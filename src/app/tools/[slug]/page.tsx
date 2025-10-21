import { toolsData } from '@/lib/tools-data';
import ToolComingSoon from '@/components/ToolComingSoon';
import { notFound, redirect } from 'next/navigation';

// Force dynamic rendering for pages that use Stack Auth
export const dynamic = 'force-dynamic';

// Generate static params for all tools
export function generateStaticParams() {
  return toolsData.tools.map((tool) => ({
    slug: tool.id,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsData.tools.find(t => t.id === slug);
  
  if (!tool) {
    notFound();
  }

  // If the tool is implemented, redirect to its specific page
  if (tool.id === 'complexity-analyzer') {
    redirect('/tools/complexity-analyzer');
  }
  
  if (tool.implemented) {
    // For other implemented tools, redirect to their specific page
    redirect(`/tools/${tool.id}`);
  }

  // Get tool features from the full db.json data
  const getToolFeatures = (toolId: string): string[] => {
    const featureMap: { [key: string]: string[] } = {
      'json-formatter': [
        'Real-time JSON validation',
        'Syntax highlighting',
        'Minify and prettify options',
        'Error detection with line numbers',
        'Large file support',
        'Copy to clipboard functionality'
      ],
      'api-tester': [
        'Support for all HTTP methods',
        'Custom headers and authentication',
        'Request body formatting',
        'Response analysis and timing',
        'Save and reuse requests',
        'Export to cURL commands'
      ],
      'base64-encoder': [
        'Text to Base64 encoding',
        'File to Base64 conversion',
        'Base64 to text decoding',
        'Image preview support',
        'Batch processing',
        'Download decoded files'
      ],
      'regex-tester': [
        'Real-time pattern matching',
        'Regex explanation in plain English',
        'Match highlighting',
        'Capture group extraction',
        'Performance metrics',
        'Common patterns library'
      ],
      'hash-generator': [
        'Multiple hash algorithms',
        'File hash generation',
        'Batch processing',
        'Hash comparison tools',
        'HMAC generation',
        'Uppercase/lowercase output'
      ],
      'url-encoder': [
        'Full URL encoding/decoding',
        'Query parameter parsing',
        'Component-wise encoding',
        'Batch URL processing',
        'Validation checks',
        'RFC compliance'
      ]
    };

    return featureMap[toolId] || [
      'Fast and reliable processing',
      'Clean, intuitive interface',
      'No data stored on servers',
      'Copy results to clipboard',
      'Mobile-friendly design',
      'Free forever'
    ];
  };

  return (
    <ToolComingSoon
      toolName={tool.name}
      description={tool.description}
      features={getToolFeatures(tool.id)}
    />
  );
}