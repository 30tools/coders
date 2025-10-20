import Link from 'next/link';
import { Code2, Github, ExternalLink } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Code2 className="h-8 w-8 text-black dark:text-white" />
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">Coders</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">by 30Tools</p>
            </div>
          </Link>
          
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

          <div className="md:hidden">
            <button className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}