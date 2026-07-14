import { pgTable, text, integer, real, timestamp, vector, index, uniqueIndex, check, boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const apps = pgTable(
    "apps",
    {
        packageName: text("package_name").primaryKey(),
        name: text("name").notNull(),
        developer: text("developer"),
        description: text("description"),
        iconUrl: text("icon_url"),
        graphicUrl: text("graphic_url"),
        downloads: integer("downloads"),
        ratingAvg: real("rating_avg"),
        ageRating: text("age_rating"),
        aptoideUrl: text("aptoide_url"),
        curated: boolean("curated").default(false).notNull(),

        // pgvector column for semantic search. 1536 dims is a placeholder until we pick the embedding provider  — dims must match it.
        embedding: vector("embedding", { dimensions: 1536 }),

        ingestedAt: timestamp("ingested_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull()
    },
    (table) => [
        // HNSW index makes similarity search fast. "cosine" must match the distance operator we'll use in queries.
        index("apps_embedding_idx").using("hnsw", table.embedding.op("vector_cosine_ops"))
    ]
);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
    },
    (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull()
    },
    (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull()
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const reviews = pgTable(
    "reviews",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        packageName: text("package_name")
            .notNull()
            .references(() => apps.packageName, { onDelete: "cascade" }),
        rating: integer("rating").notNull(),
        body: text("body"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull()
    },
    (table) => [uniqueIndex("reviews_user_app_idx").on(table.userId, table.packageName), check("reviews_rating_range", sql`${table.rating} BETWEEN 1 AND 5`)]
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(user, {
        fields: [reviews.userId],
        references: [user.id]
    }),
    app: one(apps, {
        fields: [reviews.packageName],
        references: [apps.packageName]
    })
}));

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account)
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id]
    })
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id]
    })
}));
