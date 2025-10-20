import type { NextConfig } from "next";
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
  aggressiveFrontEndNavCaching: true,
  enableHTTP2: true,
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
