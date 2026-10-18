import React, { useState, useMemo } from 'react';
import { useTechVerseStore } from '../lib/store';
import { ArticleCard } from '../components/ArticleCard';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ExploreViewProps {
  initialCategoryId?: string;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialCategoryId,
  onSelectArticle,
  onSelectAuthor,
}) => {
  const { articles, categories } = useTechVerseStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'readTime'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Only published articles are visible to public exploration
  const publishedArticles = useMemo(() => {
    return articles.filter((a) => a.status === 'published');
  }, [articles]);

  // Filter & Search Logic
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((article) => {
      // Category filter
      if (selectedCategory !== 'all' && article.categoryId !== selectedCategory) {
        return false;
      }

      // Search query across title, summary, author name, and tags
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSummary = article.summary.toLowerCase().includes(query);
        const matchesAuthor = article.author?.fullName.toLowerCase().includes(query);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSummary && !matchesAuthor && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [publishedArticles, selectedCategory, searchQuery]);

  // Sorting
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'popular') {
        const popA = (a.likesCount || 0) * 2 + (a.commentsCount || 0);
        const popB = (b.likesCount || 0) * 2 + (b.commentsCount || 0);
        return popB - popA;
      }
      if (sortBy === 'readTime') {
        return a.readTimeMinutes - b.readTimeMinutes;
      }
      return 0;
    });
  }, [filteredArticles, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedArticles, currentPage]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Explore Technical Publications
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          Search and filter verified student research papers, system benchmarks, and technical architecture guides across collegiate engineering disciplines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, keyword, author, or tag (e.g. Raft, PyTorch, RISC-V)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-md text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest Publications</option>
              <option value="popular">Most Popular (Likes & Comments)</option>
              <option value="readTime">Shortest Reading Time</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
            }`}
          >
            All Categories ({publishedArticles.length})
          </button>
          {categories.filter(c => c.isActive).map((cat) => {
            const count = publishedArticles.filter(a => a.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <div>
          Showing <span className="font-semibold text-slate-800 tabular-nums">{sortedArticles.length}</span> publications
          {selectedCategory !== 'all' && (
            <span> in <strong className="text-slate-800">{categories.find(c => c.id === selectedCategory)?.name}</strong></span>
          )}
          {searchQuery && (
            <span> matching &ldquo;<strong className="text-slate-800">{searchQuery}</strong>&rdquo;</span>
          )}
        </div>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="text-blue-900 hover:underline font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Articles Grid or Empty State */}
      {paginatedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              onSelectAuthor={onSelectAuthor}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-stone-300 rounded-xl bg-white p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-slate-500 mb-4">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
            No Published Articles Match Your Criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Try adjusting your search terms, selecting a broader discipline category, or resetting your active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1 text-xs text-slate-600 px-3">
            <span>Page</span>
            <strong className="text-slate-900 font-semibold">{currentPage}</strong>
            <span>of</span>
            <strong className="text-slate-900 font-semibold">{totalPages}</strong>
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};
