import React from 'react';
import { INSTITUTION_NAME, PLATFORM_NAME } from '../lib/supabase';
import { ShieldCheck, BookOpen, FileCode, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSetupGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSetupGuide }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Institutional Brand & Scope */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-blue-700 text-white flex items-center justify-center font-serif font-bold text-sm">
                Ψ
              </span>
              <span className="text-white font-bold tracking-tight text-base font-serif">
                {PLATFORM_NAME}
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              The official peer-reviewed student research and technical publishing journal of {INSTITUTION_NAME}. Encouraging rigorous technical inquiry, software architecture documentation, and student innovation across undergraduate engineering departments.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-stone-400">
              <span className="inline-flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Double-blind peer review
              </span>
              <span className="inline-flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Verified student authors
              </span>
            </div>
          </div>

          {/* Col 2: Publication & Discovery */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Journal Sections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors cursor-pointer">
                  Explore Publications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-white transition-colors cursor-pointer">
                  Monthly Contributor Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guidelines')} className="hover:text-white transition-colors cursor-pointer">
                  Peer Review & Editorial Standards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('student-dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Student Verification Workflow
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology & Governance */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Engineering & Stack
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={onOpenSetupGuide} className="hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Supabase Schema & RLS Policies</span>
                </button>
              </li>
              <li>
                <span className="text-stone-500">PostgreSQL 15+ with Row Level Security</span>
              </li>
              <li>
                <span className="text-stone-500">Institutional Email Domain Regex</span>
              </li>
              <li>
                <span className="text-stone-500">Vercel & Next.js Production Ready</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {INSTITUTION_NAME}. All technical submissions remain copyright of their student authors under CC BY-NC-SA 4.0.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <button onClick={() => onNavigate('guidelines')} className="hover:text-stone-300">
              Academic Honor Code
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('guidelines')} className="hover:text-stone-300">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={onOpenSetupGuide} className="hover:text-stone-300">
              Admin Bootstrapping Procedure
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
