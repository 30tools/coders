'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Code2, Github, ExternalLink, User, LogOut, Menu, X } from 'lucide-react';
import { useUser } from '@stackframe/stack';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const user = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await user?.signOut();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Code2 className="h-8 w-8 text-black dark:text-white" />
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">Coders</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">by 30Tools</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/tools" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Tools
            </Link>
            <Link href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d" 
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                  target="_blank" rel="noopener noreferrer">
              <span>Discussion</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link href="https://github.com/30tools/coders" 
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                  target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <Image 
                        src={user.profileImageUrl} 
                        alt={user.displayName || 'User'} 
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
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
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/handler/sign-in"
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/handler/sign-up"
                  className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button 
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/tools" 
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tools
              </Link>
              <Link 
                href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Discussion</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link 
                href="https://github.com/30tools/coders"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
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
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {user.profileImageUrl ? (
                          <Image 
                            src={user.profileImageUrl} 
                            alt={user.displayName || 'User'} 
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
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
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href="/handler/sign-in"
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-center border border-gray-300 dark:border-gray-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/handler/sign-up"
                      className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center"
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
      </div>
    </header>
  );
}