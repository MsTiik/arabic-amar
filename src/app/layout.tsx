import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";

import { Topbar } from "@/components/topbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Noto Sans Arabic mirrors the look the Google Doc gets from "Arial" — a
// neutral, sans-serif Arabic typeface — while keeping full diacritic coverage.
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
