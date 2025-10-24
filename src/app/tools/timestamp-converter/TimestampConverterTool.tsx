'use client';

import { useState, useCallback, useEffect } from 'react';
import { Copy, Clock, Calendar, Globe, RefreshCw, Plus, Minus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface TimestampData {
  unix: number;
  unixMs: number;
  iso: string;
  formatted: string;
  relative: string;
  timezone: string;
}

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

const dateFormats = [
  { value: 'iso', label: 'ISO 8601', example: '2024-01-01T12:00:00.000Z' },
  { value: 'rfc2822', label: 'RFC 2822', example: 'Mon, 01 Jan 2024 12:00:00 GMT' },
  { value: 'locale', label: 'Locale String', example: '1/1/2024, 12:00:00 PM' },
  { value: 'custom', label: 'Custom Format', example: 'YYYY-MM-DD HH:mm:ss' },
];

export default function TimestampConverterTool() {
  const [currentTime, setCurrentTime] = useState<TimestampData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'unix' | 'iso' | 'human'>('unix');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [outputFormat, setOutputFormat] = useState('iso');
  const [customFormat, setCustomFormat] = useState('YYYY-MM-DD HH:mm:ss');
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<TimestampData[]>([]);
  const [convertedTime, setConvertedTime] = useState<TimestampData | null>(null);

  // Format relative time
  const getRelativeTime = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const absSeconds = Math.abs(diff) / 1000;
    const absMinutes = absSeconds / 60;
    const absHours = absMinutes / 60;
    const absDays = absHours / 24;
    const absWeeks = absDays / 7;
    const absMonths = absDays / 30;
    const absYears = absDays / 365;

    const future = diff < 0;
    const prefix = future ? 'in ' : '';
    const suffix = future ? '' : ' ago';

    if (absSeconds < 60) return `${prefix}${Math.floor(absSeconds)} seconds${suffix}`;
    if (absMinutes < 60) return `${prefix}${Math.floor(absMinutes)} minutes${suffix}`;
    if (absHours < 24) return `${prefix}${Math.floor(absHours)} hours${suffix}`;
    if (absDays < 7) return `${prefix}${Math.floor(absDays)} days${suffix}`;
    if (absWeeks < 4) return `${prefix}${Math.floor(absWeeks)} weeks${suffix}`;
    if (absMonths < 12) return `${prefix}${Math.floor(absMonths)} months${suffix}`;
    return `${prefix}${Math.floor(absYears)} years${suffix}`;
  }, []);

  // Format date based on selected format
  const formatDate = useCallback((date: Date, format: string, timezone: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'rfc2822':
        return date.toUTCString();
      case 'locale':
        return date.toLocaleString('en-US', { ...options, hour12: true });
      case 'custom':
        // Simple custom format implementation
        const pad = (n: number) => n.toString().padStart(2, '0');
        return customFormat
          .replace('YYYY', date.getFullYear().toString())
          .replace('MM', pad(date.getMonth() + 1))
          .replace('DD', pad(date.getDate()))
          .replace('HH', pad(date.getHours()))
          .replace('mm', pad(date.getMinutes()))
          .replace('ss', pad(date.getSeconds()));
      default:
        return date.toISOString();
    }
  }, [customFormat]);

  // Create timestamp data object
  const createTimestampData = useCallback((timestamp: number): TimestampData => {
    const date = new Date(timestamp);
    return {
      unix: Math.floor(timestamp / 1000),
      unixMs: timestamp,
      iso: date.toISOString(),
      formatted: formatDate(date, outputFormat, selectedTimezone),
      relative: getRelativeTime(timestamp),
      timezone: selectedTimezone,
    };
  }, [formatDate, outputFormat, selectedTimezone, getRelativeTime]);

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(createTimestampData(Date.now()));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, [createTimestampData]);

  // Convert input to timestamp
  const convertInput = useCallback(() => {
    if (!inputValue.trim()) {
      setConvertedTime(null);
      return;
    }

    try {
      let timestamp: number;

      switch (inputType) {
        case 'unix':
          const unixInput = parseFloat(inputValue);
          // Handle both seconds and milliseconds
          timestamp = unixInput < 10000000000 ? unixInput * 1000 : unixInput;
          break;
        case 'iso':
          timestamp = new Date(inputValue).getTime();
          break;
        case 'human':
          timestamp = new Date(inputValue).getTime();
          break;
        default:
          timestamp = Date.now();
      }

      if (isNaN(timestamp)) {
        toast.error('Invalid date/timestamp format');
        return;
      }

      setConvertedTime(createTimestampData(timestamp));
    } catch (error) {
      toast.error('Error converting timestamp');
      setConvertedTime(null);
    }
  }, [inputValue, inputType, createTimestampData]);

  // Auto-convert when input changes
  useEffect(() => {
    convertInput();
  }, [convertInput]);

  // Process batch timestamps
  const processBatch = useCallback(() => {
    const lines = batchInput.split('\n').filter(line => line.trim());
    const results: TimestampData[] = [];

    lines.forEach((line) => {
      try {
        const trimmed = line.trim();
        let timestamp: number;

        // Auto-detect format
        if (/^\d+$/.test(trimmed)) {
          // Unix timestamp
          const unixInput = parseFloat(trimmed);
          timestamp = unixInput < 10000000000 ? unixInput * 1000 : unixInput;
        } else {
          // ISO or human readable
          timestamp = new Date(trimmed).getTime();
        }

        if (!isNaN(timestamp)) {
          results.push(createTimestampData(timestamp));
        }
      } catch (error) {
        // Skip invalid entries
      }
    });

    setBatchResults(results);
    toast.success(`Processed ${results.length} timestamps`);
  }, [batchInput, createTimestampData]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  }, []);

  const addTime = useCallback((amount: number, unit: 'seconds' | 'minutes' | 'hours' | 'days') => {
    if (!convertedTime) return;

    const multipliers = {
      seconds: 1000,
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };

    const newTimestamp = convertedTime.unixMs + (amount * multipliers[unit]);
    setConvertedTime(createTimestampData(newTimestamp));
  }, [convertedTime, createTimestampData]);

  const exportBatch = useCallback(() => {
    if (batchResults.length === 0) return;

    const csv = [
      'Unix,Unix (ms),ISO,Formatted,Relative,Timezone',
      ...batchResults.map(result => 
        `${result.unix},${result.unixMs},"${result.iso}","${result.formatted}","${result.relative}",${result.timezone}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timestamps.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Batch results exported to CSV');
  }, [batchResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-3">
          <Clock className="h-10 w-10 text-blue-600" />
          Timestamp Converter
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Convert between Unix timestamps, ISO dates, and human-readable formats. 
          Support for multiple timezones and batch processing.
        </p>
      </div>

      {/* Current Time Display */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Current Time
          </CardTitle>
          <CardDescription>
            Live timestamp in your selected timezone
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentTime && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unix Timestamp</div>
                <div className="font-mono text-lg font-semibold cursor-pointer" 
                     onClick={() => copyToClipboard(currentTime.unix.toString(), 'Unix timestamp')}>
                  {currentTime.unix}
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Milliseconds</div>
                <div className="font-mono text-lg font-semibold cursor-pointer"
                     onClick={() => copyToClipboard(currentTime.unixMs.toString(), 'Milliseconds')}>
                  {currentTime.unixMs}
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ISO Format</div>
                <div className="font-mono text-sm font-semibold cursor-pointer"
                     onClick={() => copyToClipboard(currentTime.iso, 'ISO timestamp')}>
                  {currentTime.iso}
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Formatted</div>
                <div className="font-mono text-sm font-semibold cursor-pointer"
                     onClick={() => copyToClipboard(currentTime.formatted, 'Formatted time')}>
                  {currentTime.formatted}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Tools */}
      <Tabs defaultValue="convert" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="batch">Batch Process</TabsTrigger>
          <TabsTrigger value="calculate">Calculate</TabsTrigger>
        </TabsList>

        {/* Convert Tab */}
        <TabsContent value="convert">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>
                  Enter timestamp or date to convert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Input Type</Label>
                  <Select value={inputType} onValueChange={(value: 'unix' | 'iso' | 'human') => setInputType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unix">Unix Timestamp</SelectItem>
                      <SelectItem value="iso">ISO Date</SelectItem>
                      <SelectItem value="human">Human Readable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      inputType === 'unix' ? '1640995200' :
                      inputType === 'iso' ? '2024-01-01T12:00:00Z' :
                      'January 1, 2024 12:00 PM'
                    }
                    className="font-mono"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Timezone</Label>
                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dateFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {outputFormat === 'custom' && (
                  <div>
                    <Label>Custom Format</Label>
                    <Input
                      value={customFormat}
                      onChange={(e) => setCustomFormat(e.target.value)}
                      placeholder="YYYY-MM-DD HH:mm:ss"
                      className="font-mono"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Use: YYYY (year), MM (month), DD (day), HH (hour), mm (minute), ss (second)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Converted Result</CardTitle>
                <CardDescription>
                  All formats and timezone conversions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {convertedTime ? (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Unix Timestamp</div>
                          <div className="font-mono font-semibold">{convertedTime.unix}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(convertedTime.unix.toString(), 'Unix timestamp')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Milliseconds</div>
                          <div className="font-mono font-semibold">{convertedTime.unixMs}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(convertedTime.unixMs.toString(), 'Milliseconds')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">ISO Format</div>
                          <div className="font-mono font-semibold text-sm">{convertedTime.iso}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(convertedTime.iso, 'ISO format')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Formatted ({selectedTimezone})</div>
                          <div className="font-mono font-semibold text-sm">{convertedTime.formatted}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(convertedTime.formatted, 'Formatted time')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-sm text-blue-600 dark:text-blue-400">Relative Time</div>
                        <div className="font-semibold text-blue-800 dark:text-blue-200">{convertedTime.relative}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Enter a timestamp or date to see conversions
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Batch Process Tab */}
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Batch Processing</span>
                {batchResults.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportBatch}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Process multiple timestamps at once (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Timestamps (one per line)</Label>
                <Textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder={`1640995200
2024-01-01T12:00:00Z
January 1, 2024
1641081600000`}
                  className="font-mono min-h-[150px]"
                />
              </div>

              <Button onClick={processBatch} disabled={!batchInput.trim()}>
                Process Batch
              </Button>

              {batchResults.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Results ({batchResults.length} items)</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {batchResults.map((result, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="grid md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Unix:</span> {result.unix}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">ISO:</span> {result.iso.split('T')[0]}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Formatted:</span> {result.formatted}
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Relative:</span> {result.relative}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculate Tab */}
        <TabsContent value="calculate">
          <Card>
            <CardHeader>
              <CardTitle>Date & Time Calculator</CardTitle>
              <CardDescription>
                Add or subtract time from your converted timestamp
              </CardDescription>
            </CardHeader>
            <CardContent>
              {convertedTime ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Base Time</div>
                    <div className="font-mono font-semibold">{convertedTime.formatted}</div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Seconds</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(-1, 'seconds')}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(1, 'seconds')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Minutes</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(-1, 'minutes')}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(1, 'minutes')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Hours</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(-1, 'hours')}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(1, 'hours')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Days</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(-1, 'days')}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTime(1, 'days')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quick Actions</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => addTime(1, 'hours')}>
                          +1 Hour
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addTime(1, 'days')}>
                          +1 Day
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addTime(7, 'days')}>
                          +1 Week
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addTime(30, 'days')}>
                          +1 Month
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Reset</Label>
                      <Button 
                        variant="outline" 
                        onClick={() => setInputValue(Date.now().toString())}
                        className="w-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset to Now
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Convert a timestamp first to use the calculator
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reference Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>
            Common timestamp formats and timezone information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Timestamp Formats</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Unix (seconds):</strong> 1640995200</div>
                <div><strong>Unix (milliseconds):</strong> 1640995200000</div>
                <div><strong>ISO 8601:</strong> 2024-01-01T12:00:00.000Z</div>
                <div><strong>RFC 2822:</strong> Mon, 01 Jan 2024 12:00:00 GMT</div>
                <div><strong>Human readable:</strong> January 1, 2024 12:00 PM</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Common Unix Timestamps</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Unix Epoch:</strong> 0 (Jan 1, 1970)</div>
                <div><strong>Y2K:</strong> 946684800 (Jan 1, 2000)</div>
                <div><strong>Current:</strong> {currentTime?.unix} (Now)</div>
                <div><strong>Year 2038:</strong> 2147483647 (Jan 19, 2038)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}