import { searchApps } from "@/db/queries";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (!q) {
        return Response.json({ error: "Missing query parameter 'q'" }, { status: 400 });
    }
    const trimmedQ = q.trim();
    if (trimmedQ.length < 2) {
        return Response.json({ error: "Query parameter 'q' is too short" }, { status: 400 });
    }
    if (trimmedQ.length > 100) {
        return Response.json({ error: "Query parameter 'q' is too long" }, { status: 400 });
    }

    const results = await searchApps(trimmedQ, 20);
    return Response.json(results);
}
