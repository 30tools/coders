import Link from 'next/link';
import { Code2, Github, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-black dark:text-white" />
              <div>
                <h3 className="font-bold text-black dark:text-white">Coders</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">by 30Tools</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Essential developer tools in one clean, fast interface. Built by developers, for developers.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">Popular Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/json-formatter" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/api-tester" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  API Tester
                </Link>
              </li>
              <li>
                <Link href="/tools/complexity-analyzer" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Complexity Analyzer
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  View All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d" 
                      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                      target="_blank" rel="noopener noreferrer">
                  <span>Discussion</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="https://github.com/30tools/coders" 
                      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                      target="_blank" rel="noopener noreferrer">
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="https://30tools.com" 
                      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                      target="_blank" rel="noopener noreferrer">
                  <span>30Tools</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://github.com/SH20RAJ" 
                      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
                      target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span>Creator</span>
                </Link>
              </li>
              <li>
                <Link href="https://30tools.com/contact" 
                      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                      target="_blank" rel="noopener noreferrer">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2024 30Tools. Built with <Heart className="h-4 w-4 inline text-red-500" /> for developers.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
              Free Forever • Open Source • Privacy First
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}