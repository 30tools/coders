/**
 * Integration tests for the complete minifier system
 */

import { minifyHTML, minifyCSS, minifyJS, minifyJSON } from '../core';
import { calculateSavings, detectLanguageFromContent, validateContent } from '../utils';
import { generateCLICommand } from '../cli';

describe('Code Minifier Integration Tests', () => {
  
  describe('Real-world Examples', () => {
    test('should handle a complete HTML page', async () => {
      const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <style>
        /* Main styles */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
        }
        
        h1 {
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- Main content -->
    <div class="container">
        <h1>Welcome to our website</h1>
        <p>This is a sample paragraph with some content.</p>
        <script>
            // JavaScript code
            function showMessage() {
                console.log('Hello, world!');
                alert('Welcome!');
            }
            
            // Event listener
            document.addEventListener('DOMContentLoaded', function() {
                showMessage();
            });
        </script>
    </div>
</body>
</html>
      `;
      
      const result = await minifyHTML(htmlPage, { level: 'moderate' });
      
      expect(result.errors).toHaveLength(0);
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
      expect(result.compressionRatio).toBeGreaterThan(1.5);
      
      // Should remove comments
      expect(result.minified).not.toContain('<!-- Main content -->');
      expect(result.minified).not.toContain('/* Main styles */');
      
      // Should preserve structure
      expect(result.minified).toContain('<!DOCTYPE html>');
      expect(result.minified).toContain('<title>Test Page</title>');
      expect(result.minified).toContain('Welcome to our website');
    });

    test('should handle a CSS framework snippet', async () => {
      const cssFramework = `
/* Bootstrap-like CSS Framework */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333333;
}

/* Container system */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
}

.col {
    flex: 1;
    padding: 0 15px;
}

/* Responsive columns */
@media (min-width: 768px) {
    .col-md-1 { flex: 0 0 8.333333%; }
    .col-md-2 { flex: 0 0 16.666667%; }
    .col-md-3 { flex: 0 0 25%; }
    .col-md-4 { flex: 0 0 33.333333%; }
    .col-md-6 { flex: 0 0 50%; }
    .col-md-12 { flex: 0 0 100%; }
}

/* Button styles */
.btn {
    display: inline-block;
    padding: 8px 16px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.15s ease-in-out;
}

.btn-primary {
    color: #ffffff;
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    color: #ffffff;
    background-color: #0056b3;
    border-color: #004085;
}
      `;
      
      const result = await minifyCSS(cssFramework, { level: 'aggressive' });
      
      expect(result.errors).toHaveLength(0);
      expect(result.minifiedSize).toBeLessThan(result.originalSize * 0.7);
      
      // Should optimize values
      expect(result.minified).toContain(':0'); // 0px -> 0
      
      // Should preserve functionality
      expect(result.minified).toContain('.container');
      expect(result.minified).toContain('@media');
      expect(result.minified).toContain('.btn-primary:hover');
    });

    test('should handle modern JavaScript/TypeScript', async () => {
      const modernJS = `
/**
 * Modern JavaScript/TypeScript example
 * with ES6+ features and React-like patterns
 */

import { useState, useEffect } from 'react';

// Type definitions (would be stripped in JS)
interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

// Constants
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// Utility functions
const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// API service class
class UserService {
    private baseURL: string;
    
    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }
    
    async fetchUsers(): Promise<User[]> {
        try {
            console.log('Fetching users from API...');
            
            const response = await fetch(\`\${this.baseURL}/users\`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${localStorage.getItem('token')}\`
                },
                signal: AbortSignal.timeout(DEFAULT_TIMEOUT)
            });
            
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            const data = await response.json();
            return data.users || [];
            
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    }
    
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        const response = await fetch(\`\${this.baseURL}/users\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        return response.json();
    }
}

// React-like component function
const UserList: React.FC<{ users: User[] }> = ({ users }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    
    // Debounced search
    const debouncedSearch = debounce((term: string) => {
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, 300);
    
    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, users]);
    
    return (
        <div className="user-list">
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {filteredUsers.map(user => (
                <div key={user.id} className="user-card">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <div className="roles">
                        {user.roles.map(role => (
                            <span key={role} className="role-badge">{role}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Export default
export default UserService;
      `;
      
      const result = await minifyJS(modernJS, { 
        level: 'moderate',
        removeConsoleLog: false, // Keep for this test
        removeComments: true
      });
      
      expect(result.errors).toHaveLength(0);
      expect(result.minifiedSize).toBeLessThan(result.originalSize * 0.8);
      
      // Should remove comments but preserve functionality
      expect(result.minified).not.toContain('/**');
      expect(result.minified).not.toContain('//');
      
      // Should preserve ES6+ syntax
      expect(result.minified).toContain('=>');
      expect(result.minified).toContain('async');
      expect(result.minified).toContain('await');
      expect(result.minified).toContain('...args');
      
      // Should preserve template literals
      expect(result.minified).toContain('`${');
    });

    test('should handle complex JSON configuration', async () => {
      const complexJSON = `
{
  "name": "advanced-web-app",
  "version": "2.1.0",
  "description": "A complex web application with multiple configurations",
  
  "scripts": {
    "start": "next start",
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "type-check": "tsc --noEmit"
  },
  
  "dependencies": {
    "@next/bundle-analyzer": "^13.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "styled-components": "^5.3.0"
  },
  
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/react": "^13.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^13.0.0",
    "jest": "^29.0.0",
    "typescript": "^4.9.0"
  },
  
  "eslintConfig": {
    "extends": [
      "next/core-web-vitals",
      "@typescript-eslint/recommended"
    ],
    "rules": {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "prefer-const": "error"
    }
  },
  
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "testPathIgnorePatterns": ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ]
  },
  
  "bundleAnalyzer": {
    "enabled": false,
    "openAnalyzer": false
  }
}
      `;
      
      const result = await minifyJSON(complexJSON);
      
      expect(result.errors).toHaveLength(0);
      expect(result.minifiedSize).toBeLessThan(result.originalSize * 0.5);
      
      // Should be valid JSON
      const parsed = JSON.parse(result.minified);
      expect(parsed.name).toBe('advanced-web-app');
      expect(parsed.scripts.start).toBe('next start');
      expect(parsed.dependencies['@next/bundle-analyzer']).toBe('^13.0.0');
      
      // Should preserve all data
      expect(Object.keys(parsed.scripts)).toHaveLength(7);
      expect(Object.keys(parsed.eslintConfig.rules)).toHaveLength(3);
    });
  });

  describe('End-to-End Workflow', () => {
    test('should process files through complete workflow', async () => {
      const testFiles = [
        { name: 'app.js', content: 'function test() { console.log("hello"); }', type: 'javascript' as const },
        { name: 'styles.css', content: 'body { margin: 0px; }', type: 'css' as const },
        { name: 'config.json', content: '{"debug": true, "version": "1.0"}', type: 'json' as const }
      ];
      
      const results = [];
      
      for (const file of testFiles) {
        // 1. Detect language
        const detectedLang = detectLanguageFromContent(file.content);
        expect(detectedLang).toBe(file.type);
        
        // 2. Validate content
        const validation = validateContent(file.content, file.type);
        expect(validation.valid).toBe(true);
        
        // 3. Minify based on type
        let result;
        switch (file.type) {
          case 'javascript':
            result = await minifyJS(file.content);
            break;
          case 'css':
            result = await minifyCSS(file.content);
            break;
          case 'json':
            result = await minifyJSON(file.content);
            break;
        }
        
        // 4. Verify results
        expect(result!.errors).toHaveLength(0);
        expect(result!.minifiedSize).toBeLessThan(result!.originalSize);
        
        // 5. Calculate savings
        const savings = calculateSavings(result!.originalSize, result!.minifiedSize);
        expect(savings.percentage).toBeGreaterThan(0);
        
        results.push({
          file: file.name,
          originalSize: result!.originalSize,
          minifiedSize: result!.minifiedSize,
          savings: savings.percentage
        });
      }
      
      // All files should be processed successfully
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.minifiedSize).toBeLessThan(result.originalSize);
        expect(result.savings).toBeGreaterThan(0);
      });
    });

    test('should generate CLI commands for processed files', () => {
      const processedFiles = [
        { name: 'app.js', savings: 45 },
        { name: 'styles.css', savings: 38 },
        { name: 'index.html', savings: 52 }
      ];
      
      processedFiles.forEach(file => {
        const cliCommand = generateCLICommand({
          input: file.name,
          level: 'moderate'
        });
        
        expect(cliCommand).toContain(`--input "${file.name}"`);
        expect(cliCommand).toContain('npx @coders/minifier-cli');
      });
    });
  });

  describe('Performance with Large Files', () => {
    test('should handle large JavaScript files efficiently', async () => {
      // Generate a large JavaScript file
      const largeJS = `
        // Large JavaScript file for performance testing
        ${Array.from({ length: 1000 }, (_, i) => `
          function func${i}() {
            const data${i} = {
              id: ${i},
              name: "item_${i}",
              description: "This is item number ${i}",
              value: Math.random() * ${i}
            };
            
            console.log("Processing item", data${i}.id);
            
            if (data${i}.value > 0.5) {
              return data${i}.name.toUpperCase();
            }
            
            return data${i}.description.toLowerCase();
          }
        `).join('\n')}
        
        // Main execution
        const results = [];
        for (let i = 0; i < 1000; i++) {
          results.push(window['func' + i]());
        }
        
        console.log("Processing complete:", results.length);
      `;
      
      const startTime = performance.now();
      const result = await minifyJS(largeJS, { 
        level: 'moderate',
        removeConsoleLog: true 
      });
      const endTime = performance.now();
      
      const processingTime = endTime - startTime;
      
      expect(result.errors).toHaveLength(0);
      expect(result.minifiedSize).toBeLessThan(result.originalSize);
      expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Should remove console.log statements
      expect(result.minified).not.toContain('console.log');
      
      // Should preserve structure
      expect(result.minified).toContain('func0');
      expect(result.minified).toContain('func999');
    }, 10000); // 10 second timeout for this test
  });
});