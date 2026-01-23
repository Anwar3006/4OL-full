- To track growth over time (historical trends), you definitely need a Table.

- A View only shows you a "snapshot" of right now. For example, if you want to know how many users you had on October 12th, a View can't tell you that because it only knows who is in the database today.

- The Workflow
  You need a three-part system:

1. A Trends Table: To store the historical snapshots.
2. A Cron Job: To run at midnight every day.
3. A Function/Query: To calculate the numbers and insert them into the table.

---

1. The Trends Table
   This table stores the "state of the world" at a specific point in time.

```sql
CREATE TABLE IF NOT EXISTS platform_metrics_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date DEFAULT CURRENT_DATE UNIQUE,

  -- User Growth & Stickiness
  total_users integer NOT NULL,
  new_signups_today integer NOT NULL, -- NEW: Track growth speed
  daily_active_users integer NOT NULL,
  monthly_active_users integer NOT NULL,
  sticky_users_count integer NOT NULL, -- NEW: Active users who return frequently

  -- Demographics (Consider moving to JSONB for flexibility)
  male_count integer NOT NULL,
  female_count integer NOT NULL,
  other_gender_count integer NOT NULL,

  -- Facility Metrics
  total_facilities integer NOT NULL,
  facility_types jsonb NOT NULL, -- e.g., {"hospital": 20, "pharmacy": 5}

  -- Health Engagement
  active_medication_remainders integer NOT NULL,
  vitals_logged_count integer NOT NULL DEFAULT 0, -- NEW: Are they actually using the health tools?
  symptoms_reported_count integer NOT NULL DEFAULT 0, -- NEW: Tracking illness trends

  created_at timestamp with time zone DEFAULT now()
);
```

2. The Logic (Database Function)
   Instead of constructing the data in your frontend or a separate server, it is most efficient to do it directly in PostgreSQL using a function.

```sql
CREATE OR REPLACE FUNCTION capture_daily_metrics()
RETURNS void AS $$
BEGIN
  INSERT INTO platform_metrics_history (
    date,
    total_users,
    new_signups_today,
    daily_active_users,
    sticky_users_count, --- need to write the sql below
    male_count,
    female_count,
    total_facilities,
    facility_types,
    active_medication_remainders,
    vitals_logged_count
  )
VALUES (
  CURRENT_DATE,
  (SELECT count(*) FROM users),
  (SELECT count(*) FROM users WHERE created_at >= CURRENT_DATE), -- New Signups
  (SELECT count(*) FROM users WHERE last_active >= now() - interval '24 hours'),
  (SELECT count(*) FROM users WHERE last_active >= now() - interval '30 days'),
  (SELECT count(*) FROM users WHERE gender = 'male'),
  (SELECT count(*) FROM users WHERE gender = 'female'),
  (SELECT count(*) FROM facility_profile WHERE status = 'active'),
  (SELECT jsonb_object_agg(facility_type, count)
   FROM (SELECT facility_type, count(*) FROM facility_profile GROUP BY facility_type) AS t),
  (SELECT count(*) FROM medication_reminders WHERE is_active = true),
  (SELECT count(*) FROM health_logs WHERE created_at >= CURRENT_DATE) -- Engagement
)
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    daily_active_users = EXCLUDED.daily_active_users,
    total_facilities = EXCLUDED.total_facilities;
END;
$$ LANGUAGE plpgsql;
```

3. The Cron Job
   In Supabase, you have two main ways to trigger this function:

- Option A: Supabase pg_cron (Recommended)
  This is the most reliable method as it stays entirely inside the database.
  - Enable the extension in the dashboard.
  - Schedule the function:

```sql
SELECT cron.schedule(
  'daily-metrics-snapshot', -- name of the job
  '0 0 * * *',              -- every day at midnight (cron syntax)
  'SELECT capture_daily_metrics()'
);
```

- Option B: Vercel Cron Jobs / Edge Function
  If you prefer managing logic in TypeScript:
  - Create a route like /api/cron/track-growth.

  - Secure it with a secret header.

  - Use a tool like Upstash or Vercel Cron to ping that URL once a day.

- Do you still need a View?
  Yes, but for a different reason. While the Table stores the past, a View is still useful for your "Live Dashboard" to show current metrics (Right now) without waiting for the next midnight snapshot.

4. What about "Privacy"?
   Since this is a health app, ensure this platform_metrics_history table never stores PII (Personally Identifiable Information). By aggregating the data into integers (counts) and JSONB blobs, you are effectively "Anonymizing" the data for your dashboard, which is great for HIPAA/GDPR compliance.

## Fetching the two kinds of data using an rpc or transaction to build the data into a json_object

- Yes, a unified RPC (or tRPC procedure) is the professional way to handle this. Querying them individually leads to "waterfall" loading (where the page flickers as each card loads separately). By creating a single "Dashboard Data" procedure, you fetch the Historical Table data (for charts) and the Operational View data (for cards) in one go, returning a single JSON object.

```sql
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS json AS $$
DECLARE
    live_stats json;
    historical_data json;
BEGIN
    -- 1. Grab Live Snapshot (Current State)
    SELECT json_build_object(
        'total_facilities', (SELECT count(*) FROM facility_profile),
        'pending_facilities', (SELECT count(*) FROM facility_profile WHERE status = 'pending'),
        'total_users', (SELECT count(*) FROM users),
        'active_users_24h', (SELECT count(*) FROM users WHERE last_active >= now() - interval '24 hours'),
        'active_reminders', (SELECT count(*) FROM medication_reminders WHERE is_active = true)
    ) INTO live_stats;

    -- 2. Grab Historical Trends (Last 30 Days)
    SELECT json_agg(t) INTO historical_data
    FROM (
        SELECT date, total_users, daily_active_users, total_facilities
        FROM platform_metrics_history
        ORDER BY date ASC
        LIMIT 30
    ) t;

    RETURN json_build_object(
        'live', live_stats,
        'trends', historical_data
    );
END;
$$ LANGUAGE plpgsql;
```

## Activity Logs

- We create a table, then we create a function to run to populate that table then we create and attach triggers to each table we want to monitor so we can log CRUD activities from those tables

1. Create the activity_logs Table
   First, we create a central table to store these logs. We use jsonb for affected_record_id or metadata to allow for flexibility if you want to store more details later.

```sql
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id text,                    -- BetterAuth IDs are often strings
    actor_name text,
    action_type text NOT NULL,        -- 'INSERT', 'UPDATE', 'DELETE'
    target_table text NOT NULL,
    record_id text,                   -- record IDs can vary
    old_data jsonb,
    new_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Index for faster dashboard loading
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
```

2. The Generic Logging Function
   This function dynamically detects the table name and the action being performed.

```sql
CREATE OR REPLACE FUNCTION public.fn_log_admin_activity()
RETURNS TRIGGER AS $$
DECLARE
    -- Read the user ID from the session variable we will set in the SDK call
    current_actor_id text := current_setting('app.current_user_id', true);
    actor_name text;
BEGIN
    -- If no user is set (e.g., a background script), we might skip or log as 'system'
    IF current_actor_id IS NULL OR current_actor_id = '' THEN
        current_actor_id := 'system';
        actor_name := 'System/Automated';
    ELSE
        SELECT name INTO actor_name FROM public.user_profile WHERE id = current_actor_id;
    END IF;

    -- Filter: Only log user_profile changes if they involve admin roles
    IF (TG_TABLE_NAME = 'user_profile') THEN
        IF NOT (
            (NEW.role IS NOT NULL AND NEW.role IN ('admin', 'super_admin', 'registrar')) OR
            (OLD.role IS NOT NULL AND OLD.role IN ('admin', 'super_admin', 'registrar'))
        ) THEN
            RETURN COALESCE(NEW, OLD);
        END IF;
    END IF;

    INSERT INTO public.activity_logs (
        actor_id,
        actor_name,
        action_type,
        target_table,
        record_id,
        new_data,
        old_data
    )
    VALUES (
        current_actor_id,
        actor_name,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id::text, OLD.id::text),
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- Since we are using betterAuth which is a middleware and does work at the database level, we need a way to tell the database about the person performing the action so we set a custom session variable which would be specific to the each being performed, then in the above SQL statement we can get that variable and use it.
- We create an RPC that will set the session id to the user id for the person making the query:

```sql
-- Helper RPC to set context
CREATE OR REPLACE FUNCTION apply_admin_change(user_id text, query_text text)
RETURNS void AS $$
BEGIN
  EXECUTE format('SET LOCAL app.current_user_id = %L', user_id);
  EXECUTE query_text;
END;
$$ LANGUAGE plpgsql;
```

- Unfortunately we arent using Supabase Auth which has visibility at the database level. IF we did it would have been easier because all we had to do next we attach triggers to the tables we want to monitor. But now because BetterAuth autenticated users have no visibility at the database level, we have to include a next step, we have to create RPCs for all the actions we want to monitor, this rpc will take the admin id as first argument and the payload for whatever CRUD operation as the second argument.
- Why?
  - Because Supabase calls run on HTTP/S, meaning each call is independent of the next, so if we call the first RPC(the one to attach the admin id to the query session), and we then make our query using supabase's sdk, these two will be independent calls, which isnt what we want because then the activity_logs table will not be populated for that action because it had no query session id attached so we could not find the user making the query.
  - Essentially we need to do these two in a transaction and the only way to do this in Supabase is to use RPCs
