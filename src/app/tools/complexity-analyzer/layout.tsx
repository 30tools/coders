import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time & Space Complexity Analyzer | Coders Toolbox',
  description: 'Analyze the computational complexity of your algorithms with AI-powered insights. Get detailed time and space complexity analysis with optimization suggestions for better performance.',
  keywords: 'time complexity, space complexity, algorithm analysis, big O notation, performance optimization, computational complexity, code analysis',
  openGraph: {
    title: 'Time & Space Complexity Analyzer',
    description: 'AI-powered algorithm complexity analysis tool. Analyze time and space complexity with optimization suggestions.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComplexityAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}