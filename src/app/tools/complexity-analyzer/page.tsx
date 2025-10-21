'use client'
import { useState, useEffect } from 'react';
import { Play, Clock, HardDrive, AlertCircle, Lightbulb, Code2, TrendingUp, Info, User, History, Save } from 'lucide-react';
import { useUser } from '@stackframe/stack';

interface ComplexityResult {
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
}

interface AnalysisHistory {
  id: string;
  language: string;
  code: string;
  result: ComplexityResult;
  timestamp: Date;
  title?: string;
}

export default function ComplexityAnalyzer() {
  const user = useUser();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisHistory[]>([]);

  // Load user's history from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`complexity-history-${user.id}`);
      const saved = localStorage.getItem(`complexity-saved-${user.id}`);
      
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          setHistory(parsed.map((item: unknown) => ({
            ...item as AnalysisHistory,
            timestamp: new Date((item as AnalysisHistory).timestamp)
          })));
        } catch (error) {
          console.error('Failed to load history:', error);
        }
      }
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedAnalyses(parsed.map((item: unknown) => ({
            ...item as AnalysisHistory,
            timestamp: new Date((item as AnalysisHistory).timestamp)
          })));
        } catch (error) {
          console.error('Failed to load saved analyses:', error);
        }
      }
    }
  }, [user]);

  const saveToHistory = (analysisResult: ComplexityResult) => {
    if (!user) return;
    
    const newAnalysis: AnalysisHistory = {
      id: Date.now().toString(),
      language,
      code,
      result: analysisResult,
      timestamp: new Date()
    };
    
    const updatedHistory = [newAnalysis, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem(`complexity-history-${user.id}`, JSON.stringify(updatedHistory));
  };

  const saveAnalysis = (title?: string) => {
    if (!user || !result) return;
    
    const newSaved: AnalysisHistory = {
      id: Date.now().toString(),
      language,
      code,
      result,
      timestamp: new Date(),
      title: title || `${language} Analysis`
    };
    
    const updatedSaved = [newSaved, ...savedAnalyses];
    setSavedAnalyses(updatedSaved);
    localStorage.setItem(`complexity-saved-${user.id}`, JSON.stringify(updatedSaved));
  };

  const loadFromHistory = (analysis: AnalysisHistory) => {
    setCode(analysis.code);
    setLanguage(analysis.language);
    setResult(analysis.result);
    setError('');
  };

  const analyzeComplexity = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze-complexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json();
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData 
          ? (errorData as { error: string }).error 
          : `API request failed: ${response.status}`;
        throw new Error(errorMessage);
      }

      const analysisResult: unknown = await response.json();
      
      // Type guard to validate the response structure
      if (typeof analysisResult === 'object' && analysisResult !== null) {
        const result = analysisResult as ComplexityResult;
        setResult(result);
        
        // Save to history if user is logged in
        if (user) {
          saveToHistory(result);
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze complexity');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('1') || complexity.includes('log')) return 'text-green-600 dark:text-green-400';
    if (complexity.includes('n') && !complexity.includes('n²') && !complexity.includes('n³')) return 'text-yellow-600 dark:text-yellow-400';
    if (complexity.includes('n²') || complexity.includes('n³')) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const exampleCodes = {
    javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    java: `public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
  };

  const loadExample = () => {
    setCode(exampleCodes[language as keyof typeof exampleCodes]);
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-black dark:text-white mr-3" />
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Time & Space Complexity Analyzer
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analyze the computational complexity of your algorithms with AI-powered insights. 
            Get detailed time and space complexity analysis with optimization suggestions.
          </p>
          
          {/* User Status */}
          {user && (
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Signed in as {user.displayName || user.primaryEmail} - History & Save features enabled
              </span>
            </div>
          )}
        </div>

        {/* User Features Bar */}
        {user && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <History className="h-4 w-4" />
              <span>History ({history.length})</span>
            </button>
            {result && (
              <button
                onClick={() => saveAnalysis()}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Analysis</span>
              </button>
            )}
          </div>
        )}

        {/* History Panel */}
        {user && showHistory && (
          <div className="mb-8 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Recent Analysis History</h3>
            {history.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {history.map((analysis) => (
                  <div 
                    key={analysis.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => loadFromHistory(analysis)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {analysis.language}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {analysis.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {analysis.code.substring(0, 80)}...
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`text-xs font-medium ${getComplexityColor(analysis.result.timeComplexity.worst)}`}>
                        {analysis.result.timeComplexity.worst}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No analysis history yet. Start analyzing code to see your history here.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-white flex items-center">
                  <Code2 className="h-5 w-5 mr-2" />
                  Code Input
                </h2>
                <div className="flex items-center space-x-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                  </select>
                  <button
                    onClick={loadExample}
                    className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-md transition-colors duration-200"
                  >
                    Load Example
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${language} code here...`}
                className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-black dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
              />

              {error && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={analyzeComplexity}
                disabled={isAnalyzing || !code.trim()}
                className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-black border-t-transparent mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Analyze Complexity
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Time Complexity */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white flex items-center mb-4">
                    <Clock className="h-5 w-5 mr-2" />
                    Time Complexity
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best</div>
                      <div className={`text-lg font-mono font-semibold ${getComplexityColor(result.timeComplexity.best)}`}>
                        {result.timeComplexity.best}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average</div>
                      <div className={`text-lg font-mono font-semibold ${getComplexityColor(result.timeComplexity.average)}`}>
                        {result.timeComplexity.average}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Worst</div>
                      <div className={`text-lg font-mono font-semibold ${getComplexityColor(result.timeComplexity.worst)}`}>
                        {result.timeComplexity.worst}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {result.timeComplexity.explanation}
                  </p>
                </div>

                {/* Space Complexity */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white flex items-center mb-4">
                    <HardDrive className="h-5 w-5 mr-2" />
                    Space Complexity
                  </h3>
                  
                  <div className="text-center mb-4">
                    <div className={`text-2xl font-mono font-semibold ${getComplexityColor(result.spaceComplexity.complexity)}`}>
                      {result.spaceComplexity.complexity}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {result.spaceComplexity.explanation}
                  </p>
                </div>

                {/* Analysis Summary */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white flex items-center mb-4">
                    <Info className="h-5 w-5 mr-2" />
                    Analysis Summary
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {result.analysis.summary}
                  </p>

                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {result.analysis.complexityClass} complexity
                    </span>
                  </div>
                </div>

                {/* Optimizations */}
                {result.analysis.optimizations.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white flex items-center mb-4">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Optimization Suggestions
                    </h3>
                    
                    <ul className="space-y-2">
                      {result.analysis.optimizations.map((optimization, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{optimization}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {result.analysis.warnings.length > 0 && (
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 flex items-center mb-4">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Potential Issues
                    </h3>
                    
                    <ul className="space-y-2">
                      {result.analysis.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm text-red-700 dark:text-red-300">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Enter your code and click &ldquo;Analyze Complexity&rdquo; to get detailed insights about your algorithm&apos;s performance.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              Understanding Complexity Analysis
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-green-600 dark:text-green-400 font-mono text-lg font-semibold mb-2">O(1)</div>
              <div className="text-sm font-medium text-black dark:text-white mb-1">Constant</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Best possible performance</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 dark:text-yellow-400 font-mono text-lg font-semibold mb-2">O(n)</div>
              <div className="text-sm font-medium text-black dark:text-white mb-1">Linear</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Scales with input size</div>
            </div>
            <div className="text-center">
              <div className="text-orange-600 dark:text-orange-400 font-mono text-lg font-semibold mb-2">O(n²)</div>
              <div className="text-sm font-medium text-black dark:text-white mb-1">Quadratic</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Consider optimization</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 font-mono text-lg font-semibold mb-2">O(2ⁿ)</div>
              <div className="text-sm font-medium text-black dark:text-white mb-1">Exponential</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Usually needs improvement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}