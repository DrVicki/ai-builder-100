// Signal & Clarity — Certificate Page
// Renders a downloadable completion certificate once all 5 modules are 100% complete
import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Award, Download, CheckCircle2, Lock, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useProgress } from '@/contexts/ProgressContext';
import { MODULES } from '@/lib/data';
import { toast } from 'sonner';

// ─── Certificate visual component ────────────────────────────────────────────
function CertificateCard({ name, date }: { name: string; date: string }) {
  return (
    <div
      id="certificate-card"
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, oklch(0.18 0.06 255) 0%, oklch(0.14 0.05 255) 50%, oklch(0.18 0.06 270) 100%)',
        border: '1px solid oklch(0.55 0.22 260 / 40%)',
        boxShadow: '0 0 60px oklch(0.55 0.22 260 / 20%), inset 0 0 80px oklch(0.55 0.22 260 / 5%)',
      }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[oklch(0.85_0.25_135/60%)] rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[oklch(0.85_0.25_135/60%)] rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[oklch(0.85_0.25_135/60%)] rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[oklch(0.85_0.25_135/60%)] rounded-br-xl" />

      {/* Decorative glow orbs */}
      <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-[oklch(0.55_0.22_260/8%)] blur-2xl pointer-events-none" />
      <div className="absolute bottom-8 left-12 w-24 h-24 rounded-full bg-[oklch(0.85_0.25_135/6%)] blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative px-10 py-12 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[oklch(0.85_0.25_135/15%)] border-2 border-[oklch(0.85_0.25_135/50%)] flex items-center justify-center">
            <Award size={28} className="text-[oklch(0.85_0.25_135)]" />
          </div>
        </div>

        {/* Header text */}
        <p className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-[0.3em] text-[oklch(0.65_0.22_260)] mb-2">
          Certificate of Completion
        </p>
        <p className="text-sm text-white/40 font-['DM_Sans'] mb-6">This certifies that</p>

        {/* Name */}
        <h2
          className="font-['Barlow_Condensed'] font-800 text-white mb-6"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.1,
            textShadow: '0 0 40px oklch(0.65 0.22 260 / 40%)',
          }}
        >
          {name || 'Your Name'}
        </h2>

        <p className="text-sm text-white/50 font-['DM_Sans'] mb-2">has successfully completed</p>

        {/* Course name */}
        <div className="mb-2">
          <span
            className="font-['Barlow_Condensed'] font-700 text-[oklch(0.75_0.15_260)] text-xl"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
          >
            AI Builder 100
          </span>
        </div>
        <p className="text-white/60 font-['DM_Sans'] text-sm mb-8">
          Foundations for Application
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[oklch(0.55_0.22_260/40%)]" />
          <div className="w-2 h-2 rounded-full bg-[oklch(0.85_0.25_135/60%)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[oklch(0.55_0.22_260/40%)]" />
        </div>

        {/* Modules row */}
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {MODULES.map((m) => (
            <div
              key={m.slug}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[oklch(0.85_0.25_135/25%)] bg-[oklch(0.85_0.25_135/8%)]"
            >
              <CheckCircle2 size={11} className="text-[oklch(0.85_0.25_135)]" />
              <span className="text-xs text-white/60 font-['DM_Sans']">{m.title}</span>
            </div>
          ))}
        </div>

        {/* Date + Credential ID */}
        <div className="flex items-end justify-between">
          <div className="text-left">
            <div className="text-xs text-white/30 font-['DM_Sans'] mb-0.5">Date of Completion</div>
            <div className="text-sm font-['Barlow_Condensed'] font-600 text-white/70" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {date}
            </div>
          </div>
            <div className="text-center">
              <div className="text-xs text-white/30 font-['DM_Sans'] mb-1">Issued by</div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-[oklch(0.55_0.22_260)] flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">AI</span>
                  </div>
                  <span className="text-xs font-['Barlow_Condensed'] font-700 text-white/60" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    AI Builder 100
                  </span>
                </div>
                <span className="text-[10px] text-white/35 font-['DM_Sans']">Dr. Vicki Bealman</span>
              </div>
            </div>
          <div className="text-right">
            <div className="text-xs text-white/30 font-['DM_Sans'] mb-0.5">Credential ID</div>
            <div className="text-xs font-['Barlow_Condensed'] font-600 text-white/50 font-mono" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              AIB100-{Math.abs(name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 7919).toString(16).toUpperCase().slice(0, 8)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Module progress row ──────────────────────────────────────────────────────
function ModuleProgressRow({ mod }: { mod: typeof MODULES[0] }) {
  const { getModuleProgress } = useProgress();
  const p = getModuleProgress(mod.slug);
  const done = p.completed === p.total && p.total > 0;
  return (
    <Link href={`/module/${mod.slug}`}>
      <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all group ${done ? 'border-[oklch(0.85_0.25_135/30%)] bg-[oklch(0.85_0.25_135/5%)]' : 'border-white/10 bg-[oklch(0.20_0.04_255)] hover:border-white/20'}`}>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? 'border-[oklch(0.85_0.25_135)] bg-[oklch(0.85_0.25_135/15%)]' : 'border-white/20 bg-white/5'}`}>
          {done
            ? <CheckCircle2 size={14} className="text-[oklch(0.85_0.25_135)]" />
            : <span className="text-xs font-['Barlow_Condensed'] font-700 text-white/30" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{mod.number}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-['DM_Sans'] font-500 ${done ? 'text-white/80' : 'text-white/60'}`}>{mod.title}</span>
            <span className="text-xs text-white/30 font-['DM_Sans'] flex-shrink-0 ml-2">{p.completed}/{p.total}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-[oklch(0.85_0.25_135)]' : 'bg-[oklch(0.55_0.22_260)]'}`} style={{ width: `${p.percent}%` }} />
          </div>
        </div>
        <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Certificate() {
  const { getOverallProgress } = useProgress();
  const overall = getOverallProgress();
  const isEligible = overall.completedModules === overall.totalModules && overall.totalModules > 0;

  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleGenerate = () => {
    if (!name.trim()) {
      toast.error('Please enter your full name to generate the certificate');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      certRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleDownload = () => {
    toast.success('Certificate saved — use your browser\'s Print > Save as PDF to download');
    window.print();
  };

  return (
    <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white">
      <Navbar />

      <div className="container pt-28 pb-24 max-w-3xl">
        {/* Back */}
        <Link href="/dashboard">
          <div className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 font-['DM_Sans']">
            <ArrowLeft size={14} /> Back to My Progress
          </div>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)] mb-3">
            Certificate of Completion
          </div>
          <h1
            className="font-['Barlow_Condensed'] font-800 text-white mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}
          >
            Your Certificate
          </h1>
          <p className="text-white/50 font-['DM_Sans'] text-sm leading-relaxed">
            Complete all 5 modules to unlock your personalised certificate of completion.
          </p>
        </div>

        {/* ── LOCKED STATE ─────────────────────────────────────────────────── */}
        {!isEligible && (
          <div className="space-y-6">
            {/* Lock banner */}
            <div className="rounded-lg border border-white/15 bg-[oklch(0.20_0.04_255)] p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Lock size={18} className="text-white/40" />
              </div>
              <div>
                <h3 className="font-['Barlow_Condensed'] font-700 text-white text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Certificate Locked
                </h3>
                <p className="text-sm text-white/50 font-['DM_Sans'] leading-relaxed">
                  You have completed <span className="text-white font-semibold">{overall.completedModules}</span> of <span className="text-white font-semibold">{overall.totalModules}</span> modules.
                  Finish all remaining modules to unlock your certificate.
                </p>
              </div>
            </div>

            {/* Overall progress */}
            <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['Barlow_Condensed'] font-700 text-white text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Overall Progress
                </span>
                <span className="text-sm font-['Barlow_Condensed'] font-700 text-[oklch(0.65_0.22_260)]">{overall.percent}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-gradient-to-r from-[oklch(0.55_0.22_260)] to-[oklch(0.85_0.25_135)] rounded-full transition-all duration-700"
                  style={{ width: `${overall.percent}%` }}
                />
              </div>
              <div className="space-y-2">
                {MODULES.map((mod) => <ModuleProgressRow key={mod.slug} mod={mod} />)}
              </div>
            </div>

            {/* Preview (blurred) */}
            <div>
              <p className="text-xs text-white/30 font-['DM_Sans'] mb-3 text-center">Certificate preview (unlocks when all modules are complete)</p>
              <div className="relative">
                <div className="blur-sm opacity-40 pointer-events-none">
                  <CertificateCard name="Your Name Here" date={today} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[oklch(0.16_0.04_255/80%)] backdrop-blur-sm rounded-xl px-8 py-5 border border-white/10 text-center">
                    <Lock size={24} className="text-white/40 mx-auto mb-2" />
                    <p className="text-sm font-['Barlow_Condensed'] font-700 text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Complete all modules to unlock
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── UNLOCKED STATE ───────────────────────────────────────────────── */}
        {isEligible && (
          <div className="space-y-8">
            {/* Success banner */}
            <div className="rounded-lg border border-[oklch(0.85_0.25_135/40%)] bg-[oklch(0.85_0.25_135/8%)] p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.85_0.25_135/20%)] border border-[oklch(0.85_0.25_135/40%)] flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-[oklch(0.85_0.25_135)]" />
              </div>
              <div>
                <p className="font-['Barlow_Condensed'] font-700 text-white text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  All 5 modules complete — certificate unlocked!
                </p>
                <p className="text-xs text-white/50 font-['DM_Sans'] mt-0.5">
                  Enter your name below to generate your personalised certificate.
                </p>
              </div>
            </div>

            {/* Name input */}
            {!submitted && (
              <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-6">
                <label className="block text-sm font-['DM_Sans'] text-white/70 mb-2">
                  Your Full Name <span className="text-[oklch(0.85_0.25_135)]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-white placeholder-white/25 font-['DM_Sans'] text-sm focus:outline-none focus:border-[oklch(0.55_0.22_260)] transition-colors mb-4"
                />
                <button
                  onClick={handleGenerate}
                  className="btn-lime w-full py-3 rounded-md text-sm flex items-center justify-center gap-2"
                >
                  <Award size={15} />
                  Generate My Certificate
                </button>
              </div>
            )}

            {/* Certificate */}
            {submitted && name.trim() && (
              <div ref={certRef} className="space-y-5">
                {/* Edit name */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50 font-['DM_Sans']">
                    Certificate for <span className="text-white font-semibold">{name}</span>
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[oklch(0.65_0.22_260)] hover:text-white transition-colors font-['DM_Sans']"
                  >
                    Edit name
                  </button>
                </div>

                <CertificateCard name={name} date={today} />

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="btn-glow w-full py-3 rounded-md text-sm flex items-center justify-center gap-2"
                >
                  <Download size={15} />
                  Download Certificate (Print as PDF)
                </button>
                <p className="text-xs text-white/25 font-['DM_Sans'] text-center">
                  In the print dialog, select "Save as PDF" and choose "Landscape" orientation for best results.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
