import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import ColorPaletteGeneratorTool from './ColorPaletteGeneratorTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'Color Palette Generator & Picker - AI-Powered Design Tool',
    description: 'Generate beautiful color palettes with AI. Create harmonious color schemes, check accessibility, export to CSS/Tailwind, and test for color blindness. Perfect for designers and developers.',
    keywords: [
      'color palette generator', 'color picker', 'color harmony', 'design tools',
      'accessibility checker', 'WCAG colors', 'CSS colors', 'Tailwind colors',
      'color blindness', 'hex colors', 'RGB colors', 'HSL colors',
      'complementary colors', 'analogous colors', 'triadic colors', 'color theory'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools/color-palette-generator',
    ogType: 'article'
  });
}

export default function ColorPaletteGeneratorPage() {
  const jsonLd = generateStructuredData('Tool', {
    name: 'Color Palette Generator & Picker',
    description: 'AI-powered color palette generator with accessibility checking, color harmony rules, and multi-format export capabilities.',
    features: [
      'AI-powered palette generation',
      'Color harmony algorithms',
      'WCAG accessibility checker',
      'Color blindness simulator',
      'Export to CSS, Sass, Tailwind',
      'Real-time color picker',
      'Gradient generator',
      'Brand color extraction',
      'Color scheme templates',
      'Interactive color wheel',
      'Contrast ratio calculator',
      'Mobile-friendly design'
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorPaletteGeneratorTool />
    </div>
  );
}