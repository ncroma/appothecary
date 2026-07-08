import Image from "next/image";
import Link from "next/link";
import type { App } from "@/db/queries";
import { formatDownloads } from "@/lib/format";

export function AppCard({ app }: { app: App }) {
    return (
        <Link href={`/apps/${app.packageName}`} className="group flex min-h-21 items-center gap-3 rounded-sm bg-vial p-3 transition-shadow hover:ring-1 hover:ring-elixir/60">
            {app.iconUrl ? (
                <Image src={app.iconUrl} alt="" width={48} height={48} className="size-12 shrink-0 rounded-xl bg-bottle" />
            ) : (
                <div aria-hidden className="size-12 shrink-0 rounded-xl bg-bottle" />
            )}

            <div className="min-w-0">
                <p className="truncate font-medium">{app.name}</p>
                <p className="truncate text-sm opacity-70">{app.developer}</p>
                <p className="truncate font-mono text-xs opacity-70">
                    {app.ratingAvg?.toFixed(1) ?? "—"} ★ · {formatDownloads(app.downloads)}
                </p>
            </div>
        </Link>
    );
}
