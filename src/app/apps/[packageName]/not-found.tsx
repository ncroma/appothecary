import Link from "next/link";

export default function AppNotFound() {
    return (
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-herb">404 · out of stock</p>
            <h1 className="font-display text-4xl">This remedy isn&apos;t stocked.</h1>
            <p className="opacity-80">No app by that name on our shelves — it may have been mislabeled, or it was never bottled here.</p>
            <Link href="/" className="mt-2 text-sm text-herb hover:underline">
                ← Back to the shelves
            </Link>
        </main>
    );
}
