ALTER TABLE "healthy_living" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "healthy_living" ADD COLUMN "updated_at" timestamp;