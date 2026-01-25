# Constructing the Ratings & Review feature

1. We need to construct a table. In order for reviews to have other reviews attached(Threading), we need to convert this table into an Adjacency List. This can be achieved by adding a parent_id field to the table that acts a Self-Referential foreign key.

- To top-rate a facility, we need to include this field within the facility_profile table. So we will alter the existing table to include it.
- Our table will this be constructed like:

```sql
-- 1. Add Top-Rated status to the Facility
  ALTER TABLE public.facility_profile
  ADD COLUMN is_top_rated boolean DEFAULT false;

  -- 2. Enhanced Reviews with Threading (Adjacency List)
  CREATE TABLE IF NOT EXISTS public.facility_reviews (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      facility_id uuid NOT NULL REFERENCES public.facility_profile(id) ON DELETE CASCADE,
      user_id text NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

      -- Support for replies/threading
      parent_id uuid REFERENCES public.facility_reviews(id) ON DELETE CASCADE,

      -- Status & Moderation
      is_published boolean DEFAULT true, -- Allows admins to hide "spam" or "offensive" reviews
      is_verified_visit boolean DEFAULT false, -- Set to true if the user actually had an appointment

      rating integer CHECK (rating >= 1 AND rating <= 5), -- NULL for replies, NOT NULL for top-level
      comment_text text NOT NULL,
      helpful_count integer, -- (Optional) Allow other users to "upvote" a review.

      -- Metadata
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),

      -- Prevent a user from reviewing the same facility multiple times
      CONSTRAINT unique_user_facility_review UNIQUE (user_id, facility_id)
      ADD CONSTRAINT check_rating_presence
        CHECK (
            (parent_id IS NULL AND rating IS NOT NULL) OR
            (parent_id IS NOT NULL AND rating IS NULL)
        );
  );

  CREATE INDEX idx_reviews_parent_id ON public.facility_reviews(parent_id);
```

2. When an admin wants to review a facility they have to do two things:

- Toggle top rated - true/false
- Insert their comment
- We can apply this atomically using Transactions/RPC(for Supabase):
  - Set the session context to the admin_id so we can trigger our activity_log function.
  - We update the top-rated field in the facility_profile, then
  - Insert this new comment or rating or both

  ```sql
    CREATE OR REPLACE FUNCTION admin_perform_facility_review_action(
      p_admin_id text,
      p_facility_id uuid,
      p_is_top_rated boolean,
      p_comment_text text,
      p_rating integer
    ) RETURNS void AS $$
    BEGIN
        -- 1. Set context for Audit Logs
        EXECUTE format('SET LOCAL app.current_user_id = %L', p_admin_id);

        -- 2. Update Facility Status
        UPDATE public.facility_profile
        SET is_top_rated = p_is_top_rated
        WHERE id = p_facility_id;

        -- 3. Insert the Admin's Comment (Internal Review)
        -- We assume rating is NULL or 5 for admin 'top-rated' notes
        IF p_comment_text IS NOT NULL AND p_comment_text != '' THEN
            INSERT INTO public.facility_reviews (facility_id, user_id, comment_text, rating)
            VALUES (p_facility_id, p_admin_id, p_comment_text, p_rating);
        END IF;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

3. Frontend Component Structure
   In the Facility View Dialog, we will now have three distinct sections:

- A. Summary & Toggle
  - A Switch component from the UI library (like shadcn/ui) that controls the is_top_rated boolean.

- B. The Admin Comment Box
  - A Textarea where the admin can type. Because we are using an adjacency list, we could even allow the admin to click "Reply" on an existing user review, passing that review's ID as the parent_id.

- C. The History List (Previous Admin Comments)
  - To show only the current admin's previous comments for this facility, your query would look like this:

```typescript
const { data: adminHistory } = useQuery({
  queryKey: ["facility-admin-comments", facilityId, adminId],
  queryFn: async () => {
    const { data } = await supabase
      .from("facility_reviews")
      .select("*")
      .eq("facility_id", facilityId)
      .eq("user_id", adminId) // Filter by current logged-in admin
      .order("created_at", { ascending: false });
    return data;
  },
});
```

4. Comments should be optional but Ratings should not be for Parent

- For a parent review, comments are optional but ratings are not. For a child review, comments are required but ratings are not(You can not rate a comment only upvote/downvote). We use a CHECK constraint to ensure that if it's a top-level review, it must have a rating. If it's a reply, it must not have a rating
- To enforce this at te database level, we add a constraint:
  - Check: parent_id is Null and ratings is Not Null Or parent_id is Not Null and ratings is Null

  ```sql
    ADD CONSTRAINT check_rating_presence
  CHECK (
    (parent_id IS NULL AND rating IS NOT NULL) OR
    (parent_id IS NOT NULL AND rating IS NULL)
  );
  ```

- To avoid long nested replies that are difficult to model UI for on mobile, we limit the number of replies to only one. We can enforce this by making sure the parent_id of a new record cannot, itself, have a parent_id. We use a trigger and attach it to an Insert operation, which says, for the incoming record, check our table to find an id that matches the parent_id of the incoming one, making the incoming record a reply because it has a parent_id, then check if the existing record's parent_id is not null meaning the incoming record attempts to be a reply of a reply:

```sql
  CREATE OR REPLACE FUNCTION public.fn_enforce_review_depth()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        -- Check if the parent is already a reply
        IF EXISTS (
            SELECT 1 FROM public.facility_reviews
            WHERE id = NEW.parent_id AND parent_id IS NOT NULL
        ) THEN
            RAISE EXCEPTION 'Nesting limit reached: You cannot reply to a reply.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_review_depth
BEFORE INSERT ON public.facility_reviews
FOR EACH ROW EXECUTE FUNCTION public.fn_enforce_review_depth();
```

5. Refine the logic for upserting a review.

- Status Only: The admin toggles "Top-Rated" without a comment.
- Internal Audit: The admin leaves a top-level note (with an optional rating).
- Direct Reply: The admin responds to a specific user's review (using a parent_id).

```sql
CREATE OR REPLACE FUNCTION admin_perform_facility_review_action(
    p_admin_id text,
    p_facility_id uuid,
    p_is_top_rated boolean,
    p_comment_text text DEFAULT NULL,
    p_rating integer DEFAULT NULL,
    p_parent_id uuid DEFAULT NULL -- New: Support for replying to a review
) RETURNS void AS $$
BEGIN
    -- 1. Set context for Audit Logs trigger
    EXECUTE format('SET LOCAL app.current_user_id = %L', p_admin_id);

    -- 2. Update Facility 'Top-Rated' Status
    UPDATE public.facility_profile
    SET
        is_top_rated = p_is_top_rated,
        updated_at = now()
    WHERE id = p_facility_id;

    -- 3. Handle Comment Logic
    -- Case A: It's a reply to an existing review
    IF p_parent_id IS NOT NULL THEN
        INSERT INTO public.facility_reviews (
            facility_id,
            user_id,
            parent_id,
            comment_text,
            rating -- Ratings are NULL for replies
        )
        VALUES (p_facility_id, p_admin_id, p_parent_id, p_comment_text, NULL);

    -- Case B: It's a new top-level internal audit/review
    ELSIF p_comment_text IS NOT NULL AND p_comment_text != '' THEN
        INSERT INTO public.facility_reviews (
            facility_id,
            user_id,
            comment_text,
            rating
        )
        VALUES (p_facility_id, p_admin_id, p_comment_text, p_rating);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
