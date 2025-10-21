'use client';

import Link from "next/link";
import { ArrowRight, Code2, Zap, Shield, Users, Star, Github, MessageCircle, User, TrendingUp, ExternalLink } from "lucide-react";
import { useUser } from '@stackframe/stack';

export default function HomeClient() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code2 className="h-6 w-6 text-black dark:text-white" />
            <span className="text-xl font-semibold text-black dark:text-white">Coders</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">by 30Tools</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d" 
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="Join Discussion"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link 
              href="https://github.com/30tools/coders" 
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </Link>
            
            {/* Auth Links */}
            {user ? (
              <Link 
                href="/profile"
                className="flex items-center space-x-1 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <Link 
                href="/handler/sign-in"
                className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6">
            The Ultimate{" "}
            <span className="bg-gradient-to-r from-gray-600 to-black dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
              Developer Toolbox
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            30+ essential coding tools in one clean interface. No ads, no clutter, just pure developer productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Explore Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            {user ? (
              <Link
                href="/tools/complexity-analyzer"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Complexity Analyzer
              </Link>
            ) : (
              <Link
                href="https://github.com/30tools/coders"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200"
              >
                <Github className="mr-2 h-4 w-4" />
                View Source
              </Link>
            )}
          </div>

          {/* Personalized Section for Authenticated Users */}
          {user && (
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 mb-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Welcome back, {user.displayName || user.primaryEmail?.split('@')[0]}!
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Your analysis history and saved tools are synced across devices.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 mt-8">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Free Forever
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Lightning Fast
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Privacy First
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Everything You Need to Code Better
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From formatters to analyzers, we&apos;ve got every tool a developer needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Code Tools</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Format, validate, and optimize your code with our comprehensive suite of coding utilities.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• JSON Formatter & Validator</li>
                <li>• HTML/CSS/JS Beautifier</li>
                <li>• Code Minifiers</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Performance</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Analyze and optimize your code performance with advanced algorithmic insights.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Complexity Analysis</li>
                <li>• Performance Metrics</li>
                <li>• Optimization Tips</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Security</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Secure your applications with our encryption and security analysis tools.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Hash Generators</li>
                <li>• Password Tools</li>
                <li>• JWT Decoder</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
            Built by Developers, for Developers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Coders is open source, community-driven, and completely free. Join thousands of developers who trust our tools for their daily workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://github.com/30tools/coders"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200"
            >
              <Github className="mr-2 h-5 w-5" />
              Star on GitHub
            </Link>
            <Link
              href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join Discussion
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 mt-12">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              10k+ Users
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Open Source
            </div>
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-1" />
              MIT License
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Code2 className="h-6 w-6 text-black dark:text-white" />
              <span className="text-lg font-semibold text-black dark:text-white">Coders</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">by 30Tools</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link
                href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d"
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-200 flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Discussion</span>
                <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
              <Link
                href="https://github.com/30tools/coders"
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-200 flex items-center space-x-1"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Coders by 30Tools. Open source under MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}