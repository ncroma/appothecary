import { searchAppsSemantic } from "@/db/queries";
import { embedText } from "@/lib/embeddings";

const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;
// per-instance only: serverless spawns fresh maps per instance, so this is
// a cost guard, not a security boundary
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now - entry.windowStart > WINDOW_MS) {
        hits.set(ip, { count: 1, windowStart: now });
        return false;
    }
    entry.count += 1;
    return entry.count > RATE_LIMIT;
}

export async function GET(request: Request) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
        return Response.json({ error: "Too many searches — let the cauldron cool for a minute." }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (!q) {
        return Response.json({ error: "Missing query parameter 'q'" }, { status: 400 });
    }
    const trimmed = q.trim();
    if (trimmed.length < 3) {
        return Response.json({ error: "Query parameter 'q' is too short" }, { status: 400 });
    }
    if (trimmed.length > 200) {
        return Response.json({ error: "Query parameter 'q' is too long" }, { status: 400 });
    }

    const embedding = await embedText(trimmed);
    const results = await searchAppsSemantic(embedding, 12);
    return Response.json(results);
}
