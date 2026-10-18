import React, { useState } from 'react';
import { useTechVerseStore } from '../lib/store';
import { 
  PenSquare, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  UploadCloud, 
  ExternalLink,
  Edit3
} from 'lucide-react';
import { ArticleStatus } from '../types';

interface StudentDashboardViewProps {
  onNavigate: (view: string, param?: string) => void;
  onEditArticle: (articleId: string) => void;
  onSelectArticle: (articleId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onNavigate,
  onEditArticle,
  onSelectArticle,
}) => {
  const { currentUser, articles, requestVerification, verificationRequests } = useTechVerseStore();

  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'pending' | 'changes' | 'published' | 'rejected'>('all');
  
  // Verification Request Form State
  const [showVerifModal, setShowVerifModal] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState(currentUser?.studentId || '');
  const [departmentInput, setDepartmentInput] = useState(currentUser?.department || 'Computer Engineering');
  const [batchYearInput, setBatchYearInput] = useState(currentUser?.batchYear || 2027);
  const [idCardUrlInput, setIdCardUrlInput] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80');
  const [verifSubmittedSuccess, setVerifSubmittedSuccess] = useState(false);
  const [verifError, setVerifError] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-600 mb-4">Please authenticate to view your author workspace.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  const myArticles = articles.filter((a) => a.authorId === currentUser.id);

  const drafts = myArticles.filter((a) => a.status === 'draft');
  const pendingSubmissions = myArticles.filter((a) => a.status === 'pending_review' || a.status === 'pending_verification');
  const changesRequested = myArticles.filter((a) => a.status === 'changes_requested');
  const published = myArticles.filter((a) => a.status === 'published');
  const rejected = myArticles.filter((a) => a.status === 'rejected');

  const filteredArticles = () => {
    switch (activeTab) {
      case 'drafts': return drafts;
      case 'pending': return pendingSubmissions;
      case 'changes': return changesRequested;
      case 'published': return published;
      case 'rejected': return rejected;
      default: return myArticles;
    }
  };

  const handleVerifSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifError('');
    if (!studentIdInput.trim()) {
      setVerifError('Valid student roll number or registration ID is required.');
      return;
    }

    try {
      requestVerification({
        studentIdNumber: studentIdInput,
        collegeIdCardUrl: idCardUrlInput,
        department: departmentInput,
        batchYear: Number(batchYearInput),
      });
      setVerifSubmittedSuccess(true);
      setTimeout(() => {
        setShowVerifModal(false);
        setVerifSubmittedSuccess(false);
      }, 2000);
    } catch (err: any) {
      setVerifError(err.message || 'Verification submission failed.');
    }
  };

  const currentVerifReq = verificationRequests.find(v => v.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Author Workspace & Submissions
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage your technical manuscripts, peer reviews, revision requests, and academic credentials.
          </p>
        </div>

        {currentUser.verificationStatus === 'verified' && (
          <button
            onClick={() => onNavigate('editor')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Create New Article</span>
          </button>
        )}
      </div>

      {/* Verification Status Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-lg shrink-0 ${
              currentUser.verificationStatus === 'verified' 
                ? 'bg-emerald-50 text-emerald-700' 
                : currentUser.verificationStatus === 'pending'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-rose-50 text-rose-700'
            }`}>
              {currentUser.verificationStatus === 'verified' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : currentUser.verificationStatus === 'pending' ? (
                <Clock className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Institutional Eligibility</span>
                <span className="text-stone-300">·</span>
                <span className={`text-xs font-semibold uppercase ${
                  currentUser.verificationStatus === 'verified' 
                    ? 'text-emerald-700' 
                    : currentUser.verificationStatus === 'pending'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}>
                  {currentUser.verificationStatus === 'verified' 
                    ? 'Verified Student Author' 
                    : currentUser.verificationStatus === 'pending'
                    ? 'Verification Review Pending'
                    : 'Verification Ineligible'}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-900">
                {currentUser.fullName} ({currentUser.department || 'Engineering Student'})
              </div>

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {currentUser.verificationStatus === 'verified' ? (
                  'Your student credentials have been confirmed against college department registries. You are authorized to write articles, participate in peer discussions, and appear on the monthly leaderboard.'
                ) : currentUser.verificationStatus === 'pending' ? (
                  'You registered with a personal email or newly submitted ID. Editorial administrators must verify your student enrollment before your submissions can be reviewed and published.'
                ) : (
                  'Your student verification was not approved. Please review administrator notes or submit an updated student ID card.'
                )}
              </p>
            </div>
          </div>

          {currentUser.verificationStatus !== 'verified' && (
            <button
              onClick={() => setShowVerifModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              {currentVerifReq ? 'View / Update ID Submission' : 'Submit College ID for Verification'}
            </button>
          )}
        </div>
      </div>

      {/* Manuscript Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Drafts</div>
          <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">{drafts.length}</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">In Peer Review</div>
          <div className="text-2xl font-bold font-serif text-amber-700 mt-1 tabular-nums">{pendingSubmissions.length}</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Revisions Needed</div>
          <div className="text-2xl font-bold font-serif text-rose-700 mt-1 tabular-nums">{changesRequested.length}</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Published Papers</div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1 tabular-nums">{published.length}</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Total Views</div>
          <div className="text-2xl font-bold font-serif text-blue-900 mt-1 tabular-nums">
            {myArticles.reduce((acc, a) => acc + (a.viewsCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Revision Policy Alert */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Academic Revision Invariant:</strong> Editing an already published manuscript submits the update to editorial moderation as a pending revision. The current approved version remains accessible to peers until the revision is reviewed and approved.
        </div>
      </div>

      {/* Articles Management Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 border-b border-stone-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Submissions ({myArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'drafts'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Drafts ({drafts.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pending'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Under Review ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'changes'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Changes Requested ({changesRequested.length})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'published'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Published ({published.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'rejected'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rejected ({rejected.length})
          </button>
        </div>

        {/* Article Rows */}
        <div className="space-y-3">
          {filteredArticles().length > 0 ? (
            filteredArticles().map((article) => {
              const statusColors: Record<ArticleStatus, { bg: string; text: string; label: string }> = {
                draft: { bg: 'bg-stone-100', text: 'text-stone-700', label: 'Draft' },
                pending_verification: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'Pending Author Verification' },
                pending_review: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'In Editorial Review' },
                changes_requested: { bg: 'bg-rose-50', text: 'text-rose-800', label: 'Revision Requested' },
                approved: { bg: 'bg-emerald-50', text: 'text-emerald-800', label: 'Approved for Publication' },
                published: { bg: 'bg-emerald-50', text: 'text-emerald-800', label: 'Published' },
                rejected: { bg: 'bg-rose-50', text: 'text-rose-800', label: 'Rejected' },
              };

              const statusMeta = statusColors[article.status];

              return (
                <div
                  key={article.id}
                  className="p-5 bg-white border border-stone-200 rounded-lg shadow-2xs hover:border-slate-400 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded font-medium ${statusMeta.bg} ${statusMeta.text}`}>
                        {statusMeta.label}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-slate-500">{article.category?.name}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-slate-400">Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {article.status === 'published' && (
                        <button
                          onClick={() => onSelectArticle(article.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-900 border border-stone-200 rounded inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Public Page</span>
                        </button>
                      )}

                      <button
                        onClick={() => onEditArticle(article.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>
                          {article.status === 'published' ? 'Revise Manuscript' : 'Edit Article'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-950">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {article.summary}
                    </p>
                  </div>

                  {/* Changes Feedback Callout */}
                  {article.status === 'changes_requested' && article.changesFeedback && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 space-y-1">
                      <div className="font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                        <span>Editorial Board Feedback:</span>
                      </div>
                      <p className="leading-relaxed pl-4">{article.changesFeedback}</p>
                    </div>
                  )}

                  {/* Rejection Reason Callout */}
                  {article.status === 'rejected' && article.rejectionReason && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 space-y-1">
                      <div className="font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-700" />
                        <span>Rejection Reason:</span>
                      </div>
                      <p className="leading-relaxed pl-4">{article.rejectionReason}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center border border-dashed border-stone-300 rounded-lg bg-white p-6">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">
                No submissions in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* College ID Verification Modal */}
      {showVerifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Student Verification Request
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To preserve academic trust and prevent impersonation, students registered with personal emails must provide university enrollment proof.
            </p>

            {verifSubmittedSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-900">Verification Request Submitted</div>
                <div className="text-xs text-slate-500">
                  The editorial committee will review your college enrollment within 24 hours.
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifSubmit} className="space-y-3">
                {verifError && (
                  <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                    {verifError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Roll Number / University PRN
                  </label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. DYP2023CS084"
                    required
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={departmentInput}
                      onChange={(e) => setDepartmentInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                    >
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecom</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Graduation Batch Year
                    </label>
                    <input
                      type="number"
                      value={batchYearInput}
                      onChange={(e) => setBatchYearInput(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College ID Card Scan / Verification Proof URL
                  </label>
                  <input
                    type="text"
                    value={idCardUrlInput}
                    onChange={(e) => setIdCardUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Stored in private access-controlled storage bucket restricted to review administrators.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowVerifModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded cursor-pointer"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
