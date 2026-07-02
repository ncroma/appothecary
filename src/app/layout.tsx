import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Appothecary",
    description: "Remedies for your app drawer — discover, review, and curate apps."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="bg-parchment text-ink antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
