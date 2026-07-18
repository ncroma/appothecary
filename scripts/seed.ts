import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { apps } from "../src/db/schema";
import { fetchAppMeta, fetchTopApps, type AppInsert } from "../src/lib/aptoide";
import { FAVORITES } from "./favorites";
import { CATALOG } from "./catalog";
import { chunk } from "../src/lib/chunk";

const TOP_LIMIT = 250;
const CONCURRENCY = 4;
const WAVE_DELAY_MS = 150;
const BATCH_SIZE = 50;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(ref: string | number): Promise<AppInsert | null> {
    const first = await fetchAppMeta(ref).catch(() => null);
    if (first) return first;
    await sleep(500);
    return fetchAppMeta(ref).catch(() => null);
}

async function main() {
    console.log(`Fetching top ${TOP_LIMIT} from the charts…`);
    const top = await fetchTopApps(TOP_LIMIT);

    const refs = [...new Set<string | number>([...top, ...FAVORITES, ...CATALOG])];
    console.log(`${refs.length} refs to ingest (${top.length} chart + ${FAVORITES.length} favorites + ${CATALOG.length} catalog, deduped)`);

    const rows: AppInsert[] = [];
    const missing: (string | number)[] = [];

    const favoriteRefs = new Set(FAVORITES);

    for (const wave of chunk(refs, CONCURRENCY)) {
        const results = await Promise.all(wave.map(fetchWithRetry));
        results.forEach((row, i) => {
            if (!row) {
                missing.push(wave[i]);
                return;
            }

            rows.push(favoriteRefs.has(wave[i]) ? { ...row, curated: true } : row);
        });
        process.stdout.write(`\rfetched ${rows.length + missing.length}/${refs.length}`);
        await sleep(WAVE_DELAY_MS);
    }

    const unique = [...new Map(rows.map((row) => [row.packageName, row])).values()];

    let upserted = 0;
    for (const batch of chunk(unique, BATCH_SIZE)) {
        await db
            .insert(apps)
            .values(batch)
            .onConflictDoUpdate({
                target: apps.packageName,
                set: {
                    name: sql`excluded.name`,
                    developer: sql`excluded.developer`,
                    description: sql`excluded.description`,
                    iconUrl: sql`excluded.icon_url`,
                    graphicUrl: sql`excluded.graphic_url`,
                    downloads: sql`excluded.downloads`,
                    ratingAvg: sql`excluded.rating_avg`,
                    ageRating: sql`excluded.age_rating`,
                    aptoideUrl: sql`excluded.aptoide_url`,
                    curated: sql`excluded.curated`,
                    updatedAt: new Date()
                }
            });
        upserted += batch.length;
        console.log(`upserted ${upserted}/${unique.length}`);
    }

    console.log(`\nDone: ${unique.length} apps on the shelves, ${missing.length} misses.`);
    if (missing.length > 0) console.log(`Missing: ${missing.join(", ")}`);

    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
