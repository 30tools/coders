import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import TextDiffCheckerTool from './TextDiffCheckerTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'Text Diff Checker - Compare Text Documents Online',
    description: 'Compare text documents and highlight differences line by line. Visual diff tool with merge support, syntax highlighting, and file comparison for developers.',
    keywords: [
      'text diff', 'text comparison', 'diff checker', 'merge conflict',
      'file comparison', 'document diff', 'text differences', 'compare text',
      'line by line diff', 'visual diff', 'merge tool', 'git diff',
      'side by side comparison', 'unified diff', 'patch generator'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools/text-diff-checker',
    ogType: 'article'
  });
}

export default function TextDiffCheckerPage() {
  const jsonLd = generateStructuredData('Tool', {
    name: 'Text Diff Checker',
    description: 'Professional text comparison tool with visual highlighting, merge capabilities, and multiple diff formats.',
    features: [
      'Side-by-side text comparison',
      'Line-by-line difference highlighting',
      'Visual merge conflict resolution',
      'Multiple diff output formats',
      'File upload support',
      'Syntax highlighting for code',
      'Unified and split view modes',
      'Export diff as patch',
      'Character-level differences',
      'Ignore whitespace options',
      'Word-level comparison',
      'Real-time diff updates'
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextDiffCheckerTool />
    </div>
  );
}