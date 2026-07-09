// The signature loader: a vial of sloshing tincture, pure CSS. The liquid
// is an oversized rounded square rotating slowly below the waterline — its
// curved edge reads as the wave. Reserved for FULL-PAGE waits (e.g. the
// future semantic search "steeping" state); skeletons keep their pulse.
export function VialLoader({ label = "Steeping…" }: { label?: string }) {
    return (
        <div role="status" className="flex flex-col items-center gap-3">
            <div className="relative h-21 w-14 overflow-hidden rounded-t-lg rounded-b-3xl border-2 border-foam/25 bg-foam/5">
                <div
                    aria-hidden
                    className="absolute top-[52%] -left-[55%] h-[200%] w-[210%] animate-slosh rounded-[42%] bg-linear-to-b from-elixir/85 to-oxblood/70 motion-reduce:animate-none"
                />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{label}</p>
        </div>
    );
}
