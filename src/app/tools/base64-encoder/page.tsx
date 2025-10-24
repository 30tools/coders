import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import Base64EncoderTool from './Base64EncoderTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'Base64 Encoder & Decoder - Encode Files & Text to Base64 Online',
    description: 'Free Base64 encoder and decoder tool. Convert text and files to Base64 encoding or decode Base64 strings. Supports images, documents, URL-safe encoding, and batch processing.',
    keywords: [
      'Base64 encoder', 'Base64 decoder', 'encode Base64', 'decode Base64',
      'Base64 converter', 'file to Base64', 'Base64 to file', 'image to Base64',
      'URL safe Base64', 'Base64 online tool', 'free Base64 encoder',
      'Base64 file converter', 'text to Base64', 'Base64 string decoder'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools/base64-encoder',
    ogType: 'article'
  });
}

export default function Base64EncoderPage() {
  const jsonLd = generateStructuredData('Tool', {
    name: 'Base64 Encoder & Decoder',
    description: 'Professional Base64 encoding and decoding tool supporting text, files, images, and URL-safe encoding with real-time processing.',
    features: [
      'Encode text to Base64',
      'Decode Base64 to text',
      'File encoding support',
      'Image preview functionality',
      'URL-safe encoding option',
      'Automatic line breaks',
      'Copy to clipboard',
      'Download results',
      'Real-time processing',
      'No file size limits',
      'Secure client-side processing',
      'Binary file support'
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Base64EncoderTool />
    </div>
  );
}