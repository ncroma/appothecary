import { VialLoader } from "@/components/vial-loader";

// Shown instantly by the router while the detail page renders on the
// server (ISR miss + database wake can take a beat on prod).
export default function AppDetailLoading() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <VialLoader />
        </main>
    );
}
