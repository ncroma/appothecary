import { cache } from "react";
import { eq, ilike, sql, or } from "drizzle-orm";
import { db } from "./index";
import { apps, reviews, user } from "./schema";

export type App = typeof apps.$inferSelect;

export async function getCuratedApps(limit: number): Promise<App[]> {
    return db
        .select()
        .from(apps)
        .where(eq(apps.curated, true))
        .orderBy(sql`${apps.ratingAvg} DESC NULLS LAST`)
        .limit(limit);
}

export const getApp = cache(async (packageName: string): Promise<App | undefined> => {
    const [app] = await db.select().from(apps).where(eq(apps.packageName, packageName)).limit(1);
    return app;
});

export async function searchApps(q: string, limit: number): Promise<App[]> {
    return db
        .select()
        .from(apps)
        .where(or(ilike(apps.name, `%${q}%`), ilike(apps.developer, `%${q}%`)))
        .orderBy(sql`${apps.downloads} DESC NULLS LAST`)
        .limit(limit);
}

export async function getReviewsForApp(packageName: string) {
    return db
        .select({
            id: reviews.id,
            rating: reviews.rating,
            body: reviews.body,
            createdAt: reviews.createdAt,
            userId: reviews.userId,
            authorName: user.name,
            authorImage: user.image
        })
        .from(reviews)
        .innerJoin(user, eq(reviews.userId, user.id))
        .where(eq(reviews.packageName, packageName))
        .orderBy(sql`${reviews.createdAt} DESC`);
}

export type ReviewWithAuthor = Awaited<ReturnType<typeof getReviewsForApp>>[number];

export async function getTopApps(limit: number): Promise<App[]> {
    return db
        .select()
        .from(apps)
        .orderBy(sql`${apps.downloads} DESC NULLS LAST, ${apps.ratingAvg} DESC NULLS LAST`)
        .limit(limit);
}
