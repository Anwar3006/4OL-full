ALTER TABLE "facility_profile" ADD COLUMN "ownership" text NOT NULL;--> statement-breakpoint
ALTER TABLE "facility_profile" ADD COLUMN "accepts_nhis" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean;