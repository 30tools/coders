import { MinificationOptions, SupportedLanguage } from './types';

export interface CLIConfig {
  input: string;
  output?: string;
  language?: SupportedLanguage;
  level?: 'light' | 'moderate' | 'aggressive';
  recursive?: boolean;
  watch?: boolean;
  options?: MinificationOptions;
}

/**
 * Generate CLI command string
 */
export function generateCLICommand(config: CLIConfig): string {
  const parts = ['npx @coders/minifier-cli'];
  
  // Input
  parts.push(`--input "${config.input}"`);
  
  // Output
  if (config.output) {
    parts.push(`--output "${config.output}"`);
  }
  
  // Language
  if (config.language) {
    parts.push(`--language ${config.language}`);
  }
  
  // Level
  if (config.level && config.level !== 'moderate') {
    parts.push(`--level ${config.level}`);
  }
  
  // Recursive
  if (config.recursive) {
    parts.push('--recursive');
  }
  
  // Watch mode
  if (config.watch) {
    parts.push('--watch');
  }
  
  // Options
  if (config.options) {
    if (config.options.removeComments === false) {
      parts.push('--keep-comments');
    }
    if (config.options.removeWhitespace === false) {
      parts.push('--keep-whitespace');
    }
    if (config.options.mangleVariables) {
      parts.push('--mangle-variables');
    }
    if (config.options.removeConsoleLog) {
      parts.push('--remove-console');
    }
    if (config.options.removeDebugger === false) {
      parts.push('--keep-debugger');
    }
    if (config.options.preserveLineBreaks) {
      parts.push('--preserve-linebreaks');
    }
  }
  
  return parts.join(' ');
}

/**
 * Generate batch processing script
 */
export function generateBatchScript(files: string[], options: CLIConfig): string {
  const commands = files.map(file => {
    const outputFile = options.output 
      ? options.output 
      : file.replace(/(\.[^.]+)$/, '.min$1');
    
    return generateCLICommand({
      ...options,
      input: file,
      output: outputFile
    });
  });
  
  return commands.join('\n');
}

/**
 * Generate package.json scripts
 */
export function generateNpmScripts(config: CLIConfig): Record<string, string> {
  return {
    'minify': generateCLICommand(config),
    'minify:watch': generateCLICommand({ ...config, watch: true }),
    'minify:aggressive': generateCLICommand({ ...config, level: 'aggressive' }),
    'minify:light': generateCLICommand({ ...config, level: 'light' })
  };
}

/**
 * Generate Makefile
 */
export function generateMakefile(config: CLIConfig): string {
  const baseCommand = generateCLICommand(config);
  
  return `# Minifier Makefile
.PHONY: minify minify-watch minify-aggressive minify-light clean

minify:
\t${baseCommand}

minify-watch:
\t${generateCLICommand({ ...config, watch: true })}

minify-aggressive:
\t${generateCLICommand({ ...config, level: 'aggressive' })}

minify-light:
\t${generateCLICommand({ ...config, level: 'light' })}

clean:
\tfind . -name "*.min.*" -delete
`;
}

/**
 * Generate Gulp task
 */
export function generateGulpTask(config: CLIConfig): string {
  return `const { src, dest, watch, series } = require('gulp');
const minifier = require('@coders/minifier-cli');

function minifyTask() {
  return src('${config.input}')
    .pipe(minifier({
      level: '${config.level || 'moderate'}',
      removeComments: ${config.options?.removeComments !== false},
      removeWhitespace: ${config.options?.removeWhitespace !== false},
      mangleVariables: ${config.options?.mangleVariables || false},
      removeConsoleLog: ${config.options?.removeConsoleLog || false},
      removeDebugger: ${config.options?.removeDebugger !== false}
    }))
    .pipe(dest('${config.output || 'dist'}'));
}

function watchTask() {
  watch('${config.input}', minifyTask);
}

exports.minify = minifyTask;
exports.watch = series(minifyTask, watchTask);
exports.default = minifyTask;
`;
}

/**
 * Generate Webpack plugin config
 */
export function generateWebpackConfig(config: CLIConfig): string {
  return `const MinifierPlugin = require('@coders/webpack-minifier-plugin');

module.exports = {
  // ... your webpack config
  plugins: [
    new MinifierPlugin({
      test: /\\.(js|css|html)$/,
      level: '${config.level || 'moderate'}',
      parallel: true,
      cache: true,
      options: {
        removeComments: ${config.options?.removeComments !== false},
        removeWhitespace: ${config.options?.removeWhitespace !== false},
        mangleVariables: ${config.options?.mangleVariables || false},
        removeConsoleLog: ${config.options?.removeConsoleLog || false},
        removeDebugger: ${config.options?.removeDebugger !== false}
      }
    })
  ]
};
`;
}

/**
 * Generate GitHub Actions workflow
 */
export function generateGitHubAction(config: CLIConfig): string {
  return `name: Minify Assets

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  minify:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install -g @coders/minifier-cli
    
    - name: Minify files
      run: ${generateCLICommand(config)}
    
    - name: Commit minified files
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add .
        git diff --staged --quiet || git commit -m "Auto-minify files"
        git push
`;
}

/**
 * Generate Docker configuration
 */
export function generateDockerfile(): string {
  return `FROM node:18-alpine

WORKDIR /app

RUN npm install -g @coders/minifier-cli

COPY . .

# Example usage:
# docker run --rm -v $(pwd):/app minifier --input /app/src --output /app/dist --recursive

ENTRYPOINT ["minifier"]
`;
}

/**
 * Generate configuration file
 */
export function generateConfigFile(config: CLIConfig): string {
  const configObj = {
    input: config.input,
    output: config.output,
    language: config.language,
    level: config.level || 'moderate',
    recursive: config.recursive || false,
    watch: config.watch || false,
    options: {
      removeComments: config.options?.removeComments !== false,
      removeWhitespace: config.options?.removeWhitespace !== false,
      removeEmptyLines: config.options?.removeEmptyLines !== false,
      preserveLineBreaks: config.options?.preserveLineBreaks || false,
      mangleVariables: config.options?.mangleVariables || false,
      removeConsoleLog: config.options?.removeConsoleLog || false,
      removeDebugger: config.options?.removeDebugger !== false
    }
  };
  
  return `module.exports = ${JSON.stringify(configObj, null, 2)};
`;
}

/**
 * CLI Help text generator
 */
export function generateHelpText(): string {
  return `
Code Minifier CLI - Minify HTML, CSS, JavaScript and 20+ programming languages

USAGE:
  minifier [OPTIONS]

OPTIONS:
  -i, --input <path>          Input file or directory (required)
  -o, --output <path>         Output file or directory
  -l, --level <level>         Minification level: light, moderate, aggressive (default: moderate)
  -L, --language <lang>       Force language detection
  -r, --recursive             Process directories recursively
  -w, --watch                 Watch for file changes
  -c, --config <path>         Configuration file path
  
MINIFICATION OPTIONS:
  --remove-comments           Remove comments (default: true)
  --keep-comments             Keep comments
  --remove-whitespace         Remove unnecessary whitespace (default: true)
  --keep-whitespace           Keep whitespace
  --remove-empty-lines        Remove empty lines (default: true)
  --preserve-linebreaks       Preserve line breaks
  --mangle-variables          Mangle variable names (aggressive mode only)
  --remove-console            Remove console.log statements
  --keep-debugger             Keep debugger statements
  
EXAMPLES:
  # Minify single file
  minifier -i app.js -o app.min.js
  
  # Minify directory recursively
  minifier -i ./src -o ./dist -r
  
  # Watch mode with aggressive minification
  minifier -i ./src -o ./dist -w -l aggressive
  
  # Use configuration file
  minifier -c minifier.config.js
  
  # Batch process with specific language
  minifier -i "*.html" -L html -r

SUPPORTED LANGUAGES:
  HTML, CSS, JavaScript, TypeScript, JSON, XML, PHP, Python, Java, C/C++,
  C#, Go, Rust, Swift, Kotlin, Dart, Scala, Ruby, Perl, R, MATLAB, SQL,
  Shell, PowerShell

For more information, visit: https://github.com/coders/minifier
`;
}