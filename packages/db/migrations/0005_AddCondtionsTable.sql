CREATE EXTENSION IF NOT EXISTS ltree; 
CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
	"treament" jsonb,
	"complications" jsonb,
	"symptoms" jsonb,
	"prevention" jsonb,
	"contact_your_doctor" jsonb,
	"more_information" jsonb,
	"attribution" jsonb,
	"search_vector" "tsvector",
	"specialist" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "body_parts" ADD CONSTRAINT "body_parts_parent_id_body_parts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."body_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_causes" ADD CONSTRAINT "condition_causes_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_body_parts" ADD CONSTRAINT "condition_body_parts_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_body_parts" ADD CONSTRAINT "condition_body_parts_body_part_id_body_parts_id_fk" FOREIGN KEY ("body_part_id") REFERENCES "public"."body_parts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_categories" ADD CONSTRAINT "condition_categories_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_categories" ADD CONSTRAINT "condition_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_types" ADD CONSTRAINT "condition_types_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "materialized_bodypart_path_idx" ON "body_parts" USING gist ("path");--> statement-breakpoint
CREATE INDEX "bodypart_mesh_idx" ON "body_parts" USING btree ("mesh_id");--> statement-breakpoint
CREATE INDEX "category_path_idx" ON "categories" USING gist ("path");--> statement-breakpoint
CREATE INDEX "condition_lookup_idx" ON "condition_body_parts" USING btree ("condition_id");--> statement-breakpoint
CREATE INDEX "condition_name_idx" ON "conditions" USING btree ("name");