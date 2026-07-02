CREATE TABLE "apps" (
	"package_name" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"developer" text,
	"description" text,
	"icon_url" text,
	"graphic_url" text,
	"downloads" integer,
	"rating_avg" real,
	"age_rating" text,
	"aptoide_url" text,
	"embedding" vector(1536),
	"ingested_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "apps_embedding_idx" ON "apps" USING hnsw ("embedding" vector_cosine_ops);