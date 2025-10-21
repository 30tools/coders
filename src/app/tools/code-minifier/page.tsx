'use client';

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Code2, 
  Zap, 
  Settings, 
  Copy, 
  Trash2, 
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Split,
  Terminal,
  FileCode
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import minification utilities
import { minifyHTML, minifyCSS, minifyJS, minifyJSON, minifyXML } from '@/lib/minifier/core';
import { MinificationOptions, MinificationResult, SupportedLanguage } from '@/lib/minifier/types';
import { validateFile, getFileExtension, calculateSavings } from '@/lib/minifier/utils';

const CODE_MINIFIER_LANGUAGES: { value: SupportedLanguage; label: string; icon: string }[] = [
  { value: 'html', label: 'HTML', icon: 'html' },
  { value: 'css', label: 'CSS', icon: 'css' },
  { value: 'javascript', label: 'JavaScript', icon: 'js' },
  { value: 'typescript', label: 'TypeScript', icon: 'ts' },
  { value: 'json', label: 'JSON', icon: 'json' },
  { value: 'xml', label: 'XML', icon: 'xml' },
  { value: 'php', label: 'PHP', icon: 'php' },
  { value: 'python', label: 'Python', icon: 'py' },
  { value: 'java', label: 'Java', icon: 'java' },
  { value: 'c', label: 'C', icon: 'c' },
  { value: 'cpp', label: 'C++', icon: 'cpp' },
  { value: 'csharp', label: 'C#', icon: 'cs' },
  { value: 'go', label: 'Go', icon: 'go' },
  { value: 'rust', label: 'Rust', icon: 'rs' },
  { value: 'swift', label: 'Swift', icon: 'swift' },
  { value: 'kotlin', label: 'Kotlin', icon: 'kt' },
  { value: 'dart', label: 'Dart', icon: 'dart' },
  { value: 'scala', label: 'Scala', icon: 'scala' },
  { value: 'ruby', label: 'Ruby', icon: 'rb' },
  { value: 'perl', label: 'Perl', icon: 'pl' },
  { value: 'r', label: 'R', icon: 'r' },
  { value: 'matlab', label: 'MATLAB', icon: 'm' },
  { value: 'sql', label: 'SQL', icon: 'sql' },
  { value: 'shell', label: 'Shell', icon: 'sh' },
  { value: 'powershell', label: 'PowerShell', icon: 'ps1' },
];

const MINIFICATION_LEVELS = [
  { 
    value: 'light', 
    label: 'Light', 
    description: 'Basic whitespace removal, safe for all code',
    icon: '🟢'
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    description: 'Balanced optimization with comment removal',
    icon: '🟡'
  },
  { 
    value: 'aggressive', 
    label: 'Aggressive', 
    description: 'Maximum compression, may alter functionality',
    icon: '🔴'
  },
];

interface MinifierFile {
  id: string;
  name: string;
  size: number;
  content: string;
  language: SupportedLanguage;
  original: string;
  minified: string | null;
  result: MinificationResult | null;
  error: string | null;
}

export default function CodeMinifier() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [files, setFiles] = useState<MinifierFile[]>([]);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('javascript');
  const [minificationLevel, setMinificationLevel] = useState<'light' | 'moderate' | 'aggressive'>('moderate');
  const [editorContent, setEditorContent] = useState('');
  const [minifiedContent, setMinifiedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  
  // Minification options
  const [options, setOptions] = useState<MinificationOptions>({
    removeComments: true,
    removeWhitespace: true,
    removeEmptyLines: true,
    preserveLineBreaks: false,
    mangleVariables: false,
    removeConsoleLog: false,
    removeDebugger: true,
  });

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    uploadedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const extension = getFileExtension(file.name);
        const language = detectLanguage(extension);
        
        if (validateFile(file)) {
          const newFile: MinifierFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            content: content,
            language: language,
            original: content,
            minified: null,
            result: null,
            error: null,
          };
          
          setFiles(prev => [...prev, newFile]);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  // Detect language from file extension
  const detectLanguage = (extension: string): SupportedLanguage => {
    const extMap: Record<string, SupportedLanguage> = {
      'html': 'html', 'htm': 'html',
      'css': 'css',
      'js': 'javascript', 'jsx': 'javascript',
      'ts': 'typescript', 'tsx': 'typescript',
      'json': 'json',
      'xml': 'xml',
      'php': 'php',
      'py': 'python',
      'java': 'java',
      'c': 'c', 'h': 'c',
      'cpp': 'cpp', 'cxx': 'cpp', 'cc': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'dart': 'dart',
      'scala': 'scala',
      'rb': 'ruby',
      'pl': 'perl',
      'r': 'r',
      'm': 'matlab',
      'sql': 'sql',
      'sh': 'shell', 'bash': 'shell',
      'ps1': 'powershell',
    };
    
    return extMap[extension.toLowerCase()] || 'javascript';
  };

  // Minify content
  const minifyContent = async (content: string, language: SupportedLanguage) => {
    try {
      switch (language) {
        case 'html':
          return await minifyHTML(content, { ...options, level: minificationLevel });
        case 'css':
          return await minifyCSS(content, { ...options, level: minificationLevel });
        case 'javascript':
        case 'typescript':
          return await minifyJS(content, { ...options, level: minificationLevel });
        case 'json':
          return await minifyJSON(content);
        case 'xml':
          return await minifyXML(content, { ...options, level: minificationLevel });
        default:
          // For other languages, use basic whitespace removal
          return {
            minified: content.replace(/\s+/g, ' ').trim(),
            originalSize: content.length,
            minifiedSize: content.replace(/\s+/g, ' ').trim().length,
            compressionRatio: 0,
            errors: [],
            warnings: []
          };
      }
    } catch (error) {
      throw new Error(`Minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Process single file
  const processFile = async (fileId: string) => {
    setIsProcessing(true);
    
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return { ...file, error: null };
      }
      return file;
    }));

    try {
      const file = files.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');

      const result = await minifyContent(file.content, file.language);
      
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            minified: result.minified,
            result: result,
            error: null,
          };
        }
        return f;
      }));
    } catch (error) {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
        return f;
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Process all files
  const processAllFiles = async () => {
    setIsProcessing(true);
    
    for (const file of files) {
      try {
        const result = await minifyContent(file.content, file.language);
        
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            return {
              ...f,
              minified: result.minified,
              result: result,
              error: null,
            };
          }
          return f;
        }));
      } catch (error) {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            return {
              ...f,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
          return f;
        }));
      }
    }
    
    setIsProcessing(false);
  };

  // Process editor content
  const processEditorContent = async () => {
    if (!editorContent.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await minifyContent(editorContent, selectedLanguage);
      setMinifiedContent(result.minified);
    } catch (error) {
      console.error('Minification error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download minified file
  const downloadMinified = (file: MinifierFile) => {
    if (!file.minified) return;
    
    const blob = new Blob([file.minified], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}.min${file.name.match(/\.[^/.]+$/)?.[0] || ''}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all minified files as ZIP
  const downloadAllAsZip = async () => {
    // This would require a ZIP library - for now, download individually
    files.forEach(file => {
      if (file.minified) {
        setTimeout(() => downloadMinified(file), 100 * files.indexOf(file));
      }
    });
  };

  // Copy to clipboard
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    setEditorContent('');
    setMinifiedContent('');
  };

  // Generate CLI command
  const generateCLICommand = () => {
    const levelFlag = minificationLevel !== 'moderate' ? ` --level ${minificationLevel}` : '';
    const optionsFlags = Object.entries(options)
      .filter(([, value]) => value)
      .map(([key]) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`)
      .join(' ');
    
    return `npx code-minifier --input "file.${selectedLanguage}"${levelFlag}${optionsFlags ? ' ' + optionsFlags : ''}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Code Minifier
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Minify HTML, CSS, JavaScript, and 20+ other programming languages. 
            Batch processing, side-by-side comparison, and CLI support included.
          </p>
        </div>

        {/* Main Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'editor', label: 'Code Editor', icon: Code2 },
                { id: 'batch', label: 'Batch Files', icon: Upload },
                { id: 'cli', label: 'CLI Generator', icon: Terminal },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {CODE_MINIFIER_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Minification Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minification Level
              </label>
              <select
                value={minificationLevel}
                onChange={(e) => setMinificationLevel(e.target.value as 'light' | 'moderate' | 'aggressive')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {MINIFICATION_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.icon} {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* View Options */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSideBySide(!showSideBySide)}
                className={`px-4 py-2 rounded-md border flex items-center ${
                  showSideBySide
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                <Split className="h-4 w-4 mr-2" />
                Compare
              </button>
              
              <button
                onClick={clearAllFiles}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </button>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="mt-6">
            <details className="group">
              <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Options
                <ArrowRight className="h-4 w-4 ml-2 group-open:rotate-90 transition-transform" />
              </summary>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(options).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'editor' && (
          <div className={`grid ${showSideBySide ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {/* Original Code */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Original Code
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={processEditorContent}
                    disabled={isProcessing || !editorContent.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Minify'}
                  </button>
                </div>
              </div>
              
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder={`Enter your ${selectedLanguage} code here...`}
                className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Minified Code */}
            {(showSideBySide || minifiedContent) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Minified Code
                  </h3>
                  {minifiedContent && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(minifiedContent)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                    </div>
                  )}
                </div>
                
                <textarea
                  value={minifiedContent}
                  readOnly
                  placeholder="Minified code will appear here..."
                  className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
                />
                
                {minifiedContent && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                      <div className="text-blue-700 dark:text-blue-300 font-medium">Original</div>
                      <div className="text-blue-600 dark:text-blue-400">{editorContent.length} chars</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                      <div className="text-green-700 dark:text-green-300 font-medium">Minified</div>
                      <div className="text-green-600 dark:text-green-400">{minifiedContent.length} chars</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                      <div className="text-purple-700 dark:text-purple-300 font-medium">Savings</div>
                      <div className="text-purple-600 dark:text-purple-400">
                        {calculateSavings(editorContent.length, minifiedContent.length).percentage}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Batch Processing */}
        {activeTab === 'batch' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Files for Batch Processing
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Drop files here or click to browse. Supports all major programming languages.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".html,.css,.js,.ts,.json,.xml,.php,.py,.java,.c,.cpp,.cs,.go,.rs,.swift,.kt,.dart,.scala,.rb,.pl,.r,.m,.sql,.sh,.ps1"
              />
              <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Choose Files
              </button>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Files ({files.length})
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={processAllFiles}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Minify All'}
                    </button>
                    <button
                      onClick={downloadAllAsZip}
                      disabled={!files.some(f => f.minified)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <FileCode className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {file.language.toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {file.result && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                              {calculateSavings(file.result.originalSize, file.result.minifiedSize).percentage}% saved
                            </span>
                          )}
                          
                          {file.error ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : file.minified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                          
                          <button
                            onClick={() => processFile(file.id)}
                            disabled={isProcessing}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                          >
                            Minify
                          </button>
                          
                          {file.minified && (
                            <button
                              onClick={() => downloadMinified(file)}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>

                      {file.error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                          <p className="text-red-800 dark:text-red-300 text-sm">{file.error}</p>
                        </div>
                      )}

                      {file.result && (
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                            <div className="text-blue-700 dark:text-blue-300 font-medium">Original</div>
                            <div className="text-blue-600 dark:text-blue-400">{file.result.originalSize} bytes</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                            <div className="text-green-700 dark:text-green-300 font-medium">Minified</div>
                            <div className="text-green-600 dark:text-green-400">{file.result.minifiedSize} bytes</div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                            <div className="text-purple-700 dark:text-purple-300 font-medium">Ratio</div>
                            <div className="text-purple-600 dark:text-purple-400">{file.result.compressionRatio.toFixed(2)}:1</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md">
                            <div className="text-orange-700 dark:text-orange-300 font-medium">Saved</div>
                            <div className="text-orange-600 dark:text-orange-400">
                              {((file.result.originalSize - file.result.minifiedSize) / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CLI Generator */}
        {activeTab === 'cli' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Terminal className="h-5 w-5 mr-2" />
                CLI Command Generator
              </h3>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Generate CLI commands for batch minification. Install the CLI tool globally:
                </p>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                  <code>npm install -g @coders/minifier-cli</code>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Generated command based on current settings:
                </p>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                  <code>{generateCLICommand()}</code>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Available Options</h4>
                    <div className="space-y-2 text-sm">
                      <div><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">--input, -i</code> Input file or directory</div>
                      <div><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">--output, -o</code> Output file or directory</div>
                      <div><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">--level, -l</code> Minification level (light/moderate/aggressive)</div>
                      <div><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">--recursive, -r</code> Process directories recursively</div>
                      <div><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">--watch, -w</code> Watch for file changes</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Example Commands</h4>
                    <div className="space-y-2 text-sm font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <div># Minify single file</div>
                      <div className="text-blue-600 dark:text-blue-400">minifier -i app.js -o app.min.js</div>
                      <div className="mt-2"># Minify directory</div>
                      <div className="text-blue-600 dark:text-blue-400">minifier -i ./src -o ./dist -r</div>
                      <div className="mt-2"># Watch mode</div>
                      <div className="text-blue-600 dark:text-blue-400">minifier -i ./src -o ./dist -w</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}