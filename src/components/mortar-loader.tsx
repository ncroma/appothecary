export function MortarLoader({ label = "Grinding the remedy…" }: { label?: string }) {
    return (
        <div role="status" className="flex flex-col items-center gap-3 text-foam">
            <svg viewBox="4 0 25 26" aria-hidden className="h-16 w-auto">
                <path
                    d="M18.2 13.5 L24.3 3.6 a1.7 1.7 0 0 1 3 1.6 L21.8 14 Z"
                    fill="currentColor"
                    opacity="0.9"
                    className="animate-grind motion-reduce:animate-none"
                    style={{ transformBox: "view-box", transformOrigin: "20px 13.5px" }}
                />
                <path
                    d="M6 14 h20 a1.5 1.5 0 0 1 1.5 1.7 c-0.8 6 -5 9.3 -11.5 9.3 s-10.7 -3.3 -11.5 -9.3 A1.5 1.5 0 0 1 6 14 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">{label}</p>
        </div>
    );
}
