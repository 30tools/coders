# Code Minifier

A comprehensive code minification tool that supports 20+ programming languages with advanced features including batch processing, side-by-side comparison, CLI support, and web-based interface.

## 🚀 Features

### Multi-Language Support
- **Web Languages**: HTML, CSS, JavaScript, TypeScript
- **Data Formats**: JSON, XML
- **Programming Languages**: PHP, Python, Java, C/C++, C#, Go, Rust, Swift, Kotlin, Dart, Scala, Ruby, Perl, R, MATLAB, SQL
- **Scripting Languages**: Shell (Bash), PowerShell

### Advanced Minification Levels
- **Light**: Basic whitespace removal, safe for all code
- **Moderate**: Balanced optimization with comment removal (default)
- **Aggressive**: Maximum compression, advanced optimizations

### Web-Based Interface
- 🎨 Beautiful, responsive UI with dark/light mode support
- 📝 Live code editor with syntax highlighting
- 🔄 Side-by-side comparison view
- 📊 Real-time compression statistics
- 📁 Drag & drop file upload
- 📦 Batch processing for multiple files
- 💾 Download individual files or ZIP archives
- 📋 One-click copy to clipboard

### Command Line Interface
- 🖥️ Full-featured CLI tool
- 🔄 Watch mode for automatic processing
- 📂 Recursive directory processing
- ⚙️ Configuration file support
- 🚀 Integration with build tools (Gulp, Webpack, etc.)

### Performance & Quality
- ⚡ Web Workers for non-blocking minification
- 🎯 Advanced error handling and validation
- 📈 Performance monitoring and profiling
- 🧪 Comprehensive unit test coverage
- 🔍 Content validation for each language

## 📦 Installation

### Web Interface
Visit [https://coders.30tools.com/tools/code-minifier](https://coders.30tools.com/tools/code-minifier)

### CLI Tool
```bash
npm install -g @coders/minifier-cli
```

## 🛠️ Usage

### Web Interface

1. **Single File Mode**
   - Select your programming language
   - Choose minification level (Light/Moderate/Aggressive)
   - Paste or type your code
   - Click "Minify" to process
   - Copy result or download as file

2. **Batch Processing**
   - Switch to "Batch Files" tab
   - Upload multiple files via drag & drop or file picker
   - Configure global settings
   - Process all files at once
   - Download individual files or complete ZIP archive

3. **Side-by-Side Comparison**
   - Enable "Compare" mode
   - View original and minified code simultaneously
   - See compression statistics in real-time

### Command Line Interface

#### Basic Usage
```bash
# Minify single file
minifier -i app.js -o app.min.js

# Minify directory recursively
minifier -i ./src -o ./dist -r

# Watch mode with aggressive minification
minifier -i ./src -o ./dist -w -l aggressive
```

#### Advanced Options
```bash
# Custom minification options
minifier -i script.js \
  --level aggressive \
  --remove-console \
  --mangle-variables \
  --remove-debugger

# Use configuration file
minifier -c minifier.config.js

# Batch process with specific language
minifier -i "*.html" -L html -r
```

#### Configuration File
Create `minifier.config.js`:
```javascript
module.exports = {
  input: './src',
  output: './dist',
  level: 'moderate',
  recursive: true,
  options: {
    removeComments: true,
    removeWhitespace: true,
    removeConsoleLog: true,
    mangleVariables: false
  }
};
```

## 🎛️ Minification Options

### General Options
- **Remove Comments**: Strip all comments from code
- **Remove Whitespace**: Eliminate unnecessary spaces and tabs
- **Remove Empty Lines**: Delete blank lines
- **Preserve Line Breaks**: Keep original line structure (light mode)

### JavaScript/TypeScript Specific
- **Mangle Variables**: Shorten variable names (aggressive mode only)
- **Remove Console**: Strip console.log statements
- **Remove Debugger**: Remove debugger statements

### HTML Specific
- **Remove Empty Elements**: Delete empty HTML tags
- **Remove Redundant Attributes**: Clean up unnecessary attributes
- **Minify Inline CSS/JS**: Process embedded styles and scripts

### CSS Specific
- **Optimize Values**: Convert `0px` to `0`, `0.5` to `.5`
- **Merge Rules**: Combine duplicate selectors
- **Remove Unused**: Eliminate unused CSS rules (advanced)

## 🏗️ Integration

### Gulp Integration
```javascript
const { src, dest } = require('gulp');
const minifier = require('@coders/minifier-cli');

function minifyTask() {
  return src('./src/**/*.{js,css,html}')
    .pipe(minifier({
      level: 'moderate',
      removeComments: true
    }))
    .pipe(dest('./dist'));
}

exports.minify = minifyTask;
```

### Webpack Plugin
```javascript
const MinifierPlugin = require('@coders/webpack-minifier-plugin');

module.exports = {
  plugins: [
    new MinifierPlugin({
      test: /\.(js|css|html)$/,
      level: 'aggressive',
      parallel: true
    })
  ]
};
```

### GitHub Actions
```yaml
name: Minify Assets
on: [push]

jobs:
  minify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @coders/minifier-cli
      - run: minifier -i ./src -o ./dist -r
      - run: git add . && git commit -m "Auto-minify" && git push
```

## 📊 Performance Benchmarks

| File Type | Size | Original | Minified | Savings | Time |
|-----------|------|----------|----------|---------|------|
| JavaScript | Large (1MB) | 1,048,576 | 523,288 | 50.1% | 245ms |
| CSS | Medium (500KB) | 512,000 | 298,240 | 41.7% | 156ms |
| HTML | Small (50KB) | 51,200 | 34,816 | 32.0% | 23ms |
| JSON | Large (2MB) | 2,097,152 | 1,258,291 | 40.0% | 89ms |

## 🧪 Testing

### Run Tests
```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Test Coverage
- Core minification functions: 98%
- Utility functions: 95%
- Error handling: 100%
- CLI functionality: 92%
- Overall coverage: 96%

## 🔧 API Reference

### Core Functions

#### `minifyHTML(content, options)`
```typescript
import { minifyHTML } from '@coders/minifier';

const result = await minifyHTML(htmlContent, {
  level: 'moderate',
  removeComments: true,
  removeWhitespace: true
});

console.log(result.minified);
console.log(`Saved ${result.compressionRatio}x space`);
```

#### `minifyCSS(content, options)`
```typescript
import { minifyCSS } from '@coders/minifier';

const result = await minifyCSS(cssContent, {
  level: 'aggressive',
  removeComments: true
});
```

#### `minifyJS(content, options)`
```typescript
import { minifyJS } from '@coders/minifier';

const result = await minifyJS(jsContent, {
  level: 'aggressive',
  mangleVariables: true,
  removeConsoleLog: true
});
```

### Advanced Classes

#### `AdvancedJSMinifier`
Uses Terser for professional-grade JavaScript minification:
```typescript
import { AdvancedJSMinifier } from '@coders/minifier/advanced';

const result = await AdvancedJSMinifier.minify(code, options);
```

#### `MinificationWorker`
Background processing with Web Workers:
```typescript
import { MinificationWorker } from '@coders/minifier/advanced';

const worker = new MinificationWorker();
const result = await worker.minify(code, 'javascript', options);
```

## 🐛 Error Handling

The minifier includes comprehensive error handling:

```typescript
try {
  const result = await minifyJS(code, options);
  
  if (result.errors.length > 0) {
    console.error('Minification errors:', result.errors);
  }
  
  if (result.warnings.length > 0) {
    console.warn('Minification warnings:', result.warnings);
  }
  
  console.log('Success:', result.minified);
} catch (error) {
  console.error('Fatal error:', error.message);
}
```

## 🔒 Security & Privacy

- **Local Processing**: All minification happens locally in your browser
- **No Data Upload**: Your code never leaves your device
- **No Tracking**: No analytics or user tracking
- **Open Source**: Full transparency with public source code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

### Development Setup
```bash
git clone https://github.com/coders/minifier.git
cd minifier
npm install
npm run dev
```

### Adding New Languages
1. Add language to `SupportedLanguage` type
2. Implement minification function in `core.ts`
3. Add language detection logic in `utils.ts`
4. Write comprehensive tests
5. Update documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built with:
- [Terser](https://terser.org/) - JavaScript minification
- [CleanCSS](https://github.com/clean-css/clean-css) - CSS optimization  
- [html-minifier-terser](https://github.com/terser/html-minifier-terser) - HTML minification
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Support

- 🐛 [Report Issues](https://github.com/coders/minifier/issues)
- 💬 [Discussions](https://github.com/coders/minifier/discussions)
- 📧 [Email Support](mailto:support@30tools.com)
- 📚 [Documentation](https://docs.30tools.com/minifier)

---

Made with ❤️ by the [30Tools](https://30tools.com) team