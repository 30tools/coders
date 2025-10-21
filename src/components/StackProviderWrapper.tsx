'use client';

import { StackProvider } from '@stackframe/stack';
import { stackClientApp } from '../stack/client';

export default function StackProviderWrapper({ children }: { children: React.ReactNode }) {
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