'use client';

import { StackProvider } from '@stackframe/stack';
import { stackClientApp } from '../stack/client';
import { useEffect, useState } from 'react';

export default function StackProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR or if app is not properly initialized, render children without Stack provider
  if (!isClient || !stackClientApp) {
    return <>{children}</>;
  }

  try {
    return (
      <StackProvider app={stackClientApp}>
        {children}
      </StackProvider>
    );
  } catch (error) {
    console.error('Stack Provider Error:', error);
    // Fallback: render children without Stack provider
    return <>{children}</>;
  }
}