import Link from "next/link";
import { AuthWidget } from "@/components/auth-widget";
import { AppLogo } from "@/components/logo";

export function SiteHeader() {
    return (
        <header className="border-b border-foam/10">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-4">
                <Link href="/" className="flex items-center gap-2 font-display text-xl">
                    <AppLogo className="aspect-3/5 h-6 w-auto" />
                    Appothecary
                </Link>
                <AuthWidget />
            </div>
        </header>
    );
}
