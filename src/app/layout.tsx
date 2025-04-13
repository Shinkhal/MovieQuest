import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MovieQuest | Find Your Next Favorite Film",
    template: "%s | MovieQuest",
  },
  description:
    "Discover, explore and share your favorite movies with MovieQuest - your personalized film recommendation platform.",
  keywords: [
    "movies",
    "film recommendations",
    "movie database",
    "cinema",
    "movie discovery",
    "film ratings",
  ],
  authors: [{ name: "Shinkhal Sinha" }],
  creator: "MovieQuest",
  metadataBase: new URL("https://moviequest.example.com"),
  openGraph: {
    title: "MovieQuest | Find Your Next Favorite Film",
    description:
      "Discover, explore and share your favorite movies with MovieQuest - your personalized film recommendation platform.",
    url: "https://moviequest.example.com",
    siteName: "MovieQuest",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieQuest - Find Your Next Favorite Film",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieQuest | Find Your Next Favorite Film",
    description:
      "Discover, explore and share your favorite movies with MovieQuest - your personalized film recommendation platform.",
    creator: "@moviequest",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
        <Toaster richColors position="bottom-right" />
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MovieQuest",
              url: "https://moviequest.example.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://moviequest.example.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
