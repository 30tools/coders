import Link from "next/link";
import { ArrowRight, Code2, Zap, Shield, Users, Star, Github, MessageCircle, User, TrendingUp, ExternalLink } from "lucide-react";
import { ClientUserMessage } from "./ClientUserMessage";

interface User {
  id: string;
  displayName?: string;
  primaryEmail?: string;
  profileImageUrl?: string;
}

interface HomeContentProps {
  user: User | null;
}

export default function HomeContent({ user }: HomeContentProps) {
  return (
    <>
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
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
              aria-label="Explore all developer tools"
            >
              Explore Tools
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            
            {user ? (
              <Link
                href="/tools/complexity-analyzer"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                aria-label="Open Complexity Analyzer tool"
              >
                <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                Complexity Analyzer
              </Link>
            ) : (
              <Link
                href="https://github.com/30tools/coders"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub (opens in new tab)"
              >
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                View Source
              </Link>
            )}
          </div>

          {/* Personalized Section for Authenticated Users */}
          <ClientUserMessage user={user} />

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 mt-8">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" aria-hidden="true" />
              Free Forever
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" aria-hidden="true" />
              Lightning Fast
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" aria-hidden="true" />
              Privacy First
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Everything You Need to Code Better
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From formatters to analyzers, we&apos;ve got every tool a developer needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Code Tools</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Format, validate, and optimize your code with our comprehensive suite of coding utilities.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1" role="list">
                <li>• JSON Formatter &amp; Validator</li>
                <li>• HTML/CSS/JS Beautifier</li>
                <li>• Code Minifiers</li>
              </ul>
            </article>

            <article className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Performance</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Analyze and optimize your code performance with advanced algorithmic insights.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1" role="list">
                <li>• Complexity Analysis</li>
                <li>• Performance Metrics</li>
                <li>• Optimization Tips</li>
              </ul>
            </article>

            <article className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Security</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Secure your applications with our encryption and security analysis tools.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1" role="list">
                <li>• Hash Generators</li>
                <li>• Password Tools</li>
                <li>• JWT Decoder</li>
              </ul>
            </article>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
              aria-label="View all available tools"
            >
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="open-source-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="open-source-heading" className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
            Built by Developers, for Developers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Coders is open source, community-driven, and completely free. Join thousands of developers who trust our tools for their daily workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://github.com/30tools/coders"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star project on GitHub (opens in new tab)"
            >
              <Github className="mr-2 h-5 w-5" aria-hidden="true" />
              Star on GitHub
            </Link>
            <Link
              href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join community discussion (opens in new tab)"
            >
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Join Discussion
              <ExternalLink className="ml-2 h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 mt-12">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" aria-hidden="true" />
              10k+ Users
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" aria-hidden="true" />
              Open Source
            </div>
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-1" aria-hidden="true" />
              MIT License
            </div>
          </div>
        </div>
      </section>
    </>
  );
}