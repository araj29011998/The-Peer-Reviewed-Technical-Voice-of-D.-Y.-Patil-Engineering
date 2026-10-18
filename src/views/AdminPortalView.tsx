import React, { useState } from 'react';
import { useTechVerseStore } from '../lib/store';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Users, 
  Tag, 
  MessageSquare, 
  History, 
  ExternalLink,
  Eye,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { RichArticleViewer } from '../components/RichArticleViewer';

interface AdminPortalViewProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectArticle: (articleId: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onNavigate,
  onSelectArticle,
}) => {
  const { 
    currentUser, 
    articles, 
    users, 
    categories, 
    comments, 
    verificationRequests, 
    moderationLogs,
    approveAndPublishArticle,
    requestChanges,
    rejectArticle,
    unpublishArticle,
    reviewVerification,
    createCategory,
    toggleCategoryActive,
    deleteCategory,
    hideComment,
  } = useTechVerseStore();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'articles' | 'verifications' | 'categories' | 'comments' | 'logs'
  >('articles');

  // Article Modal Review State
  const [selectedArticleForReview, setSelectedArticleForReview] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'request_changes' | 'reject' | 'unpublish';
    articleId: string;
  } | null>(null);
  const [modalFeedback, setModalFeedback] = useState('');
  const [actionError, setActionError] = useState('');

  // Category creation state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catError, setCatError] = useState('');

  // Verification Review State
  const [selectedVerifForReview, setSelectedVerifForReview] = useState<string | null>(null);
  const [verifActionModal, setVerifActionModal] = useState<{
    requestId: string;
    approve: boolean;
  } | null>(null);
  const [verifNotes, setVerifNotes] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Unauthorized Access: Editorial Board Required
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Only authorized platform administrators and faculty editorial heads can access this portal. Please switch to the administrative account (Dr. Anjali Deshmukh) in the top menu to evaluate moderation controls.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
        >
          Return to Journal Home
        </button>
      </div>
    );
  }

  // Metrics
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.verificationStatus === 'verified').length;
  const pendingVerifs = verificationRequests.filter((v) => v.status === 'pending');
  const pendingArticles = articles.filter((a) => a.status === 'pending_review' || a.status === 'pending_verification');
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const reportedComments = comments.filter((c) => c.reportCount > 0);

  const articleInReview = articles.find((a) => a.id === selectedArticleForReview);

  // Article Action Handlers
  const handleConfirmArticleAction = () => {
    setActionError('');
    if (!actionModal) return;

    try {
      if (actionModal.type === 'approve') {
        approveAndPublishArticle(actionModal.articleId);
      } else if (actionModal.type === 'request_changes') {
        if (!modalFeedback.trim()) {
          setActionError('Mandatory feedback is required when requesting revisions.');
          return;
        }
        requestChanges(actionModal.articleId, modalFeedback);
      } else if (actionModal.type === 'reject') {
        if (!modalFeedback.trim()) {
          setActionError('A mandatory rejection reason is required for student feedback.');
          return;
        }
        rejectArticle(actionModal.articleId, modalFeedback);
      } else if (actionModal.type === 'unpublish') {
        if (!modalFeedback.trim()) {
          setActionError('An unpublish reason is required for the audit log.');
          return;
        }
        unpublishArticle(actionModal.articleId, modalFeedback);
      }

      setActionModal(null);
      setSelectedArticleForReview(null);
      setModalFeedback('');
    } catch (err: any) {
      setActionError(err.message || 'Operation failed.');
    }
  };

  // Verification Action Handler
  const handleConfirmVerification = () => {
    if (!verifActionModal) return;
    try {
      reviewVerification(verifActionModal.requestId, verifActionModal.approve, verifNotes);
      setVerifActionModal(null);
      setSelectedVerifForReview(null);
      setVerifNotes('');
    } catch (err: any) {
      alert(err.message || 'Verification update failed.');
    }
  };

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');
    if (!newCatName.trim()) {
      setCatError('Category name cannot be empty.');
      return;
    }
    try {
      createCategory(newCatName, newCatDesc);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      setCatError(err.message || 'Failed to add category.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-900 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Editorial Board Administration Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Publishing Governance & Moderation
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Enforcing academic rigor, student enrollment verification, and peer review standards across collegiate publications.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Pending Articles</div>
          <div className="text-2xl font-bold font-serif text-amber-700 mt-1 tabular-nums">
            {pendingArticles.length}
          </div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Pending Student IDs</div>
          <div className="text-2xl font-bold font-serif text-blue-900 mt-1 tabular-nums">
            {pendingVerifs.length}
          </div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Published Articles</div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1 tabular-nums">
            {publishedArticles.length}
          </div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Verified Students</div>
          <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">
            {verifiedUsers}/{totalUsers}
          </div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Reported Comments</div>
          <div className="text-2xl font-bold font-serif text-rose-700 mt-1 tabular-nums">
            {reportedComments.length}
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-stone-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveAdminTab('articles')}
          className={`px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'articles'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Article Moderation ({pendingArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('verifications')}
          className={`px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'verifications'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Verifications ({pendingVerifs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('categories')}
          className={`px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'categories'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Disciplines ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('comments')}
          className={`px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'comments'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Comment Moderation ({reportedComments.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('logs')}
          className={`px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'logs'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Trail ({moderationLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ARTICLE MODERATION QUEUE */}
      {activeAdminTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Manuscripts Awaiting Editorial Review
            </h2>
            <span className="text-xs text-slate-500">
              {pendingArticles.length} pending submissions
            </span>
          </div>

          {pendingArticles.length > 0 ? (
            <div className="space-y-3">
              {pendingArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 bg-white border border-stone-200 rounded-lg shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-blue-900">{art.category?.name}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-slate-500">Submitted {new Date(art.createdAt).toLocaleDateString()}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-slate-500">{art.readTimeMinutes} min read</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedArticleForReview(art.id)}
                        className="px-3 py-1 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Manuscript</span>
                      </button>

                      <button
                        onClick={() => setActionModal({ type: 'approve', articleId: art.id })}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>

                      <button
                        onClick={() => setActionModal({ type: 'request_changes', articleId: art.id })}
                        className="px-3 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        onClick={() => setActionModal({ type: 'reject', articleId: art.id })}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900">{art.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{art.summary}</p>
                  </div>

                  {/* Author Details & Verification Indicator */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{art.author?.fullName}</span>
                      <span className="text-stone-300">·</span>
                      <span>{art.author?.department}</span>
                      <span className="text-stone-300">·</span>
                      <span className="font-mono text-slate-500">{art.author?.studentId}</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Author Status</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-stone-300 rounded-lg bg-white p-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                All submitted articles have been reviewed. Moderation queue is clear.
              </p>
            </div>
          )}

          {/* Published Articles List with Unpublish Action */}
          <div className="pt-8 border-t border-stone-200 space-y-3">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Live Published Articles ({publishedArticles.length})
            </h3>
            <div className="space-y-2">
              {publishedArticles.map((pub) => (
                <div key={pub.id} className="p-4 bg-white border border-stone-200 rounded-lg flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{pub.category?.name}</span>
                      <span>·</span>
                      <span>By {pub.author?.fullName}</span>
                      <span>·</span>
                      <span>Published {new Date(pub.publishedAt!).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-slate-900 truncate mt-0.5">{pub.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectArticle(pub.id)}
                      className="px-2.5 py-1 text-xs text-slate-700 hover:text-blue-900 border border-stone-200 rounded inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => setActionModal({ type: 'unpublish', articleId: pub.id })}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded"
                    >
                      Unpublish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT VERIFICATION MANAGEMENT */}
      {activeAdminTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Collegiate Enrollment Verification Requests
            </h2>
            <span className="text-xs text-slate-500">
              {pendingVerifs.length} requests pending review
            </span>
          </div>

          {pendingVerifs.length > 0 ? (
            <div className="space-y-3">
              {pendingVerifs.map((req) => (
                <div key={req.id} className="p-5 bg-white border border-stone-200 rounded-lg shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-500">
                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {req.user?.fullName || req.personalEmail}
                      </div>
                      <div className="text-xs text-slate-600">
                        Registered Email: <span className="font-mono text-slate-800">{req.personalEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setVerifActionModal({ requestId: req.id, approve: true });
                          setVerifNotes('Student ID confirmed against university registry records.');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Student</span>
                      </button>

                      <button
                        onClick={() => {
                          setVerifActionModal({ requestId: req.id, approve: false });
                          setVerifNotes('Enrollment number does not match current semester roster.');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Request</span>
                      </button>
                    </div>
                  </div>

                  {/* Verification Document Details */}
                  <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 block">Roll / PRN Number:</span>
                      <span className="font-mono font-semibold text-slate-900">{req.studentIdNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Department & Batch:</span>
                      <span className="font-medium text-slate-900">{req.department} ({req.batchYear})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">ID Card Document:</span>
                      {req.collegeIdCardUrl ? (
                        <a
                          href={req.collegeIdCardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 underline inline-flex items-center gap-1 font-medium"
                        >
                          <span>Inspect Student ID</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">None attached</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-stone-300 rounded-lg bg-white p-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                No pending student verification requests.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATEGORY MANAGEMENT */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Department & Topic Categories
            </h2>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="p-5 bg-white border border-stone-200 rounded-lg shadow-2xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-slate-900">
              Add New Engineering Discipline
            </h3>

            {catError && (
              <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                {catError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category Name (e.g. Quantum Computing)"
                className="px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
              />
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Scope & Editorial Description"
                className="px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Category</span>
            </button>
          </form>

          {/* Categories Table */}
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Articles</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categories.map((cat) => {
                  const articleCount = articles.filter((a) => a.categoryId === cat.id).length;
                  return (
                    <tr key={cat.id} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-slate-900">{cat.name}</td>
                      <td className="p-3 font-mono text-slate-500">{cat.slug}</td>
                      <td className="p-3 tabular-nums">{articleCount} articles</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          cat.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-slate-500'
                        }`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => toggleCategoryActive(cat.id)}
                          className="text-xs text-blue-900 hover:underline font-medium cursor-pointer"
                        >
                          {cat.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => {
                            try {
                              deleteCategory(cat.id);
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="text-xs text-rose-700 hover:underline font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COMMENT MODERATION */}
      {activeAdminTab === 'comments' && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Reported Discussion Comments
          </h2>

          {reportedComments.length > 0 ? (
            <div className="space-y-3">
              {reportedComments.map((comm) => (
                <div key={comm.id} className="p-4 bg-white border border-rose-200 rounded-lg shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-800">
                      Report Count: {comm.reportCount}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => hideComment(comm.id, !comm.isHidden)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 rounded"
                      >
                        {comm.isHidden ? 'Unhide Comment' : 'Hide from Public'}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 whitespace-pre-wrap">{comm.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-stone-300 rounded-lg bg-white p-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                No reported comments requiring intervention.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeAdminTab === 'logs' && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Immutable Moderation Audit Trail
          </h2>

          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Administrator</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Reason / Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {moderationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="p-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-sans font-semibold text-slate-900">
                      {log.adminName}
                    </td>
                    <td className="p-3 font-semibold uppercase text-blue-900">
                      {log.action}
                    </td>
                    <td className="p-3 text-slate-700">
                      {log.targetTitle || log.targetId}
                    </td>
                    <td className="p-3 font-sans text-slate-600">
                      {log.reason || 'Standard review procedure'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Article Inspection Modal */}
      {selectedArticleForReview && articleInReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <span className="text-xs uppercase font-mono text-blue-900 font-semibold">
                  Manuscript Review · {articleInReview.category?.name}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {articleInReview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticleForReview(null)}
                className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-3 bg-stone-100 rounded text-xs text-slate-700">
                <strong>Author:</strong> {articleInReview.author?.fullName} ({articleInReview.author?.department}) · Student ID: {articleInReview.author?.studentId}
              </div>

              {articleInReview.coverImageUrl && (
                <div className="aspect-16/9 w-full rounded overflow-hidden bg-slate-900">
                  <img src={articleInReview.coverImageUrl} alt={articleInReview.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-2">
                <RichArticleViewer content={articleInReview.content} />
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActionModal({ type: 'reject', articleId: articleInReview.id })}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => setActionModal({ type: 'request_changes', articleId: articleInReview.id })}
                className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded"
              >
                Request Revisions
              </button>
              <button
                onClick={() => setActionModal({ type: 'approve', articleId: articleInReview.id })}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Action Confirmation Modal (Approve / Reject / Changes) */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-slate-900 capitalize">
              {actionModal.type.replace('_', ' ')} Article
            </h3>

            {actionError && (
              <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                {actionError}
              </div>
            )}

            {actionModal.type === 'approve' ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to approve this technical manuscript for public publication in the DY Patil TechVerse journal?
              </p>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {actionModal.type === 'request_changes' ? 'Revision Notes for Author *' : 'Rejection Reason *'}
                </label>
                <textarea
                  value={modalFeedback}
                  onChange={(e) => setModalFeedback(e.target.value)}
                  rows={4}
                  placeholder="Detail explicit feedback, missing experimental data, citations, or formatting improvements..."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setActionModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArticleAction}
                className={`px-4 py-1.5 text-xs font-semibold text-white rounded cursor-pointer ${
                  actionModal.type === 'approve'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Review Modal */}
      {verifActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              {verifActionModal.approve ? 'Approve Student Verification' : 'Reject Verification Request'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrative Notes & Registry Verification Notes
              </label>
              <textarea
                value={verifNotes}
                onChange={(e) => setVerifNotes(e.target.value)}
                rows={3}
                placeholder="Audit notes (e.g. verified in Student Affairs database)..."
                className="w-full p-2.5 text-xs border border-stone-300 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setVerifActionModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerification}
                className={`px-4 py-1.5 text-xs font-semibold text-white rounded cursor-pointer ${
                  verifActionModal.approve ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                Confirm Verification Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
