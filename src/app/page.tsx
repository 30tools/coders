import HomeClient from './HomeClient';

// Force dynamic rendering since this uses Stack Auth
export const dynamic = 'force-dynamic';

export default function Home() {
  return <HomeClient />;
}
