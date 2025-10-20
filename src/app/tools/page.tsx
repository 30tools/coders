'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Star, Zap, Code2, Grid3X3, List, ArrowRight } from 'lucide-react';
import { toolsData } from '@/lib/tools-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const { tools, categories } = toolsData;

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'category' | 'difficulty' | 'popular';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('name');

  const filteredTools = useMemo(() => {
    const filtered = tools.filter(tool => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.searchDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const categoryMatch = selectedCategory === 'all' || tool.category === selectedCategory;

      // Difficulty filter
      const difficultyMatch = selectedDifficulty === 'all' || tool.difficulty === selectedDifficulty;

      // Featured filter
      const featuredMatch = !showFeaturedOnly || tool.featured;

      return searchMatch && categoryMatch && difficultyMatch && featuredMatch;
    });

    // Sort tools
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'difficulty':
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        case 'popular':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty, showFeaturedOnly, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'braces': Code2,
      'globe': Code2,
      'file-text': Code2,
      'search': Search,
      'shield': Code2,
      'link': Code2,
      'git-compare': Code2,
      'bug': Code2,
      'alert-triangle': Code2,
      'git-branch': Code2,
      'check-circle': Code2,
      'server': Code2,
      'package': Code2,
      'wind': Code2,
      'eye-off': Code2,
      'database': Code2,
      'file-code': Code2,
      'minimize': Code2,
      'key': Code2,
      'palette': Code2,
      'edit': Code2,
      'image': Code2,
      'terminal': Code2,
      'qr-code': Code2,
      'lock': Code2,
      'type': Code2,
      'clock': Code2,
      'trending-up': Code2,
    };
    return iconMap[iconName] || Code2;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Developer Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover {tools.length} essential coding tools designed to boost your productivity. 
              Find formatters, analyzers, converters, and more.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                {/* Featured Toggle */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
                    showFeaturedOnly ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform duration-200 ${
                      showFeaturedOnly ? 'translate-x-4' : ''
                    }`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Featured only</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="popular">Sort by Popularity</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 dark:border-gray-700 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {filteredTools.length} of {tools.length} tools
              {searchQuery && (
                <span> for "<span className="font-medium text-black dark:text-white">{searchQuery}</span>"</span>
              )}
            </p>
          </div>

          {/* Tools Grid/List */}
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No tools found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredTools.map((tool) => {
                const IconComponent = getIconComponent(tool.icon);
                const categoryInfo = categories.find(cat => cat.id === tool.category);

                if (viewMode === 'grid') {
                  return (
                    <Link
                      key={tool.id}
                      href={tool.url}
                      className="group block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <IconComponent className="h-6 w-6 text-black dark:text-white mr-3" />
                          <div>
                            <h3 className="font-semibold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                              {tool.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {tool.featured && (
                            <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                          )}
                          {tool.popular && (
                            <Zap className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {tool.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(tool.difficulty)}`}>
                            {tool.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {categoryInfo?.name}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      key={tool.id}
                      href={tool.url}
                      className="group block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <IconComponent className="h-5 w-5 text-black dark:text-white mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                {tool.name}
                              </h3>
                              {tool.featured && (
                                <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                              )}
                              {tool.popular && (
                                <Zap className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                              {tool.shortDescription}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(tool.difficulty)}`}>
                            {tool.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hidden sm:inline">
                            {categoryInfo?.name}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          )}

          {/* Categories Overview */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryTools = tools.filter(tool => tool.category === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSearchQuery('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {categoryTools.length} tools
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}