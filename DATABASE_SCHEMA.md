# 📊 Database Schema Documentation

## Overview
The `db.json` file contains a comprehensive database of 30 developer tools organized into categories with rich metadata for search, filtering, and presentation.

## Structure

### Tools Array
Each tool object contains:

#### Basic Information
- `id`: Unique identifier (URL-friendly slug)
- `name`: Display name of the tool
- `description`: Detailed description of functionality
- `shortDescription`: Brief one-line description
- `longDescription`: Comprehensive explanation

#### Search & Discovery
- `searchDesc`: Space-separated keywords for search optimization
- `tags`: Array of relevant tags
- `category`: Primary category ID
- `subcategory`: Secondary categorization

#### UI & Presentation
- `icon`: Lucide icon name for UI display
- `url`: Tool page URL path
- `featured`: Boolean - appears in featured sections
- `popular`: Boolean - appears in popular tools
- `difficulty`: "beginner" | "intermediate" | "advanced"

#### Functionality
- `inputTypes`: Array of accepted input types
- `outputTypes`: Array of output formats
- `features`: Array of key features
- `useCases`: Array of common use cases
- `relatedTools`: Array of related tool IDs

### Categories Array
Organized tool categories with:
- `id`: Category identifier
- `name`: Display name
- `description`: Category description
- `icon`: Category icon
- `color`: Theme color (black for minimal design)

### Metadata Object
Database information including:
- Version and update tracking
- Total counts
- Searchable fields definition
- Available filter options

## Usage Examples

### Search Implementation
```javascript
// Search across multiple fields
const searchableFields = ['name', 'description', 'searchDesc', 'tags', 'category'];

function searchTools(query) {
  return tools.filter(tool => 
    searchableFields.some(field => 
      tool[field]?.toString().toLowerCase().includes(query.toLowerCase())
    )
  );
}
```

### Filter Implementation
```javascript
// Filter by category
const apiTools = tools.filter(tool => tool.category === 'apis-backends');

// Filter by difficulty
const beginnerTools = tools.filter(tool => tool.difficulty === 'beginner');

// Filter featured tools
const featuredTools = tools.filter(tool => tool.featured === true);
```

### Category Navigation
```javascript
// Get tools by category
function getToolsByCategory(categoryId) {
  return tools.filter(tool => tool.category === categoryId);
}

// Get category details
const category = categories.find(cat => cat.id === 'code-syntax');
```

## Tool Categories

1. **Code & Syntax** (8 tools) - Formatters, validators, converters
2. **APIs & Backends** (6 tools) - API testing, schema tools
3. **Data & Encoding** (4 tools) - Encoding, hashing, conversion
4. **Frontend Tools** (4 tools) - CSS, design, optimization
5. **AI & Productivity** (3 tools) - AI-powered development tools
6. **Security & Privacy** (3 tools) - Security analysis, scanning
7. **DevOps & Deployment** (1 tool) - Container tools
8. **Database Tools** (1 tool) - SQL optimization
9. **Utilities** (6 tools) - General purpose tools

## Featured Tools (12)
The most important tools that appear prominently:
- JSON Formatter
- API Tester  
- Base64 Encoder
- Regex Tester
- Hash Generator
- URL Encoder
- Semantic Code Diff
- MRE Generator
- Dependency Risk Analyzer
- API Contract Diff
- Test Generator
- Mock API Generator

## Popular Tools (14)
Community favorites and frequently used tools include most featured tools plus:
- YAML Converter
- CSS Minifier
- JWT Decoder
- Markdown Editor
- cURL Converter
- QR Code Generator
- Password Generator
- Text Diff Checker
- Timestamp Converter

## Search Optimization
Each tool includes a `searchDesc` field with relevant keywords:
- Technical terms and synonyms
- Common use cases
- Related technologies
- Alternative names

## Extensibility
The schema supports easy addition of new tools with:
- Consistent structure
- Rich metadata
- Flexible categorization
- Search optimization
- UI presentation data

This database structure enables powerful search, filtering, and discovery features while maintaining clean, minimal presentation aligned with the overall design philosophy.