// The Appothecary mark: an android — no arms, no legs — whose belly is a
// glass vial of elixir. Head and glass in foam (currentColor); `animated`
// adds the settle slosh and rising bubbles (hero only). Android robot ©
// Google, reused/modified under CC BY 3.0 — attribution lives in the README.
export function AppLogo({ className, animated = false }: { className?: string; animated?: boolean }) {
    return (
        <svg viewBox="1.5 0.5 21 35" role="img" aria-label="Appothecary" className={className}>
            {/* head */}
            <path d="M4 11 a8 8 0 0 1 16 0 z" fill="currentColor" />
            <line x1="7" y1="4.8" x2="5.2" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="4.8" x2="18.8" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8.5" cy="8.2" r="1.5" fill="var(--color-bottle)" />
            <circle cx="15.5" cy="8.2" r="1.5" fill="var(--color-bottle)" />

            {/* the belly: liquid first, glass wall on top */}
            {animated ? (
                <>
                    <clipPath id="app-logo-belly">
                        <path d="M4 14.5 h16 v10.5 a8 8 0 0 1 -16 0 z" />
                    </clipPath>
                    <g clipPath="url(#app-logo-belly)">
                        <rect
                            x="-12"
                            y="20.5"
                            width="48"
                            height="48"
                            rx="14"
                            fill="var(--color-elixir)"
                            className="animate-settle-still motion-reduce:animate-none"
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                        <circle
                            cx="9"
                            cy="30.5"
                            r="0.65"
                            fill="var(--color-foam)"
                            className="animate-bubble motion-reduce:animate-none"
                            style={{ transformBox: "fill-box", transformOrigin: "center", animationFillMode: "backwards" }}
                        />
                        <circle
                            cx="14.5"
                            cy="31"
                            r="0.5"
                            fill="var(--color-foam)"
                            className="animate-bubble motion-reduce:animate-none"
                            style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "1.7s", animationDuration: "3.3s", animationFillMode: "backwards" }}
                        />
                    </g>
                </>
            ) : (
                <>
                    <path d="M4 21 q4 -1.8 8 0 t8 0 V25 a8 8 0 0 1 -16 0 z" fill="var(--color-elixir)" />
                    <circle cx="8.5" cy="26" r="1" fill="var(--color-foam)" opacity="0.8" />
                </>
            )}
            <path
                d="M5.5 13 h13 a1.5 1.5 0 0 1 1.5 1.5 v10.5 a8 8 0 0 1 -16 0 v-10.5 A1.5 1.5 0 0 1 5.5 13 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}
