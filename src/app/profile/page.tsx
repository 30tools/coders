import { generateMetadata as createSEOMetadata } from '@/lib/seo';
import { getServerAuthSession } from '@/server/auth';
import ProfileContent from './ProfileContent';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: 'User Profile - Manage Your Developer Tools & History | Coders',
    description: 'Access your saved analyses, tool history, and account settings. Sync your developer workflow across devices with your personalized Coders profile.',
    keywords: [
      'developer profile', 'user account', 'saved tools', 'analysis history',
      'code complexity', 'tool settings', 'developer workflow', 'account management'
    ],
    canonicalUrl: 'https://coders.30tools.com/profile',
    noIndex: true // Profile pages shouldn't be indexed
  });
}

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const user = session?.user || null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <ProfileContent user={user} />
    </div>
  );
}