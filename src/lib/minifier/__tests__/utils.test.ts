import {
  validateFile,
  getFileExtension,
  calculateSavings,
  formatFileSize,
  detectLanguageFromContent,
  generateMinifiedFilename,
  validateContent,
  estimateMinificationPotential
} from '../utils';

describe('Minifier Utilities', () => {
  
  describe('File Extension Detection', () => {
    test('should extract correct file extensions', () => {
      expect(getFileExtension('app.js')).toBe('js');
      expect(getFileExtension('style.css')).toBe('css');
      expect(getFileExtension('index.html')).toBe('html');
      expect(getFileExtension('config.json')).toBe('json');
      expect(getFileExtension('script.ts')).toBe('ts');
      expect(getFileExtension('component.tsx')).toBe('tsx');
    });

    test('should handle files without extensions', () => {
      expect(getFileExtension('README')).toBe('');
      expect(getFileExtension('Dockerfile')).toBe('');
    });

    test('should handle multiple dots in filename', () => {
      expect(getFileExtension('app.min.js')).toBe('js');
      expect(getFileExtension('style.component.css')).toBe('css');
    });
  });

  describe('File Size Formatting', () => {
    test('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1023)).toBe('1023 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1.0 MB');
      expect(formatFileSize(1073741824)).toBe('1.0 GB');
    });
  });

  describe('Compression Statistics', () => {
    test('should calculate savings correctly', () => {
      const stats = calculateSavings(1000, 600);
      
      expect(stats.originalSize).toBe(1000);
      expect(stats.minifiedSize).toBe(600);
      expect(stats.savings).toBe(400);
      expect(stats.percentage).toBe(40);
    });

    test('should handle zero original size', () => {
      const stats = calculateSavings(0, 0);
      
      expect(stats.percentage).toBe(0);
    });

    test('should handle negative compression (edge case)', () => {
      const stats = calculateSavings(100, 150);
      
      expect(stats.savings).toBe(-50);
      expect(stats.percentage).toBe(-50);
    });
  });

  describe('Language Detection from Content', () => {
    test('should detect HTML correctly', () => {
      const htmlContent = '<!DOCTYPE html><html><head><title>Test</title></head></html>';
      expect(detectLanguageFromContent(htmlContent)).toBe('html');
    });

    test('should detect JSON correctly', () => {
      const jsonContent = '{"name": "test", "version": "1.0.0"}';
      expect(detectLanguageFromContent(jsonContent)).toBe('json');
      
      const arrayContent = '[1, 2, 3, 4, 5]';
      expect(detectLanguageFromContent(arrayContent)).toBe('json');
    });

    test('should detect XML correctly', () => {
      const xmlContent = '<?xml version="1.0"?><root><item>test</item></root>';
      expect(detectLanguageFromContent(xmlContent)).toBe('xml');
    });

    test('should detect CSS correctly', () => {
      const cssContent = '.class { color: red; } #id { background: blue; }';
      expect(detectLanguageFromContent(cssContent)).toBe('css');
      
      const mediaQuery = '@media (max-width: 768px) { .mobile { display: block; } }';
      expect(detectLanguageFromContent(mediaQuery)).toBe('css');
    });

    test('should detect JavaScript correctly', () => {
      const jsContent = 'function test() { var x = 5; return x; }';
      expect(detectLanguageFromContent(jsContent)).toBe('javascript');
      
      const es6Content = 'const arrow = () => { let x = 5; }';
      expect(detectLanguageFromContent(es6Content)).toBe('javascript');
    });

    test('should detect TypeScript correctly', () => {
      const tsContent = 'interface User { name: string; age: number; }';
      expect(detectLanguageFromContent(tsContent)).toBe('typescript');
      
      const typeContent = 'type Status = "pending" | "complete";';
      expect(detectLanguageFromContent(typeContent)).toBe('typescript');
    });

    test('should detect PHP correctly', () => {
      const phpContent = '<?php echo "Hello World"; ?>';
      expect(detectLanguageFromContent(phpContent)).toBe('php');
    });

    test('should detect Python correctly', () => {
      const pythonContent = 'def hello_world():\n    print("Hello, World!")';
      expect(detectLanguageFromContent(pythonContent)).toBe('python');
      
      const importContent = 'import os\nfrom datetime import datetime';
      expect(detectLanguageFromContent(importContent)).toBe('python');
    });

    test('should default to JavaScript for unknown content', () => {
      const unknownContent = 'some random text without clear language indicators';
      expect(detectLanguageFromContent(unknownContent)).toBe('javascript');
    });
  });

  describe('Minified Filename Generation', () => {
    test('should generate correct minified filenames', () => {
      expect(generateMinifiedFilename('app.js')).toBe('app.min.js');
      expect(generateMinifiedFilename('style.css')).toBe('style.min.css');
      expect(generateMinifiedFilename('index.html')).toBe('index.min.html');
    });

    test('should handle files without extensions', () => {
      expect(generateMinifiedFilename('README')).toBe('README.min');
    });

    test('should handle complex filenames', () => {
      expect(generateMinifiedFilename('my-component.test.js')).toBe('my-component.test.min.js');
    });
  });

  describe('Content Validation', () => {
    test('should validate JSON content', () => {
      const validJson = '{"name": "test"}';
      const result = validateContent(validJson, 'json');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch JSON syntax errors', () => {
      const invalidJson = '{"name": test}'; // Missing quotes
      const result = validateContent(invalidJson, 'json');
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should validate HTML content', () => {
      const validHtml = '<div><p>Test</p></div>';
      const result = validateContent(validHtml, 'html');
      
      expect(result.valid).toBe(true);
    });

    test('should warn about unclosed HTML tags', () => {
      const unclosedHtml = '<div><p>Test</p><span><img><input>';
      const result = validateContent(unclosedHtml, 'html');
      
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should validate CSS content', () => {
      const validCss = '.class { color: red; }';
      const result = validateContent(validCss, 'css');
      
      expect(result.valid).toBe(true);
    });

    test('should catch CSS brace mismatches', () => {
      const invalidCss = '.class { color: red; .nested { background: blue; }';
      const result = validateContent(invalidCss, 'css');
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should validate JavaScript content', () => {
      const validJs = 'function test() { return true; }';
      const result = validateContent(validJs, 'javascript');
      
      expect(result.valid).toBe(true);
    });

    test('should warn about unmatched parentheses in JavaScript', () => {
      const unmatchedJs = 'function test() { console.log("test"); }';
      const result = validateContent(unmatchedJs, 'javascript');
      
      // This should pass as parentheses are matched
      expect(result.valid).toBe(true);
      
      const reallyUnmatched = 'function test( { console.log("test"); }';
      const result2 = validateContent(reallyUnmatched, 'javascript');
      
      expect(result2.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Minification Potential Estimation', () => {
    test('should estimate JavaScript minification potential', () => {
      const verboseJs = `
        // This is a comment
        function calculateSum(a, b) {
          console.log('Calculating sum');
          return a + b;
        }
        
        /* Another comment */
        const result = calculateSum(5, 10);
      `;
      
      const potential = estimateMinificationPotential(verboseJs, 'javascript');
      
      expect(potential).toBeGreaterThan(0);
      expect(potential).toBeLessThanOrEqual(100);
    });

    test('should estimate HTML minification potential', () => {
      const verboseHtml = `
        <!DOCTYPE html>
        <html>
          <!-- Comment -->
          <head>
            <title>Test</title>
          </head>
          <body>
            <div class="container">
              <h1>Hello World</h1>
            </div>
          </body>
        </html>
      `;
      
      const potential = estimateMinificationPotential(verboseHtml, 'html');
      
      expect(potential).toBeGreaterThan(0);
      expect(potential).toBeLessThanOrEqual(100);
    });

    test('should estimate CSS minification potential', () => {
      const verboseCss = `
        /* Main styles */
        body {
          margin: 0;
          padding: 10px;
          background-color: #ffffff;
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
        }
      `;
      
      const potential = estimateMinificationPotential(verboseCss, 'css');
      
      expect(potential).toBeGreaterThan(0);
      expect(potential).toBeLessThanOrEqual(100);
    });

    test('should handle already minified content', () => {
      const minifiedJs = 'function test(){return!0}';
      const potential = estimateMinificationPotential(minifiedJs, 'javascript');
      
      expect(potential).toBeLessThan(20); // Should be low for already minified content
    });
  });

  describe('File Validation', () => {
    test('should validate file size', () => {
      const smallFile = new File(['test content'], 'test.js', { type: 'application/javascript' });
      
      expect(() => validateFile(smallFile, 'javascript')).not.toThrow();
    });

    test('should reject oversized files', () => {
      // Create a mock file that's too large
      const largeContent = 'a'.repeat(11 * 1024 * 1024); // 11MB
      const largeFile = new File([largeContent], 'large.js', { type: 'application/javascript' });
      
      expect(() => validateFile(largeFile, 'javascript')).toThrow('File too large');
    });

    test('should reject empty files', () => {
      const emptyFile = new File([''], 'empty.js', { type: 'application/javascript' });
      
      expect(() => validateFile(emptyFile, 'javascript')).toThrow('File is empty');
    });
  });
});