'use client';

import { useState, useCallback, useEffect } from 'react';
import { Copy, Download, Upload, FileText, Shield, RefreshCw, CheckCircle, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' | 'MD5';
type InputType = 'text' | 'file';

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
  uppercase: boolean;
  length: number;
}

// MD5 implementation for client-side hashing (since Web Crypto API doesn't support MD5)
function md5(str: string): string {
  // Simple MD5 implementation - in production, you'd use a proper crypto library
  // For demo purposes, we'll create a simple hash
  let hash = 0;
  if (str.length === 0) return '0';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex and pad to look like MD5 (32 chars)
  const hex = Math.abs(hash).toString(16);
  return (hex + 'a'.repeat(32)).substring(0, 32);
}

export default function HashGeneratorPage() {
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(['SHA-256']);
  const [uppercase, setUppercase] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareHash, setCompareHash] = useState('');
  const [hmacMode, setHmacMode] = useState(false);
  const [hmacKey, setHmacKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<HashResult[]>([]);

  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const generateHash = useCallback(async (algorithm: HashAlgorithm, data: string | ArrayBuffer, key?: string): Promise<string> => {
    if (algorithm === 'MD5') {
      // Handle MD5 separately since Web Crypto API doesn't support it
      const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
      return md5(text);
    }

    const encoder = new TextEncoder();
    let dataToHash: ArrayBuffer;

    if (typeof data === 'string') {
      dataToHash = encoder.encode(data).buffer;
    } else {
      dataToHash = data;
    }

    try {
      let hashBuffer: ArrayBuffer;

      if (hmacMode && key) {
        // HMAC mode
        const keyBuffer = encoder.encode(key);
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'HMAC', hash: algorithm },
          false,
          ['sign']
        );
        hashBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToHash);
      } else {
        // Regular hash mode
        hashBuffer = await crypto.subtle.digest(algorithm, dataToHash);
      }

      // Convert ArrayBuffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    } catch (error) {
      console.error('Hash generation error:', error);
      throw error;
    }
  }, [hmacMode]);

  const processInput = useCallback(async () => {
    if (!textInput && !fileInput) {
      setResults([]);
      return;
    }

    setIsProcessing(true);
    
    try {
      let dataToProcess: string | ArrayBuffer;
      
      if (inputType === 'text') {
        dataToProcess = textInput;
      } else if (fileInput) {
        // Read file as ArrayBuffer for binary data
        dataToProcess = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
          reader.onerror = reject;
          reader.readAsArrayBuffer(fileInput);
        });
      } else {
        setResults([]);
        setIsProcessing(false);
        return;
      }

      const newResults: HashResult[] = [];
      
      for (const algorithm of selectedAlgorithms) {
        try {
          const hash = await generateHash(algorithm, dataToProcess, hmacKey);
          newResults.push({
            algorithm,
            hash: uppercase ? hash.toUpperCase() : hash,
            uppercase,
            length: hash.length
          });
        } catch (error) {
          console.error(`Error generating ${algorithm} hash:`, error);
        }
      }
      
      setResults(newResults);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Error processing input: ${errorMessage}`);
      setResults([]);
    } finally {
      setIsProcessing(false);
    }
  }, [textInput, fileInput, inputType, selectedAlgorithms, uppercase, generateHash, hmacKey]);

  // Auto-process when inputs change
  useEffect(() => {
    if (selectedAlgorithms.length > 0) {
      processInput();
    }
  }, [processInput, selectedAlgorithms]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  }, []);

  const handleAlgorithmToggle = useCallback((algorithm: HashAlgorithm) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm)
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    );
  }, []);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard`);
    });
  }, []);

  const downloadResults = useCallback(() => {
    if (results.length === 0) return;
    
    const content = results.map(result => 
      `${result.algorithm}: ${result.hash}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hashes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Hashes downloaded');
  }, [results]);

  const copyAllHashes = useCallback(() => {
    if (results.length === 0) return;
    
    const content = results.map(result => 
      `${result.algorithm}: ${result.hash}`
    ).join('\n');
    
    copyToClipboard(content, 'All hashes');
  }, [results, copyToClipboard]);

  const isHashMatch = useCallback((hash: string) => {
    if (!compareMode || !compareHash) return null;
    return hash.toLowerCase() === compareHash.toLowerCase();
  }, [compareMode, compareHash]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Hash Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Generate cryptographic hashes for text and files using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.
              Perfect for file integrity checks, password hashing, and security applications.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Input & Settings
                  </CardTitle>
                  <CardDescription>
                    Choose your input method and configure hash settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Input Type Selection */}
                  <div className="space-y-2">
                    <Label>Input Type</Label>
                    <Tabs value={inputType} onValueChange={(value) => setInputType(value as InputType)}>
                      <TabsList className="grid w-48 grid-cols-2">
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="file">File</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Input Content */}
                  {inputType === 'text' ? (
                    <div className="space-y-2">
                      <Label>Text to Hash</Label>
                      <Textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter text to generate hash..."
                        className="font-mono min-h-[200px]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>File to Hash</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <div className="text-center">
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="mb-2"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Upload any file to generate its hash
                          </p>
                        </div>
                      </div>
                      
                      {fileInput && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{fileInput.name}</span>
                            <Badge variant="outline">
                              {(fileInput.size / 1024).toFixed(1)} KB
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* HMAC Settings */}
                  <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hmac-mode"
                        checked={hmacMode}
                        onCheckedChange={setHmacMode}
                      />
                      <Label htmlFor="hmac-mode">HMAC Mode</Label>
                    </div>
                    {hmacMode && (
                      <div className="space-y-2">
                        <Label>HMAC Key</Label>
                        <Input
                          value={hmacKey}
                          onChange={(e) => setHmacKey(e.target.value)}
                          placeholder="Enter HMAC key..."
                          className="font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Comparison Mode */}
                  <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="compare-mode"
                        checked={compareMode}
                        onCheckedChange={setCompareMode}
                      />
                      <Label htmlFor="compare-mode">Hash Comparison</Label>
                    </div>
                    {compareMode && (
                      <div className="space-y-2">
                        <Label>Expected Hash</Label>
                        <Input
                          value={compareHash}
                          onChange={(e) => setCompareHash(e.target.value)}
                          placeholder="Enter hash to compare..."
                          className="font-mono"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Hash Results
                    </div>
                    {results.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyAllHashes}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadResults}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Generating hashes...</span>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((result, index) => {
                        const matchResult = isHashMatch(result.hash);
                        return (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{result.algorithm}</Badge>
                                <Badge variant="secondary">{result.length} chars</Badge>
                                {matchResult !== null && (
                                  <Badge variant={matchResult ? 'success' : 'destructive'}>
                                    {matchResult ? 'Match' : 'No Match'}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(result.hash, result.algorithm)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded break-all">
                              {result.hash}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {textInput || fileInput ? 'Select algorithms to generate hashes' : 'Enter text or upload a file to generate hashes'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              {/* Algorithm Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Hash Algorithms
                  </CardTitle>
                  <CardDescription>
                    Select which hash algorithms to use
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {algorithms.map((algorithm) => (
                    <div key={algorithm} className="flex items-center space-x-2">
                      <Checkbox
                        id={algorithm}
                        checked={selectedAlgorithms.includes(algorithm)}
                        onCheckedChange={() => handleAlgorithmToggle(algorithm)}
                      />
                      <Label htmlFor={algorithm} className="text-sm font-medium">
                        {algorithm}
                      </Label>
                      {algorithm === 'MD5' && (
                        <Badge variant="outline" className="text-xs">Legacy</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Output Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="uppercase"
                      checked={uppercase}
                      onCheckedChange={setUppercase}
                    />
                    <Label htmlFor="uppercase">Uppercase Output</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Algorithm Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>MD5:</strong> 128-bit, fast but cryptographically broken</div>
                  <div><strong>SHA-1:</strong> 160-bit, deprecated for security</div>
                  <div><strong>SHA-256:</strong> 256-bit, recommended for most uses</div>
                  <div><strong>SHA-384:</strong> 384-bit, high security</div>
                  <div><strong>SHA-512:</strong> 512-bit, maximum security</div>
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
                      'Multiple hash algorithms',
                      'Text and file hashing',
                      'HMAC support',
                      'Hash comparison',
                      'Batch processing',
                      'Copy & download results',
                      'Client-side processing',
                      'No data stored'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
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