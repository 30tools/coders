'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogOut, ExternalLink, Github, User } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface User {
  id: string;
  displayName?: string;
  primaryEmail?: string;
  profileImageUrl?: string;
  signOut?: () => Promise<void>;
}

interface HeaderWrapperProps {
  user: User | null;
  children: React.ReactNode;
}

export function HeaderWrapper({ user, children }: HeaderWrapperProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    if (user?.signOut) {
      await user.signOut();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {children}
      
      {/* Mobile Menu Button - Only show on mobile */}
      <div className="md:hidden flex items-center space-x-3 absolute right-4 top-4">
        <ThemeToggle />
        <button 
          onClick={toggleMenu}
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm p-1"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              href="/tools" 
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </Link>
            <Link 
              href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Discussion</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="https://github.com/30tools/coders"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link 
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
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
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <span className="text-sm">
                      {user.displayName || user.primaryEmail}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/handler/sign-in"
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-center border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/handler/sign-up"
                    className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Sign out button for desktop - Only show when user is authenticated */}
      {user && (
        <button
          onClick={handleSignOut}
          className="hidden md:flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1 absolute right-4 top-1/2 transform -translate-y-1/2"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      )}
    </>
  );
}