import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import JSONFormatterTool from './JSONFormatterTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'JSON Formatter & Validator - Format, Validate & Minify JSON Online',
    description: 'Free online JSON formatter and validator tool. Format, validate, and minify JSON data with real-time error detection, syntax highlighting, and file upload support. Perfect for debugging APIs and cleaning up JSON files.',
    keywords: [
      'JSON formatter', 'JSON validator', 'JSON minifier', 'JSON prettifier',
      'JSON syntax checker', 'format JSON online', 'validate JSON online',
      'JSON parser', 'JSON lint', 'JSON beautifier', 'API debugging',
      'JSON file formatter', 'free JSON tool', 'online JSON editor'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools/json-formatter',
    ogType: 'article'
  });
}

export default function JSONFormatterPage() {
  const jsonLd = generateStructuredData('Tool', {
    name: 'JSON Formatter & Validator',
    description: 'Professional JSON formatting, validation, and minification tool with real-time error detection and syntax highlighting.',
    features: [
      'Real-time JSON validation',
      'Syntax highlighting support', 
      'Format with custom indentation',
      'Minify for production use',
      'Sort keys alphabetically',
      'File upload support',
      'Download processed JSON',
      'Error detection with line numbers',
      'JSON statistics and analysis',
      'Copy to clipboard functionality',
      'No data stored on servers',
      'Works completely offline'
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JSONFormatterTool />
    </div>
  );
}