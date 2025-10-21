import { getServerAuthSession } from '@/server/auth';
import HomeClient from './HomeClient';

// Force dynamic rendering since this uses Stack Auth
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Coders - The Ultimate Developer Toolbox | 30+ Free Coding Tools',
    description: 'Fast, free, and beautifully designed developer tools. Code formatters, API testers, converters, and 30+ essential coding utilities in one clean interface. Built by developers, for developers.',
    keywords: 'developer tools, coding tools, JSON formatter, API tester, code converter, regex tester, base64 encoder, developer utilities, programming tools, web development',
    openGraph: {
      title: 'Coders - The Ultimate Developer Toolbox',
      description: '30+ essential developer tools in one clean, fast interface. No ads, no clutter, just pure productivity.',
      url: 'https://coders.30tools.com',
      siteName: 'Coders by 30Tools',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Coders - Developer Toolbox',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Coders - The Ultimate Developer Toolbox',
      description: '30+ essential developer tools in one clean, fast interface. Built by developers, for developers.',
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session?.user || null;

  return <HomeClient user={user} />;
}
