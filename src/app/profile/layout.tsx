import { Metadata } from 'next';
import ServerHeader from '@/components/ServerHeader';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'User Profile - Manage Your Developer Tools & History | Coders',
  description: 'Access your saved analyses, tool history, and account settings. Sync your developer workflow across devices with your personalized Coders profile.',
  keywords: 'developer profile, user account, saved tools, analysis history, code complexity, tool settings, developer workflow, account management',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServerHeader />
      {children}
      <Footer />
    </>
  );
}