ALTER TABLE "condition_causes" DROP CONSTRAINT "condition_causes_condition_id_conditions_id_fk";
--> statement-breakpoint
ALTER TABLE "condition_body_parts" DROP CONSTRAINT "condition_body_parts_condition_id_conditions_id_fk";
--> statement-breakpoint
ALTER TABLE "condition_categories" DROP CONSTRAINT "condition_categories_condition_id_conditions_id_fk";
--> statement-breakpoint
ALTER TABLE "condition_types" DROP CONSTRAINT "condition_types_condition_id_conditions_id_fk";
--> statement-breakpoint
ALTER TABLE "condition_causes" ADD CONSTRAINT "condition_causes_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_body_parts" ADD CONSTRAINT "condition_body_parts_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_categories" ADD CONSTRAINT "condition_categories_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_types" ADD CONSTRAINT "condition_types_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;