import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { AuthorProfileView } from './views/AuthorProfileView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { ArticleEditorView } from './views/ArticleEditorView';
import { AdminPortalView } from './views/AdminPortalView';
import { LeaderboardView } from './views/LeaderboardView';
import { GuidelinesView } from './views/GuidelinesView';
import { AuthModal } from './components/AuthModal';
import { SetupGuideModal } from './components/SetupGuideModal';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('art-1');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>('usr-student-1');
  const [editingArticleId, setEditingArticleId] = useState<string | undefined>(undefined);
  const [exploreCategoryId, setExploreCategoryId] = useState<string | undefined>(undefined);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedArticleId, selectedAuthorId, editingArticleId]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'explore') {
      setExploreCategoryId(param);
      setCurrentView('explore');
    } else if (view === 'article-detail' && param) {
      setSelectedArticleId(param);
      setCurrentView('article-detail');
    } else if (view === 'author-profile' && param) {
      setSelectedAuthorId(param);
      setCurrentView('author-profile');
    } else if (view === 'editor') {
      setEditingArticleId(param);
      setCurrentView('editor');
    } else {
      setCurrentView(view);
    }
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView('article-detail');
  };

  const handleSelectAuthor = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setCurrentView('author-profile');
  };

  const handleEditArticle = (articleId: string) => {
    setEditingArticleId(articleId);
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navigation */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSetupGuide={() => setSetupGuideOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            initialCategoryId={exploreCategoryId}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
          />
        )}

        {currentView === 'article-detail' && (
          <ArticleDetailView
            articleId={selectedArticleId}
            onBack={() => setCurrentView('explore')}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'author-profile' && (
          <AuthorProfileView
            authorId={selectedAuthorId}
            onBack={() => setCurrentView('explore')}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboardView
            onNavigate={handleNavigate}
            onEditArticle={handleEditArticle}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentView === 'editor' && (
          <ArticleEditorView
            existingArticleId={editingArticleId}
            onBack={() => setCurrentView('student-dashboard')}
            onSuccess={(savedId) => {
              setSelectedArticleId(savedId);
              setCurrentView('student-dashboard');
            }}
          />
        )}

        {currentView === 'admin-portal' && (
          <AdminPortalView
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            onSelectAuthor={handleSelectAuthor}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentView === 'guidelines' && (
          <GuidelinesView />
        )}
      </main>

      {/* Academic Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSetupGuide={() => setSetupGuideOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          // Handled
        }}
      />

      {/* Production & Supabase Setup Guide Modal */}
      <SetupGuideModal
        isOpen={setupGuideOpen}
        onClose={() => setSetupGuideOpen(false)}
      />

    </div>
  );
}
