import { getContent } from "@/sanity/lib/content";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./story.css";
import "./typography.css";
const cal = localFont({
  src: "../../public/fonts/cal-sans.ttf",
  variable: "--font-cal",
  display: "swap",
  weight: "400",
});
const dm = localFont({
  src: [
    { path: "../../public/fonts/dm-sans.ttf", weight: "400" },
    { path: "../../public/fonts/dm-sans-semibold.ttf", weight: "600" },
  ],
  variable: "--font-dm",
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return {
    ...seo,
    metadataBase: new URL(seo.metadataBase),
    robots: { index: false, follow: false },
  } as Metadata;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cal.variable} ${dm.variable}`}>{children}</body>
    </html>
  );
}
