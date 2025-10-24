'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Copy, Search, RefreshCw, BookOpen, AlertCircle, CheckCircle, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

interface Match {
  match: string;
  index: number;
  groups: string[];
  namedGroups: { [key: string]: string };
}



const commonPatterns = [
  {
    name: 'Email Address',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Matches most email addresses',
    flags: 'g'
  },
  {
    name: 'Phone Number (US)',
    pattern: '\\(?(\\d{3})\\)?[-. ]?(\\d{3})[-. ]?(\\d{4})',
    description: 'Matches US phone numbers in various formats',
    flags: 'g'
  },
  {
    name: 'URL',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    description: 'Matches HTTP and HTTPS URLs',
    flags: 'g'
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    description: 'Matches IPv4 addresses',
    flags: 'g'
  },
  {
    name: 'Date (MM/DD/YYYY)',
    pattern: '(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d\\d',
    description: 'Matches dates in MM/DD/YYYY format',
    flags: 'g'
  },
  {
    name: 'Hexadecimal Color',
    pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})',
    description: 'Matches hex color codes',
    flags: 'g'
  },
  {
    name: 'Credit Card',
    pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b',
    description: 'Matches common credit card numbers',
    flags: 'g'
  },
  {
    name: 'Strong Password',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description: 'At least 8 chars with uppercase, lowercase, number, and special char',
    flags: ''
  }
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [explanation, setExplanation] = useState('');

  const regexResult = useMemo(() => {
    if (!pattern) {
      return {
        isValid: true,
        matches: [],
        globalMatches: [],
        executionTime: 0,
        flags: []
      };
    }

    try {
      const startTime = performance.now();
      
      // Build flags string
      const flagString = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matches: Match[] = [];
      const globalMatches: string[] = [];
      
      if (testString) {
        if (flags.global) {
          // Global matching
          let match;
          while ((match = regex.exec(testString)) !== null) {
            matches.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
              namedGroups: match.groups || {}
            });
            globalMatches.push(match[0]);
            
            // Prevent infinite loop on zero-length matches
            if (match.index === regex.lastIndex) {
              regex.lastIndex++;
            }
          }
        } else {
          // Single match
          const match = regex.exec(testString);
          if (match) {
            matches.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
              namedGroups: match.groups || {}
            });
            globalMatches.push(match[0]);
          }
        }
      }

      const endTime = performance.now();
      
      return {
        isValid: true,
        matches,
        globalMatches,
        executionTime: endTime - startTime,
        flags: flagString.split('')
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isValid: false,
        error: errorMessage,
        matches: [],
        globalMatches: [],
        executionTime: 0,
        flags: []
      };
    }
  }, [pattern, testString, flags]);

  const highlightedText = useMemo(() => {
    if (!testString || !regexResult.isValid || regexResult.matches.length === 0) {
      return testString;
    }

    let result = testString;
    let offset = 0;

    regexResult.matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlightClass = `bg-yellow-200 dark:bg-yellow-900 font-semibold`;
      const before = result.slice(0, start);
      const highlighted = `<span class="${highlightClass}" data-match="${index}">${result.slice(start, end)}</span>`;
      const after = result.slice(end);
      
      result = before + highlighted + after;
      offset += highlighted.length - match.match.length;
    });

    return result;
  }, [testString, regexResult]);

  const generateExplanation = useCallback((pattern: string) => {
    if (!pattern) return '';
    
    // Simple regex explanation (in a real app, you might use a library like regex-parser)
    let explanation = 'Pattern breakdown:\n';
    
    // Basic character explanations
    const explanations: { [key: string]: string } = {
      '.': 'Matches any character except newline',
      '*': 'Matches 0 or more of the preceding element',
      '+': 'Matches 1 or more of the preceding element',
      '?': 'Matches 0 or 1 of the preceding element',
      '^': 'Matches the start of the string',
      '$': 'Matches the end of the string',
      '\\d': 'Matches any digit (0-9)',
      '\\w': 'Matches any word character (a-z, A-Z, 0-9, _)',
      '\\s': 'Matches any whitespace character',
      '\\b': 'Matches a word boundary',
      '[': 'Start of character class',
      ']': 'End of character class',
      '(': 'Start of capturing group',
      ')': 'End of capturing group',
      '|': 'Alternation (OR)',
      '{': 'Start of quantifier',
      '}': 'End of quantifier'
    };

    for (const [char, desc] of Object.entries(explanations)) {
      if (pattern.includes(char)) {
        explanation += `• ${char}: ${desc}\n`;
      }
    }

    return explanation || 'Enter a regex pattern to see explanation';
  }, []);

  useEffect(() => {
    setExplanation(generateExplanation(pattern));
  }, [pattern, generateExplanation]);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard`);
    });
  }, []);

  const loadPattern = useCallback((patternData: typeof commonPatterns[0]) => {
    setPattern(patternData.pattern);
    setFlags({
      global: patternData.flags.includes('g'),
      ignoreCase: patternData.flags.includes('i'),
      multiline: patternData.flags.includes('m'),
      dotAll: patternData.flags.includes('s'),
      unicode: patternData.flags.includes('u'),
      sticky: patternData.flags.includes('y')
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Regex Tester & Explainer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Test regular expressions with real-time matching, detailed explanations, and performance analysis.
              Perfect for debugging regex patterns and learning regex syntax.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Testing Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pattern Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Regular Expression
                  </CardTitle>
                  <CardDescription>
                    Enter your regex pattern and select flags
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pattern Input */}
                  <div className="space-y-2">
                    <Label>Pattern</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">/</span>
                        <Input
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          placeholder="Enter regex pattern..."
                          className="pl-6 pr-12 font-mono"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/</span>
                      </div>
                      <Badge variant={regexResult.isValid ? 'success' : 'destructive'}>
                        {regexResult.isValid ? (
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
                    {!regexResult.isValid && regexResult.error && (
                      <div className="text-red-600 dark:text-red-400 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        {regexResult.error}
                      </div>
                    )}
                  </div>

                  {/* Flags */}
                  <div className="space-y-2">
                    <Label>Flags</Label>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(flags).map(([flag, enabled]) => (
                        <div key={flag} className="flex items-center space-x-2">
                          <Switch
                            id={flag}
                            checked={enabled}
                            onCheckedChange={(checked: boolean) => 
                              setFlags(prev => ({ ...prev, [flag]: checked }))
                            }
                          />
                          <Label htmlFor={flag} className="text-sm">
                            {flag.charAt(0).toUpperCase() + flag.slice(1)} ({
                              {
                                global: 'g',
                                ignoreCase: 'i',
                                multiline: 'm',
                                dotAll: 's',
                                unicode: 'u',
                                sticky: 'y'
                              }[flag as keyof typeof flags]
                            })
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test String */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Test String
                  </CardTitle>
                  <CardDescription>
                    Enter text to test your regex pattern against
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter test string here..."
                    className="font-mono min-h-[200px]"
                  />
                  
                  {/* Highlighted Results */}
                  {testString && (
                    <div className="space-y-2">
                      <Label>Highlighted Matches</Label>
                      <div 
                        className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md font-mono text-sm whitespace-pre-wrap break-all border min-h-[100px]"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Match Results
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {regexResult.executionTime.toFixed(2)}ms
                      </div>
                      <Badge variant="outline">
                        {regexResult.matches.length} matches
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {regexResult.matches.length > 0 ? (
                    <div className="space-y-4">
                      {regexResult.matches.map((match, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">Match {index + 1}</Badge>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Position: {match.index}-{match.index + match.match.length}
                            </div>
                          </div>
                          <div className="font-mono text-sm">
                            <div><strong>Full Match:</strong> &ldquo;{match.match}&rdquo;</div>
                            {match.groups.length > 0 && (
                              <div><strong>Capture Groups:</strong> [{match.groups.map(g => `"${g}"`).join(', ')}]</div>
                            )}
                            {Object.keys(match.namedGroups).length > 0 && (
                              <div><strong>Named Groups:</strong> {JSON.stringify(match.namedGroups)}</div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(regexResult.globalMatches.join('\n'), 'Matches')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy All Matches
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {pattern && testString ? 'No matches found' : 'Enter a pattern and test string to see results'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Common Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Common Patterns
                  </CardTitle>
                  <CardDescription>
                    Click to load pre-built regex patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {commonPatterns.map((patternData, index) => (
                      <button
                        key={index}
                        onClick={() => loadPattern(patternData)}
                        className="w-full p-3 text-left border rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="font-medium text-sm">{patternData.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {patternData.description}
                        </div>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded mt-1 block break-all">
                          {patternData.pattern}
                        </code>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>Pattern Explanation</CardTitle>
                  <CardDescription>
                    Understanding your regex pattern
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-line font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                    {explanation}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="characters">
                      <AccordionTrigger>Character Classes</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 text-sm font-mono">
                          <div>. → Any character</div>
                          <div>\d → Digit (0-9)</div>
                          <div>\w → Word character</div>
                          <div>\s → Whitespace</div>
                          <div>[abc] → Any of a, b, c</div>
                          <div>[^abc] → Not a, b, or c</div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="quantifiers">
                      <AccordionTrigger>Quantifiers</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 text-sm font-mono">
                          <div>* → 0 or more</div>
                          <div>+ → 1 or more</div>
                          <div>? → 0 or 1</div>
                          <div>{`{n}`} → Exactly n</div>
                          <div>{`{n,}`} → n or more</div>
                          <div>{`{n,m}`} → Between n and m</div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="anchors">
                      <AccordionTrigger>Anchors</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 text-sm font-mono">
                          <div>^ → Start of string</div>
                          <div>$ → End of string</div>
                          <div>\b → Word boundary</div>
                          <div>\B → Not word boundary</div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}