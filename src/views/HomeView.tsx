import React from 'react';
import { useTechVerseStore } from '../lib/store';
import { ArticleCard } from '../components/ArticleCard';
import { 
  PenSquare, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Compass, 
  Clock,
  Sparkles
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectArticle,
  onSelectAuthor,
}) => {
  const { articles, categories, getMonthlyLeaderboard } = useTechVerseStore();

  const publishedArticles = articles.filter((a) => a.status === 'published');
  const featuredArticle = publishedArticles[0];
  const recentArticles = publishedArticles.slice(1, 4);

  // Top 3 contributors of current month (October 2026)
  const currentMonthLeaderboard = getMonthlyLeaderboard('2026-10').slice(0, 3);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* 1. Hero Section: Editorial Academic Marquee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-stone-200 rounded-xl bg-white p-6 sm:p-10 lg:p-14 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono tracking-widest text-blue-900 uppercase">
                Volume IV · Autumn Semester 2026 · Official Engineering Journal
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 leading-[1.15] text-balance">
                The Peer-Reviewed Technical Voice of D. Y. Patil Engineering.
              </h1>

              <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl">
                A community for undergraduate researchers, software engineers, and hardware architects to publish reproducible investigations, analyze distributed systems, and receive peer recognition.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('editor')}
                  className="px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Submit Technical Article</span>
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-5 py-3 text-sm font-semibold text-slate-800 hover:text-blue-950 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Publications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Faculty & Peer Moderation
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Monthly Contributor Leaderboard
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-slate-600" />
                  Open Access & CC BY-NC-SA 4.0
                </span>
              </div>
            </div>

            {/* Hero Right Visual Column */}
            <div className="lg:col-span-5">
              {featuredArticle && (
                <div 
                  onClick={() => onSelectArticle(featuredArticle.id)}
                  className="group relative bg-stone-50 border border-stone-200 rounded-lg overflow-hidden cursor-pointer hover:border-slate-400 transition-all shadow-xs"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                    <img
                      src={featuredArticle.coverImageUrl || '/src/assets/images/hero_techverse_magazine_1791975433144.jpg'}
                      alt={featuredArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase">
                      Featured Investigation
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-900">
                        {featuredArticle.category?.name}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {featuredArticle.readTimeMinutes} min read
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-950 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {featuredArticle.summary}
                    </p>

                    <div className="pt-2 text-xs text-blue-900 font-semibold inline-flex items-center gap-1">
                      <span>Read Complete Paper</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. Operational Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-stone-100 rounded-lg border border-stone-200">
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold font-serif text-slate-900 tabular-nums">
              {publishedArticles.length}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Peer-Reviewed Publications
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold font-serif text-slate-900 tabular-nums">
              {categories.filter(c => c.isActive).length}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Academic Disciplines
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold font-serif text-slate-900 tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Verified Student Authors
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold font-serif text-slate-900 tabular-nums">
              Oct 2026
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Active Publication Cycle
            </div>
          </div>
        </div>
      </section>

      {/* 3. Recent Technical Publications Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Recently Published Articles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Latest peer-reviewed technical articles across collegiate computing laboratories.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-950 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({publishedArticles.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              onSelectAuthor={onSelectAuthor}
            />
          ))}
        </div>
      </section>

      {/* 4. Category Disciplines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Explore by Discipline
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse submissions organized by engineering department and research focus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.filter(c => c.isActive).map((cat) => {
            const count = publishedArticles.filter(a => a.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('explore', cat.id)}
                className="group p-5 bg-white border border-stone-200 hover:border-slate-400 rounded-lg cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-950 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {count} {count === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Monthly Top Contributors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-stone-200 bg-white rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
            <div>
              <div className="text-xs font-mono text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Monthly Contributor Spotlight · October 2026</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                Top Student Authors
              </h2>
            </div>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Full Leaderboard & Criteria</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentMonthLeaderboard.map((rankEntry, idx) => (
              <div
                key={rankEntry.authorId}
                onClick={() => onSelectAuthor(rankEntry.authorId)}
                className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-200 hover:border-slate-400 cursor-pointer transition-all"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  idx === 0 
                    ? 'bg-amber-400 text-amber-950' 
                    : idx === 1 
                    ? 'bg-slate-300 text-slate-900' 
                    : 'bg-amber-700 text-amber-50'
                }`}>
                  #{rankEntry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm truncate hover:text-blue-950">
                    {rankEntry.author.fullName}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {rankEntry.author.department}
                  </p>
                  <div className="mt-2 text-xs text-slate-700 flex items-center gap-3">
                    <span className="font-medium text-blue-950 tabular-nums">
                      {rankEntry.eligibleArticleCount} {rankEntry.eligibleArticleCount === 1 ? 'publication' : 'publications'}
                    </span>
                    <span>·</span>
                    <span className="text-slate-500 tabular-nums">
                      {rankEntry.distinctPublicationDays} active days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Have a Research Project or Technical Finding to Share?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            All enrolled engineering students with verified institutional email can draft articles. Submissions undergo faculty-mentored peer review before journal publication.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('editor')}
              className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-white hover:bg-stone-100 rounded transition-colors cursor-pointer shadow-xs"
            >
              Start an Article Draft
            </button>
            <button
              onClick={() => onNavigate('guidelines')}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              Read Submission Criteria
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
