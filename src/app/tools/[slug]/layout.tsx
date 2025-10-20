import { Metadata } from 'next';
import { toolsData } from '@/lib/tools-data';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData.tools.find(t => t.id === slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found | Coders Toolbox',
      description: 'The requested developer tool was not found.',
    };
  }

  return {
    title: `${tool.name} | Coders Toolbox`,
    description: tool.description,
    keywords: tool.tags.join(', '),
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}