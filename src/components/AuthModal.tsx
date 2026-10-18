import React, { useState } from 'react';
import { useTechVerseStore } from '../lib/store';
import { ALLOWED_EMAIL_DOMAINS, INSTITUTION_NAME } from '../lib/supabase';
import { ShieldCheck, Mail, CheckCircle2, User, Building, GraduationCap, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { authenticateWithEmail, switchUser, users } = useTechVerseStore();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Engineering');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const emailDomain = email.includes('@') ? email.split('@')[1].toLowerCase().trim() : '';
  const isInstitutional = ALLOWED_EMAIL_DOMAINS.includes(emailDomain);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setError('Full legal student name is required.');
      return;
    }

    try {
      const res = authenticateWithEmail(
        email, 
        mode === 'register' ? fullName : (email.split('@')[0]), 
        studentId, 
        department
      );
      setInfoMessage(res.message);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Collegiate Academic Auth</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {mode === 'signin' ? 'Sign In to TechVerse' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-600">
            Access author workspaces, peer reviews, and publishable manuscripts.
          </p>
        </div>

        {/* Demo Fast Switcher Bar for Reviewers */}
        <div className="p-3 bg-stone-100 rounded-lg text-xs space-y-2 border border-stone-200">
          <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
            Quick Persona Switch (Evaluation Mode)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {users.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u.id);
                  onSuccess();
                  onClose();
                }}
                className="text-left p-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded truncate cursor-pointer text-slate-800"
              >
                <div className="font-medium text-[11px] truncate">{u.fullName}</div>
                <div className="text-[10px] text-slate-400 capitalize">{u.role} · {u.verificationStatus}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            {error}
          </div>
        )}
        {infoMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">
            {infoMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name (as per Student ID) *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aditya Sharma"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@dypatil.edu or personal@gmail.com"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
            />
            {email.includes('@') && (
              <div className="mt-1 text-[11px]">
                {isInstitutional ? (
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official Institutional Domain ({emailDomain}) recognized</span>
                  </span>
                ) : (
                  <span className="text-amber-700">
                    Personal domain. Will require college ID submission before publishing.
                  </span>
                )}
              </div>
            )}
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Roll / PRN
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. DYP2023CS012"
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="Computer Engineering">Computer Engg</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Artificial Intelligence & Data Science">AI & DS</option>
                    <option value="Electronics & Telecommunication">ETC</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer shadow-xs mt-2"
          >
            {mode === 'signin' ? 'Sign In to Author Account' : 'Register Student Account'}
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-stone-100">
          {mode === 'signin' ? (
            <span>
              Enrolling for the first time?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-900 font-semibold hover:underline cursor-pointer"
              >
                Register Account
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-900 font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
