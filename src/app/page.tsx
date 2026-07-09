import { Suspense } from "react";
import { AppCard } from "@/components/app-card";
import { getCuratedApps, getTopApps, type App } from "@/db/queries";
import { Search } from "@/components/search";

async function Shelf({ title, load }: { title: string; load: () => Promise<App[]> }) {
    const apps = await load();

    return (
        <section className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{title}</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                    <li key={app.packageName}>
                        <AppCard app={app} />
                    </li>
                ))}
            </ul>
        </section>
    );
}

function ShelfSkeleton({ title }: { title: string }) {
    return (
        <section aria-hidden className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{title} · steeping…</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="h-21 animate-pulse rounded-sm bg-foam/8" />
                ))}
            </div>
        </section>
    );
}

export default function HomePage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-14 px-8 py-16">
            <header className="flex flex-col gap-3">
                <h1 className="font-display text-5xl">Appothecary</h1>
                <p className="text-lg opacity-80">Remedies for your app drawer.</p>
            </header>

            <Search />

            <Suspense fallback={<ShelfSkeleton title="Dispensary picks" />}>
                <Shelf title="Dispensary picks" load={() => getCuratedApps(12)} />
            </Suspense>

            <Suspense fallback={<ShelfSkeleton title="Most Downloaded" />}>
                <Shelf title="Most Downloaded" load={() => getTopApps(12)} />
            </Suspense>
        </main>
    );
}
