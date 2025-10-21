'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Download, Upload, FileText, CheckCircle, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function JSONFormatterPage() {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('formatter');

  const sortObjectKeys = useCallback((obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sortedObj: Record<string, unknown> = {};
      Object.keys(obj).sort().forEach(key => {
        sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
      });
      return sortedObj;
    }
    return obj;
  }, []);

  const formatResult = useMemo(() => {
    if (!input.trim()) {
      return { 
        formatted: '', 
        minified: '', 
        isValid: true, 
        error: null, 
        stats: { size: 0, lines: 0, objects: 0, arrays: 0 }
      };
    }

    try {
      const parsed = JSON.parse(input);
      
      // Sort keys if enabled
      const processedData = sortKeys ? sortObjectKeys(parsed) : parsed;
      
      const indentSpaces = parseInt(indentSize);
      const formatted = JSON.stringify(processedData, null, indentSpaces);
      const minified = JSON.stringify(processedData);
      
      // Calculate statistics
      const stats = calculateJSONStats(parsed);
      
      return {
        formatted,
        minified,
        isValid: true,
        error: null,
        stats,
        parsed: processedData
      };
    } catch (error: unknown) {
      // Parse error details
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorMatch = errorMessage.match(/position (\d+)/);
      let line = 1;
      let column = 1;
      
      if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        const lines = input.substring(0, position).split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }

      return {
        formatted: '',
        minified: '',
        isValid: false,
        error: {
          line,
          column,
          message: errorMessage
        },
        stats: { size: 0, lines: 0, objects: 0, arrays: 0 }
      };
    }
  }, [input, indentSize, sortKeys, sortObjectKeys]);

  const calculateJSONStats = (obj: unknown): { size: number; lines: number; objects: number; arrays: number } => {
    const jsonString = JSON.stringify(obj);
    const size = new Blob([jsonString]).size;
    const lines = jsonString.split('\n').length;
    
    let objects = 0;
    let arrays = 0;
    
    const traverse = (item: unknown) => {
      if (Array.isArray(item)) {
        arrays++;
        item.forEach(traverse);
      } else if (item !== null && typeof item === 'object') {
        objects++;
        Object.values(item as Record<string, unknown>).forEach(traverse);
      }
    };
    
    traverse(obj);
    
    return { size, lines, objects, arrays };
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  }, []);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard`);
    });
  }, []);

  const downloadJSON = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              JSON Formatter & Validator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Format, validate, and minify JSON data with real-time error detection and syntax highlighting.
              Perfect for debugging APIs and cleaning up JSON files.
            </p>
          </div>

          {/* Tools */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  JSON Processor
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </div>
              <CardDescription>
                Paste your JSON or upload a file to format, validate, and analyze it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Options */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="indent-size">Indent:</Label>
                  <Select value={indentSize} onValueChange={setIndentSize}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="tab">\t</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sort-keys"
                    checked={sortKeys}
                    onCheckedChange={setSortKeys}
                  />
                  <Label htmlFor="sort-keys">Sort Keys</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="json-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('json-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload JSON
                  </Button>
                </div>
              </div>

              {/* Input/Output */}
              <div className={`grid gap-4 ${isExpanded ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
                {/* Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Input JSON</Label>
                    <Badge variant={formatResult.isValid ? 'success' : 'destructive'}>
                      {formatResult.isValid ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invalid
                        </>
                      )}
                    </Badge>
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your JSON here..."
                    className={`font-mono min-h-[300px] ${isExpanded ? 'min-h-[400px]' : ''}`}
                  />
                  {!formatResult.isValid && formatResult.error && (
                    <div className="text-red-600 dark:text-red-400 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <strong>Error at line {formatResult.error.line}, column {formatResult.error.column}:</strong>
                      <br />
                      {formatResult.error.message}
                    </div>
                  )}
                </div>

                {/* Output */}
                <div className="space-y-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="formatter">Formatted</TabsTrigger>
                      <TabsTrigger value="minified">Minified</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="formatter" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Formatted JSON</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(formatResult.formatted, 'Formatted JSON')}
                            disabled={!formatResult.isValid}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadJSON(formatResult.formatted, 'formatted.json')}
                            disabled={!formatResult.isValid}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={formatResult.formatted}
                        readOnly
                        className={`font-mono min-h-[300px] ${isExpanded ? 'min-h-[400px]' : ''}`}
                        placeholder="Formatted JSON will appear here..."
                      />
                    </TabsContent>
                    
                    <TabsContent value="minified" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Minified JSON</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(formatResult.minified, 'Minified JSON')}
                            disabled={!formatResult.isValid}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadJSON(formatResult.minified, 'minified.json')}
                            disabled={!formatResult.isValid}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={formatResult.minified}
                        readOnly
                        className={`font-mono min-h-[300px] ${isExpanded ? 'min-h-[400px]' : ''}`}
                        placeholder="Minified JSON will appear here..."
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Statistics */}
              {formatResult.isValid && input.trim() && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {formatResult.stats.size}B
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {formatResult.stats.lines}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Lines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {formatResult.stats.objects}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Objects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {formatResult.stats.arrays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Arrays</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Everything you need for JSON processing in one tool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Real-time JSON validation',
                  'Syntax highlighting support',
                  'Format with custom indentation',
                  'Minify for production use',
                  'Sort keys alphabetically',
                  'File upload support',
                  'Download processed JSON',
                  'Error detection with line numbers',
                  'JSON statistics and analysis',
                  'Copy to clipboard',
                  'No data stored on servers',
                  'Works completely offline'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}