import React from 'react';
import { Article } from '../types';
import { Heart, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (articleId: string) => void;
  onSelectAuthor?: (authorId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  onSelectAuthor,
}) => {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft in Progress';

  return (
    <article 
      onClick={() => onSelect(article.id)}
      className="group flex flex-col bg-white border border-stone-200 hover:border-slate-400 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Cover Image slot with fallback container */}
      <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 text-stone-200">
            <span className="font-serif text-3xl opacity-30">Ψ</span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-2">DY Patil TechVerse</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Zero-Pill Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
          <span className="font-medium text-blue-900">
            {article.category?.name || 'General Engineering'}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{formattedDate}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{article.readTimeMinutes} min</span>
          </span>
        </div>

        {/* Article Headline */}
        <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-950 transition-colors line-clamp-2 leading-snug mb-2">
          {article.title}
        </h3>

        {/* Article Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {article.summary}
        </p>

        {/* Author Footer & Metrics */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div 
            onClick={(e) => {
              if (onSelectAuthor && article.author) {
                e.stopPropagation();
                onSelectAuthor(article.author.id);
              }
            }}
            className="flex items-center gap-2 text-xs hover:text-blue-950 transition-colors"
          >
            {article.author?.avatarUrl ? (
              <img
                src={article.author.avatarUrl}
                alt={article.author.fullName}
                className="w-5 h-5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                {article.author?.fullName.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex items-center gap-1 font-medium text-slate-800">
              <span className="max-w-[130px] truncate">{article.author?.fullName || 'Anonymous Author'}</span>
              {article.author?.verificationStatus === 'verified' && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-label="Verified Student Author" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 tabular-nums">
            <span className="inline-flex items-center gap-1 hover:text-rose-600 transition-colors">
              <Heart className={`w-3.5 h-3.5 ${article.isLikedByCurrentUser ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>{article.likesCount || 0}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.commentsCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
