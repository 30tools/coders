import type { Metadata, Viewport } from "next";
import { StackTheme } from "@stackframe/stack";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/error-boundary";
import StackProviderWrapper from "@/components/StackProviderWrapper";
import { generateMetadata as createSEOMetadata, generateStructuredData } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = createSEOMetadata({
  title: "Coders - The Ultimate Developer Toolbox | 30+ Free Coding Tools",
  description: "Fast, free, and beautifully designed developer tools. Code formatters, API testers, converters, and 30+ essential coding utilities in one clean interface. Built by developers, for developers.",
  keywords: [
    "developer tools", "coding tools", "JSON formatter", "API tester", 
    "code converter", "regex tester", "base64 encoder", "developer utilities",
    "programming tools", "web development", "code analysis", "complexity analyzer",
    "hash generator", "URL encoder", "free tools", "online tools"
  ],
  canonicalUrl: "https://coders.30tools.com",
  ogType: "website"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateStructuredData('WebApplication', {
    name: "Coders - Developer Toolbox",
    description: "30+ essential developer tools in one clean, fast interface. Code formatters, API testers, converters, and more. Built by developers, for developers.",
    rating: {
      value: "4.8",
      count: "1250"
    }
  });

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Coders" />
        <meta name="application-name" content="Coders" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  const preference = localStorage.getItem('theme');
                  if (preference) return preference;
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                const theme = getInitialTheme();
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <StackProviderWrapper>
              <StackTheme>
                <div id="skip-nav" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50">
                  <a href="#main-content">Skip to main content</a>
                </div>
                <main id="main-content">
                  {children}
                </main>
              </StackTheme>
            </StackProviderWrapper>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
