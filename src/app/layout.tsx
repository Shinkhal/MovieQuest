import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/QueryProvider';
import { AuthProvider } from '@/components/AuthProvider';

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
    "Discover, explore and share your favorite movies with MovieQuest - your personalized film recommendation and streaming platform.",
  keywords: [
    "movies",
    "film recommendations",
    "movie database",
    "cinema",
    "movie discovery",
    "film ratings",
    "streaming guide",
  ],
  authors: [{ name: "Shinkhal Sinha" }],
  creator: "MovieQuest",
  metadataBase: new URL("https://moviequests.vercel.app"),
  openGraph: {
    title: "MovieQuest | Find Your Next Favorite Film",
    description:
      "Discover, explore and share your favorite movies with MovieQuest - your personalized film recommendation platform.",
    url: "https://moviequests.vercel.app",
    siteName: "MovieQuest",
    type: "website",
    locale: "en_US",
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <QueryProvider>
              <Navbar />
              {children}
              <Toaster richColors position="bottom-right" />
              <Footer />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MovieQuest",
              url: "https://moviequests.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://moviequests.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
