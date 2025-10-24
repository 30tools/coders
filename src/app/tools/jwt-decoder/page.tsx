import { generateMetadata as createSEOMetadata, generateStructuredData } from '@/lib/seo';
import JWTDecoderTool from './JWTDecoderTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'JWT Token Decoder & Validator - Decode JSON Web Tokens Online',
    description: 'Professional JWT token decoder and validator. Decode, validate, and analyze JSON Web Tokens with security insights, expiration tracking, and claims validation. Perfect for debugging authentication.',
    keywords: [
      'JWT decoder', 'JSON Web Token', 'JWT validator', 'token decoder',
      'JWT analyzer', 'authentication debugging', 'JWT claims', 'token validation',
      'security analysis', 'JWT expiration', 'token parser', 'JWT debugger',
      'Bearer token', 'OAuth decoder', 'JWT signature verification'
    ],
    canonicalUrl: 'https://coders.30tools.com/tools/jwt-decoder',
    ogType: 'article'
  });
}

export default function JWTDecoderPage() {
  const jsonLd = generateStructuredData('Tool', {
    name: 'JWT Token Decoder & Validator',
    description: 'Professional JWT token decoding and validation tool with security analysis, expiration tracking, and comprehensive claims validation.',
    features: [
      'Decode JWT tokens instantly',
      'Visual token structure breakdown',
      'Signature verification',
      'Expiration countdown timer',
      'Security vulnerability scanning',
      'Claims validation and analysis',
      'Multiple algorithm support',
      'Copy decoded parts easily',
      'Token generation for testing',
      'JOSE header analysis',
      'Real-time validation feedback',
      'Privacy-focused client-side processing'
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JWTDecoderTool />
    </div>
  );
}