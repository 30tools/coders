'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Copy, Eye, EyeOff, Clock, Shield, AlertTriangle, CheckCircle, Info, Download, RefreshCw, Key, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  isExpired: boolean;
  expiresIn?: number;
  algorithm: string;
  warnings: string[];
  errors: string[];
}

export default function JWTDecoderTool() {
  const [token, setToken] = useState('');
  const [decodedToken, setDecodedToken] = useState<DecodedJWT | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  // Sample JWT for demo
  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTksImF1ZCI6ImV4YW1wbGUuY29tIiwiaXNzIjoiYXV0aC5leGFtcGxlLmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const decodeJWT = useCallback((tokenString: string): DecodedJWT | null => {
    if (!tokenString.trim()) return null;
    
    setIsValidating(true);
    
    try {
      const parts = tokenString.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signature] = parts;
      
      // Decode header
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header: JWTHeader = JSON.parse(headerJson);
      
      // Decode payload
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload: JWTPayload = JSON.parse(payloadJson);
      
      // Validation and warnings
      const warnings: string[] = [];
      const errors: string[] = [];
      const now = Math.floor(Date.now() / 1000);
      
      // Check expiration
      const isExpired = payload.exp ? payload.exp < now : false;
      const expiresIn = payload.exp ? payload.exp - now : undefined;
      
      // Security checks
      if (header.alg === 'none') {
        warnings.push('Token uses "none" algorithm - no signature verification');
      }
      
      if (!payload.exp) {
        warnings.push('Token has no expiration time (exp claim)');
      }
      
      if (!payload.iat) {
        warnings.push('Token has no issued at time (iat claim)');
      }
      
      if (payload.exp && payload.iat && payload.exp <= payload.iat) {
        errors.push('Token expires before it was issued');
      }
      
      if (isExpired) {
        errors.push('Token has expired');
      }
      
      if (payload.nbf && payload.nbf > now) {
        errors.push('Token is not yet valid (nbf claim)');
      }

      return {
        header,
        payload,
        signature,
        isValid: errors.length === 0,
        isExpired,
        expiresIn,
        algorithm: header.alg || 'unknown',
        warnings,
        errors
      };
    } catch (error) {
      return {
        header: {},
        payload: {},
        signature: '',
        isValid: false,
        isExpired: false,
        algorithm: 'unknown',
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Invalid JWT token']
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Auto-decode when token changes
  useEffect(() => {
    const decoded = decodeJWT(token);
    setDecodedToken(decoded);
  }, [token, decodeJWT]);

  // Auto-refresh expiration countdown
  useEffect(() => {
    if (!autoRefresh || !decodedToken?.expiresIn) return;
    
    const interval = setInterval(() => {
      if (decodedToken.payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const newExpiresIn = decodedToken.payload.exp - now;
        
        if (newExpiresIn <= 0) {
          setDecodedToken(prev => prev ? { ...prev, isExpired: true, expiresIn: 0 } : null);
        } else {
          setDecodedToken(prev => prev ? { ...prev, expiresIn: newExpiresIn } : null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [decodedToken, autoRefresh]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  }, []);

  const formatTime = useCallback((timestamp?: number) => {
    if (!timestamp) return 'Not set';
    return new Date(timestamp * 1000).toLocaleString();
  }, []);

  const formatDuration = useCallback((seconds?: number) => {
    if (!seconds || seconds <= 0) return 'Expired';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }, []);

  const loadSample = useCallback(() => {
    setToken(sampleJWT);
    toast.success('Sample JWT loaded');
  }, []);

  const clearToken = useCallback(() => {
    setToken('');
    setDecodedToken(null);
  }, []);

  const downloadReport = useCallback(() => {
    if (!decodedToken) return;
    
    const report = {
      token: token,
      decoded: decodedToken,
      analysis: {
        isValid: decodedToken.isValid,
        isExpired: decodedToken.isExpired,
        expiresIn: decodedToken.expiresIn,
        warnings: decodedToken.warnings,
        errors: decodedToken.errors
      },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jwt-analysis-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analysis report downloaded');
  }, [decodedToken, token]);

  const getStatusIcon = useMemo(() => {
    if (!decodedToken) return <Key className="h-5 w-5 text-gray-400" />;
    if (decodedToken.errors.length > 0) return <Lock className="h-5 w-5 text-red-500" />;
    if (decodedToken.warnings.length > 0) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <Unlock className="h-5 w-5 text-green-500" />;
  }, [decodedToken]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-3">
          {getStatusIcon}
          JWT Token Decoder & Validator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Decode, validate, and analyze JSON Web Tokens with comprehensive security insights and real-time expiration tracking.
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>JWT Token Input</span>
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
                onClick={clearToken}
                disabled={!token}
              >
                Clear
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Paste your JWT token below. All processing happens in your browser - no data is sent to servers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>JWT Token</Label>
              <Textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="font-mono text-sm min-h-[120px] resize-y"
              />
            </div>
            
            {/* Processing Options */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                  <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh countdown</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-sensitive"
                    checked={showSensitive}
                    onCheckedChange={setShowSensitive}
                  />
                  <Label htmlFor="show-sensitive" className="text-sm">Show sensitive data</Label>
                </div>
              </div>
              
              {isValidating && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Validating...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {decodedToken && (
        <div className="space-y-6">
          {/* Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Token Status</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Validity Status */}
                <div className="text-center p-4 rounded-lg border">
                  {decodedToken.isValid ? (
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  )}
                  <div className="font-semibold">
                    {decodedToken.isValid ? 'Valid Token' : 'Invalid Token'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {decodedToken.errors.length} errors, {decodedToken.warnings.length} warnings
                  </div>
                </div>

                {/* Expiration Status */}
                <div className="text-center p-4 rounded-lg border">
                  <Clock className={`h-8 w-8 mx-auto mb-2 ${decodedToken.isExpired ? 'text-red-500' : 'text-green-500'}`} />
                  <div className="font-semibold">
                    {decodedToken.isExpired ? 'Expired' : 'Active'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {decodedToken.expiresIn !== undefined ? formatDuration(decodedToken.expiresIn) : 'No expiration'}
                  </div>
                </div>

                {/* Algorithm */}
                <div className="text-center p-4 rounded-lg border">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold">{decodedToken.algorithm.toUpperCase()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Signing Algorithm
                  </div>
                </div>
              </div>

              {/* Errors and Warnings */}
              {(decodedToken.errors.length > 0 || decodedToken.warnings.length > 0) && (
                <div className="mt-4 space-y-2">
                  {decodedToken.errors.map((error, index) => (
                    <Alert key={`error-${index}`} className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        {error}
                      </AlertDescription>
                    </Alert>
                  ))}
                  
                  {decodedToken.warnings.map((warning, index) => (
                    <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        {warning}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Parts */}
          <Tabs defaultValue="payload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>

            {/* Header Tab */}
            <TabsContent value="header">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>JOSE Header</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(decodedToken.header, null, 2), 'Header')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    JWT header contains metadata about the token type and signing algorithm.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                    {JSON.stringify(decodedToken.header, null, 2)}
                  </pre>
                  
                  {/* Header Analysis */}
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Header Analysis:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Algorithm:</span> {decodedToken.header.alg || 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {decodedToken.header.typ || 'Not specified'}
                      </div>
                      {decodedToken.header.kid && (
                        <div>
                          <span className="font-medium">Key ID:</span> {decodedToken.header.kid}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payload Tab */}
            <TabsContent value="payload">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Payload (Claims)</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSensitive(!showSensitive)}
                      >
                        {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(decodedToken.payload, null, 2), 'Payload')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    JWT payload contains the claims (user data and metadata).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                    {showSensitive 
                      ? JSON.stringify(decodedToken.payload, null, 2)
                      : JSON.stringify(decodedToken.payload, null, 2).replace(/"([^"]*)":/g, '"***":')
                    }
                  </pre>
                  
                  {/* Claims Analysis */}
                  <div className="mt-4 space-y-4">
                    <h4 className="font-semibold">Standard Claims:</h4>
                    <div className="grid gap-4">
                      {/* Timing Claims */}
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-gray-600 dark:text-gray-400">Issued At (iat)</div>
                          <div>{formatTime(decodedToken.payload.iat)}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-gray-600 dark:text-gray-400">Expires (exp)</div>
                          <div className={decodedToken.isExpired ? 'text-red-600' : ''}>
                            {formatTime(decodedToken.payload.exp)}
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-gray-600 dark:text-gray-400">Not Before (nbf)</div>
                          <div>{formatTime(decodedToken.payload.nbf)}</div>
                        </div>
                      </div>
                      
                      {/* Identity Claims */}
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-gray-600 dark:text-gray-400">Subject (sub)</div>
                          <div className="font-mono break-all">
                            {showSensitive ? (decodedToken.payload.sub || 'Not set') : '***'}
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-gray-600 dark:text-gray-400">Issuer (iss)</div>
                          <div className="break-all">{decodedToken.payload.iss || 'Not set'}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="font-medium text-gray-600 dark:text-gray-400">Audience (aud)</div>
                          <div className="break-all">
                            {Array.isArray(decodedToken.payload.aud) 
                              ? decodedToken.payload.aud.join(', ') 
                              : decodedToken.payload.aud || 'Not set'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signature Tab */}
            <TabsContent value="signature">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Signature</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(decodedToken.signature, 'Signature')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Digital signature used to verify the token's authenticity and integrity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="font-mono text-sm break-all">
                        {decodedToken.signature || 'No signature present'}
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                      <strong>Note:</strong> This tool only decodes the token structure. 
                        Signature verification requires the secret key or public key and should be done server-side.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium text-gray-600 dark:text-gray-400">Algorithm</div>
                        <div>{decodedToken.algorithm}</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium text-gray-600 dark:text-gray-400">Signature Length</div>
                        <div>{decodedToken.signature.length} characters</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About JWT Tokens</CardTitle>
          <CardDescription>
            Learn about JSON Web Tokens and how to use them securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">What is a JWT?</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. 
                It consists of three parts: header, payload, and signature.
              </p>
              
              <h4 className="font-semibold mb-2">Common Use Cases:</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• User authentication</li>
                <li>• API access tokens</li>
                <li>• Information exchange</li>
                <li>• Stateless sessions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Security Best Practices:</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Always verify signatures server-side</li>
                <li>• Use strong signing algorithms (RS256, ES256)</li>
                <li>• Set reasonable expiration times</li>
                <li>• Never store sensitive data in claims</li>
                <li>• Validate all claims before use</li>
                <li>• Use HTTPS for token transmission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}