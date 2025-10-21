import { getServerAuthSession } from '@/server/auth';
import { generateMetadata as createSEOMetadata } from '@/lib/seo';
import ServerHeader from '@/components/ServerHeader';
import Footer from '@/components/Footer';
import HomeContent from './HomeContent';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'Coders - The Ultimate Developer Toolbox | 30+ Free Coding Tools',
    description: 'Fast, free, and beautifully designed developer tools. Code formatters, API testers, converters, and 30+ essential coding utilities in one clean interface. Built by developers, for developers.',
    keywords: [
      'developer tools', 'coding tools', 'JSON formatter', 'API tester', 
      'code converter', 'regex tester', 'base64 encoder', 'developer utilities',
      'programming tools', 'web development', 'free tools', 'online tools',
      'code analysis', 'complexity analyzer', 'hash generator', 'URL encoder'
    ],
    canonicalUrl: 'https://coders.30tools.com',
    ogType: 'website'
  });
}

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session?.user || null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <ServerHeader />
      <HomeContent user={user} />
      <Footer />
    </div>
  );
}
