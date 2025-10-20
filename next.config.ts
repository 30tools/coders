import type { NextConfig } from "next";
// @ts-ignore - next-pwa doesn't have TypeScript declarations
import nextPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'],
  },
};

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

const withPWA = nextPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
