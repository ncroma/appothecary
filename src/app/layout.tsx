import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export const metadata: Metadata = {
    title: "Appothecary",
    description: "Remedies for your app drawer — discover, review, and curate apps."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${archivo.variable} ${libreCaslon.variable} ${jetbrainsMono.variable}`}>
            <body className="bg-dispensary text-foam antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
