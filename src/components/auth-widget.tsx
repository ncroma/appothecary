"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthWidget() {
    const { data: session, isPending } = authClient.useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [isSigningIn, startSignIn] = useTransition();
    const [isSigningOut, startSignOut] = useTransition();

    if (isPending) return <div aria-hidden className="h-8 w-24 animate-pulse rounded-sm bg-foam/8" />;

    if (!session) {
        return (
            <button
                type="button"
                disabled={isSigningIn}
                onClick={() =>
                    startSignIn(async () => {
                        await authClient.signIn.social({ provider: "github", callbackURL: pathname });
                    })
                }
                className="cursor-pointer rounded-sm bg-elixir px-4 py-1.5 text-sm font-semibold text-bottle transition-opacity hover:opacity-90 disabled:opacity-60"
            >
                {isSigningIn ? "Opening GitHub…" : "Sign in with GitHub"}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {session.user.image ? (
                <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full bg-vial" />
            ) : (
                <div aria-hidden className="grid size-7 place-items-center rounded-full bg-vial text-xs text-herb">
                    {session.user.name.charAt(0).toUpperCase()}
                </div>
            )}
            <span className="hidden text-sm opacity-80 sm:inline">{session.user.name}</span>
            <button
                type="button"
                disabled={isSigningOut}
                onClick={() =>
                    startSignOut(async () => {
                        await authClient.signOut();
                        router.refresh();
                    })
                }
                className="cursor-pointer text-sm text-herb hover:underline disabled:opacity-50"
            >
                {isSigningOut ? "Signing out…" : "Sign out"}
            </button>
        </div>
    );
}
