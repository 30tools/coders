'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Download, Upload, FileText, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type Mode = 'encode' | 'decode';
type InputType = 'text' | 'file';

export default function Base64EncoderTool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [output, setOutput] = useState('');
  const [urlSafeMode, setUrlSafeMode] = useState(false);
  const [autoLineBreaks, setAutoLineBreaks] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const processContent = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      let content = '';
      
      if (inputType === 'text') {
        content = textInput;
      } else if (fileInput) {
        // Read file as base64 for encoding, or as text for decoding
        const reader = new FileReader();
        
        return new Promise<void>((resolve, reject) => {
          reader.onload = (e) => {
            try {
              if (mode === 'encode') {
                // For encoding, we need the raw binary data
                const result = e.target?.result as ArrayBuffer;
                const bytes = new Uint8Array(result);
                let binary = '';
                for (let i = 0; i < bytes.length; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                
                let encoded = btoa(binary);
                
                if (urlSafeMode) {
                  encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
                }
                
                if (autoLineBreaks) {
                  encoded = encoded.match(/.{1,76}/g)?.join('\n') || encoded;
                }
                
                setOutput(encoded);
              } else {
                // For decoding, we need the text content
                const result = e.target?.result as string;
                
                let toDecode = result.trim();
                
                if (urlSafeMode) {
                  toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
                  // Add padding if needed
                  while (toDecode.length % 4) {
                    toDecode += '=';
                  }
                }
                
                // Remove line breaks
                toDecode = toDecode.replace(/\s/g, '');
                
                const decoded = atob(toDecode);
                setOutput(decoded);
              }
              
              setIsProcessing(false);
              resolve();
            } catch (error: unknown) {
              setIsProcessing(false);
              const errorMessage = error instanceof Error ? error.message : String(error);
              toast.error(`Error processing file: ${errorMessage}`);
              reject(error);
            }
          };
          
          reader.onerror = () => {
            setIsProcessing(false);
            toast.error('Error reading file');
            reject(new Error('File read error'));
          };
          
          if (mode === 'encode') {
            reader.readAsArrayBuffer(fileInput);
          } else {
            reader.readAsText(fileInput);
          }
        });
      }
      
      // Process text input
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(content)));
        
        if (urlSafeMode) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        
        if (autoLineBreaks) {
          encoded = encoded.match(/.{1,76}/g)?.join('\n') || encoded;
        }
        
        setOutput(encoded);
      } else {
        let toDecode = content.trim();
        
        if (urlSafeMode) {
          toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if needed
          while (toDecode.length % 4) {
            toDecode += '=';
          }
        }
        
        // Remove line breaks
        toDecode = toDecode.replace(/\s/g, '');
        
        try {
          const decoded = decodeURIComponent(escape(atob(toDecode)));
          setOutput(decoded);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          toast.error(`Decoding error: ${errorMessage}`);
          setOutput('');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Error: ${errorMessage}`);
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  }, [mode, inputType, textInput, fileInput, urlSafeMode, autoLineBreaks]);

  // Auto-process when inputs change
  useMemo(() => {
    if ((inputType === 'text' && textInput) || (inputType === 'file' && fileInput)) {
      processContent();
    } else {
      setOutput('');
    }
  }, [processContent, inputType, textInput, fileInput]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
      // Read file for preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFileContent('');
      }
    }
  }, []);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard`);
    });
  }, []);

  const downloadResult = useCallback(() => {
    if (!output) return;
    
    const blob = new Blob([output], { 
      type: mode === 'encode' ? 'text/plain' : 'application/octet-stream' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${a.download}`);
  }, [output, mode]);

  const swapMode = useCallback(() => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    // Swap input and output
    if (inputType === 'text' && output) {
      setTextInput(output);
      setOutput('');
    }
  }, [mode, inputType, output]);

  const clearAll = useCallback(() => {
    setTextInput('');
    setFileInput(null);
    setFileContent('');
    setOutput('');
  }, []);

  const isImageFile = fileInput?.type.startsWith('image/');
  const hasInput = (inputType === 'text' && textInput) || (inputType === 'file' && fileInput);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Base64 Encoder & Decoder
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Encode text and files to Base64 or decode Base64 strings back to their original format.
              Supports URL-safe encoding and handles images, documents, and binary files.
            </p>
          </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Processing Options</span>
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
                    Clear All
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

                {/* Input Type Toggle */}
                <div className="flex items-center gap-2">
                  <Label>Input Type:</Label>
                  <Tabs value={inputType} onValueChange={(value) => setInputType(value as InputType)}>
                    <TabsList className="grid w-32 grid-cols-2">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="file">File</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Options */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="url-safe"
                    checked={urlSafeMode}
                    onCheckedChange={setUrlSafeMode}
                  />
                  <Label htmlFor="url-safe" className="text-sm">URL Safe</Label>
                </div>

                {mode === 'encode' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="line-breaks"
                      checked={autoLineBreaks}
                      onCheckedChange={setAutoLineBreaks}
                    />
                    <Label htmlFor="line-breaks" className="text-sm">Line Breaks</Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'encode' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                  Input ({mode === 'encode' ? 'Original' : 'Base64'})
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' 
                    ? 'Enter text or upload a file to encode to Base64' 
                    : 'Enter Base64 string to decode'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inputType === 'text' ? (
                  <div className="space-y-2">
                    <Label>
                      {mode === 'encode' ? 'Text to encode' : 'Base64 string to decode'}
                    </Label>
                    <Textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={
                        mode === 'encode' 
                          ? 'Enter text to encode...' 
                          : 'Paste Base64 string to decode...'
                      }
                      className="font-mono min-h-[300px]"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        {mode === 'encode' ? 'File to encode' : 'Base64 file to decode'}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept={mode === 'decode' ? '.txt,.b64' : undefined}
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
                            {mode === 'encode' 
                              ? 'Upload any file (images, documents, etc.)'
                              : 'Upload a text file containing Base64 data'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {fileInput && (
                      <div className="space-y-2">
                        <Label>Selected File</Label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{fileInput.name}</span>
                            <Badge variant="outline">
                              {(fileInput.size / 1024).toFixed(1)} KB
                            </Badge>
                          </div>
                          
                          {isImageFile && fileContent && (
                            <div className="mt-3">
                              <Label className="text-xs">Preview:</Label>
                              <Image 
                                src={fileContent} 
                                alt="Preview" 
                                width={200}
                                height={128}
                                className="mt-1 max-w-full max-h-32 object-contain border rounded"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {mode === 'encode' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                    Output ({mode === 'encode' ? 'Base64' : 'Decoded'})
                  </div>
                  {output && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(output, 'Output')}
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
                  {mode === 'encode' 
                    ? 'Base64 encoded result' 
                    : 'Decoded result'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Result</Label>
                  {isProcessing ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    <Textarea
                      value={output}
                      readOnly
                      className="font-mono min-h-[300px]"
                      placeholder={
                        hasInput 
                          ? 'Processing...' 
                          : mode === 'encode' 
                            ? 'Base64 output will appear here...'
                            : 'Decoded output will appear here...'
                      }
                    />
                  )}
                  
                  {output && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <Badge variant="outline">
                        {output.length} characters
                      </Badge>
                      <Badge variant="outline">
                        {new Blob([output]).size} bytes
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Everything you need for Base64 encoding and decoding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Encode text to Base64',
                  'Decode Base64 to text',
                  'File encoding support',
                  'Image preview',
                  'URL-safe encoding',
                  'Automatic line breaks',
                  'Copy to clipboard',
                  'Download results',
                  'Real-time processing',
                  'No file size limits',
                  'Secure client-side processing',
                  'Binary file support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}