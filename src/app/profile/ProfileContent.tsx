'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Settings, 
  History, 
  Save, 
  Code2, 
  Trash2, 
  ExternalLink,
  ArrowLeft,
  Mail
} from 'lucide-react';

interface User {
  id: string;
  displayName?: string;
  primaryEmail?: string;
  profileImageUrl?: string;
  signOut?: () => Promise<void>;
}

interface AnalysisHistory {
  id: string;
  language: string;
  code: string;
  result: {
    timeComplexity: {
      best: string;
      average: string;
      worst: string;
      explanation: string;
    };
    spaceComplexity: {
      complexity: string;
      explanation: string;
    };
    analysis: {
      summary: string;
      optimizations: string[];
      warnings: string[];
      complexityClass: string;
    };
  };
  timestamp: Date;
  title?: string;
}

interface ProfileContentProps {
  user: User | null;
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisHistory[]>([]);
  const [recentHistory, setRecentHistory] = useState<AnalysisHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'history' | 'settings'>('overview');

  const loadUserData = useCallback(() => {
    if (!user?.id) return;
    
    try {
      const saved = localStorage.getItem(`complexity-saved-${user.id}`);
      const history = localStorage.getItem(`complexity-history-${user.id}`);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedAnalyses(parsed.map((item: unknown) => ({
          ...item as AnalysisHistory,
          timestamp: new Date((item as AnalysisHistory).timestamp)
        })));
      }
      
      if (history) {
        const parsed = JSON.parse(history);
        setRecentHistory(parsed.map((item: unknown) => ({
          ...item as AnalysisHistory,
          timestamp: new Date((item as AnalysisHistory).timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const deleteSavedAnalysis = (id: string) => {
    const updated = savedAnalyses.filter(analysis => analysis.id !== id);
    setSavedAnalyses(updated);
    if (user) {
      localStorage.setItem(`complexity-saved-${user.id}`, JSON.stringify(updated));
    }
  };

  const clearHistory = () => {
    setRecentHistory([]);
    if (user) {
      localStorage.removeItem(`complexity-history-${user.id}`);
    }
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('1') || complexity.includes('log')) return 'text-green-600 dark:text-green-400';
    if (complexity.includes('n') && !complexity.includes('n²') && !complexity.includes('n³')) return 'text-yellow-600 dark:text-yellow-400';
    if (complexity.includes('n²') || complexity.includes('n³')) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleSignOut = async () => {
    if (user?.signOut) {
      await user.signOut();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please sign in to access your profile and saved analyses.
          </p>
          <Link 
            href="/handler/sign-in"
            className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Navigation */}
      <nav className="mb-8">
        <Link 
          href="/tools" 
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm px-2 py-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Back to Tools
        </Link>
      </nav>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          {user.profileImageUrl ? (
            <Image 
              src={user.profileImageUrl} 
              alt={user.displayName || 'User avatar'} 
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
              priority
            />
          ) : (
            <User className="h-10 w-10 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {user.displayName || 'Developer Profile'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {user.primaryEmail}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
        <nav className="flex space-x-8 justify-center" role="tablist" aria-label="Profile sections">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'saved', label: 'Saved Analyses', icon: Save },
            { id: 'history', label: 'Recent History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${
                activeTab === id
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`${id}-panel`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div role="tabpanel" id="overview-panel" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Save className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-black dark:text-white">Saved Analyses</h3>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white mb-2">{savedAnalyses.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Complexity analyses you&apos;ve saved
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <History className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-black dark:text-white">Recent Analyses</h3>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white mb-2">{recentHistory.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your analysis history
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code2 className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-black dark:text-white">Languages Used</h3>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white mb-2">
                {new Set([...savedAnalyses, ...recentHistory].map(a => a.language)).size}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Different programming languages
              </p>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div role="tabpanel" id="saved-panel" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black dark:text-white">Saved Analyses</h2>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {savedAnalyses.length} saved
              </span>
            </div>
            
            {savedAnalyses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedAnalyses.map((analysis) => (
                  <article key={analysis.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {analysis.language}
                        </span>
                        <time className="text-xs text-gray-400 dark:text-gray-500">
                          {analysis.timestamp.toLocaleDateString()}
                        </time>
                      </div>
                      <button
                        onClick={() => deleteSavedAnalysis(analysis.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-sm p-1"
                        aria-label={`Delete analysis: ${analysis.title || `${analysis.language} Analysis`}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <h3 className="font-medium text-black dark:text-white mb-2">
                      {analysis.title || `${analysis.language} Analysis`}
                    </h3>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Time Complexity:</span>
                        <span className={`font-medium ${getComplexityColor(analysis.result.timeComplexity.worst)}`}>
                          {analysis.result.timeComplexity.worst}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Space Complexity:</span>
                        <span className={`font-medium ${getComplexityColor(analysis.result.spaceComplexity.complexity)}`}>
                          {analysis.result.spaceComplexity.complexity}
                        </span>
                      </div>
                    </div>
                    
                    <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                      <code>{analysis.code.substring(0, 150)}...</code>
                    </pre>
                    
                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/tools/complexity-analyzer?load=${analysis.id}`}
                        className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-1"
                      >
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        <span>Open in Analyzer</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Save className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  No saved analyses yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Save your complexity analyses to access them later.
                </p>
                <Link 
                  href="/tools/complexity-analyzer"
                  className="inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
                >
                  Start Analyzing
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div role="tabpanel" id="settings-panel" className="space-y-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">Account Settings</h2>
            
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.primaryEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.displayName || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Data Management</h3>
                <div className="space-y-3">
                  <button
                    onClick={clearHistory}
                    className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Clear Analysis History</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{recentHistory.length} items</span>
                    </div>
                  </button>
                </div>
              </section>
              
              <section className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Account Actions</h3>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}