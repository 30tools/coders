'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Download, Upload, FileText, GitCompare, RefreshCw, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed' | 'modified';
  oldLine?: string;
  newLine?: string;
  oldNumber?: number;
  newNumber?: number;
}

type ViewMode = 'split' | 'unified';
type DiffFormat = 'visual' | 'unified' | 'context' | 'patch';

export default function TextDiffCheckerTool() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [diffFormat, setDiffFormat] = useState<DiffFormat>('visual');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [contextLines, setContextLines] = useState(3);

  // Sample texts for demo
  const loadSample = useCallback(() => {
    setLeftText(`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const tax = 0.08;
const shipping = 15.99;`);

    setRightText(`function calculateTotal(items, includeTax = false) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  
  if (includeTax) {
    total *= (1 + TAX_RATE);
  }
  
  return total;
}

const TAX_RATE = 0.085;
const SHIPPING_COST = 19.99;`);

    toast.success('Sample code loaded');
  }, []);

  // Text preprocessing
  const preprocessText = useCallback((text: string): string => {
    let processed = text;
    
    if (ignoreCase) {
      processed = processed.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      processed = processed.replace(/\s+/g, ' ').trim();
    }
    
    return processed;
  }, [ignoreCase, ignoreWhitespace]);

  // Calculate differences
  const calculateDiff = useMemo((): DiffLine[] => {
    const leftLines = preprocessText(leftText).split('\n');
    const rightLines = preprocessText(rightText).split('\n');
    
    // Simple LCS-based diff algorithm
    const lcs = (a: string[], b: string[]): number[][] => {
      const m = a.length;
      const n = b.length;
      const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
      
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }
      
      return dp;
    };

    const lcsMatrix = lcs(leftLines, rightLines);
    const diff: DiffLine[] = [];
    
    let i = leftLines.length;
    let j = rightLines.length;
    let leftLineNum = leftLines.length;
    let rightLineNum = rightLines.length;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
        diff.unshift({
          type: 'unchanged',
          oldLine: leftLines[i - 1],
          newLine: rightLines[j - 1],
          oldNumber: leftLineNum,
          newNumber: rightLineNum,
        });
        i--;
        j--;
        leftLineNum--;
        rightLineNum--;
      } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
        diff.unshift({
          type: 'added',
          newLine: rightLines[j - 1],
          newNumber: rightLineNum,
        });
        j--;
        rightLineNum--;
      } else if (i > 0) {
        diff.unshift({
          type: 'removed',
          oldLine: leftLines[i - 1],
          oldNumber: leftLineNum,
        });
        i--;
        leftLineNum--;
      }
    }
    
    return diff;
  }, [leftText, rightText, preprocessText]);

  // Statistics
  const diffStats = useMemo(() => {
    const stats = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
    };
    
    calculateDiff.forEach(line => {
      stats[line.type]++;
    });
    
    return stats;
  }, [calculateDiff]);

  // Generate unified diff format
  const generateUnifiedDiff = useCallback((): string => {
    const lines = ['--- Original', '+++ Modified', `@@ -1,${leftText.split('\n').length} +1,${rightText.split('\n').length} @@`];
    
    calculateDiff.forEach(line => {
      switch (line.type) {
        case 'unchanged':
          lines.push(` ${line.oldLine}`);
          break;
        case 'removed':
          lines.push(`-${line.oldLine}`);
          break;
        case 'added':
          lines.push(`+${line.newLine}`);
          break;
      }
    });
    
    return lines.join('\n');
  }, [calculateDiff, leftText, rightText]);

  // File upload handlers
  const handleFileUpload = useCallback((side: 'left' | 'right') => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (side === 'left') {
          setLeftText(content);
        } else {
          setRightText(content);
        }
        toast.success(`File loaded into ${side} panel`);
      };
      reader.readAsText(file);
    };
  }, []);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  }, []);

  const downloadDiff = useCallback((format: DiffFormat) => {
    let content = '';
    let filename = 'diff.txt';
    
    switch (format) {
      case 'unified':
        content = generateUnifiedDiff();
        filename = 'diff.patch';
        break;
      case 'visual':
        content = calculateDiff.map(line => {
          const prefix = line.type === 'added' ? '+ ' : 
                        line.type === 'removed' ? '- ' : 
                        line.type === 'modified' ? '~ ' : '  ';
          return prefix + (line.newLine || line.oldLine || '');
        }).join('\n');
        break;
      default:
        content = generateUnifiedDiff();
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Diff exported as ${format}`);
  }, [calculateDiff, generateUnifiedDiff]);

  const clearAll = useCallback(() => {
    setLeftText('');
    setRightText('');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-3">
          <GitCompare className="h-10 w-10 text-blue-600" />
          Text Diff Checker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Compare text documents and highlight differences line by line. 
          Perfect for code reviews, document comparison, and merge conflict resolution.
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Comparison Settings</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSample}
              >
                Load Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>View Mode</Label>
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="split">Side by Side</SelectItem>
                  <SelectItem value="unified">Unified View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ignore-whitespace"
                  checked={ignoreWhitespace}
                  onCheckedChange={setIgnoreWhitespace}
                />
                <Label htmlFor="ignore-whitespace" className="text-sm">Ignore whitespace</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="ignore-case"
                  checked={ignoreCase}
                  onCheckedChange={setIgnoreCase}
                />
                <Label htmlFor="ignore-case" className="text-sm">Ignore case</Label>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-line-numbers"
                  checked={showLineNumbers}
                  onCheckedChange={setShowLineNumbers}
                />
                <Label htmlFor="show-line-numbers" className="text-sm">Line numbers</Label>
              </div>
            </div>
            
            <div>
              <Label>Export Format</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDiff('unified')}
                  disabled={!leftText && !rightText}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Patch
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateUnifiedDiff(), 'Unified diff')}
                  disabled={!leftText && !rightText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {(leftText || rightText) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comparison Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{diffStats.added}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Added Lines</div>
              </div>
              
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{diffStats.removed}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Removed Lines</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{diffStats.unchanged}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Unchanged Lines</div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {((diffStats.unchanged / (diffStats.unchanged + diffStats.added + diffStats.removed)) * 100 || 0).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Similarity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Comparison Area */}
      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="export">Export & Share</TabsTrigger>
        </TabsList>

        <TabsContent value="compare">
          {viewMode === 'split' ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Original Text</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".txt,.md,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.css,.html,.json,.xml,.yml,.yaml"
                        onChange={handleFileUpload('left')}
                        className="hidden"
                        id="left-file-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('left-file-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={leftText}
                    onChange={(e) => setLeftText(e.target.value)}
                    placeholder="Paste or upload your original text here..."
                    className="font-mono text-sm min-h-[400px] resize-y"
                  />
                </CardContent>
              </Card>

              {/* Right Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Modified Text</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".txt,.md,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.css,.html,.json,.xml,.yml,.yaml"
                        onChange={handleFileUpload('right')}
                        className="hidden"
                        id="right-file-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('right-file-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={rightText}
                    onChange={(e) => setRightText(e.target.value)}
                    placeholder="Paste or upload your modified text here..."
                    className="font-mono text-sm min-h-[400px] resize-y"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Text Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Original Text</Label>
                  <Textarea
                    value={leftText}
                    onChange={(e) => setLeftText(e.target.value)}
                    placeholder="Original text..."
                    className="font-mono text-sm min-h-[200px]"
                  />
                </div>
                <div>
                  <Label>Modified Text</Label>
                  <Textarea
                    value={rightText}
                    onChange={(e) => setRightText(e.target.value)}
                    placeholder="Modified text..."
                    className="font-mono text-sm min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Diff Results */}
          {(leftText || rightText) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Differences</CardTitle>
                <CardDescription>
                  {viewMode === 'split' ? 'Side-by-side comparison' : 'Unified diff view'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {calculateDiff.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No differences found - texts are identical!
                    </div>
                  ) : viewMode === 'split' ? (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left side - removed/unchanged */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Original</div>
                        {calculateDiff.map((line, index) => (
                          line.type !== 'added' && (
                            <div
                              key={`left-${index}`}
                              className={`px-2 py-1 rounded ${
                                line.type === 'removed' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                line.type === 'modified' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                'bg-transparent'
                              }`}
                            >
                              {showLineNumbers && (
                                <span className="text-gray-400 mr-4 text-xs">
                                  {line.oldNumber || ' '}
                                </span>
                              )}
                              <span className="mr-2">
                                {line.type === 'removed' ? '-' : 
                                 line.type === 'modified' ? '~' : ' '}
                              </span>
                              {line.oldLine || ''}
                            </div>
                          )
                        ))}
                      </div>

                      {/* Right side - added/unchanged */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Modified</div>
                        {calculateDiff.map((line, index) => (
                          line.type !== 'removed' && (
                            <div
                              key={`right-${index}`}
                              className={`px-2 py-1 rounded ${
                                line.type === 'added' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                line.type === 'modified' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                'bg-transparent'
                              }`}
                            >
                              {showLineNumbers && (
                                <span className="text-gray-400 mr-4 text-xs">
                                  {line.newNumber || ' '}
                                </span>
                              )}
                              <span className="mr-2">
                                {line.type === 'added' ? '+' : 
                                 line.type === 'modified' ? '~' : ' '}
                              </span>
                              {line.newLine || ''}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Unified view
                    <div className="space-y-1">
                      {calculateDiff.map((line, index) => (
                        <div
                          key={index}
                          className={`px-2 py-1 rounded ${
                            line.type === 'added' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            line.type === 'removed' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                            line.type === 'modified' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-transparent'
                          }`}
                        >
                          {showLineNumbers && (
                            <span className="text-gray-400 mr-4 text-xs">
                              {line.oldNumber && line.newNumber ? `${line.oldNumber},${line.newNumber}` :
                               line.oldNumber ? `${line.oldNumber},-` :
                               line.newNumber ? `-,${line.newNumber}` : ' '}
                            </span>
                          )}
                          <span className="mr-2">
                            {line.type === 'added' ? '+' : 
                             line.type === 'removed' ? '-' : 
                             line.type === 'modified' ? '~' : ' '}
                          </span>
                          {line.newLine || line.oldLine || ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export & Share</CardTitle>
              <CardDescription>
                Export your diff in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => downloadDiff('unified')}
                    className="flex items-center gap-2"
                    disabled={!leftText && !rightText}
                  >
                    <Download className="h-4 w-4" />
                    Download as Patch
                  </Button>
                  
                  <Button
                    onClick={() => downloadDiff('visual')}
                    className="flex items-center gap-2"
                    variant="outline"
                    disabled={!leftText && !rightText}
                  >
                    <Download className="h-4 w-4" />
                    Download Visual Diff
                  </Button>
                </div>

                {(leftText || rightText) && (
                  <div>
                    <Label className="mb-2 block">Unified Diff Format</Label>
                    <div className="relative">
                      <Textarea
                        value={generateUnifiedDiff()}
                        readOnly
                        className="font-mono text-sm min-h-[300px]"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateUnifiedDiff(), 'Unified diff')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Diff Legend</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">+</span>
                  <span>Added lines (green background)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">-</span>
                  <span>Removed lines (red background)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">~</span>
                  <span>Modified lines (yellow background)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-600">space</span>
                  <span>Unchanged lines</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Tips</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Use "Ignore whitespace" for cleaner code diffs</li>
                <li>• Upload files directly for easier comparison</li>
                <li>• Export as patch files for git apply</li>
                <li>• Switch between split and unified views</li>
                <li>• Line numbers help with precise locations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}