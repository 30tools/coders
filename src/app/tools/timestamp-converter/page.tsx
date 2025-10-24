import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import TimestampConverterTool from './TimestampConverterTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'Timestamp Converter - Unix Epoch Time & Date Converter',
    description: 'Convert between Unix timestamps, ISO dates, and human-readable formats. Timezone support, batch processing, and real-time conversion for developers.',
    keywords: [
      'timestamp converter', 'unix timestamp', 'epoch time', 'date converter',
      'timezone converter', 'ISO date', 'UTC time', 'milliseconds converter',
      'human readable date', 'time format', 'date parser', 'unix time',
      'epoch converter', 'datetime converter', 'time zone conversion'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools/timestamp-converter',
    ogType: 'article'
  });
}

export default function TimestampConverterPage() {
  const jsonLd = generateStructuredData('Tool', {
    name: 'Timestamp Converter',
    description: 'Professional timestamp conversion tool supporting Unix timestamps, ISO dates, and multiple timezone formats.',
    features: [
      'Unix timestamp conversion',
      'ISO date format support',
      'Multiple timezone conversion',
      'Real-time clock display',
      'Batch timestamp processing',
      'Relative time calculations',
      'Custom date format output',
      'Milliseconds precision',
      'Historical date support',
      'Copy timestamps easily',
      'Date arithmetic operations',
      'Time zone abbreviations'
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimestampConverterTool />
    </div>
  );
}