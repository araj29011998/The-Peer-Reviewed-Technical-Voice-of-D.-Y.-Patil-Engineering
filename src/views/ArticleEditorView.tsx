import React, { useState, useEffect } from 'react';
import { useTechVerseStore } from '../lib/store';
import { RichArticleViewer } from '../components/RichArticleViewer';
import { 
  ArrowLeft, 
  Eye, 
  PenTool, 
  Save, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Code, 
  Heading2, 
  Heading3, 
  Bold, 
  Italic, 
  Quote, 
  List, 
  Link2,
  Clock,
  Sparkles
} from 'lucide-react';

interface ArticleEditorViewProps {
  existingArticleId?: string;
  onBack: () => void;
  onSuccess: (articleId: string) => void;
}

export const ArticleEditorView: React.FC<ArticleEditorViewProps> = ({
  existingArticleId,
  onBack,
  onSuccess,
}) => {
  const { articles, categories, currentUser, saveArticle } = useTechVerseStore();

  const existingArticle = existingArticleId
    ? articles.find((a) => a.id === existingArticleId)
    : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [summary, setSummary] = useState(existingArticle?.summary || '');
  const [content, setContent] = useState(
    existingArticle?.content || 
    `## 1. Introduction & Theoretical Motivation

Briefly contextualize the engineering problem, baseline constraints, and research hypothesis...

## 2. System Architecture & Implementation

Provide detailed methodology, circuit schematics, or algorithmic routines.

\`\`\`python
# Example benchmarking routine
def evaluate_latency():
    pass
\`\`\`

## 3. Empirical Results & Discussion

Detail measured observations, hardware testbeds, and failure mode analysis.

## 4. Conclusion & Future Scope

Summarize findings and prospective research directions for collegiate peers.`
  );
  const [categoryId, setCategoryId] = useState(
    existingArticle?.categoryId || categories[0]?.id || ''
  );
  const [tagsInput, setTagsInput] = useState(existingArticle?.tags?.join(', ') || '');
  const [coverImageUrl, setCoverImageUrl] = useState(
    existingArticle?.coverImageUrl || '/src/assets/images/hero_techverse_magazine_1791975433144.jpg'
  );
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset academic cover photography from our high-res generated assets
  const coverPresets = [
    { label: 'Quantum Lab / AI Computing', url: '/src/assets/images/hero_techverse_magazine_1791975433144.jpg' },
    { label: 'Distributed Systems & Nodes', url: '/src/assets/images/article_distributed_systems_1791975433559.jpg' },
    { label: 'Zero-Trust Cybersecurity', url: '/src/assets/images/article_cybersecurity_zero_trust_1791975433507.jpg' },
    { label: 'RISC-V Edge Silicon / IoT', url: '/src/assets/images/article_iot_embedded_edge_1791975433737.jpg' },
  ];

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(2, Math.ceil(wordCount / 200));

  const isPublishedRevision = existingArticle?.status === 'published';

  // Toolbar action helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  const handleSave = async (submitForReview: boolean) => {
    setStatusMessage(null);

    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'Article title is mandatory.' });
      return;
    }
    if (title.length < 10) {
      setStatusMessage({ type: 'error', text: 'Title must be at least 10 characters long for academic rigor.' });
      return;
    }
    if (!summary.trim() || summary.length < 30) {
      setStatusMessage({ type: 'error', text: 'A concise technical abstract/summary (minimum 30 characters) is required.' });
      return;
    }
    if (wordCount < 150) {
      setStatusMessage({ type: 'error', text: `Article body must contain at least 150 words (currently ${wordCount} words).` });
      return;
    }

    if (submitForReview && currentUser?.verificationStatus !== 'verified') {
      setStatusMessage({ 
        type: 'error', 
        text: 'Only verified college students and faculty can submit for peer review. Please submit your college ID verification first.' 
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter((t) => t.length > 0);

      const savedId = saveArticle({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        categoryId,
        tags: parsedTags,
        coverImageUrl,
        submitForReview,
        existingArticleId: existingArticle?.id,
      });

      setStatusMessage({
        type: 'success',
        text: submitForReview
          ? (isPublishedRevision 
              ? 'Revision submitted! Editorial board will review your update. Live article remains online until approval.' 
              : 'Manuscript submitted successfully to the editorial review queue!')
          : 'Draft saved successfully.',
      });

      setTimeout(() => {
        onSuccess(savedId);
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save article.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              {existingArticle ? 'Edit Technical Manuscript' : 'Author New Technical Article'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{isPublishedRevision ? 'Live Revision Mode' : 'Drafting Phase'}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums">{estimatedReadTime} min read (~{wordCount} words)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
              isPreviewMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {isPreviewMode ? <PenTool className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreviewMode ? 'Edit Mode' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className={`p-4 rounded-lg text-xs font-medium flex items-start gap-2.5 ${
          statusMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {statusMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{statusMessage.text}</span>
        </div>
      )}

      {isPublishedRevision && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Published Article Revision:</strong> Submitting changes will trigger editorial review. The current live version remains visible on the platform until this revised draft is reviewed and approved by faculty moderators.
          </div>
        </div>
      )}

      {/* Editor or Preview Pane */}
      {isPreviewMode ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs uppercase font-mono text-blue-900 tracking-wider">
              Previewing: {categories.find((c) => c.id === categoryId)?.name}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              {title || 'Untitled Manuscript'}
            </h1>
            <p className="text-sm text-slate-600 italic mt-2">
              {summary || 'No summary provided.'}
            </p>
          </div>

          {coverImageUrl && (
            <div className="aspect-16/9 w-full rounded-lg overflow-hidden bg-slate-900">
              <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="pt-4">
            <RichArticleViewer content={content} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Writing Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Architecting High-Throughput Raft Consensus in Go: Cluster Benchmarks"
                className="w-full px-4 py-2.5 text-base sm:text-lg font-serif font-bold text-slate-900 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 shadow-2xs placeholder:font-sans placeholder:text-sm placeholder:font-normal"
              />
            </div>

            {/* Summary / Abstract */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Technical Abstract / Summary *
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Concise 1–2 sentence overview summarizing the engineering problem, methodology, and key experimental findings..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 shadow-2xs"
              />
            </div>

            {/* Markdown Toolbar */}
            <div className="border border-stone-300 rounded-md bg-stone-50 overflow-hidden shadow-2xs">
              <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-100 border-b border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => insertFormatting('## ', '')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <span className="w-px h-4 bg-stone-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('`', '`')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer font-mono text-xs"
                  title="Inline Code"
                >
                  &lt;/&gt;
                </button>
                <span className="w-px h-4 bg-stone-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('\n```python\n# Code snippet\n', '\n```\n')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ', '')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ', '')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('[Link Title](', ')')}
                  className="p-1.5 rounded hover:bg-stone-200 text-slate-700 cursor-pointer"
                  title="External Hyperlink"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="article-content-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full p-4 font-mono text-xs sm:text-sm bg-white text-slate-900 focus:outline-none resize-y leading-relaxed"
                placeholder="Compose your article using Markdown (headings, lists, code blocks, blockquotes)..."
              />
            </div>
          </div>

          {/* Metadata & Media Sidebar (1 Col) */}
          <div className="space-y-5">
            
            {/* Category Selector */}
            <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Engineering Discipline *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
              >
                {categories.filter(c => c.isActive).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Select the most applicable technical category for peer indexing.
              </p>
            </div>

            {/* Tags / Keywords */}
            <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Keywords & Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Distributed Systems, Go, Raft, Networking"
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <p className="text-[11px] text-slate-500">
                Comma-separated keywords for discoverability and citation.
              </p>
            </div>

            {/* Cover Image Selection */}
            <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Cover Image
              </label>

              {coverImageUrl && (
                <div className="aspect-16/9 w-full rounded overflow-hidden bg-slate-900">
                  <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Image URL or choose preset below"
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-600">Preset Academic Themes:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {coverPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImageUrl(preset.url)}
                      className={`text-left p-1.5 text-[11px] rounded border truncate cursor-pointer ${
                        coverImageUrl === preset.url
                          ? 'border-blue-900 bg-blue-50 font-semibold text-blue-950'
                          : 'border-stone-200 hover:bg-stone-50 text-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Standards Check */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-2 text-slate-600">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Peer-Review Criteria</span>
              </div>
              <ul className="space-y-1 list-disc pl-4 text-[11px]">
                <li>Code must be reproducible on campus lab hardware.</li>
                <li>Cite external research papers & RFC protocols.</li>
                <li>No auto-generated unverified text or synthetic citations.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
