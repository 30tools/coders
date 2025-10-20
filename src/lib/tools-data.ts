export const toolsData = {
  "tools": [
    {
      "id": "json-formatter",
      "name": "JSON Formatter", 
      "description": "Format, validate, and minify JSON with syntax highlighting and error detection.",
      "searchDesc": "json formatter validator minify prettify syntax highlighting parse stringify lint",
      "category": "code-syntax",
      "subcategory": "formatters",
      "tags": ["json", "formatter", "validator", "minify", "prettify", "syntax"],
      "featured": true,
      "popular": true,
      "difficulty": "beginner",
      "inputTypes": ["text", "file"],
      "outputTypes": ["text", "file"],
      "url": "/tools/json-formatter",
      "icon": "braces",
      "shortDescription": "Format and validate JSON data instantly"
    },
    {
      "id": "api-tester",
      "name": "API Tester",
      "description": "Test REST APIs with custom headers, authentication, and request body formatting.",
      "searchDesc": "api tester rest http client postman curl request response headers authentication",
      "category": "apis-backends",
      "subcategory": "testing",
      "tags": ["api", "rest", "http", "testing", "postman", "curl", "requests"],
      "featured": true,
      "popular": true,
      "difficulty": "intermediate",
      "inputTypes": ["url", "headers", "body"],
      "outputTypes": ["response", "status"],
      "url": "/tools/api-tester",
      "icon": "globe",
      "shortDescription": "Test REST APIs with custom headers and auth"
    },
    {
      "id": "complexity-analyzer",
      "name": "Time & Space Complexity Analyzer",
      "description": "Analyze computational complexity of algorithms with AI-powered insights and optimization suggestions.",
      "searchDesc": "time complexity space complexity algorithm analysis big O notation performance optimization computational complexity code analysis",
      "category": "ai-productivity",
      "subcategory": "analysis",
      "tags": ["complexity", "algorithm", "performance", "optimization", "big-o", "analysis"],
      "featured": true,
      "popular": true,
      "difficulty": "advanced",
      "inputTypes": ["code"],
      "outputTypes": ["analysis", "recommendations"],
      "url": "/tools/complexity-analyzer",
      "icon": "trending-up",
      "shortDescription": "AI-powered algorithm complexity analysis"
    }
  ],
  "categories": [
    {
      "id": "code-syntax",
      "name": "Code & Syntax",
      "description": "Code formatters, validators, converters, and syntax tools",
      "icon": "code",
      "color": "#000000"
    },
    {
      "id": "apis-backends", 
      "name": "APIs & Backends",
      "description": "API testing, documentation, and backend development tools",
      "icon": "server",
      "color": "#000000"
    },
    {
      "id": "ai-productivity",
      "name": "AI & Productivity",
      "description": "AI-powered tools for code generation and productivity",
      "icon": "brain",
      "color": "#000000"
    }
  ]
} as const;