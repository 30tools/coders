import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Tools - 31+ Essential Coding Utilities | Coders Toolbox',
  description: 'Discover 31+ essential developer tools including code formatters, API testers, complexity analyzers, and more. Free, fast, and beautifully designed coding utilities.',
  keywords: 'developer tools, coding tools, programming utilities, code formatter, API tester, regex tester, complexity analyzer, web development tools',
  openGraph: {
    title: 'Developer Tools - 31+ Essential Coding Utilities',
    description: 'Discover 31+ essential developer tools for better coding productivity. Code formatters, analyzers, converters and more.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}