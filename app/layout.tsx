import type { Metadata, Viewport } from "next";
import { DotGothic16, Jersey_10, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({ variable: "--font-pixelify", subsets: ["latin"], weight: ["500", "700"] });
const jersey = Jersey_10({ variable: "--font-jersey", subsets: ["latin"], weight: "400" });
const dotgothic = DotGothic16({ variable: "--font-dotgothic", subsets: ["latin"], weight: "400", preload: false });

export const metadata: Metadata = {
  title: "King of the Hill — the last GMGN call out takes the fees",
  description:
    "Call out the token on GMGN to take the hill. Every new call out resets the clock. Whoever holds the hill when the timer hits zero is crowned and takes the fees.",
};

export const viewport: Viewport = {
  themeColor: "#489ffa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixelify.variable} ${jersey.variable} ${dotgothic.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
