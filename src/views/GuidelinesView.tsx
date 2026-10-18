import React from 'react';
import { ShieldCheck, BookOpen, CheckCircle2, Code2, AlertTriangle, FileCheck } from 'lucide-react';

export const GuidelinesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="border-b border-stone-200 pb-6">
        <div className="text-xs font-mono text-blue-900 uppercase tracking-widest">
          Editorial & Academic Integrity Manual
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
          Author Guidelines & Peer-Review Standards
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          The definitive publication handbook for undergraduate student researchers, software engineers, and faculty mentors submitting technical manuscripts to DY Patil TechVerse.
        </p>
      </div>

      {/* 1. Core Publication Principles */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-900" />
          <span>1. Scope and Eligibility</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          DY Patil TechVerse publishes original, peer-reviewed technical manuscripts produced by currently enrolled students and faculty across all engineering disciplines. Manuscripts should document:
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
          <li><strong>Architectural Case Studies:</strong> Deep dives into distributed systems, network security protocols, database engines, or microservices.</li>
          <li><strong>Empirical Engineering Benchmarks:</strong> Reproducible latency, throughput, power consumption, or memory footprint evaluations.</li>
          <li><strong>Applied Hardware & Firmware:</strong> Embedded C/C++ firmware, FPGA designs, RISC-V extensions, and IoT field telemetry.</li>
          <li><strong>Undergraduate Capstone Syntheses:</strong> High-impact capstone project findings and open-source contributions.</li>
        </ul>
      </section>

      {/* 2. Manuscript Structure */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-900" />
          <span>2. Mandatory Manuscript Structure</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <strong>1. Title & Abstract (30–100 words):</strong> Concisely articulate the engineering objective, baseline constraints, and quantitative outcomes.
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <strong>2. Theoretical Context & System Design:</strong> Explain the underlying algorithms, network topologies, or circuit schematics.
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <strong>3. Reproducible Implementation & Code:</strong> Provide syntactically clean code snippets with explicit language identifiers and commented parameters.
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <strong>4. Results, Metrics & Failure Modes:</strong> Detail quantitative measurements, hardware testbeds, and known limitations.
          </div>
        </div>
      </section>

      {/* 3. Code & Reproducibility */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-900" />
          <span>3. Code Standards & Laboratory Reproducibility</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Submitted code must be executable on campus laboratory instruments or consumer workstations. Authors are prohibited from publishing synthetic mock data or unverified claims.
        </p>
      </section>

      {/* 4. Academic Integrity & Ethics */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>4. Plagiarism & Generative Text Policy</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Unattributed copying of text, diagrams, or code from external publications or peer authors will result in immediate disqualification, unpublishing, and referral to the Departmental Academic Disciplinary Committee. AI-assisted grammatical refinement is permitted, but all code, architectural diagrams, and experimental measurements must be the original work of the authoring student.
        </p>
      </section>

      {/* 5. Editorial Workflow */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>5. Editorial Review Lifecycle</span>
        </h2>
        <div className="p-4 bg-stone-50 rounded border border-stone-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <span>Status Flow:</span>
            <span className="font-mono text-blue-950">Draft ➔ Pending Review ➔ Changes Requested ➔ Approved & Published</span>
          </div>
          <p className="leading-relaxed">
            Faculty reviewers have a 5-day review window. If revisions are required, the reviewer will record explicit feedback directly visible in your Author Workspace.
          </p>
        </div>
      </section>

    </div>
  );
};
