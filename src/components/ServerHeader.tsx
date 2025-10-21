import Image from 'next/image';
import Link from 'next/link';
import { Code2, Github, ExternalLink, User } from 'lucide-react';
import { getServerAuthSession } from '@/server/auth';
import { HeaderWrapper } from './HeaderWrapper';
import { ThemeToggle } from './theme-toggle';

export default async function ServerHeader() {
  const session = await getServerAuthSession();
  const user = session?.user || null;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <HeaderWrapper user={user}>
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm"
              aria-label="Coders - Home"
            >
              <Code2 className="h-8 w-8 text-black dark:text-white" />
              <div>
                <h1 className="text-xl font-bold text-black dark:text-white">Coders</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">by 30Tools</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
              <Link 
                href="/tools" 
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
              >
                Tools
              </Link>
              <Link 
                href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d" 
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Join Discussion (opens in new tab)"
              >
                <span>Discussion</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
              <Link 
                href="https://github.com/30tools/coders" 
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="View GitHub Repository (opens in new tab)"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub</span>
              </Link>
            </nav>

            {/* Auth Section - Server rendered */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
                    aria-label={`Profile - ${user.displayName || user.primaryEmail}`}
                  >
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      {user.profileImageUrl ? (
                        <Image 
                          src={user.profileImageUrl} 
                          alt={user.displayName || 'User avatar'} 
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-sm max-w-32 truncate">
                      {user.displayName || user.primaryEmail}
                    </span>
                  </Link>
                  {/* Sign out will be handled client-side in HeaderWrapper */}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/handler/sign-in"
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-md"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/handler/sign-up"
                    className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </HeaderWrapper>
      </div>
    </header>
  );
}