import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Debug: Log environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Stack Server Environment Variables:', {
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'NOT_SET',
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? 'SET' : 'NOT_SET',
    secretServerKey: process.env.STACK_SECRET_SERVER_KEY ? 'SET' : 'NOT_SET',
  });
}

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "",
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || "",
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY || "",
});
