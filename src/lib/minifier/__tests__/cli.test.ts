import {
  generateCLICommand,
  generateBatchScript,
  generateNpmScripts,
  generateMakefile,
  generateGulpTask,
  generateWebpackConfig,
  generateHelpText
} from '../cli';
import { CLIConfig } from '../cli';

describe('CLI Generator Functions', () => {
  
  describe('CLI Command Generation', () => {
    test('should generate basic CLI command', () => {
      const config: CLIConfig = {
        input: 'src/app.js'
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('npx @coders/minifier-cli');
      expect(command).toContain('--input "src/app.js"');
    });

    test('should include output parameter', () => {
      const config: CLIConfig = {
        input: 'src/app.js',
        output: 'dist/app.min.js'
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('--output "dist/app.min.js"');
    });

    test('should include language parameter', () => {
      const config: CLIConfig = {
        input: 'src/app.js',
        language: 'javascript'
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('--language javascript');
    });

    test('should include minification level', () => {
      const config: CLIConfig = {
        input: 'src/app.js',
        level: 'aggressive'
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('--level aggressive');
    });

    test('should not include default moderate level', () => {
      const config: CLIConfig = {
        input: 'src/app.js',
        level: 'moderate'
      };
      
      const command = generateCLICommand(config);
      
      expect(command).not.toContain('--level moderate');
    });

    test('should include recursive flag', () => {
      const config: CLIConfig = {
        input: 'src/',
        recursive: true
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('--recursive');
    });

    test('should include watch flag', () => {
      const config: CLIConfig = {
        input: 'src/',
        watch: true
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('--watch');
    });

    test('should include minification options', () => {
      const config: CLIConfig = {
        input: 'src/app.js',
        options: {
          removeComments: false,
          removeWhitespace: false,
          mangleVariables: true,
          removeConsoleLog: true,
          removeDebugger: false,
          preserveLineBreaks: true
        }
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('--keep-comments');
      expect(command).toContain('--keep-whitespace');
      expect(command).toContain('--mangle-variables');
      expect(command).toContain('--remove-console');
      expect(command).toContain('--keep-debugger');
      expect(command).toContain('--preserve-linebreaks');
    });
  });

  describe('Batch Script Generation', () => {
    test('should generate batch script for multiple files', () => {
      const files = ['app.js', 'utils.js', 'config.js'];
      const config: CLIConfig = {
        input: '',
        level: 'moderate'
      };
      
      const script = generateBatchScript(files, config);
      
      expect(script).toContain('app.min.js');
      expect(script).toContain('utils.min.js');
      expect(script).toContain('config.min.js');
      expect(script.split('\n')).toHaveLength(3);
    });

    test('should use custom output directory', () => {
      const files = ['src/app.js'];
      const config: CLIConfig = {
        input: '',
        output: 'dist/'
      };
      
      const script = generateBatchScript(files, config);
      
      expect(script).toContain('--output "dist/"');
    });
  });

  describe('NPM Scripts Generation', () => {
    test('should generate npm scripts object', () => {
      const config: CLIConfig = {
        input: 'src/',
        output: 'dist/',
        level: 'moderate'
      };
      
      const scripts = generateNpmScripts(config);
      
      expect(scripts).toHaveProperty('minify');
      expect(scripts).toHaveProperty('minify:watch');
      expect(scripts).toHaveProperty('minify:aggressive');
      expect(scripts).toHaveProperty('minify:light');
      
      expect(scripts['minify:watch']).toContain('--watch');
      expect(scripts['minify:aggressive']).toContain('--level aggressive');
      expect(scripts['minify:light']).toContain('--level light');
    });
  });

  describe('Makefile Generation', () => {
    test('should generate valid Makefile', () => {
      const config: CLIConfig = {
        input: 'src/',
        output: 'dist/'
      };
      
      const makefile = generateMakefile(config);
      
      expect(makefile).toContain('.PHONY:');
      expect(makefile).toContain('minify:');
      expect(makefile).toContain('minify-watch:');
      expect(makefile).toContain('minify-aggressive:');
      expect(makefile).toContain('minify-light:');
      expect(makefile).toContain('clean:');
      expect(makefile).toContain('\t'); // Should have tabs for Make targets
    });
  });

  describe('Gulp Task Generation', () => {
    test('should generate valid Gulp task', () => {
      const config: CLIConfig = {
        input: 'src/**/*.js',
        output: 'dist',
        level: 'aggressive',
        options: {
          removeComments: true,
          mangleVariables: true
        }
      };
      
      const gulpTask = generateGulpTask(config);
      
      expect(gulpTask).toContain("require('gulp')");
      expect(gulpTask).toContain("src('src/**/*.js')");
      expect(gulpTask).toContain("dest('dist')");
      expect(gulpTask).toContain("level: 'aggressive'");
      expect(gulpTask).toContain('removeComments: true');
      expect(gulpTask).toContain('mangleVariables: true');
      expect(gulpTask).toContain('exports.minify');
      expect(gulpTask).toContain('exports.watch');
    });
  });

  describe('Webpack Config Generation', () => {
    test('should generate valid Webpack config', () => {
      const config: CLIConfig = {
        input: 'src/',
        level: 'moderate',
        options: {
          removeConsoleLog: true,
          mangleVariables: false
        }
      };
      
      const webpackConfig = generateWebpackConfig(config);
      
      expect(webpackConfig).toContain('MinifierPlugin');
      expect(webpackConfig).toContain("test: /\\.(js|css|html)$/");
      expect(webpackConfig).toContain("level: 'moderate'");
      expect(webpackConfig).toContain('parallel: true');
      expect(webpackConfig).toContain('cache: true');
      expect(webpackConfig).toContain('removeConsoleLog: true');
      expect(webpackConfig).toContain('mangleVariables: false');
    });
  });

  describe('Help Text Generation', () => {
    test('should generate comprehensive help text', () => {
      const helpText = generateHelpText();
      
      expect(helpText).toContain('Code Minifier CLI');
      expect(helpText).toContain('USAGE:');
      expect(helpText).toContain('OPTIONS:');
      expect(helpText).toContain('EXAMPLES:');
      expect(helpText).toContain('SUPPORTED LANGUAGES:');
      expect(helpText).toContain('--input');
      expect(helpText).toContain('--output');
      expect(helpText).toContain('--level');
      expect(helpText).toContain('--recursive');
      expect(helpText).toContain('--watch');
    });

    test('should include all supported languages in help', () => {
      const helpText = generateHelpText();
      
      expect(helpText).toContain('HTML');
      expect(helpText).toContain('CSS');
      expect(helpText).toContain('JavaScript');
      expect(helpText).toContain('TypeScript');
      expect(helpText).toContain('Python');
      expect(helpText).toContain('Java');
      expect(helpText).toContain('Go');
      expect(helpText).toContain('Rust');
    });

    test('should include practical examples', () => {
      const helpText = generateHelpText();
      
      expect(helpText).toMatch(/minifier -i.*\.js/);
      expect(helpText).toMatch(/minifier.*-r/);
      expect(helpText).toMatch(/minifier.*-w/);
      expect(helpText).toMatch(/minifier.*-c/);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty config', () => {
      const config: CLIConfig = {
        input: ''
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('npx @coders/minifier-cli');
      expect(command).toContain('--input ""');
    });

    test('should handle special characters in paths', () => {
      const config: CLIConfig = {
        input: 'src with spaces/app.js',
        output: 'dist (minified)/app.min.js'
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toContain('"src with spaces/app.js"');
      expect(command).toContain('"dist (minified)/app.min.js"');
    });

    test('should handle undefined options gracefully', () => {
      const config: CLIConfig = {
        input: 'app.js',
        options: undefined
      };
      
      const command = generateCLICommand(config);
      
      expect(command).toBe('npx @coders/minifier-cli --input "app.js"');
    });
  });
});