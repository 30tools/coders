import { minifyHTML, minifyCSS, minifyJS, minifyJSON, minifyXML } from '../core';
import { MinificationOptions } from '../types';

describe('Core Minification Functions', () => {
  
  describe('HTML Minification', () => {
    const htmlSample = `
      <!DOCTYPE html>
      <html>
        <head>
          <!-- This is a comment -->
          <title>Test Page</title>
          <style>
            body {
              margin: 0;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hello World</h1>
            <p>This is a test paragraph.</p>
          </div>
        </body>
      </html>
    `;

    test('should remove comments and whitespace by default', async () => {
      const result = await minifyHTML(htmlSample);
      
      expect(result.minified).not.toContain('<!-- This is a comment -->');
      expect(result.minified).not.toMatch(/>\s+</);
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
      expect(result.compressionRatio).toBeGreaterThan(1);
      expect(result.errors).toHaveLength(0);
    });

    test('should preserve comments when configured', async () => {
      const options: MinificationOptions = { removeComments: false };
      const result = await minifyHTML(htmlSample, options);
      
      expect(result.minified).toContain('<!-- This is a comment -->');
    });

    test('should handle empty input', async () => {
      const result = await minifyHTML('');
      
      expect(result.minified).toBe('');
      expect(result.originalSize).toBe(0);
      expect(result.minifiedSize).toBe(0);
      expect(result.compressionRatio).toBe(1);
    });

    test('should handle malformed HTML gracefully', async () => {
      const malformedHTML = '<div><p>Unclosed tags<span>';
      const result = await minifyHTML(malformedHTML);
      
      expect(result.errors).toHaveLength(0); // Should not throw errors
      expect(result.minified.length).toBeGreaterThan(0);
    });
  });

  describe('CSS Minification', () => {
    const cssSample = `
      /* Main styles */
      body {
        margin: 0px;
        padding: 10px;
        background-color: #ffffff;
        font-family: Arial, sans-serif;
      }
      
      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .container {
          padding: 0.5rem;
        }
      }
    `;

    test('should minify CSS effectively', async () => {
      const result = await minifyCSS(cssSample);
      
      expect(result.minified).not.toContain('/* Main styles */');
      expect(result.minified).not.toMatch(/\s*{\s*/);
      expect(result.minified).not.toMatch(/\s*}\s*/);
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
      expect(result.compressionRatio).toBeGreaterThan(1);
    });

    test('should apply aggressive optimizations', async () => {
      const cssWithZeros = 'div { margin: 0px; padding: 0em; width: 0%; }';
      const options: MinificationOptions = { level: 'aggressive' };
      const result = await minifyCSS(cssWithZeros, options);
      
      expect(result.minified).toContain(':0');
      expect(result.minified).not.toContain('0px');
      expect(result.minified).not.toContain('0em');
      expect(result.minified).not.toContain('0%');
    });

    test('should handle CSS syntax errors gracefully', async () => {
      const invalidCSS = 'body { color: #invalid-color; }';
      const result = await minifyCSS(invalidCSS);
      
      expect(result.errors).toHaveLength(0); // Basic minifier should not validate CSS
      expect(result.minified.length).toBeGreaterThan(0);
    });
  });

  describe('JavaScript Minification', () => {
    const jsSample = `
      // This is a comment
      function calculateSum(a, b) {
        console.log('Calculating sum');
        debugger;
        return a + b;
      }
      
      /* Multi-line comment
         with multiple lines */
      const result = calculateSum(5, 10);
      console.log('Result:', result);
    `;

    test('should minify JavaScript code', async () => {
      const result = await minifyJS(jsSample);
      
      expect(result.minified).not.toContain('// This is a comment');
      expect(result.minified).not.toContain('/* Multi-line comment');
      expect(result.minified).not.toContain('debugger');
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
    });

    test('should remove console.log when configured', async () => {
      const options: MinificationOptions = { removeConsoleLog: true };
      const result = await minifyJS(jsSample, options);
      
      expect(result.minified).not.toContain('console.log');
    });

    test('should preserve console.log when configured', async () => {
      const options: MinificationOptions = { removeConsoleLog: false };
      const result = await minifyJS(jsSample, options);
      
      expect(result.minified).toContain('console.log');
    });

    test('should handle ES6+ syntax', async () => {
      const es6Code = `
        const arrow = (x) => x * 2;
        const [first, ...rest] = [1, 2, 3, 4];
        const obj = { prop: 'value', method() { return this.prop; } };
      `;
      
      const result = await minifyJS(es6Code);
      
      expect(result.errors).toHaveLength(0);
      expect(result.minified).toContain('=>');
      expect(result.minified).toContain('...');
    });
  });

  describe('JSON Minification', () => {
    const jsonSample = `
      {
        "name": "Test Project",
        "version": "1.0.0",
        "scripts": {
          "start": "node index.js",
          "test": "jest"
        },
        "dependencies": {
          "express": "^4.18.0",
          "lodash": "^4.17.21"
        }
      }
    `;

    test('should minify valid JSON', async () => {
      const result = await minifyJSON(jsonSample);
      
      expect(result.minified).not.toMatch(/\s+/);
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
      expect(result.errors).toHaveLength(0);
      
      // Should be valid JSON
      expect(() => JSON.parse(result.minified)).not.toThrow();
    });

    test('should handle invalid JSON', async () => {
      const invalidJson = '{ "name": "test", invalid: true }';
      const result = await minifyJSON(invalidJson);
      
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.minified).toBe(invalidJson); // Should return original on error
    });

    test('should preserve JSON structure', async () => {
      const result = await minifyJSON(jsonSample);
      const parsed = JSON.parse(result.minified);
      const original = JSON.parse(jsonSample);
      
      expect(parsed).toEqual(original);
    });
  });

  describe('XML Minification', () => {
    const xmlSample = `
      <?xml version="1.0" encoding="UTF-8"?>
      <!-- This is an XML comment -->
      <root>
        <item id="1">
          <name>Test Item</name>
          <description>This is a test item</description>
        </item>
        <item id="2">
          <name>Another Item</name>
          <description>This is another test item</description>
        </item>
      </root>
    `;

    test('should minify XML effectively', async () => {
      const result = await minifyXML(xmlSample);
      
      expect(result.minified).not.toContain('<!-- This is an XML comment -->');
      expect(result.minified).not.toMatch(/>\s+</);
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
      expect(result.errors).toHaveLength(0);
    });

    test('should preserve XML structure', async () => {
      const result = await minifyXML(xmlSample);
      
      expect(result.minified).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result.minified).toContain('<root>');
      expect(result.minified).toContain('</root>');
    });
  });

  describe('Error Handling', () => {
    test('should handle extremely large inputs', async () => {
      const largeInput = 'a'.repeat(1000000); // 1MB of 'a'
      const result = await minifyJS(largeInput);
      
      expect(result.errors).toHaveLength(0);
      expect(result.minified.length).toBeGreaterThan(0);
    });

    test('should handle special characters', async () => {
      const specialChars = '𝕌𝕟𝕚𝕔𝕠𝕕𝕖 /* comment */ 中文 🚀';
      const result = await minifyJS(specialChars);
      
      expect(result.minified).toContain('𝕌𝕟𝕚𝕔𝕠𝕕𝕖');
      expect(result.minified).toContain('中文');
      expect(result.minified).toContain('🚀');
      expect(result.minified).not.toContain('/* comment */');
    });
  });

  describe('Performance', () => {
    test('should process medium files quickly', async () => {
      const mediumFile = `
        function test() {
          // This is repeated many times
          ${Array.from({ length: 1000 }, (_, i) => `console.log("Line ${i}");`).join('\n')}
        }
      `;
      
      const startTime = performance.now();
      const result = await minifyJS(mediumFile);
      const endTime = performance.now();
      
      const processingTime = endTime - startTime;
      
      expect(result.errors).toHaveLength(0);
      expect(processingTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});