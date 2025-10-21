'use client';

import { useState } from 'react';
import { ArrowLeft, Construction, Code2, Zap, User, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSafeUser } from '@/lib/hooks/useSafeUser';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ToolComingSoonProps {
  toolName: string;
  description: string;
  features: string[];
}

export default function ToolComingSoon({ toolName, description, features }: ToolComingSoonProps) {
  const user = useSafeUser();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // If user is logged in, use their email, otherwise use the input email
      const subscriptionEmail = user?.primaryEmail || email;
      
      // TODO: Replace with actual API call to store subscription
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Subscribed email: ${subscriptionEmail} for tool: ${toolName}`);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/tools" 
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Link>
          </div>

          {/* Main Content */}
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                <Construction className="h-10 w-10 text-gray-600 dark:text-gray-300" />
              </div>
              
              <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                {toolName}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                Coming Soon
              </p>
              
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                {description}
              </p>
            </div>

            {/* User Status Message */}
            {user && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                  <User className="h-5 w-5" />
                  <span className="text-sm">
                    Signed in as {user.displayName || user.primaryEmail}
                  </span>
                </div>
              </div>
            )}

            {/* Features Preview */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                What to Expect
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <Zap className="h-5 w-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Signup */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Get Notified When Ready
              </h3>
              
              {!subscribed ? (
                <>
                  {user ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{user.primaryEmail}</span>
                      </div>
                      <button
                        onClick={handleSubscribe}
                        disabled={isSubmitting}
                        className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Subscribing...' : 'Notify Me'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <form onSubmit={handleSubscribe} className="space-y-4">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Subscribing...' : 'Notify Me'}
                        </button>
                      </form>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Already have an account?
                        </p>
                        <Link 
                          href="/handler/sign-in"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Sign in for faster notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    Thanks! We&apos;ll notify you when it&apos;s ready.
                  </p>
                  {user && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Notification will be sent to {user.primaryEmail}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Alternative Tools */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Meanwhile, Try These Tools
              </h3>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/tools/complexity-analyzer"
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Complexity Analyzer</span>
                </Link>
                
                <Link 
                  href="/tools"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <span>View All Tools</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}