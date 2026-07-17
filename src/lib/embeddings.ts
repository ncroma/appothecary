import type { App } from "@/db/queries";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const INPUT_MAX_CHARS = 1500;

export function buildEmbeddingInput(app: Pick<App, "name" | "developer" | "description">): string {
    return [app.name, app.developer, app.description]
        .filter(Boolean)
        .join("\n")
        .slice(0, INPUT_MAX_CHARS);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts })
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Embedding request failed with ${res.status}: ${detail.slice(0, 300)}`);
    }

    const json = (await res.json()) as { data: { index: number; embedding: number[] }[] };
    const embeddings = [...json.data].sort((a, b) => a.index - b.index).map((item) => item.embedding);

    for (const embedding of embeddings) {
        if (embedding.length !== EMBEDDING_DIMENSIONS) {
            throw new Error(`Expected ${EMBEDDING_DIMENSIONS} dimensions, got ${embedding.length}`);
        }
    }

    return embeddings;
}

export async function embedText(text: string): Promise<number[]> {
    const [embedding] = await embedBatch([text]);
    return embedding;
}
