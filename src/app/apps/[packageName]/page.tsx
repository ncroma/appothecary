import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApp, getReviewsForApp } from "@/db/queries";
import { formatDownloads } from "@/lib/format";
import { ReviewsSection } from "@/components/reviews-section";
import { ExpandableText } from "@/components/expandable-text";

export const revalidate = 86400;

type Props = { params: Promise<{ packageName: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { packageName } = await params;
    const app = await getApp(packageName);
    if (!app) return { title: "Not stocked — Appothecary" };

    return {
        title: `${app.name} — Appothecary`,
        description: app.description?.slice(0, 160) ?? `${app.name} on the Appothecary shelves.`
    };
}

export default async function AppDetailPage({ params }: Props) {
    const { packageName } = await params;
    const app = await getApp(packageName);
    if (!app) notFound();

    const appReviews = await getReviewsForApp(packageName);

    return (
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-8 py-12">
            <Link href="/" className="text-sm text-herb hover:underline">
                ← Back to the shelves
            </Link>

            {app.graphicUrl && (
                <div className="relative aspect-2/1 overflow-hidden rounded-sm bg-vial sm:aspect-3/1">
                    <Image src={app.graphicUrl} loading="eager" alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                </div>
            )}

            <header className="flex items-center gap-5">
                {app.iconUrl ? (
                    <Image src={app.iconUrl} alt="" width={96} height={96} className="size-24 shrink-0 rounded-2xl bg-vial" />
                ) : (
                    <div aria-hidden className="size-24 shrink-0 rounded-2xl bg-vial" />
                )}
                <div className="min-w-0">
                    <h1 className="font-display text-4xl">{app.name}</h1>
                    {app.developer && <p className="mt-1 opacity-70">{app.developer}</p>}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 rounded-sm surface-vial p-4">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-herb">Rating</span>
                    <span className="font-mono text-lg">{app.ratingAvg?.toFixed(1) ?? "—"} ★</span>
                </div>
                <div className="flex flex-col gap-1 rounded-sm surface-vial p-4">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-herb">Downloads</span>
                    <span className="font-mono text-lg">{formatDownloads(app.downloads)}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-sm surface-vial p-4">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-herb">Age</span>
                    <span className="font-mono text-lg">{app.ageRating ?? "—"}</span>
                </div>
            </section>

            {app.aptoideUrl && (
                <a
                    href={app.aptoideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start rounded-sm bg-elixir px-5 py-2.5 text-sm font-semibold text-bottle transition-opacity hover:opacity-90"
                >
                    Get it on Aptoide ↗
                </a>
            )}

            {app.description && (
                <section className="flex flex-col gap-3">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-herb">The label says</h2>
                    {app.description.length > 400 ? (
                        <ExpandableText text={app.description} className="max-w-prose whitespace-pre-line text-sm leading-relaxed opacity-85" />
                    ) : (
                        <p className="max-w-prose whitespace-pre-line text-sm leading-relaxed opacity-85">{app.description}</p>
                    )}
                </section>
            )}

            <ReviewsSection packageName={packageName} reviews={appReviews} />
        </main>
    );
}
