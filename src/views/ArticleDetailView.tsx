import React, { useState } from 'react';
import { useTechVerseStore } from '../lib/store';
import { RichArticleViewer } from '../components/RichArticleViewer';
import { ArticleCard } from '../components/ArticleCard';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Flag, 
  CheckCircle, 
  Clock, 
  Calendar, 
  ArrowLeft,
  Trash2,
  Check,
  Send
} from 'lucide-react';

interface ArticleDetailViewProps {
  articleId: string;
  onBack: () => void;
  onSelectArticle: (id: string) => void;
  onSelectAuthor: (authorId: string) => void;
  onOpenAuth: () => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  articleId,
  onBack,
  onSelectArticle,
  onSelectAuthor,
  onOpenAuth,
}) => {
  const { 
    articles, 
    currentUser, 
    toggleLike, 
    addComment, 
    deleteComment, 
    reportComment, 
    toggleFollow, 
    follows,
    comments 
  } = useTechVerseStore();

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested publication might be unpublished or under editorial revision.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
        >
          Return to Publications
        </button>
      </div>
    );
  }

  const isAuthor = currentUser?.id === article.authorId;
  const isFollowingAuthor = currentUser && article.author 
    ? follows.some(f => f.followerId === currentUser.id && f.followingId === article.author!.id)
    : false;

  const authorFollowersCount = article.author
    ? follows.filter(f => f.followingId === article.author!.id).length
    : 0;

  const articleComments = comments.filter(c => c.articleId === article.id && !c.isHidden);

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.categoryId === article.categoryId && a.status === 'published')
    .slice(0, 3);

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'In Editorial Review';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (currentUser.verificationStatus !== 'verified') {
      setCommentError('Only verified students and faculty can participate in academic discussions.');
      return;
    }

    try {
      addComment(article.id, commentText);
      setCommentText('');
    } catch (err: any) {
      setCommentError(err.message || 'Failed to post comment.');
    }
  };

  return (
    <div className="py-8 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-stone-200 rounded hover:bg-stone-50 cursor-pointer shadow-2xs"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Article</span>
                </>
              )}
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-700 border border-transparent hover:border-rose-200 rounded cursor-pointer"
              title="Report content violation"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Article Header Card */}
        <header className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-900">
              {article.category?.name}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTimeMinutes} min read</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight leading-[1.2] text-balance">
            {article.title}
          </h1>

          {/* Abstract / Summary */}
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic border-l-2 border-blue-900/30 pl-4 py-1">
            {article.summary}
          </p>

          {/* Author Card & Follow Control */}
          {article.author && (
            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div 
                onClick={() => onSelectAuthor(article.author!.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                {article.author.avatarUrl ? (
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-stone-200 group-hover:ring-blue-900"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {article.author.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 group-hover:text-blue-950 text-sm">
                    <span>{article.author.fullName}</span>
                    {article.author.verificationStatus === 'verified' && (
                      <CheckCircle className="w-4 h-4 text-blue-700" aria-label="Verified Student Author" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    <span>{article.author.department}</span>
                    {article.author.batchYear && (
                      <span> · Class of {article.author.batchYear}</span>
                    )}
                  </div>
                </div>
              </div>

              {!isAuthor && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 tabular-nums">
                    {authorFollowersCount} {authorFollowersCount === 1 ? 'follower' : 'followers'}
                  </span>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onOpenAuth();
                        return;
                      }
                      toggleFollow(article.author!.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                      isFollowingAuthor
                        ? 'bg-stone-100 text-slate-800 hover:bg-stone-200 border border-stone-300'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isFollowingAuthor ? 'Following' : 'Follow Author'}
                  </button>
                </div>
              )}
            </div>
          )}

        </header>

        {/* Cover Image */}
        {article.coverImageUrl && (
          <div className="aspect-16/9 w-full bg-slate-900 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Article Body (Safely Rendered) */}
        <article className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs">
          <RichArticleViewer content={article.content} />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-stone-200">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                Research Keywords & Tags
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="bg-stone-100 px-2.5 py-1 rounded text-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sticky / Bottom Article Interaction Bar */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  toggleLike(article.id);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  article.isLikedByCurrentUser
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${article.isLikedByCurrentUser ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                <span className="tabular-nums">{article.likesCount || 0} Likes</span>
              </button>

              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{articleComments.length} Comments</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="text-xs font-semibold text-slate-700 hover:text-blue-950 inline-flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </article>

        {/* Peer Discussion & Comments Section */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Peer Discussion ({articleComments.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Constructive technical discourse adhering to academic integrity standards.
            </p>
          </div>

          {/* Post Comment Form */}
          <form onSubmit={handlePostComment} className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                currentUser?.verificationStatus === 'verified'
                  ? 'Add a technical query, methodological feedback, or critique...'
                  : 'Sign in with verified student account to post a comment.'
              }
              disabled={currentUser?.verificationStatus !== 'verified'}
              rows={3}
              className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 text-slate-900 placeholder:text-slate-400 disabled:bg-stone-50 disabled:cursor-not-allowed shadow-2xs"
            />

            {commentError && (
              <div className="text-xs text-rose-600 font-medium">
                {commentError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 tabular-nums">
                {commentText.length}/1000 characters
              </span>
              <button
                type="submit"
                disabled={!commentText.trim() || currentUser?.verificationStatus !== 'verified'}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Response</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            {articleComments.length > 0 ? (
              articleComments.map((comm) => {
                const isCommentAuthor = currentUser?.id === comm.userId;
                const authorUser = comm.user || { fullName: 'Peer Reviewer', role: 'student', verificationStatus: 'verified' };
                const commDate = new Date(comm.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div key={comm.id} className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">
                          {authorUser.fullName}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-slate-500">{commDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCommentAuthor && (
                          <button
                            onClick={() => deleteComment(comm.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Delete your comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            reportComment(comm.id);
                            alert('Comment reported for editorial review.');
                          }}
                          className="text-slate-400 hover:text-amber-700 p-1 cursor-pointer"
                          title="Report inappropriate content"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {comm.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No peer comments recorded yet. Be the first to initiate technical dialogue.
              </div>
            )}
          </div>
        </section>

        {/* Related Publications */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-6">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Related Publications in {article.category?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard
                  key={rel.id}
                  article={rel}
                  onSelect={onSelectArticle}
                  onSelectAuthor={onSelectAuthor}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Report Content Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Report Technical Publication
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If this article contains plagiarism, unverified code, proprietary lab leaks, or academic misconduct, submit a confidential report to the editorial committee.
            </p>

            {reportSubmitted ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-900">Report Transmitted</div>
                <div className="text-xs text-slate-500">The editorial moderation team has been notified.</div>
                <button
                  onClick={() => {
                    setReportModalOpen(false);
                    setReportSubmitted(false);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="report_reason" defaultChecked />
                    <span>Plagiarism or uncredited code/data usage</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="report_reason" />
                    <span>Academic misinformation or fabricated benchmarks</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="report_reason" />
                    <span>Policy or ethical code of conduct violation</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  placeholder="Optional explanatory notes for review board..."
                  className="w-full p-2 text-xs border border-stone-300 rounded"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setReportSubmitted(true)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
