import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { Topbar } from "@/components/topbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Self-hosted Noto Naskh Arabic (Medium). Naskh is the traditional book/Quran
// hand and has full coverage of tashkeel (fathatan, dammatan, kasratan, fatha,
// damma, kasra, shadda, sukun, dagger alif, etc.) — preserving every diacritic
// from the source doc end-to-end.
const notoArabic = localFont({
  variable: "--font-noto-arabic",
  src: [
    { path: "./fonts/NotoNaskhArabic-Medium.ttf", weight: "500", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arabic Amar — Quranic Arabic learning",
    template: "%s · Arabic Amar",
  },
  description:
    "Gamified Quranic Arabic vocabulary practice from the AMAR Arabic Programme study notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <Topbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          Built from the{" "}
          <a className="underline hover:text-foreground" href="/about">
            AMAR Arabic Programme study notes
          </a>
          . Tashkeel preserved end-to-end.
        </footer>
      </body>
    </html>
  );
}
