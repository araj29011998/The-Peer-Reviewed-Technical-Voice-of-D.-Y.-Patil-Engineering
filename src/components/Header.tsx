import React, { useState } from 'react';
import { useTechVerseStore } from '../lib/store';
import { 
  BookOpen, 
  PenSquare, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Database, 
  ChevronDown,
  Menu,
  X,
  FileText
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: () => void;
  onOpenSetupGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenSetupGuide,
}) => {
  const { currentUser, switchUser, users, isSupabaseLive, verificationRequests, articles } = useTechVerseStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingReviewCount = articles.filter(a => a.status === 'pending_review').length;
  const pendingVerifCount = verificationRequests.filter(v => v.status === 'pending').length;
  const adminPendingTotal = pendingReviewCount + pendingVerifCount;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top operational environment indicator ribbon */}
      <div className="bg-slate-900 text-stone-300 px-4 py-1 text-xs border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">D. Y. Patil College of Engineering & Technology</span>
          <span className="text-slate-500">/</span>
          <span className="hidden sm:inline text-slate-400">Institutional Technical Publishing Platform</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSetupGuide}
            className="text-stone-300 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs">
              {isSupabaseLive ? 'Supabase: Connected' : 'Storage: Demo Sandbox (SQL Ready)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs group-hover:bg-blue-900 transition-colors">
              Ψ
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                DY Patil TechVerse
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <button 
              onClick={() => onNavigate('home')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'home' ? 'text-blue-950 font-semibold border-b-2 border-blue-950 py-1' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('explore')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'explore' ? 'text-blue-950 font-semibold border-b-2 border-blue-950 py-1' : ''
              }`}
            >
              Explore
            </button>
            <button 
              onClick={() => onNavigate('leaderboard')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'leaderboard' ? 'text-blue-950 font-semibold border-b-2 border-blue-950 py-1' : ''
              }`}
            >
              Leaderboard
            </button>
            <button 
              onClick={() => onNavigate('guidelines')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'guidelines' ? 'text-blue-950 font-semibold border-b-2 border-blue-950 py-1' : ''
              }`}
            >
              Author Guidelines
            </button>
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => onNavigate('admin-portal')}
                className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'admin-portal' ? 'text-blue-950 font-semibold border-b-2 border-blue-950 py-1' : 'text-amber-800'
                }`}
              >
                <span>Editorial Admin</span>
                {adminPendingTotal > 0 && (
                  <span className="bg-amber-100 text-amber-900 text-xs px-1.5 py-0.2 rounded-full font-semibold">
                    {adminPendingTotal}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action & Account controls */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.verificationStatus === 'verified' && (
                  <button
                    onClick={() => onNavigate('editor')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    <span>Write Article</span>
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-stone-100 border border-stone-200 text-slate-800 transition-colors text-xs font-medium cursor-pointer"
                  >
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-semibold">
                        {currentUser.fullName.charAt(0)}
                      </div>
                    )}
                    <span className="max-w-[120px] truncate hidden sm:inline">
                      {currentUser.fullName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 text-slate-800 text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-stone-100">
                        <div className="font-semibold text-slate-900 text-sm truncate">{currentUser.fullName}</div>
                        <div className="text-slate-500 truncate">{currentUser.email}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span className="font-medium text-slate-700 capitalize">{currentUser.role}</span>
                          <span>·</span>
                          <span className={currentUser.verificationStatus === 'verified' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                            {currentUser.verificationStatus === 'verified' ? 'Verified Student Author' : 'Verification Pending'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('student-dashboard');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-slate-500" />
                          <span>Author Dashboard & Submissions</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('author-profile', currentUser.id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <span>View Public Profile</span>
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('admin-portal');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center gap-2 text-amber-900 font-medium cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            <span>Editorial Moderation Portal</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-stone-100 pt-1 mt-1">
                        <div className="px-4 py-1 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          Switch Persona (Demo Evaluation)
                        </div>
                        {users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                              u.id === currentUser.id ? 'bg-stone-100 font-semibold text-slate-900' : 'text-slate-600'
                            }`}
                          >
                            <span className="truncate">{u.fullName} ({u.role})</span>
                            <span className="text-[10px] text-slate-400 capitalize">{u.verificationStatus}</span>
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-stone-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            switchUser(null);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-rose-700 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-stone-50 rounded"
          >
            Home
          </button>
          <button 
            onClick={() => { onNavigate('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-stone-50 rounded"
          >
            Explore
          </button>
          <button 
            onClick={() => { onNavigate('leaderboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-stone-50 rounded"
          >
            Leaderboard
          </button>
          <button 
            onClick={() => { onNavigate('guidelines'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-stone-50 rounded"
          >
            Author Guidelines
          </button>
          {currentUser && (
            <button 
              onClick={() => { onNavigate('student-dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-blue-900 hover:bg-stone-50 rounded"
            >
              My Author Dashboard
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => { onNavigate('admin-portal'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded"
            >
              Admin Moderation Portal ({adminPendingTotal})
            </button>
          )}
        </div>
      )}
    </header>
  );
};
