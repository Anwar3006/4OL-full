CREATE TABLE "healthy_living" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"about" jsonb,
	"category" jsonb,
	"contact_your_doctor" jsonb,
	"more_information" jsonb,
	"attribution" jsonb,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "healthy_living_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"healthy_living_id" uuid,
	"type_name" text NOT NULL,
	"about_type" jsonb
);
--> statement-breakpoint
ALTER TABLE "healthy_living_types" ADD CONSTRAINT "healthy_living_types_healthy_living_id_healthy_living_id_fk" FOREIGN KEY ("healthy_living_id") REFERENCES "public"."healthy_living"("id") ON DELETE cascade ON UPDATE no action;