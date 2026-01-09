CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE "public"."facility_status_enum" AS ENUM('pending', 'active', 'rejected', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."facility_type_enum" AS ENUM('hospitals_&_clinics', 'herbal_centers', 'diagnostic_labs', 'pharmacies', 'dental_clinics', 'homes', 'eye_clinics', 'osteopathy_centers', 'physiotherapy_centers', 'prosthetics_centers', 'psychiatric_centers', 'ibps');--> statement-breakpoint
CREATE TYPE "public"."region_enum" AS ENUM('ahafo', 'ashanti', 'bono', 'bono east', 'central', 'eastern', 'greater accra', 'north east', 'northern', 'oti', 'savannah', 'upper east', 'upper west', 'volta', 'western', 'western north');--> statement-breakpoint
CREATE TABLE "facility_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"facility_type" text NOT NULL,
	"facility_name" text NOT NULL,
	"contact_number" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"email" text NOT NULL,
	"media_urls" jsonb,
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
ALTER TABLE "facility_profile" ADD CONSTRAINT "facility_profile_owner_id_user_profiles_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "keywords_gin_idx" ON "facility_profile" USING gin ("keywords");--> statement-breakpoint
CREATE INDEX "services_gin_idx" ON "facility_profile" USING gin ("hospital_services");--> statement-breakpoint
CREATE INDEX "region_idx" ON "facility_profile" USING btree ("region");--> statement-breakpoint
CREATE INDEX "rating_idx" ON "facility_profile" USING btree ("avg_rating");--> statement-breakpoint
CREATE INDEX "name_idx" ON "facility_profile" USING btree ("facility_name");--> statement-breakpoint
CREATE INDEX "owner_id_idx" ON "facility_profile" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "location_gist_idx" ON "facility_profile" USING gist ("location");