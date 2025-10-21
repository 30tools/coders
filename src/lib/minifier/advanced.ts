import { MinificationOptions, MinificationResult, SupportedLanguage } from './types';

/**
 * Advanced JavaScript minifier using external libraries via CDN
 */
export class AdvancedJSMinifier {
  private static terserLoaded = false;
  
  static async loadTerser(): Promise<void> {
    if (this.terserLoaded) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/terser@5.19.4/dist/bundle.min.js';
      script.onload = () => {
        this.terserLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Terser'));
      document.head.appendChild(script);
    });
  }
  
  static async minify(code: string, options: MinificationOptions = {}): Promise<MinificationResult> {
    const originalSize = code.length;
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      await this.loadTerser();
      
      // @ts-expect-error - Terser is loaded dynamically
      const result = await Terser.minify(code, {
        compress: {
          drop_console: options.removeConsoleLog,
          drop_debugger: options.removeDebugger,
          passes: options.level === 'aggressive' ? 3 : 1,
        },
        mangle: options.mangleVariables && options.level === 'aggressive',
        format: {
          comments: !options.removeComments,
        }
      });
      
      if (result.error) {
        throw new Error(result.error.toString());
      }
      
      const minified = result.code || code;
      const minifiedSize = minified.length;
      const compressionRatio = originalSize > 0 ? originalSize / minifiedSize : 1;
      
      if (result.warnings) {
        warnings.push(...result.warnings);
      }
      
      return {
        minified,
        originalSize,
        minifiedSize,
        compressionRatio,
        errors,
        warnings
      };
    } catch (error) {
      errors.push(`Advanced JS minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Fallback to basic minification
      return this.basicMinify(code, options);
    }
  }
  
  private static async basicMinify(code: string, options: MinificationOptions): Promise<MinificationResult> {
    const { minifyJS } = await import('./core');
    return minifyJS(code, options);
  }
}

/**
 * Advanced CSS minifier using CleanCSS via CDN
 */
export class AdvancedCSSMinifier {
  private static cleanCSSLoaded = false;
  
  static async loadCleanCSS(): Promise<void> {
    if (this.cleanCSSLoaded) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/clean-css@5.3.2/dist/clean-css.min.js';
      script.onload = () => {
        this.cleanCSSLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load CleanCSS'));
      document.head.appendChild(script);
    });
  }
  
  static async minify(css: string, options: MinificationOptions = {}): Promise<MinificationResult> {
    const originalSize = css.length;
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      await this.loadCleanCSS();
      
      // @ts-expect-error - CleanCSS is loaded dynamically
      const cleanCSS = new CleanCSS({
        level: options.level === 'aggressive' ? 2 : 1,
        format: options.preserveLineBreaks ? 'beautify' : false,
        inline: options.level === 'aggressive' ? ['all'] : false,
      });
      
      const result = cleanCSS.minify(css);
      
      if (result.errors.length > 0) {
        errors.push(...result.errors);
      }
      
      if (result.warnings.length > 0) {
        warnings.push(...result.warnings);
      }
      
      const minified = result.styles || css;
      const minifiedSize = minified.length;
      const compressionRatio = originalSize > 0 ? originalSize / minifiedSize : 1;
      
      return {
        minified,
        originalSize,
        minifiedSize,
        compressionRatio,
        errors,
        warnings
      };
    } catch (error) {
      errors.push(`Advanced CSS minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Fallback to basic minification
      return this.basicMinify(css, options);
    }
  }
  
  private static async basicMinify(css: string, options: MinificationOptions): Promise<MinificationResult> {
    const { minifyCSS } = await import('./core');
    return minifyCSS(css, options);
  }
}

/**
 * Advanced HTML minifier using html-minifier via CDN
 */
export class AdvancedHTMLMinifier {
  private static htmlMinifierLoaded = false;
  
  static async loadHTMLMinifier(): Promise<void> {
    if (this.htmlMinifierLoaded) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html-minifier-terser@7.2.0/dist/htmlminifier.min.js';
      script.onload = () => {
        this.htmlMinifierLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load HTML Minifier'));
      document.head.appendChild(script);
    });
  }
  
  static async minify(html: string, options: MinificationOptions = {}): Promise<MinificationResult> {
    const originalSize = html.length;
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      await this.loadHTMLMinifier();
      
      // @ts-expect-error - HTMLMinifier is loaded dynamically
      const minified = HTMLMinifier.minify(html, {
        collapseWhitespace: options.removeWhitespace !== false,
        removeComments: options.removeComments !== false,
        removeEmptyElements: options.level === 'aggressive',
        removeRedundantAttributes: options.level !== 'light',
        removeStyleLinkTypeAttributes: options.level === 'aggressive',
        removeScriptTypeAttributes: options.level === 'aggressive',
        minifyCSS: options.level !== 'light',
        minifyJS: options.level !== 'light',
        processConditionalComments: options.level === 'aggressive',
        sortAttributes: options.level === 'aggressive',
        sortClassName: options.level === 'aggressive',
      });
      
      const minifiedSize = minified.length;
      const compressionRatio = originalSize > 0 ? originalSize / minifiedSize : 1;
      
      return {
        minified,
        originalSize,
        minifiedSize,
        compressionRatio,
        errors,
        warnings
      };
    } catch (error) {
      errors.push(`Advanced HTML minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Fallback to basic minification
      return this.basicMinify(html, options);
    }
  }
  
  private static async basicMinify(html: string, options: MinificationOptions): Promise<MinificationResult> {
    const { minifyHTML } = await import('./core');
    return minifyHTML(html, options);
  }
}

/**
 * Web Worker for background minification
 */
export class MinificationWorker {
  private worker: Worker | null = null;
  
  constructor() {
    if (typeof Worker !== 'undefined') {
      this.initWorker();
    }
  }
  
  private initWorker() {
    const workerCode = `
      // Web Worker code for background minification
      self.onmessage = async function(e) {
        const { id, code, language, options } = e.data;
        
        try {
          let result;
          
          // Import minification functions (this would need to be adapted for web worker context)
          switch (language) {
            case 'javascript':
            case 'typescript':
              // Basic JS minification in worker
              result = await minifyJSBasic(code, options);
              break;
            case 'css':
              result = await minifyCSSBasic(code, options);
              break;
            case 'html':
              result = await minifyHTMLBasic(code, options);
              break;
            default:
              result = await minifyGenericBasic(code, options);
          }
          
          self.postMessage({ id, success: true, result });
        } catch (error) {
          self.postMessage({ 
            id, 
            success: false, 
            error: error.message 
          });
        }
      };
      
      // Basic minification functions for web worker
      async function minifyJSBasic(code, options) {
        let minified = code;
        
        if (options.removeComments) {
          minified = minified.replace(/\\/\\/.*$/gm, '');
          minified = minified.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
        }
        
        if (options.removeWhitespace) {
          minified = minified.replace(/\\s+/g, ' ').trim();
        }
        
        return {
          minified,
          originalSize: code.length,
          minifiedSize: minified.length,
          compressionRatio: code.length / minified.length,
          errors: [],
          warnings: []
        };
      }
      
      async function minifyCSSBasic(code, options) {
        let minified = code;
        
        if (options.removeComments) {
          minified = minified.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
        }
        
        if (options.removeWhitespace) {
          minified = minified
            .replace(/\\s*{\\s*/g, '{')
            .replace(/\\s*}\\s*/g, '}')
            .replace(/\\s*;\\s*/g, ';')
            .replace(/\\s*:\\s*/g, ':')
            .replace(/\\s+/g, ' ')
            .trim();
        }
        
        return {
          minified,
          originalSize: code.length,
          minifiedSize: minified.length,
          compressionRatio: code.length / minified.length,
          errors: [],
          warnings: []
        };
      }
      
      async function minifyHTMLBasic(code, options) {
        let minified = code;
        
        if (options.removeComments) {
          minified = minified.replace(/<!--[\\s\\S]*?-->/g, '');
        }
        
        if (options.removeWhitespace) {
          minified = minified
            .replace(/>\\s+</g, '><')
            .replace(/\\s+/g, ' ')
            .trim();
        }
        
        return {
          minified,
          originalSize: code.length,
          minifiedSize: minified.length,
          compressionRatio: code.length / minified.length,
          errors: [],
          warnings: []
        };
      }
      
      async function minifyGenericBasic(code, options) {
        let minified = code;
        
        if (options.removeComments) {
          minified = minified.replace(/\\/\\/.*$/gm, '');
        }
        
        if (options.removeWhitespace) {
          minified = minified.replace(/\\s+/g, ' ').trim();
        }
        
        return {
          minified,
          originalSize: code.length,
          minifiedSize: minified.length,
          compressionRatio: code.length / minified.length,
          errors: [],
          warnings: []
        };
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
  }
  
  async minify(
    code: string, 
    language: SupportedLanguage, 
    options: MinificationOptions = {}
  ): Promise<MinificationResult> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web Worker not supported'));
        return;
      }
      
      const id = Math.random().toString(36).substr(2, 9);
      
      const timeout = setTimeout(() => {
        reject(new Error('Minification timeout'));
      }, 30000); // 30 second timeout
      
      const messageHandler = (e: MessageEvent) => {
        if (e.data.id === id) {
          clearTimeout(timeout);
          this.worker!.removeEventListener('message', messageHandler);
          
          if (e.data.success) {
            resolve(e.data.result);
          } else {
            reject(new Error(e.data.error));
          }
        }
      };
      
      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({ id, code, language, options });
    });
  }
  
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

/**
 * Performance monitoring for minification
 */
export class MinificationProfiler {
  private metrics: Map<string, { startTime: number; endTime?: number; size: number }> = new Map();
  
  start(id: string, size: number) {
    this.metrics.set(id, {
      startTime: performance.now(),
      size
    });
  }
  
  end(id: string): { duration: number; throughput: number } | null {
    const metric = this.metrics.get(id);
    if (!metric) return null;
    
    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    const throughput = metric.size / duration; // bytes per ms
    
    metric.endTime = endTime;
    
    return { duration, throughput };
  }
  
  getReport(): Array<{ id: string; duration: number; size: number; throughput: number }> {
    return Array.from(this.metrics.entries())
      .filter(([, metric]) => metric.endTime)
      .map(([id, metric]) => ({
        id,
        duration: metric.endTime! - metric.startTime,
        size: metric.size,
        throughput: metric.size / (metric.endTime! - metric.startTime)
      }));
  }
  
  clear() {
    this.metrics.clear();
  }
}