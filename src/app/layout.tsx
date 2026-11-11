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
export const metadata: Metadata = {
  metadataBase: new URL("https://gotechnologies.lk"),
  title: "Go Technologies | Technology for Journeys That Matter",
  description:
    "Go Technologies builds digital products that make travel and mobility simpler, more connected and easier to navigate - starting with GoChauffeur in Sri Lanka.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Go Technologies | Technology for Journeys That Matter",
    description:
      "Go Technologies builds digital products that make travel and mobility simpler, more connected and easier to navigate - starting with GoChauffeur in Sri Lanka.",
    images: [
      {
        url: "/images/go-technologies-preview.png",
        width: 1920,
        height: 1080,
        alt: "Go Technologies — Everything begins with Go.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/images/go-technologies-preview.png",
        alt: "Go Technologies — Everything begins with Go.",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cal.variable} ${dm.variable}`}>{children}</body>
    </html>
  );
}
