import { SupportedLanguage, FileValidationResult, CompressionStats } from './types';

/**
 * Validate uploaded file
 */
export function validateFile(file: File): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
  }
  
  if (file.size === 0) {
    throw new Error('File is empty');
  }
  
  return true;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Calculate compression savings
 */
export function calculateSavings(originalSize: number, minifiedSize: number): CompressionStats {
  const savings = originalSize - minifiedSize;
  const percentage = originalSize > 0 ? Math.round((savings / originalSize) * 100) : 0;
  
  return {
    originalSize,
    minifiedSize,
    savings,
    percentage
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get MIME type for language
 */
export function getMimeType(language: SupportedLanguage): string {
  const mimeTypes: Record<SupportedLanguage, string> = {
    html: 'text/html',
    css: 'text/css',
    javascript: 'application/javascript',
    typescript: 'application/typescript',
    json: 'application/json',
    xml: 'application/xml',
    php: 'application/x-php',
    python: 'text/x-python',
    java: 'text/x-java',
    c: 'text/x-c',
    cpp: 'text/x-c++',
    csharp: 'text/x-csharp',
    go: 'text/x-go',
    rust: 'text/x-rust',
    swift: 'text/x-swift',
    kotlin: 'text/x-kotlin',
    dart: 'text/x-dart',
    scala: 'text/x-scala',
    ruby: 'text/x-ruby',
    perl: 'text/x-perl',
    r: 'text/x-r',
    matlab: 'text/x-matlab',
    sql: 'text/x-sql',
    shell: 'text/x-sh',
    powershell: 'text/x-powershell'
  };
  
  return mimeTypes[language] || 'text/plain';
}

/**
 * Detect language from content (basic heuristics)
 */
export function detectLanguageFromContent(content: string): SupportedLanguage {
  const trimmed = content.trim();
  
  // HTML detection
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || /<\/html>/.test(content)) {
    return 'html';
  }
  
  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(content);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }
  
  // XML detection
  if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
    return 'xml';
  }
  
  // CSS detection (look for CSS-specific patterns)
  if (/[.#][a-zA-Z-_][a-zA-Z0-9-_]*\s*{/.test(content) || 
      /@(media|import|charset|keyframes)/.test(content)) {
    return 'css';
  }
  
  // JavaScript/TypeScript detection
  if (/\b(function|var|let|const|class|interface|type)\b/.test(content)) {
    if (/\b(interface|type|enum)\b/.test(content) || content.includes(': string') || content.includes(': number')) {
      return 'typescript';
    }
    return 'javascript';
  }
  
  // PHP detection
  if (content.includes('<?php') || content.includes('<?=')) {
    return 'php';
  }
  
  // Python detection
  if (/\b(def|import|from|class|if __name__)\b/.test(content) || /^[ \t]*def\s+/.test(content)) {
    return 'python';
  }
  
  // Default fallback
  return 'javascript';
}

/**
 * Generate filename for minified output
 */
export function generateMinifiedFilename(originalName: string): string {
  const lastDot = originalName.lastIndexOf('.');
  if (lastDot === -1) {
    return `${originalName}.min`;
  }
  
  const name = originalName.substring(0, lastDot);
  const extension = originalName.substring(lastDot);
  
  return `${name}.min${extension}`;
}

/**
 * Validate content for specific language
 */
export function validateContent(content: string, language: SupportedLanguage): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    switch (language) {
      case 'json':
        JSON.parse(content);
        break;
        
      case 'html':
        // Basic HTML validation - check for unclosed tags
        const openTags = content.match(/<[^/>]+>/g) || [];
        const closeTags = content.match(/<\/[^>]+>/g) || [];
        if (openTags.length > closeTags.length + 10) { // Allow some self-closing tags
          warnings.push('Possible unclosed HTML tags detected');
        }
        break;
        
      case 'css':
        // Basic CSS validation - check for unmatched braces
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          errors.push('Unmatched CSS braces detected');
        }
        break;
        
      case 'javascript':
      case 'typescript':
        // Basic JS/TS validation - check for common syntax issues
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
          warnings.push('Unmatched parentheses detected');
        }
        break;
    }
  } catch (error) {
    errors.push(`Syntax error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Estimate minification potential
 */
export function estimateMinificationPotential(content: string, language: SupportedLanguage): number {
  const totalSize = content.length;
  
  // Count whitespace
  const whitespace = (content.match(/\s/g) || []).length;
  
  // Count comments (basic estimation)
  const jsComments = (content.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).join('').length;
  const htmlComments = (content.match(/<!--[\s\S]*?-->/g) || []).join('').length;
  
  let removableBytes = whitespace * 0.8; // Not all whitespace can be removed
  
  switch (language) {
    case 'html':
      removableBytes += htmlComments;
      break;
    case 'css':
    case 'javascript':
    case 'typescript':
      removableBytes += jsComments;
      break;
  }
  
  const potentialSavings = Math.min(removableBytes / totalSize, 0.8); // Cap at 80%
  return Math.round(potentialSavings * 100);
}

/**
 * Create download blob
 */
export function createDownloadBlob(content: string, language: SupportedLanguage): Blob {
  const mimeType = getMimeType(language);
  return new Blob([content], { type: mimeType });
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, language: SupportedLanguage): void {
  const blob = createDownloadBlob(content, language);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

/**
 * Batch process files
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  onProgress?: (completed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const result = await processor(items[i]);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, items.length);
    }
  }
  
  return results;
}

/**
 * Debounce function for real-time minification
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}