import type { Metadata } from "next";
import { AppCard } from "@/components/app-card";
import { VialLoader } from "@/components/vial-loader";
import type { App } from "@/db/queries";

export const metadata: Metadata = {
    title: "Styleguide — Appothecary"
};

const palette = [
    { name: "bottle", hex: "#111815", role: "page ground", swatch: "bg-bottle border border-foam/20" },
    { name: "vial", hex: "#1D2822", role: "raised surfaces — cards, inputs", swatch: "bg-vial" },
    { name: "foam", hex: "#EAE3CF", role: "text", swatch: "bg-foam" },
    { name: "elixir", hex: "#D9A441", role: "the accent — one pour per view", swatch: "bg-elixir" },
    { name: "herb", hex: "#7E9B78", role: "secondary — tags, success", swatch: "bg-herb" },
    { name: "oxblood", hex: "#A85944", role: "errors, destructive actions", swatch: "bg-oxblood" }
];

const sampleApp: App = {
    packageName: "org.thoughtcrime.securesms",
    name: "Signal - Private Messenger",
    developer: "Open Whisper Systems",
    iconUrl: "https://pool.img.aptoide.com/appupdater/7eb548d498e5676975cae53a786da0ff_icon.png",
    ratingAvg: 4.46,
    downloads: 100000000,
    description: null,
    graphicUrl: null,
    ageRating: null,
    aptoideUrl: null,
    embedding: null,
    curated: true,
    ingestedAt: new Date("2026-07-05"),
    updatedAt: new Date("2026-07-06")
};

export default function StyleguidePage() {
    return (
        <main className="mx-auto flex max-w-4xl flex-col gap-16 px-8 py-16">
            <header>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">Appothecary · living documentation</p>
                <h1 className="mt-3 font-display text-5xl">Styleguide</h1>
                <p className="mt-4 max-w-prose opacity-80">Every token on one shelf. If it is not here, it is not in the design system.</p>
            </header>

            <section className="flex flex-col gap-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">The shelf · color tokens</h2>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {palette.map((token) => (
                        <li key={token.name} className="flex flex-col gap-2 rounded-sm surface-vial p-3">
                            <div className={`h-16 rounded-sm ${token.swatch}`} />
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="font-medium">{token.name}</span>
                                <span className="font-mono text-xs opacity-60">{token.hex}</span>
                            </div>
                            <p className="text-sm opacity-70">{token.role}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="flex flex-col gap-8">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">Type specimens</h2>
                <div>
                    <p className="mb-2 font-mono text-xs opacity-60">font-display · Libre Caslon Text</p>
                    <p className="font-display text-4xl">Remedies for your app drawer.</p>
                </div>
                <div>
                    <p className="mb-2 font-mono text-xs opacity-60">font-sans · Archivo · the default</p>
                    <p className="max-w-prose">
                        Browse the shelves, log what you install, and leave a note for the next visitor. Appothecary keeps your history the way a good pharmacist keeps records — dated, honest, and
                        slightly obsessive.
                    </p>
                </div>
                <div>
                    <p className="mb-2 font-mono text-xs opacity-60">font-mono · JetBrains Mono · the values</p>
                    <p className="max-w-prose font-mono">v7.42.1 · 38 MB · ★ 4.6</p>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">Components</h2>
                <div>
                    <p className="mb-2 font-mono text-xs opacity-60">AppCard · shelf unit, links to the app page</p>
                    <div className="max-w-sm">
                        <AppCard app={sampleApp} />
                    </div>
                </div>
                <div>
                    <p className="mb-2 font-mono text-xs opacity-60">VialLoader · full-page waits only — skeletons keep their pulse</p>
                    <VialLoader />
                </div>
            </section>
        </main>
    );
}
