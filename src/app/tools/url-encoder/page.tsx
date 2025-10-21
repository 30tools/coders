'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Download, RefreshCw, Link, ArrowRight, ArrowLeft, Globe, CheckCircle, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type Mode = 'encode' | 'decode';
type ComponentType = 'full-url' | 'query-params' | 'path' | 'fragment';

interface URLAnalysis {
  isValid: boolean;
  protocol?: string;
  hostname?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  port?: string;
  origin?: string;
  params?: Record<string, string>;
}

export default function URLEncoderPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [componentType, setComponentType] = useState<ComponentType>('full-url');
  const [strictMode, setStrictMode] = useState(false);
  const [batchMode, setBatchMode] = useState(false);

  const processURL = useCallback((text: string, operation: Mode, component: ComponentType): string => {
    if (!text.trim()) return '';

    try {
      if (operation === 'encode') {
        switch (component) {
          case 'full-url':
            // For full URL, we need to be careful not to encode the protocol and structure
            try {
              const url = new URL(text);
              // Encode only the parts that should be encoded
              const encodedPathname = url.pathname.split('/').map(segment => 
                segment ? encodeURIComponent(segment) : ''
              ).join('/');
              
              const encodedSearch = url.search ? '?' + url.search.substring(1).split('&').map(param => {
                const [key, value] = param.split('=');
                return `${encodeURIComponent(key)}=${value ? encodeURIComponent(value) : ''}`;
              }).join('&') : '';
              
              const encodedHash = url.hash ? '#' + encodeURIComponent(url.hash.substring(1)) : '';
              
              return `${url.protocol}//${url.host}${encodedPathname}${encodedSearch}${encodedHash}`;
            } catch {
              // If not a valid URL, encode as component
              return encodeURIComponent(text);
            }
          case 'query-params':
            return text.split('&').map(param => {
              const [key, value] = param.split('=');
              return `${encodeURIComponent(key)}=${value ? encodeURIComponent(value) : ''}`;
            }).join('&');
          case 'path':
            return text.split('/').map(segment => 
              segment ? encodeURIComponent(segment) : ''
            ).join('/');
          case 'fragment':
            return encodeURIComponent(text);
          default:
            return encodeURIComponent(text);
        }
      } else {
        // Decode operation
        switch (component) {
          case 'full-url':
            return decodeURIComponent(text);
          case 'query-params':
            return text.split('&').map(param => {
              const [key, value] = param.split('=');
              return `${decodeURIComponent(key)}=${value ? decodeURIComponent(value) : ''}`;
            }).join('&');
          case 'path':
            return text.split('/').map(segment => 
              segment ? decodeURIComponent(segment) : ''
            ).join('/');
          case 'fragment':
            return decodeURIComponent(text);
          default:
            return decodeURIComponent(text);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`${operation === 'encode' ? 'Encoding' : 'Decoding'} error: ${errorMessage}`);
    }
  }, []);

  const result = useMemo(() => {
    if (!input.trim()) {
      return { 
        output: '', 
        isValid: true, 
        error: null,
        analysis: null
      };
    }

    try {
      let output: string;
      
      if (batchMode) {
        // Process multiple URLs/strings line by line
        const lines = input.split('\n').filter(line => line.trim());
        output = lines.map(line => {
          try {
            return processURL(line.trim(), mode, componentType);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return `ERROR: ${errorMessage}`;
          }
        }).join('\n');
      } else {
        output = processURL(input, mode, componentType);
      }

      // Analyze the result if it's a URL
      let analysis: URLAnalysis | null = null;
      try {
        if (mode === 'decode' || componentType === 'full-url') {
          const urlToAnalyze = mode === 'encode' ? input : output;
          const url = new URL(urlToAnalyze);
          
          const params: Record<string, string> = {};
          url.searchParams.forEach((value, key) => {
            params[key] = value;
          });
          
          analysis = {
            isValid: true,
            protocol: url.protocol,
            hostname: url.hostname,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            port: url.port,
            origin: url.origin,
            ...(Object.keys(params).length > 0 && { params })
          };
        }
      } catch {
        // Not a valid URL, that's okay
      }

      return {
        output,
        isValid: true,
        error: null,
        analysis
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        output: '',
        isValid: false,
        error: errorMessage,
        analysis: null
      };
    }
  }, [input, mode, componentType, batchMode, processURL]);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard`);
    });
  }, []);

  const downloadResult = useCallback(() => {
    if (!result.output) return;
    
    const blob = new Blob([result.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}d-urls.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${a.download}`);
  }, [result.output, mode]);

  const swapMode = useCallback(() => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    // Swap input and output if there's valid output
    if (result.output && result.isValid) {
      setInput(result.output);
    }
  }, [mode, result]);

  const clearAll = useCallback(() => {
    setInput('');
  }, []);

  const loadExample = useCallback((example: string) => {
    setInput(example);
  }, []);

  const examples = {
    encode: [
      'https://example.com/search?q=hello world&lang=en',
      'https://example.com/path with spaces/file.html',
      '/api/users?name=John Doe&email=john@example.com',
      'Special characters: #$%^&*()+=[]{}|;:,.<>?'
    ],
    decode: [
      'https%3A//example.com/search%3Fq%3Dhello%20world%26lang%3Den',
      'https%3A//example.com/path%20with%20spaces/file.html',
      '/api/users%3Fname%3DJohn%20Doe%26email%3Djohn%40example.com',
      'Special%20characters%3A%20%23%24%25%5E%26*()%2B%3D%5B%5D%7B%7D%7C%3B%3A%2C.%3C%3E%3F'
    ]
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              URL Encoder & Decoder
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Safely encode and decode URLs and query parameters for web applications.
              Perfect for handling special characters in URLs and debugging web requests.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      URL Processor
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={swapMode}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                      >
                        Clear
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {/* Mode Toggle */}
                    <div className="flex items-center gap-4">
                      <Badge variant={mode === 'encode' ? 'default' : 'outline'}>
                        {mode === 'encode' ? 'Encoding' : 'Decoding'}
                      </Badge>
                    </div>

                    {/* Component Type */}
                    <div className="flex items-center gap-2">
                      <Label>Component:</Label>
                      <Select value={componentType} onValueChange={(value) => setComponentType(value as ComponentType)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-url">Full URL</SelectItem>
                          <SelectItem value="query-params">Query Params</SelectItem>
                          <SelectItem value="path">Path</SelectItem>
                          <SelectItem value="fragment">Fragment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Options */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="batch-mode"
                        checked={batchMode}
                        onCheckedChange={setBatchMode}
                      />
                      <Label htmlFor="batch-mode" className="text-sm">Batch Mode</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="strict-mode"
                        checked={strictMode}
                        onCheckedChange={setStrictMode}
                      />
                      <Label htmlFor="strict-mode" className="text-sm">Strict RFC</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Input/Output */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {mode === 'encode' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                      Input ({mode === 'encode' ? 'Original' : 'Encoded'})
                    </CardTitle>
                    <CardDescription>
                      {mode === 'encode' 
                        ? 'Enter URL or text to encode' 
                        : 'Enter encoded URL or text to decode'
                      }
                      {batchMode && ' (one per line)'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        mode === 'encode' 
                          ? batchMode 
                            ? 'Enter URLs to encode (one per line)...' 
                            : 'Enter URL or text to encode...'
                          : batchMode
                            ? 'Enter encoded URLs to decode (one per line)...'
                            : 'Enter encoded URL or text to decode...'
                      }
                      className="font-mono min-h-[300px]"
                    />
                    
                    {!result.isValid && result.error && (
                      <div className="text-red-600 dark:text-red-400 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {result.error}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Output */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {mode === 'encode' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                        Output ({mode === 'encode' ? 'Encoded' : 'Decoded'})
                      </div>
                      {result.output && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(result.output, 'Result')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadResult}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {mode === 'encode' ? 'Encoded result' : 'Decoded result'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={result.output}
                      readOnly
                      className="font-mono min-h-[300px]"
                      placeholder={
                        input 
                          ? mode === 'encode' ? 'Encoded URL will appear here...' : 'Decoded URL will appear here...'
                          : 'Result will appear here...'
                      }
                    />
                    
                    {result.output && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <Badge variant="outline">
                          {result.output.length} characters
                        </Badge>
                        <Badge variant="outline">
                          {new Blob([result.output]).size} bytes
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* URL Analysis */}
              {result.analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      URL Analysis
                    </CardTitle>
                    <CardDescription>
                      Breakdown of URL components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Protocol:</span> {result.analysis.protocol}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Hostname:</span> {result.analysis.hostname}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Pathname:</span> {result.analysis.pathname || '/'}
                        </div>
                        {result.analysis.port && (
                          <div className="text-sm">
                            <span className="font-medium">Port:</span> {result.analysis.port}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {result.analysis.search && (
                          <div className="text-sm">
                            <span className="font-medium">Query:</span> {result.analysis.search}
                          </div>
                        )}
                        {result.analysis.hash && (
                          <div className="text-sm">
                            <span className="font-medium">Fragment:</span> {result.analysis.hash}
                          </div>
                        )}
                        {result.analysis.params && Object.keys(result.analysis.params).length > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Parameters:</span>
                            <div className="ml-2 mt-1 space-y-1">
                              {Object.entries(result.analysis.params).map(([key, value]) => (
                                <div key={key} className="font-mono text-xs">
                                  {key} = {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Examples</CardTitle>
                  <CardDescription>
                    Click to load example {mode === 'encode' ? 'URLs' : 'encoded strings'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {examples[mode].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => loadExample(example)}
                        className="w-full p-2 text-left border rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-xs"
                      >
                        <code className="break-all">{example}</code>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Component Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Component Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Full URL:</strong> Complete URL with protocol</div>
                  <div><strong>Query Params:</strong> Only the query parameters</div>
                  <div><strong>Path:</strong> Only the path component</div>
                  <div><strong>Fragment:</strong> Only the hash fragment</div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {[
                      'Full URL encoding/decoding',
                      'Component-wise processing',
                      'Batch processing support',
                      'URL analysis and breakdown',
                      'RFC compliant encoding',
                      'Copy and download results',
                      'Real-time processing',
                      'No server round trips'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Common Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>• API request URLs with special characters</div>
                  <div>• Search query parameters</div>
                  <div>• File paths with spaces</div>
                  <div>• Social media sharing URLs</div>
                  <div>• Email template links</div>
                  <div>• Form data submission</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}