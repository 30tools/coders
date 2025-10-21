'use client';

import { User } from "lucide-react";

interface User {
  id: string;
  displayName?: string;
  primaryEmail?: string;
  profileImageUrl?: string;
}

interface ClientUserMessageProps {
  user: User | null;
}

export function ClientUserMessage({ user }: ClientUserMessageProps) {
  if (!user) return null;

  return (
    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
      <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 mb-2">
        <User className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium">
          Welcome back, {user.displayName || user.primaryEmail?.split('@')[0]}!
        </span>
      </div>
      <p className="text-xs text-blue-600 dark:text-blue-400">
        Your analysis history and saved tools are synced across devices.
      </p>
    </div>
  );
}