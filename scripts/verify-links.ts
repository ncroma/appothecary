import { eq, isNotNull } from "drizzle-orm";
import { db } from "../src/db";
import { apps } from "../src/db/schema";
import { canonicalAptoideUrl } from "../src/lib/aptoide";

const REQUEST_TIMEOUT_MS = 20_000;
const DELAY_MS = 300;
const RETRY_DELAY_MS = 2_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchStatus(url: string): Promise<number> {
    try {
        const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
        return res.status;
    } catch {
        return 0;
    }
}

async function isDead(url: string): Promise<boolean> {
    let status = await fetchStatus(url);
    if (status !== 200 && status !== 404) {
        await sleep(RETRY_DELAY_MS);
        status = await fetchStatus(url);
    }
    return status === 404;
}

async function main() {
    const rows = await db
        .select({ packageName: apps.packageName, aptoideUrl: apps.aptoideUrl })
        .from(apps)
        .where(isNotNull(apps.aptoideUrl));

    console.log(`${rows.length} links to verify`);

    let canonicalized = 0;
    let removed = 0;
    let checked = 0;

    for (const row of rows) {
        const canonical = canonicalAptoideUrl(row.aptoideUrl!);

        if (await isDead(canonical)) {
            await db.update(apps).set({ aptoideUrl: null }).where(eq(apps.packageName, row.packageName));
            removed += 1;
            console.log(`dead: ${canonical} (${row.packageName})`);
        } else if (canonical !== row.aptoideUrl) {
            await db.update(apps).set({ aptoideUrl: canonical }).where(eq(apps.packageName, row.packageName));
            canonicalized += 1;
        }

        checked += 1;
        if (checked % 25 === 0) console.log(`checked ${checked}/${rows.length}`);
        await sleep(DELAY_MS);
    }

    console.log(`Done: ${checked} checked, ${canonicalized} canonicalized, ${removed} dead links removed.`);
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
