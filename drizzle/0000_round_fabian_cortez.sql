DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'used', 'deleted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hirnstammtisch_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar NOT NULL,
	"from" varchar(256) NOT NULL,
	"for" varchar(256),
	"status" "status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hirnstammtisch_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topics_idx" ON "hirnstammtisch_topics" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "hirnstammtisch_user" USING btree ("id");