// Core minification functions
export { minifyHTML, minifyCSS, minifyJS, minifyJSON, minifyXML, minifyGeneric } from './core';

// Advanced minification classes
export { 
  AdvancedJSMinifier, 
  AdvancedCSSMinifier, 
  AdvancedHTMLMinifier,
  MinificationWorker,
  MinificationProfiler 
} from './advanced';

// Utility functions
export {
  validateFile,
  getFileExtension,
  calculateSavings,
  formatFileSize,
  getMimeType,
  detectLanguageFromContent,
  generateMinifiedFilename,
  validateContent,
  estimateMinificationPotential,
  createDownloadBlob,
  downloadFile,
  batchProcess,
  debounce
} from './utils';

// CLI functions
export {
  generateCLICommand,
  generateBatchScript,
  generateNpmScripts,
  generateMakefile,
  generateGulpTask,
  generateWebpackConfig,
  generateGitHubAction,
  generateDockerfile,
  generateConfigFile,
  generateHelpText
} from './cli';

// Types
export type {
  SupportedLanguage,
  MinificationLevel,
  MinificationOptions,
  MinificationResult,
  MinificationError,
  FileValidationResult,
  CompressionStats
} from './types';

// CLI Types
export type { CLIConfig } from './cli';