import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coders - The Ultimate Developer Toolbox | 30+ Free Coding Tools",
  description: "Fast, free, and beautifully designed developer tools. Code formatters, API testers, converters, and 30+ essential coding utilities in one clean interface. Built by developers, for developers.",
  keywords: "developer tools, coding tools, JSON formatter, API tester, code converter, regex tester, base64 encoder, developer utilities, programming tools, web development",
  authors: [{ name: "30Tools Team" }],
  creator: "30Tools",
  publisher: "30Tools",
  openGraph: {
    title: "Coders - The Ultimate Developer Toolbox",
    description: "30+ essential developer tools in one clean, fast interface. No ads, no clutter, just pure productivity.",
    url: "https://coders.30tools.com",
    siteName: "Coders by 30Tools",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Coders - Developer Toolbox",
      },
    ],
 },
  twitter: {
    card: "summary_large_image",
    title: "Coders - The Ultimate Developer Toolbox",
    description: "30+ essential developer tools in one clean, fast interface. Built by developers, for developers.",
    images: ["/og-image.png"],
    creator: "@SH20RAJ",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Coders - Developer Toolbox",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "description": "30+ essential developer tools in one clean, fast interface. Code formatters, API testers, converters, and more. Built by developers, for developers.",
    "url": "https://coders.30tools.com",
    "author": {
      "@type": "Organization",
      "name": "30Tools",
      "url": "https://30tools.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#3f5efb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
