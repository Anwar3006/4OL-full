CREATE TYPE "public"."marketing_status_enum" AS ENUM('draft', 'scheduled', 'live', 'paused', 'ended');--> statement-breakpoint
CREATE TYPE "public"."marketing_type_enum" AS ENUM('ads', 'events', 'news', 'health', 'other');--> statement-breakpoint
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
ALTER TABLE "facility_profile" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "facility_profile" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."facility_status_enum";--> statement-breakpoint
CREATE TYPE "public"."facility_status_enum" AS ENUM('pending', 'active', 'rejected', 'inactive');--> statement-breakpoint
ALTER TABLE "facility_profile" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."facility_status_enum";--> statement-breakpoint
ALTER TABLE "facility_profile" ALTER COLUMN "status" SET DATA TYPE "public"."facility_status_enum" USING "status"::"public"."facility_status_enum";