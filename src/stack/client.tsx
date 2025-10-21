"use client";
import { StackClientApp } from "@stackframe/stack";

// Debug: Log environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Stack Environment Variables:', {
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'NOT_SET',
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? 'SET' : 'NOT_SET',
  });
}

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "",
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || "",
});
