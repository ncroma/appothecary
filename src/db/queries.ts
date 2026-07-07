import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { apps } from "./schema";

export type App = typeof apps.$inferSelect;

export async function getCuratedApps(limit: number): Promise<App[]> {
    return db
        .select()
        .from(apps)
        .where(eq(apps.curated, true))
        .orderBy(sql`${apps.ratingAvg} DESC NULLS LAST`)
        .limit(limit);
}

export async function getApp(packageName: string): Promise<App | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.packageName, packageName)).limit(1);
    return app;
}

export async function getTopApps(limit: number): Promise<App[]> {
    return db
        .select()
        .from(apps)
        .orderBy(sql`${apps.downloads} DESC NULLS LAST, ${apps.ratingAvg} DESC NULLS LAST`)
        .limit(limit);
}
