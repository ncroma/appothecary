import Link from "next/link";
import { AuthWidget } from "@/components/auth-widget";

export function SiteHeader() {
    return (
        <header className="border-b border-foam/10">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-4">
                <Link href="/" className="font-display text-xl">
                    Appothecary
                </Link>
                <AuthWidget />
            </div>
        </header>
    );
}
