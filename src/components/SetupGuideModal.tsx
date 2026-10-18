import React, { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { Database, Copy, Check, ShieldCheck, X, Terminal, Server, FileCode } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const isLive = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopySqlNotice = () => {
    navigator.clipboard.writeText(`-- See full migration at /supabase/migrations/20260401000000_techverse_schema.sql
-- Contains full schema, RLS policies, leaderboard tie-breaker view, and bootstrap_admin() procedure.`);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-900" />
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Production Architecture & Supabase Integration
              </h2>
              <div className="text-xs text-slate-500">
                Backend status, SQL migrations, and deployment guidelines
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed flex-1">
          
          {/* Status Box */}
          <div className={`p-4 rounded-lg border ${
            isLive 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2 font-semibold text-sm mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Current Status: {isLive ? 'Live Supabase Connected' : 'Preview Sandbox Mode Active'}</span>
            </div>
            <p>
              {isLive
                ? 'Your VITE_SUPABASE_URL and anon key are connected. Authentication, RLS policies, and PostgreSQL queries are live.'
                : 'Supabase credentials are not detected in the current environment. The platform is running in Sandbox Mode with realistic preloaded college engineering data, persisting locally so all submissions, moderation actions, and rankings can be evaluated seamlessly.'}
            </p>
          </div>

          {/* Quick Setup Steps */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Connecting to Production Supabase
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
              <li>Create a Supabase project at <code className="bg-stone-100 px-1 py-0.5 rounded">supabase.com</code>.</li>
              <li>Execute the SQL migration located at <code className="bg-stone-100 px-1 py-0.5 rounded text-blue-950 font-mono">/supabase/migrations/20260401000000_techverse_schema.sql</code> in the Supabase SQL Editor.</li>
              <li>Create two storage buckets in Supabase: <code className="bg-stone-100 px-1 py-0.5 rounded">article-covers</code> (public) and <code className="bg-stone-100 px-1 py-0.5 rounded">verification-documents</code> (private).</li>
              <li>Provide <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> in your environment.</li>
            </ol>
          </div>

          {/* Secure Admin Bootstrap */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Creating the First Administrator Securely
            </h3>
            <p className="text-slate-600">
              Never store admin credentials in client code. Once the coordinator signs up with their institutional email, run this trusted SQL function in Supabase:
            </p>
            <div className="p-3 bg-slate-950 text-slate-100 font-mono rounded text-[11px] overflow-x-auto">
              SELECT public.bootstrap_admin(&apos;coordinator@dypatil.edu&apos;, &apos;authorized-by-hod&apos;);
            </div>
          </div>

          {/* Migration File Location */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-900" />
              <div>
                <div className="font-semibold text-slate-900">SQL Migration File Ready</div>
                <div className="text-[11px] text-slate-500">supabase/migrations/20260401000000_techverse_schema.sql</div>
              </div>
            </div>
            <button
              onClick={handleCopySqlNotice}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded hover:bg-stone-100 inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Path Copied' : 'Copy SQL Path'}</span>
            </button>
          </div>

          {/* Production Checklist */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Vercel & Production Checklist
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Deploy repository to Vercel with framework preset <strong>Vite / Next.js</strong>.</li>
              <li>Set <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">VITE_ALLOWED_EMAIL_DOMAINS</code> to match official DY Patil campuses.</li>
              <li>Verify that Row Level Security (RLS) is enabled on all tables in Supabase.</li>
              <li>See <code className="bg-stone-100 px-1 py-0.5 rounded">DEPLOYMENT_AND_SETUP.md</code> for the complete deployment guide.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
