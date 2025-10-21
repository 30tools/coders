import { MinificationOptions, MinificationResult } from './types';

/**
 * Minify HTML content
 */
export async function minifyHTML(content: string, options: MinificationOptions = {}): Promise<MinificationResult> {
  const originalSize = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    let minified = content;

    // Remove HTML comments
    if (options.removeComments !== false) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove unnecessary whitespace
    if (options.removeWhitespace !== false) {
      minified = minified
        .replace(/>\s+</g, '><') // Between tags
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .replace(/\s*=\s*/g, '=') // Around equals in attributes
        .replace(/;\s*}/g, ';}') // CSS in style tags
        .trim();
    }

    // Remove empty lines
    if (options.removeEmptyLines !== false) {
      minified = minified.replace(/^\s*\n/gm, '');
    }

    // Aggressive minification
    if (options.level === 'aggressive') {
      minified = minified
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/:\s*/g, ':')
        .replace(/,\s*/g, ',');
    }

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
    errors.push(`HTML minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      minified: content,
      originalSize,
      minifiedSize: originalSize,
      compressionRatio: 1,
      errors,
      warnings
    };
  }
}

/**
 * Minify CSS content
 */
export async function minifyCSS(content: string, options: MinificationOptions = {}): Promise<MinificationResult> {
  const originalSize = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    let minified = content;

    // Remove CSS comments
    if (options.removeComments !== false) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove unnecessary whitespace
    if (options.removeWhitespace !== false) {
      minified = minified
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Remove empty lines
    if (options.removeEmptyLines !== false) {
      minified = minified.replace(/^\s*\n/gm, '');
    }

    // Aggressive optimizations
    if (options.level === 'aggressive') {
      minified = minified
        .replace(/0\.(\d+)/g, '.$1') // 0.5 -> .5
        .replace(/:0px/g, ':0') // Remove px from 0 values
        .replace(/:0em/g, ':0')
        .replace(/:0%/g, ':0')
        .replace(/background-position:0 0/g, 'background-position:0')
        .replace(/font-weight:normal/g, 'font-weight:400')
        .replace(/font-weight:bold/g, 'font-weight:700');
    }

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
    errors.push(`CSS minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      minified: content,
      originalSize,
      minifiedSize: originalSize,
      compressionRatio: 1,
      errors,
      warnings
    };
  }
}

/**
 * Minify JavaScript/TypeScript content
 */
export async function minifyJS(content: string, options: MinificationOptions = {}): Promise<MinificationResult> {
  const originalSize = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    let minified = content;

    // Remove single line comments
    if (options.removeComments !== false) {
      minified = minified.replace(/\/\/.*$/gm, '');
    }

    // Remove multi-line comments
    if (options.removeComments !== false) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove console.log statements
    if (options.removeConsoleLog) {
      minified = minified.replace(/console\.log\([^)]*\);?/g, '');
      minified = minified.replace(/console\.(warn|error|info|debug)\([^)]*\);?/g, '');
    }

    // Remove debugger statements
    if (options.removeDebugger !== false) {
      minified = minified.replace(/debugger;?/g, '');
    }

    // Remove unnecessary whitespace
    if (options.removeWhitespace !== false) {
      minified = minified
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*\[\s*/g, '[')
        .replace(/\s*\]\s*/g, ']')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Remove empty lines
    if (options.removeEmptyLines !== false) {
      minified = minified.replace(/^\s*\n/gm, '');
    }

    // Aggressive optimizations
    if (options.level === 'aggressive') {
      // Simple variable name shortening (be careful with this)
      if (options.mangleVariables) {
        warnings.push('Variable mangling is experimental and may break code');
        // This is a very basic implementation - real minifiers use AST parsing
        const vars = new Map();
        let counter = 0;
        const generateVarName = () => {
          const chars = 'abcdefghijklmnopqrstuvwxyz';
          let name = '';
          let n = counter++;
          do {
            name = chars[n % 26] + name;
            n = Math.floor(n / 26);
          } while (n > 0);
          return name;
        };

        // Very basic variable replacement (this is just for demo - real implementation needs AST)
        minified = minified.replace(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (match, keyword, varName) => {
          if (!vars.has(varName)) {
            vars.set(varName, generateVarName());
          }
          return keyword + ' ' + vars.get(varName);
        });
      }

      // Remove unnecessary semicolons
      minified = minified.replace(/;}/g, '}');
    }

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
    errors.push(`JavaScript minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      minified: content,
      originalSize,
      minifiedSize: originalSize,
      compressionRatio: 1,
      errors,
      warnings
    };
  }
}

/**
 * Minify JSON content
 */
export async function minifyJSON(content: string): Promise<MinificationResult> {
  const originalSize = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Parse and stringify to remove all unnecessary whitespace
    const parsed = JSON.parse(content);
    const minified = JSON.stringify(parsed);

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
    errors.push(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      minified: content,
      originalSize,
      minifiedSize: originalSize,
      compressionRatio: 1,
      errors,
      warnings
    };
  }
}

/**
 * Minify XML content
 */
export async function minifyXML(content: string, options: MinificationOptions = {}): Promise<MinificationResult> {
  const originalSize = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    let minified = content;

    // Remove XML comments
    if (options.removeComments !== false) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove unnecessary whitespace
    if (options.removeWhitespace !== false) {
      minified = minified
        .replace(/>\s+</g, '><') // Between tags
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .replace(/\s*=\s*/g, '=') // Around equals in attributes
        .trim();
    }

    // Remove empty lines
    if (options.removeEmptyLines !== false) {
      minified = minified.replace(/^\s*\n/gm, '');
    }

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
    errors.push(`XML minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      minified: content,
      originalSize,
      minifiedSize: originalSize,
      compressionRatio: 1,
      errors,
      warnings
    };
  }
}

/**
 * Generic minifier for other languages (basic whitespace removal)
 */
export async function minifyGeneric(content: string, options: MinificationOptions = {}): Promise<MinificationResult> {
  const originalSize = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    let minified = content;

    // Basic comment removal (works for most C-style languages)
    if (options.removeComments !== false) {
      minified = minified.replace(/\/\/.*$/gm, ''); // Single line
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line
    }

    // Remove unnecessary whitespace
    if (options.removeWhitespace !== false) {
      minified = minified
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Remove empty lines
    if (options.removeEmptyLines !== false) {
      minified = minified.replace(/^\s*\n/gm, '');
    }

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
    errors.push(`Generic minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      minified: content,
      originalSize,
      minifiedSize: originalSize,
      compressionRatio: 1,
      errors,
      warnings
    };
  }
}