-- Drop the public schema and all its objects (if you have the necessary privileges)
DROP SCHEMA IF EXISTS "public" CASCADE;
-- Recreate the public schema
CREATE SCHEMA "public";
-- Grant necessary permissions (adjust as needed)
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT ALL ON SCHEMA "public" TO postgres;


--- Enable Extensions
-- 1. Enable PostGIS for your 'geometry' and 'location' columns
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- 2. Enable LTREE for your 'path' columns and hierarchical body part traversal
CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA extensions;

-- 3. Enable pgcrypto for advanced hashing or UUID generation if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 4. Set search path so extensions are globally accessible to Drizzle
-- This ensures 'geometry' and 'ltree' types are recognized without 'extensions.' prefix
ALTER DATABASE postgres SET search_path TO "$user", public, extensions;


CREATE TYPE "public"."facility_status_enum" AS ENUM('pending', 'active', 'rejected', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."facility_type_enum" AS ENUM('hospitals_&_clinics', 'herbal_centers', 'diagnostic_labs', 'pharmacies', 'dental_clinics', 'homes', 'eye_clinics', 'osteopathy_centers', 'physiotherapy_centers', 'prosthetics_centers', 'psychiatric_centers', 'ibps', 'health_schools');--> statement-breakpoint
CREATE TYPE "public"."marketing_status_enum" AS ENUM('draft', 'scheduled', 'live', 'paused', 'ended');--> statement-breakpoint
CREATE TYPE "public"."marketing_type_enum" AS ENUM('ads', 'events', 'news', 'health', 'other');--> statement-breakpoint
CREATE TYPE "public"."region_enum" AS ENUM('ahafo', 'ashanti', 'bono', 'bono east', 'central', 'eastern', 'greater accra', 'north east', 'northern', 'oti', 'savannah', 'upper east', 'upper west', 'volta', 'western', 'western north');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "body_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"parent_id" uuid,
	"mesh_id" text,
	"path" "ltree" NOT NULL,
	"level" integer DEFAULT 0,
	CONSTRAINT "body_parts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_id" uuid,
	"path" "ltree" NOT NULL,
	"level" integer DEFAULT 0,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "condition_causes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"condition_id" uuid,
	"cause_name" text NOT NULL,
	"other_possible_causes" jsonb
);
--> statement-breakpoint
CREATE TABLE "condition_body_parts" (
	"condition_id" uuid,
	"body_part_id" uuid,
	CONSTRAINT "condition_body_parts_body_part_id_condition_id_pk" PRIMARY KEY("body_part_id","condition_id")
);
--> statement-breakpoint
CREATE TABLE "condition_categories" (
	"condition_id" uuid,
	"category_id" uuid,
	CONSTRAINT "condition_categories_category_id_condition_id_pk" PRIMARY KEY("category_id","condition_id")
);
--> statement-breakpoint
CREATE TABLE "condition_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"condition_id" uuid,
	"type_name" text NOT NULL,
	"about_type" jsonb
);
--> statement-breakpoint
CREATE TABLE "conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"nhs_link" text NOT NULL,
	"image_url" text,
	"about" jsonb,
	"diagnosis" jsonb,
	"treatment" jsonb,
	"complications" jsonb,
	"symptoms" jsonb,
	"prevention" jsonb,
	"contact_your_doctor" jsonb,
	"more_information" jsonb,
	"attribution" jsonb,
	"is_systemic" boolean DEFAULT false NOT NULL,
	"search_vector" "tsvector",
	"specialist" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facility_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"facility_type" text NOT NULL,
	"facility_name" text NOT NULL,
	"contact_number" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"email" text,
	"media_urls" jsonb,
	"featured_image_url" text NOT NULL,
	"gps_address" text NOT NULL,
	"street" text NOT NULL,
	"post_code" text NOT NULL,
	"area" text NOT NULL,
	"district" text NOT NULL,
	"region" "region_enum" DEFAULT 'greater accra' NOT NULL,
	"country" text DEFAULT 'Ghana' NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"location" geometry(point),
	"ownership" text NOT NULL,
	"accepts_nhis" boolean DEFAULT false,
	"services" jsonb,
	"amenities" jsonb,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"owner_email" text NOT NULL,
	"person_contact_number" text NOT NULL,
	"position" text NOT NULL,
	"status" "facility_status_enum" DEFAULT 'pending' NOT NULL,
	"business_hours" jsonb,
	"keywords" jsonb,
	"avg_rating" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	CONSTRAINT "facility_profile_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "faq_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "faq_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "healthy_living" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"about" jsonb,
	"category" jsonb,
	"contact_your_doctor" jsonb,
	"more_information" jsonb,
	"attribution" jsonb,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "healthy_living_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"healthy_living_id" uuid,
	"type_name" text NOT NULL,
	"about_type" jsonb
);
--> statement-breakpoint
CREATE TABLE "marketing_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketingType" "marketing_type_enum" NOT NULL,
	"status" "marketing_status_enum" DEFAULT 'draft' NOT NULL,
	"headline" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text NOT NULL,
	"cta" text NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb,
	"organization" text NOT NULL,
	"startDate" text NOT NULL,
	"endDate" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "symptom_causes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symptom_id" uuid,
	"cause_name" text NOT NULL,
	"other_possible_causes" jsonb
);
--> statement-breakpoint
CREATE TABLE "symptom_body_parts" (
	"symptom_id" uuid,
	"body_part_id" uuid,
	CONSTRAINT "symptom_body_parts_body_part_id_symptom_id_pk" PRIMARY KEY("body_part_id","symptom_id")
);
--> statement-breakpoint
CREATE TABLE "symptom_categories" (
	"symptom_id" uuid,
	"category_id" uuid,
	CONSTRAINT "symptom_categories_category_id_symptom_id_pk" PRIMARY KEY("category_id","symptom_id")
);
--> statement-breakpoint
CREATE TABLE "symptom_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symptom_id" uuid,
	"type_name" text NOT NULL,
	"about_type" jsonb
);
--> statement-breakpoint
CREATE TABLE "symptoms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"nhs_link" text NOT NULL,
	"image_url" text,
	"about" jsonb,
	"diagnosis" jsonb,
	"treatment" jsonb,
	"complications" jsonb,
	"prevention" jsonb,
	"contact_your_doctor" jsonb,
	"more_information" jsonb,
	"attribution" jsonb,
	"is_systemic" boolean DEFAULT false NOT NULL,
	"search_vector" "tsvector",
	"specialist" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "user_invites_email_unique" UNIQUE("email"),
	CONSTRAINT "user_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sex" text NOT NULL,
	"dob" text NOT NULL,
	"user_type" text DEFAULT 'customer' NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"phone_number" text NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "body_parts" ADD CONSTRAINT "body_parts_parent_id_body_parts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."body_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_causes" ADD CONSTRAINT "condition_causes_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_body_parts" ADD CONSTRAINT "condition_body_parts_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_body_parts" ADD CONSTRAINT "condition_body_parts_body_part_id_body_parts_id_fk" FOREIGN KEY ("body_part_id") REFERENCES "public"."body_parts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_categories" ADD CONSTRAINT "condition_categories_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_categories" ADD CONSTRAINT "condition_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_types" ADD CONSTRAINT "condition_types_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_profile" ADD CONSTRAINT "facility_profile_owner_id_user_profiles_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "healthy_living_types" ADD CONSTRAINT "healthy_living_types_healthy_living_id_healthy_living_id_fk" FOREIGN KEY ("healthy_living_id") REFERENCES "public"."healthy_living"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_causes" ADD CONSTRAINT "symptom_causes_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_body_parts" ADD CONSTRAINT "symptom_body_parts_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_body_parts" ADD CONSTRAINT "symptom_body_parts_body_part_id_body_parts_id_fk" FOREIGN KEY ("body_part_id") REFERENCES "public"."body_parts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_categories" ADD CONSTRAINT "symptom_categories_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_categories" ADD CONSTRAINT "symptom_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_types" ADD CONSTRAINT "symptom_types_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "materialized_bodypart_path_idx" ON "body_parts" USING gist ("path");--> statement-breakpoint
CREATE INDEX "bodypart_mesh_idx" ON "body_parts" USING btree ("mesh_id");--> statement-breakpoint
CREATE INDEX "category_path_idx" ON "categories" USING gist ("path");--> statement-breakpoint
CREATE INDEX "condition_lookup_idx" ON "condition_body_parts" USING btree ("condition_id");--> statement-breakpoint
CREATE INDEX "condition_name_idx" ON "conditions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "keywords_gin_idx" ON "facility_profile" USING gin ("keywords");--> statement-breakpoint
CREATE INDEX "services_gin_idx" ON "facility_profile" USING gin ("services");--> statement-breakpoint
CREATE INDEX "region_idx" ON "facility_profile" USING btree ("region");--> statement-breakpoint
CREATE INDEX "rating_idx" ON "facility_profile" USING btree ("avg_rating");--> statement-breakpoint
CREATE INDEX "name_idx" ON "facility_profile" USING btree ("facility_name");--> statement-breakpoint
CREATE INDEX "owner_id_idx" ON "facility_profile" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "location_gist_idx" ON "facility_profile" USING gist ("location");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "symptom_lookup_idx" ON "symptom_body_parts" USING btree ("symptom_id");--> statement-breakpoint
CREATE INDEX "symptom_name_idx" ON "symptoms" USING btree ("name");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");


--- Added from Supabase

CREATE OR REPLACE FUNCTION insert_condition (
  c_payload JSONB,
  bodypartsIds TEXT[],
  categoryIds TEXT[],
  c_causes JSONB[],
  c_types JSONB[]
) RETURNS TEXT as $$
DECLARE
  new_condition_id UUID;
BEGIN
  INSERT INTO conditions (
    name, slug, nhs_link, image_url, about, is_systemic, diagnosis, treatment, complications, symptoms, prevention, specialist, contact_your_doctor, more_information, attribution
  ) VALUES (
    c_payload->>'name', 
    c_payload->>'slug', 
    c_payload->>'nhs_link', 
    c_payload->>'image_url', 
    COALESCE(c_payload->'about', '[]'::jsonb),
    (c_payload->>'is_systemic')::boolean, 
    COALESCE(c_payload->'diagnosis', '[]'::jsonb), 
    COALESCE(c_payload->'treatment', '[]'::jsonb),
    COALESCE(c_payload->'complications', '[]'::jsonb), 
    COALESCE(c_payload->'symptoms', '[]'::jsonb), 
    COALESCE(c_payload->'prevention', '[]'::jsonb), 
    c_payload->>'specialist',  
    COALESCE(c_payload->'contact_your_doctor', '[]'::jsonb),  
    COALESCE(c_payload->'more_information', '[]'::jsonb),  
    COALESCE(c_payload->'attribution', '[]'::jsonb)
  ) RETURNING id INTO new_condition_id;

  INSERT into condition_body_parts (condition_id, body_part_id)
  SELECT new_condition_id, unnest(bodypartsIds)::uuid;

  INSERT into condition_categories (condition_id, category_id)
  SELECT new_condition_id, unnest(categoryIds)::uuid;

  INSERT into condition_types (condition_id, type_name, about_type)
  SELECT new_condition_id, (val->>'type_name'), COALESCE(val->'about_type', '[]'::jsonb)
  FROM unnest(c_types) AS val;

  INSERT into condition_causes (condition_id, cause_name, other_possible_causes)
  SELECT new_condition_id, (val->>'cause_name'), COALESCE(val->'other_possible_causes', '[]'::jsonb)
  FROM unnest(c_causes) as val;

  RETURN new_condition_id;
END;
$$ LANGUAGE plpgsql;


--- Update Condition RPC
CREATE OR REPLACE FUNCTION update_condition (
  c_id UUID,
  c_payload JSONB,
  bodypartsIds TEXT[],
  categoryIds TEXT[],
  c_types JSONB[],
  c_causes JSONB[]
) RETURNS TEXT AS $$
DECLARE
  updated_condition_id UUID;
BEGIN
  -- 1. Update the main record
  UPDATE conditions
  SET
    name = c_payload->>'name',
    slug = c_payload->>'slug',
    nhs_link = c_payload->>'nhs_link',
    about = COALESCE(c_payload->'about', '[]'::jsonb),
    diagnosis = COALESCE(c_payload->'diagnosis', '[]'::jsonb),
    treatment = COALESCE(c_payload->'treatment', '[]'::jsonb),
    complications = COALESCE(c_payload->'complications', '[]'::jsonb),
    symptoms = COALESCE(c_payload->'symptoms', '[]'::jsonb),
    prevention = COALESCE(c_payload->'prevention', '[]'::jsonb),
    specialist = c_payload->>'specialist', -- Verified field name
    contact_your_doctor = COALESCE(c_payload->'contact_your_doctor', '[]'::jsonb),
    more_information = COALESCE(c_payload->'more_information', '[]'::jsonb),
    attribution = COALESCE(c_payload->'attribution', '[]'::jsonb),
    image_url = c_payload->>'image_url',
    is_systemic = (c_payload->>'is_systemic')::BOOLEAN,
    updated_at = NOW()
  WHERE id = c_id
  RETURNING id INTO updated_condition_id;

  -- If condition doesn't exist, exit
  IF updated_condition_id IS NULL THEN
    RETURN 'Condition not found';
  END IF;

  -- 2. Clear existing records (ENSURE TABLE NAMES ARE CONSISTENT)
  DELETE FROM condition_body_parts WHERE condition_id = updated_condition_id;
  DELETE FROM condition_categories WHERE condition_id = updated_condition_id;
  DELETE FROM condition_types WHERE condition_id = updated_condition_id;
  DELETE FROM condition_causes WHERE condition_id = updated_condition_id;

  -- 3. Re-Insert Body Parts (Explicitly cast to UUID)
  IF bodypartsIds IS NOT NULL AND array_length(bodypartsIds, 1) > 0 THEN
    INSERT INTO condition_body_parts (condition_id, body_part_id)
    SELECT updated_condition_id, unnest(bodypartsIds)::UUID;
  END IF;

  -- 4. Re-insert Categories (Explicitly cast to UUID)
  IF categoryIds IS NOT NULL AND array_length(categoryIds, 1) > 0 THEN
    INSERT INTO condition_categories (condition_id, category_id)
    SELECT updated_condition_id, unnest(categoryIds)::UUID;
  END IF;

  -- 5. Re-insert Condition Types
  IF c_types IS NOT NULL AND array_length(c_types, 1) > 0 THEN
    INSERT INTO condition_types (condition_id, type_name, about_type)
    SELECT 
      updated_condition_id, 
      (val->>'type_name'), 
      COALESCE(val->'about_type', '[]'::jsonb)
    FROM unnest(c_types) AS val;
  END IF;

  -- 6. Re-insert Condition Causes
  IF c_causes IS NOT NULL AND array_length(c_causes, 1) > 0 THEN
    INSERT INTO condition_causes (condition_id, cause_name, other_possible_causes)
    SELECT 
      updated_condition_id, 
      (val->>'cause_name'), 
      COALESCE(val->'other_possible_causes', '[]'::jsonb)
    FROM unnest(c_causes) AS val;
  END IF;

  RETURN updated_condition_id::TEXT;
END;
$$ LANGUAGE plpgsql;


--- create a view that makes your useConditionStats hook 10x faster and more accurate:
CREATE OR REPLACE VIEW condition_stats AS
SELECT 
  (SELECT count(*) FROM conditions) as total_conditions,
  (SELECT name FROM categories c 
   JOIN condition_categories cc ON c.id = cc.category_id 
   GROUP BY c.name ORDER BY count(*) DESC LIMIT 1) as top_category,
  (SELECT name FROM body_parts b 
   JOIN condition_body_parts cbp ON b.id = cbp.body_part_id 
   GROUP BY b.name ORDER BY count(*) DESC LIMIT 1) as top_body_part;


--- Facility GeoJSON
CREATE OR REPLACE FUNCTION get_facilities_map(
  minLng DOUBLE PRECISION,
  minLat DOUBLE PRECISION,
  maxLng DOUBLE PRECISION,
  maxLat DOUBLE PRECISION,
  zoom_level INT
) RETURNS JSONB AS $$
DECLARE
  map_data JSONB;
  fetch_limit INT;
BEGIN
  -- Determine limit based on zoom level (Higher zoom = more detail)
  IF zoom_level < 10 THEN 
    fetch_limit := 1000;
  ELSE 
    fetch_limit := 5000;
  END IF;

  SELECT jsonb_build_object(
    'type', 'FeatureCollection',
    'features', COALESCE(jsonb_agg(features.feature), '[]'::jsonb)
  ) INTO map_data
  FROM (
    SELECT jsonb_build_object(
      'type', 'Feature',
      -- ST_AsGeoJSON converts geometry to the JSON structure MapLibre expects
      'geometry', ST_AsGeoJSON(location)::jsonb,
      'properties', jsonb_build_object(
        'id', id,
        'name', facility_name,
        'type', facility_type,
        'avgRating', avg_rating
      )
    ) AS feature
    FROM facility_profile
    -- Use the spatial index operator (&&) for high performance Bounding Box search
    WHERE location && ST_MakeEnvelope(minLng, minLat, maxLng, maxLat, 4326)
    AND status = 'active'
    LIMIT fetch_limit
  ) features;

  RETURN map_data;
END;
$$ LANGUAGE plpgsql;



--- Sync user_profile role to user role for BetterAuth
-- 1. Create the sync function
CREATE OR REPLACE FUNCTION sync_profile_role_to_user()
RETURNS TRIGGER AS $$
BEGIN
    -- We map the profile role to the desired auth role
    -- If the profile is 'user' or 'super_admin', they become 'admin' in core auth
    UPDATE "user"
    SET role = CASE 
        WHEN NEW.role IN ('admin', 'super_admin') THEN 'admin'
        ELSE NEW.role -- Keep other roles (like 'customer') as they are
    END
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
CREATE TRIGGER trg_sync_role
AFTER INSERT OR UPDATE OF role ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION sync_profile_role_to_user();


--- Facility Registration with Owner
CREATE OR REPLACE FUNCTION register_facility_with_profile(
  p_owner_id TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_phone_number TEXT,
  p_facility_data JSONB
) RETURNS JSONB AS $$
DECLARE
  v_facility JSONB;
BEGIN
  -- 1. Ensure user_profile exists
  INSERT INTO user_profiles (
    user_id, first_name, last_name, phone_number, user_type, role, dob, sex
  ) 
  VALUES (
    p_owner_id, p_first_name, p_last_name, p_phone_number, 'business_provider', 'user', '', 'male'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 2. Insert into facility_profile
  INSERT INTO facility_profile (
    owner_id,
    facility_name,
    facility_type,
    contact_number,
    whatsapp_number,
    email,
    gps_address,
    street,
    post_code,
    area,
    district,
    region, -- Enum Type
    country,
    latitude,
    longitude,
    location,
    position,
    keywords,
    status,
    business_hours,
    services,
    amenities,
    media_urls,
    featured_image_url,
    ownership,
    accepts_nhis,
    first_name,
    last_name,
    person_contact_number,
    owner_email
  ) VALUES (
    p_owner_id,
    p_facility_data->>'facility_name',
    p_facility_data->>'facility_type',
    p_facility_data->>'contact_number',
    COALESCE(p_facility_data->>'whatsapp_number', ''),
    p_facility_data->>'email',
    p_facility_data->>'gps_address',
    p_facility_data->>'street',
    p_facility_data->>'post_code',
    p_facility_data->>'area',
    p_facility_data->>'district',
    (p_facility_data->>'region')::region_enum, -- 👈 CAST TO ENUM
    p_facility_data->>'country',
    (p_facility_data->>'latitude')::double precision,
    (p_facility_data->>'longitude')::double precision,
    ST_SetSRID(ST_MakePoint((p_facility_data->>'longitude')::double precision, (p_facility_data->>'latitude')::double precision), 4326),
    COALESCE(p_facility_data->>'position', ''),
    COALESCE(p_facility_data->'keywords', '[]'::jsonb),
    'pending',
    COALESCE((p_facility_data->'business_hours'), '[]'::jsonb),
    COALESCE((p_facility_data->'services'), '[]'::jsonb),
    COALESCE((p_facility_data->'amenities'), '[]'::jsonb),
    COALESCE((p_facility_data->'media_urls'), '[]'::jsonb), -- 👈 Handle as JSONB
    p_facility_data->>'featured_image_url',
    p_facility_data->>'ownership',
    (p_facility_data->>'accepts_nhis')::boolean,
    p_first_name,
    p_last_name,
    p_phone_number,
    COALESCE(p_facility_data->>'owner_email', '')
  )
  RETURNING to_jsonb(facility_profile.*) INTO v_facility;

  RETURN v_facility;
END;
$$ LANGUAGE plpgsql;



--- BodyParts Stats 
CREATE OR REPLACE FUNCTION get_body_part_stats()
RETURNS TABLE (
  id uuid,
  name text,
  path ltree,
  total_conditions bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id, 
    bp.name, 
    bp.path,
    COUNT(DISTINCT sbp.symptom_id) as total_conditions
  FROM body_parts bp
  -- This is the ltree "ancestor" check: bp.path is an ancestor of child.path
  LEFT JOIN body_parts descendants ON bp.path @> descendants.path
  LEFT JOIN symptom_body_parts sbp ON descendants.id = sbp.body_part_id
  GROUP BY bp.id, bp.name, bp.path;
END;
$$ LANGUAGE plpgsql;



--- Symptoms Registration Function
CREATE OR REPLACE FUNCTION register_symptom_complex(
  s_payload JSONB,
  body_part_ids TEXT[],
  category_ids TEXT[],
  s_types JSONB[],
  s_causes JSONB[]
) RETURNS UUID AS $$
DECLARE
  new_symptom_id UUID;
BEGIN
  INSERT INTO symptoms (
    name, slug, nhs_link, image_url, about, is_systemic, 
    diagnosis, treatment, complications, prevention, 
    specialist, contact_your_doctor, more_information, attribution
  ) VALUES (
  s_payload->>'name', 
    s_payload->>'slug', 
    s_payload->>'nhs_link', 
    s_payload->>'image_url', 
    COALESCE(s_payload->'about', '[]'::jsonb),
    (s_payload->>'is_systemic')::boolean, 
    COALESCE(s_payload->'diagnosis', '[]'::jsonb), 
    COALESCE(s_payload->'treatment', '[]'::jsonb),
    COALESCE(s_payload->'complications', '[]'::jsonb), 
    COALESCE(s_payload->'prevention', '[]'::jsonb), 
    s_payload->>'specialist',  
    COALESCE(s_payload->'contact_your_doctor', '[]'::jsonb),  
    COALESCE(s_payload->'more_information', '[]'::jsonb),  
    COALESCE(s_payload->'attribution', '[]'::jsonb)
  ) RETURNING id into new_symptom_id;

  IF body_part_ids IS NOT NULL THEN
    INSERT INTO symptom_body_parts (symptom_id, body_part_id)
    SELECT new_symptom_id, unnest(body_part_ids)::UUID;
  END IF;

  -- 3. Insert Categories
  IF category_ids IS NOT NULL THEN
    INSERT INTO symptom_categories (symptom_id, category_id)
    SELECT new_symptom_id, unnest(category_ids)::UUID;
  END IF;

  -- 4. Insert Types (Correcting the COALESCE here)
  IF s_types IS NOT NULL THEN
    INSERT INTO symptom_types (symptom_id, type_name, about_type)
    SELECT new_symptom_id, (val->>'type_name'), COALESCE(val->'about_type', '[]'::jsonb)
    FROM unnest(s_types) AS val;
  END IF;

  -- 5. Insert Causes (Added based on your schema)
  IF s_causes IS NOT NULL THEN
    INSERT INTO symptom_causes (symptom_id, cause_name, other_possible_causes)
    SELECT new_symptom_id, (val->>'cause_name'), COALESCE(val->'other_possible_causes', '[]'::jsonb)
    FROM unnest(s_causes) AS val;
  END IF;

  RETURN new_symptom_id;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION update_symptom (
  s_id UUID,
  s_payload JSONB,
  body_part_ids TEXT[],
  category_ids TEXT[],
  s_types JSONB[],
  s_causes JSONB[]
) RETURNS TEXT AS $$
DECLARE
  updated_symptom_id UUID;
BEGIN
  -- 1. Update the main symptom record
  UPDATE symptoms
  SET
    name = s_payload->>'name',
    slug = s_payload->>'slug',
    nhs_link = s_payload->>'nhs_link',
    image_url = s_payload->>'image_url',
    about = COALESCE(s_payload->'about', '[]'::jsonb),
    diagnosis = COALESCE(s_payload->'diagnosis', '[]'::jsonb),
    treatment = COALESCE(s_payload->'treatment', '[]'::jsonb),
    complications = COALESCE(s_payload->'complications', '[]'::jsonb),
    prevention = COALESCE(s_payload->'prevention', '[]'::jsonb),
    is_systemic = (s_payload->>'is_systemic')::BOOLEAN,
    specialist = s_payload->>'specialist',
    contact_your_doctor = COALESCE(s_payload->'contact_your_doctor', '[]'::jsonb),
    more_information = COALESCE(s_payload->'more_information', '[]'::jsonb),
    attribution = COALESCE(s_payload->'attribution', '[]'::jsonb),
    updated_at = NOW()
  WHERE id = s_id
  RETURNING id INTO updated_symptom_id;

  IF updated_symptom_id IS NULL THEN
    RETURN 'Symptom not found';
  END IF;

  -- 2. Clear existing relations (Cascade handles types/causes if linked via ID, 
  -- but join tables often need explicit refresh)
  DELETE FROM symptom_body_parts WHERE symptom_id = updated_symptom_id;
  DELETE FROM symptom_categories WHERE symptom_id = updated_symptom_id;
  DELETE FROM symptom_types WHERE symptom_id = updated_symptom_id;
  DELETE FROM symptom_causes WHERE symptom_id = updated_symptom_id;

  -- 3. Re-insert Body Parts
  IF body_part_ids IS NOT NULL THEN
    INSERT INTO symptom_body_parts (symptom_id, body_part_id)
    SELECT updated_symptom_id, unnest(body_part_ids)::UUID;
  END IF;

  -- 4. Re-insert Categories
  IF category_ids IS NOT NULL THEN
    INSERT INTO symptom_categories (symptom_id, category_id)
    SELECT updated_symptom_id, unnest(category_ids)::UUID;
  END IF;

  -- 5. Re-insert Types
  IF s_types IS NOT NULL THEN
    INSERT INTO symptom_types (symptom_id, type_name, about_type)
    SELECT updated_symptom_id, (val->>'type_name'), COALESCE(val->'about_type', '[]'::jsonb)
    FROM unnest(s_types) AS val;
  END IF;

  RETURN updated_symptom_id::TEXT;
END;
$$ LANGUAGE plpgsql;


--- Table to track images to delete
CREATE TABLE IF NOT EXISTS public.storage_cleanup_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_paths text[] NOT NULL,
  bucket_name text DEFAULT 'facilities' NOT NULL,
  created_at timestamp DEFAULT now()
);
-- Function to catch image_urls from facilities being rejected or deleted
CREATE OR REPLACE FUNCTION queue_facility_files_for_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Scenario A: The record is being deleted entirely
    -- Scenario B: The status changed to 'rejected' (Optional logic)
    IF (TG_OP = 'DELETE') THEN
        IF OLD.media_urls IS NOT NULL AND array_length(OLD.media_urls, 1) > 0 THEN
            INSERT INTO public.storage_cleanup_queue (file_paths, bucket_name)
            VALUES (OLD.media_urls, 'facilities');
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
            INSERT INTO public.storage_cleanup_queue (file_paths, bucket_name)
            VALUES (NEW.media_urls, 'facilities');
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
--- Trigger to call the function
CREATE TRIGGER trg_cleanup_facility_files
AFTER DELETE OR UPDATE OF status ON facility_profile
FOR EACH ROW
EXECUTE FUNCTION queue_facility_files_for_deletion();
-- Next create cron job to empty the table every day/once a week