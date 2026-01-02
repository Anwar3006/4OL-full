ALTER TYPE "public"."facility_type_enum" ADD VALUE 'health_schools';--> statement-breakpoint
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
