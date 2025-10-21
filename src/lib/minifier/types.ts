export type SupportedLanguage = 
  | 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'xml' 
  | 'php' | 'python' | 'java' | 'c' | 'cpp' | 'csharp' | 'go' 
  | 'rust' | 'swift' | 'kotlin' | 'dart' | 'scala' | 'ruby' 
  | 'perl' | 'r' | 'matlab' | 'sql' | 'shell' | 'powershell';

export type MinificationLevel = 'light' | 'moderate' | 'aggressive';

export interface MinificationOptions {
  level?: MinificationLevel;
  removeComments?: boolean;
  removeWhitespace?: boolean;
  removeEmptyLines?: boolean;
  preserveLineBreaks?: boolean;
  mangleVariables?: boolean;
  removeConsoleLog?: boolean;
  removeDebugger?: boolean;
}

export interface MinificationResult {
  minified: string;
  originalSize: number;
  minifiedSize: number;
  compressionRatio: number;
  errors: string[];
  warnings: string[];
}

export interface MinificationError {
  line?: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CompressionStats {
  originalSize: number;
  minifiedSize: number;
  savings: number;
  percentage: number;
}