import Link from "next/link";
import { ArrowRight, Code2, Zap, Shield, Users, Star, Github, MessageCircle, User, ExternalLink } from "lucide-react";
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
      {/* Creative Terminal-Inspired Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Code Snippets */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 animate-float-slow opacity-30 dark:opacity-20">
            <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg font-mono text-sm">
              npm install coders
            </div>
          </div>
          <div className="absolute top-40 right-20 animate-float-slower opacity-30 dark:opacity-20">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg font-mono text-sm">
              {"{ \"success\": true }"}
            </div>
          </div>
          <div className="absolute bottom-40 left-20 animate-float opacity-30 dark:opacity-20">
            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-mono text-sm">
              const tools = 30+
            </div>
          </div>
          <div className="absolute bottom-20 right-10 animate-float-slow opacity-30 dark:opacity-20">
            <div className="bg-purple-600 text-white px-3 py-2 rounded-lg font-mono text-sm">
              BASE64_DECODED
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Terminal Interface */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-900 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 dark:bg-gray-700 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-gray-400 text-sm font-mono">coders-toolbox.sh</div>
                  <div className="w-12"></div>
                </div>

                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span className="text-white">./coders --list-tools</span>
                  </div>
                  
                  <div className="space-y-1 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">→</span>
                      <span>JSON Formatter & Validator</span>
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">→</span>
                      <span>Base64 Encoder/Decoder</span>
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">→</span>
                      <span>Hash Generator Suite</span>
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">→</span>
                      <span>Regex Pattern Tester</span>
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">→</span>
                      <span>URL Encoder/Decoder</span>
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <div className="text-yellow-400">... and 25+ more tools</div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <span className="text-green-400">$</span>
                    <span className="text-white animate-pulse">|</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  🚀 30+ Developer Tools Ready
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
                Code Like a
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
                    Pro
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-full animate-gradient-x"></div>
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Your command-line arsenal in the browser. 
                <br />
                <span className="font-semibold text-black dark:text-white">
                  Zero setup. Maximum productivity.
                </span>
              </p>

              {/* Interactive Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/tools"
                  className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20"
                  aria-label="Launch developer tools"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <span className="mr-2">Launch Tools</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>

                <Link
                  href="/tools/json-formatter"
                  className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-black dark:text-white font-medium rounded-xl transition-all duration-300 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-4 focus:ring-gray-400/20"
                  aria-label="Try JSON formatter tool"
                >
                  <div className="flex items-center justify-center">
                    <Code2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Try JSON Tool</span>
                  </div>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 dark:text-gray-400">Always Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">Privacy First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">Lightning Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Section for Authenticated Users */}
          <div className="mt-16">
            <ClientUserMessage user={user} />
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