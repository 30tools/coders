import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import { toolsData } from '@/lib/tools-data';
import ToolsContent from './ToolsContent';
import type { Metadata } from 'next';

const { tools } = toolsData;

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: `Developer Tools - ${tools.length}+ Essential Coding Utilities | Coders Toolbox`,
    description: `Discover ${tools.length}+ essential developer tools including code formatters, API testers, complexity analyzers, and more. Free, fast, and beautifully designed coding utilities for web developers.`,
    keywords: [
      'developer tools', 'coding tools', 'programming utilities', 'code formatter',
      'API tester', 'regex tester', 'complexity analyzer', 'web development tools',
      'JSON formatter', 'hash generator', 'base64 encoder', 'URL encoder',
      'free developer tools', 'online coding tools', 'web-based tools'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools',
    ogType: 'website'
  });
}

export default function ToolsPage() {
  const jsonLd = generateStructuredData('WebPage', {
    name: `Developer Tools - ${tools.length}+ Essential Coding Utilities`,
    description: `Comprehensive collection of ${tools.length}+ developer tools for better coding productivity. All free, fast, and designed for modern web development.`,
    image: '/og-tools.png'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsContent />
    </div>
  );
}