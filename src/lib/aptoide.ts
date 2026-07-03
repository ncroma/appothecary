import { apps } from "@/db/schema";

const API_BASE = "https://ws75.aptoide.com/api/7";

export type AppInsert = typeof apps.$inferInsert;

type AptoideMeta = {
    info?: { status?: string };
    data?: {
        name?: string;
        package?: string;
        icon?: string;
        graphic?: string;
        added?: string;
        age?: { title?: string };
        developer?: { name?: string };
        media?: { description?: string };
        urls?: { w?: string };
        stats?: {
            downloads?: number;
            rating?: { avg?: number; total?: number };
            prating?: { avg?: number; total?: number };
        };
    };
};

type AptoideList = {
    datalist?: { list?: { package?: string }[] };
};

export async function fetchTopApps(limit: number): Promise<string[]> {
    const packages: string[] = [];
    const pageSize = 100;

    for (let offset = 0; offset < limit; offset += pageSize) {
        const res = await fetch(`${API_BASE}/listApps/sort=downloads/limit=${pageSize}/offset=${offset}`);
        if (!res.ok) break;

        const json = (await res.json()) as AptoideList;
        const page = json.datalist?.list ?? [];
        if (page.length === 0) break;

        for (const entry of page) {
            if (entry.package) packages.push(entry.package);
        }
    }

    return packages.slice(0, limit);
}

export async function fetchAppMeta(packageName: string): Promise<AppInsert | null> {
    const res = await fetch(`${API_BASE}/app/getMeta?package_name=${encodeURIComponent(packageName)}`);
    if (!res.ok) return null;

    const json = (await res.json()) as AptoideMeta;
    const data = json.data;

    if (json.info?.status !== "OK" || !data?.package || !data.name) return null;

    return {
        packageName: data.package,
        name: data.name,
        developer: data.developer?.name ?? null,
        description: data.media?.description ?? null,
        iconUrl: data.icon ?? null,
        graphicUrl: data.graphic ?? null,
        downloads: data.stats?.downloads ?? null,
        ratingAvg: data.stats?.prating?.avg ?? data.stats?.rating?.avg ?? null,
        ageRating: data.age?.title ?? null,
        aptoideUrl: data.urls?.w ?? null
    };
}
