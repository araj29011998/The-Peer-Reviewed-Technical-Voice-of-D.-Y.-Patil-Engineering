import React from 'react';
import { useTechVerseStore } from '../lib/store';
import { ArticleCard } from '../components/ArticleCard';
import { 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';

interface AuthorProfileViewProps {
  authorId: string;
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
  onSelectAuthor: (authorId: string) => void;
  onOpenAuth: () => void;
}

export const AuthorProfileView: React.FC<AuthorProfileViewProps> = ({
  authorId,
  onBack,
  onSelectArticle,
  onSelectAuthor,
  onOpenAuth,
}) => {
  const { users, articles, currentUser, follows, toggleFollow, getMonthlyLeaderboard } = useTechVerseStore();

  const author = users.find((u) => u.id === authorId);

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Author Not Found</h2>
        <button onClick={onBack} className="text-xs font-semibold text-blue-900 underline">
          Back
        </button>
      </div>
    );
  }

  // Only published articles are shown on public profile
  const authorPublishedArticles = articles.filter(
    (a) => a.authorId === author.id && a.status === 'published'
  );

  // Month published articles (Current month October 2026)
  const currentMonthPublished = authorPublishedArticles.filter(
    (a) => a.publishedAt && a.publishedAt.startsWith('2026-10')
  ).length;

  const isCurrentViewer = currentUser?.id === author.id;
  const isFollowing = currentUser 
    ? follows.some((f) => f.followerId === currentUser.id && f.followingId === author.id)
    : false;

  const followerCount = follows.filter((f) => f.followingId === author.id).length;

  // Monthly leaderboard ranking if ranked
  const monthlyRanks = getMonthlyLeaderboard('2026-10');
  const authorRank = monthlyRanks.find((r) => r.authorId === author.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>
      </div>

      {/* Author Header Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-start gap-5">
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.fullName}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-stone-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-2xl font-serif">
                {author.fullName.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {author.fullName}
                </h1>
                {author.verificationStatus === 'verified' && (
                  <span title="Verified College Student/Faculty Author">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                {author.department && (
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{author.department}</span>
                  </span>
                )}
                {author.batchYear && (
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>Class of {author.batchYear}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {new Date(author.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </span>
              </div>

              {authorRank && (
                <div className="pt-1 flex items-center gap-1 text-xs text-amber-800 font-semibold">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Ranked #{authorRank.rank} in Monthly Contributor Leaderboard (October 2026)</span>
                </div>
              )}
            </div>
          </div>

          {!isCurrentViewer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  toggleFollow(author.id);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs ${
                  isFollowing
                    ? 'bg-stone-100 text-slate-800 border border-stone-300 hover:bg-stone-200'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Author'}
              </button>
            </div>
          )}

        </div>

        {/* Bio */}
        {author.bio && (
          <p className="mt-6 text-sm text-slate-700 leading-relaxed border-t border-stone-100 pt-4">
            {author.bio}
          </p>
        )}

        {/* Technical Interests */}
        {author.technicalInterests && author.technicalInterests.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Research Interests:</span>
            {author.technicalInterests.map((interest, idx) => (
              <span key={idx} className="bg-stone-100 text-slate-700 px-2 py-0.5 rounded">
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Performance Statistics Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-stone-200 text-center sm:text-left">
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tabular-nums">
              {authorPublishedArticles.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Total Publications
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tabular-nums">
              {currentMonthPublished}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Published this Month
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tabular-nums">
              {followerCount}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Peer Followers
            </div>
          </div>
        </div>

      </div>

      {/* Published Articles List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-600" />
            <span>Peer-Reviewed Publications ({authorPublishedArticles.length})</span>
          </h2>
        </div>

        {authorPublishedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorPublishedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelect={onSelectArticle}
                onSelectAuthor={onSelectAuthor}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-stone-300 rounded-lg bg-white p-6">
            <p className="text-xs text-slate-500">
              No approved articles published by this author yet.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
