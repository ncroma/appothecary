import { Suspense } from "react";

export const revalidate = 3600;
import { AppCard } from "@/components/app-card";
import { AppLogo } from "@/components/logo";
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
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-14 px-4 py-12 sm:px-8 sm:py-24">
            <header className="flex flex-col items-center gap-5">
                <AppLogo animated className="aspect-3/5 h-24 w-auto shrink-0" />
                <div className="flex flex-col items-center gap-3">
                    <h1 className="font-display text-5xl">Appothecary</h1>
                    <p className="text-lg opacity-80">Apps for what ails you.</p>
                </div>
            </header>

            <Search />

            <Suspense fallback={<ShelfSkeleton title="Dispensary picks" />}>
                <Shelf title="Dispensary picks" load={() => getCuratedApps(12)} />
            </Suspense>

            <Suspense fallback={<ShelfSkeleton title="Most Dispensed" />}>
                <Shelf title="Most Dispensed" load={() => getTopApps(12)} />
            </Suspense>
        </main>
    );
}
