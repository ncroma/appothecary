import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/toaster";

const archivo = Archivo({
    subsets: ["latin"],
    variable: "--font-archivo"
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains"
});

const libreCaslon = Libre_Caslon_Text({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-caslon"
});

const description = "Apps for what ails you — discover, review, and curate Android apps.";

export const metadata: Metadata = {
    metadataBase: new URL("https://appothecary.vercel.app"),
    title: "Appothecary",
    description,
    openGraph: {
        title: "Appothecary",
        description,
        url: "/",
        siteName: "Appothecary",
        type: "website"
    },
    twitter: {
        card: "summary_large_image"
    }
};

export const viewport: Viewport = {
    themeColor: "#111815"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${archivo.variable} ${libreCaslon.variable} ${jetbrainsMono.variable}`}>
            <body className="bg-dispensary text-foam antialiased">
                <Providers>
                    <SiteHeader />
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
