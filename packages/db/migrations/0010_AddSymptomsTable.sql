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
	"symtom_id" uuid,
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
ALTER TABLE "symptom_causes" ADD CONSTRAINT "symptom_causes_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_body_parts" ADD CONSTRAINT "symptom_body_parts_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_body_parts" ADD CONSTRAINT "symptom_body_parts_body_part_id_body_parts_id_fk" FOREIGN KEY ("body_part_id") REFERENCES "public"."body_parts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_categories" ADD CONSTRAINT "symptom_categories_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_categories" ADD CONSTRAINT "symptom_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom_types" ADD CONSTRAINT "symptom_types_symtom_id_symptoms_id_fk" FOREIGN KEY ("symtom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "symptom_lookup_idx" ON "symptom_body_parts" USING btree ("symptom_id");--> statement-breakpoint
CREATE INDEX "symptom_name_idx" ON "symptoms" USING btree ("name");