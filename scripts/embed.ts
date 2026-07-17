import { eq, isNull } from "drizzle-orm";
import { db } from "../src/db";
import { apps } from "../src/db/schema";
import { chunk } from "../src/lib/chunk";
import { buildEmbeddingInput, embedBatch } from "../src/lib/embeddings";

const BATCH_SIZE = 100;

async function main() {
    if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not set");
        process.exit(1);
    }

    const pending = await db
        .select({ packageName: apps.packageName, name: apps.name, developer: apps.developer, description: apps.description })
        .from(apps)
        .where(isNull(apps.embedding));

    console.log(`${pending.length} apps to embed`);

    let embedded = 0;
    for (const batch of chunk(pending, BATCH_SIZE)) {
        const vectors = await embedBatch(batch.map((app) => buildEmbeddingInput(app)));
        for (const [index, app] of batch.entries()) {
            await db.update(apps).set({ embedding: vectors[index] }).where(eq(apps.packageName, app.packageName));
        }
        embedded += batch.length;
        console.log(`embedded ${embedded}/${pending.length}`);
    }

    console.log(`Done: ${embedded} apps embedded.`);
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
