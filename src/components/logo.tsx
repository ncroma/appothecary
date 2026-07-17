// The Appothecary mark: an android — no arms, no legs — whose belly is a
// glass vial of elixir. Head and glass in foam (currentColor); `animated`
// adds the settle slosh and rising bubbles (hero only). Android robot ©
// Google, reused/modified under CC BY 3.0 — attribution lives in the README.
export function AppLogo({ className, animated = false }: { className?: string; animated?: boolean }) {
    return (
        <svg viewBox="0 0 32 44" role="img" aria-label="Appothecary" className={className}>
            {/* head — same width as the vial, foam like the glass */}
            <path d="M10.5 12 a5.5 5.5 0 0 1 11 0 z" fill="currentColor" />
            <line x1="12.4" y1="7.7" x2="10.9" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="19.6" y1="7.7" x2="21.1" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="13.8" cy="9.4" r="0.9" fill="var(--color-bottle)" />
            <circle cx="18.2" cy="9.4" r="0.9" fill="var(--color-bottle)" />

            {/* the belly: liquid first, glass wall on top */}
            {animated ? (
                <>
                    <clipPath id="app-logo-belly">
                        <path d="M10.5 15.5 h11 v15.5 a5.5 5.5 0 0 1 -11 0 z" />
                    </clipPath>
                    <g clipPath="url(#app-logo-belly)">
                        <rect
                            x="1"
                            y="23.5"
                            width="30"
                            height="32"
                            rx="13.5"
                            fill="var(--color-elixir)"
                            className="animate-settle-still motion-reduce:animate-none"
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                        <circle
                            cx="14"
                            cy="34.5"
                            r="0.9"
                            fill="var(--color-foam)"
                            className="animate-bubble motion-reduce:animate-none"
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                        <circle
                            cx="18.5"
                            cy="35"
                            r="0.7"
                            fill="var(--color-foam)"
                            className="animate-bubble motion-reduce:animate-none"
                            style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "1.7s", animationDuration: "3.3s" }}
                        />
                    </g>
                </>
            ) : (
                <>
                    <path d="M10.5 24.6 q2.75 -1.5 5.5 0 t5.5 0 V31 a5.5 5.5 0 0 1 -11 0 z" fill="var(--color-elixir)" />
                    <circle cx="14" cy="28.4" r="0.9" fill="var(--color-foam)" opacity="0.8" />
                </>
            )}
            <path
                d="M12 14 h8 a1.5 1.5 0 0 1 1.5 1.5 v15.5 a5.5 5.5 0 0 1 -11 0 v-15.5 A1.5 1.5 0 0 1 12 14 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}
