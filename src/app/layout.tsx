import type { Metadata } from "next";
import { Amiri, Amiri_Quran, Inter } from "next/font/google";

import { Topbar } from "@/components/topbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const amiriQuran = Amiri_Quran({
  variable: "--font-amiri-quran",
  subsets: ["arabic"],
  weight: ["400"],
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
      className={`${inter.variable} ${amiri.variable} ${amiriQuran.variable} h-full antialiased`}
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
