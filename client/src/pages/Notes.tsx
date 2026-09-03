// Signal & Clarity — Learner Notes Workspace
// A focused, persistent note-taking screen with Canvas-ready PDF export.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  NotebookPen,
  RotateCcw,
  Save,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MODULES } from '@/lib/data';
import { toast } from 'sonner';

type NoteDraft = {
  learnerName: string;
  moduleSlug: string;
  title: string;
  body: string;
  updatedAt: string;
};

const STORAGE_KEY = 'ai-builder-100:learner-notes';

const emptyDraft: NoteDraft = {
  learnerName: '',
  moduleSlug: MODULES[0]?.slug ?? '',
  title: 'AI Builder 100 Learning Notes',
  body: '',
  updatedAt: '',
};

function loadDraft(): NoteDraft {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyDraft, ...JSON.parse(saved) } : emptyDraft;
  } catch {
    return emptyDraft;
  }
}

function cleanFilename(value: string) {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'learner';
}

export default function Notes() {
  const [draft, setDraft] = useState<NoteDraft>(loadDraft);
  const [hasSaved, setHasSaved] = useState(Boolean(draft.updatedAt));
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedModule = useMemo(
    () => MODULES.find((module) => module.slug === draft.moduleSlug),
    [draft.moduleSlug]
  );

  useEffect(() => {
    const saveTimer = window.setTimeout(() => {
      const nextDraft = { ...draft, updatedAt: new Date().toISOString() };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));
        setHasSaved(true);
      } catch {
        // The page remains functional if browser storage is unavailable.
      }
    }, 550);
    return () => window.clearTimeout(saveTimer);
  }, [draft.learnerName, draft.moduleSlug, draft.title, draft.body]);

  const updateDraft = <K extends keyof NoteDraft>(key: K, value: NoteDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveNow = () => {
    setIsSaving(true);
    const nextDraft = { ...draft, updatedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));
      setDraft(nextDraft);
      setHasSaved(true);
      toast.success('Notes saved on this device');
    } catch {
      toast.error('Your browser could not save these notes locally');
    } finally {
      window.setTimeout(() => setIsSaving(false), 250);
    }
  };

  const resetDraft = () => {
    if (!window.confirm('Clear this note draft? This cannot be undone.')) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fall through to reset UI state.
    }
    setDraft(emptyDraft);
    setHasSaved(false);
    toast.success('Fresh note draft created');
  };

  const exportPdf = async () => {
    if (!draft.body.trim()) {
      toast.error('Add your notes before downloading a PDF');
      return;
    }

    setIsExporting(true);
    let jsPDF: typeof import('jspdf').jsPDF;
    try {
      ({ jsPDF } = await import('jspdf'));
    } catch (error) {
      console.error('Unable to load the PDF export module', error);
      toast.error('PDF export could not start. Please try again.');
      setIsExporting(false);
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 54;
    const contentWidth = pageWidth - margin * 2;
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const learnerName = draft.learnerName.trim() || 'Learner Name Not Provided';
    const noteTitle = draft.title.trim() || 'AI Builder 100 Learning Notes';
    const moduleLabel = selectedModule
      ? `${selectedModule.number} — ${selectedModule.title}`
      : 'All modules';

    const writeFooter = (pageNumber: number) => {
      pdf.setDrawColor(197, 211, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(101, 121, 158);
      pdf.text('AI Builder 100 — Foundations for Application · Instructor: Dr. Vicki Bealman', margin, pageHeight - 22);
      pdf.text(`Canvas-ready notes · Page ${pageNumber}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
    };

    const beginPage = (pageNumber: number, includeHeader = false) => {
      if (pageNumber > 1) pdf.addPage();
      if (includeHeader) {
        pdf.setFillColor(8, 23, 52);
        pdf.rect(0, 0, pageWidth, 66, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(255, 255, 255);
        pdf.text('AI BUILDER 100 · LEARNER NOTES', margin, 39);
      }
      writeFooter(pageNumber);
    };

    beginPage(1, true);
    let cursorY = 102;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(23);
    pdf.setTextColor(12, 33, 72);
    const titleLines = pdf.splitTextToSize(noteTitle, contentWidth);
    pdf.text(titleLines, margin, cursorY);
    cursorY += titleLines.length * 28 + 10;

    pdf.setFillColor(232, 241, 255);
    pdf.roundedRect(margin, cursorY, contentWidth, 66, 5, 5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(49, 89, 153);
    pdf.text('LEARNER', margin + 14, cursorY + 21);
    pdf.text('MODULE', margin + contentWidth * 0.42, cursorY + 21);
    pdf.text('DATE', margin + contentWidth * 0.72, cursorY + 21);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(25, 41, 66);
    pdf.text(learnerName, margin + 14, cursorY + 43, { maxWidth: contentWidth * 0.34 });
    pdf.text(moduleLabel, margin + contentWidth * 0.42, cursorY + 43, { maxWidth: contentWidth * 0.26 });
    pdf.text(today, margin + contentWidth * 0.72, cursorY + 43, { maxWidth: contentWidth * 0.23 });
    cursorY += 95;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(37, 103, 224);
    pdf.text('REFLECTION NOTES', margin, cursorY);
    cursorY += 20;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10.5);
    pdf.setTextColor(35, 43, 58);
    const bodyLines = pdf.splitTextToSize(draft.body.trim(), contentWidth);
    const lineHeight = 16;
    let lineIndex = 0;
    let pageNumber = 1;

    while (lineIndex < bodyLines.length) {
      const availableLines = Math.floor((pageHeight - 58 - cursorY) / lineHeight);
      if (availableLines <= 0) {
        pageNumber += 1;
        beginPage(pageNumber, true);
        cursorY = 94;
        continue;
      }
      const nextLines = bodyLines.slice(lineIndex, lineIndex + availableLines);
      pdf.text(nextLines, margin, cursorY, { lineHeightFactor: lineHeight / 10.5 });
      lineIndex += nextLines.length;
      cursorY += nextLines.length * lineHeight;
    }

    const generatedDate = new Date().toISOString().slice(0, 10);
    pdf.save(`ai-builder-100-notes-${cleanFilename(learnerName)}-${generatedDate}.pdf`);
    setIsExporting(false);
    toast.success('Canvas-ready PDF downloaded');
  };

  return (
    <div className="signal-page min-h-screen bg-[oklch(0.16_0.04_255)] text-white">
      <Navbar />

      <main className="signal-content container pt-28 pb-20">
        <Link href="/dashboard">
          <div className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 font-['DM_Sans']">
            <ArrowLeft size={14} /> Back to My Progress
          </div>
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <section>
            <div className="signal-heading mb-9">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-['Barlow_Condensed'] font-700 uppercase tracking-[0.18em] text-[oklch(0.65_0.22_260)] mb-3">
                    Learner Workspace
                  </p>
                  <h1
                    className="font-['Barlow_Condensed'] font-800 text-white leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 4.25rem)' }}
                  >
                    Notes for <span className="text-[oklch(0.65_0.22_260)]">Thinking</span>
                  </h1>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-['DM_Sans'] ${hasSaved ? 'border-[oklch(0.85_0.25_135/30%)] bg-[oklch(0.85_0.25_135/8%)] text-[oklch(0.85_0.25_135)]' : 'border-white/10 bg-white/5 text-white/40'}`}>
                  <CheckCircle2 size={13} />
                  {hasSaved ? 'Saved on this device' : 'Start your note draft'}
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm text-white/55 font-['DM_Sans'] leading-relaxed">
                Capture your learning in one place. Your draft saves automatically in this browser, and the PDF export is formatted for direct upload to a Canvas assignment.
              </p>
            </div>

            <div className="signal-tab-panel signal-stripe border border-white/10 bg-[oklch(0.20_0.04_255)] overflow-hidden shadow-[0_20px_65px_oklch(0_0_0/18%)]">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.025]">
                <div className="flex items-center gap-2 text-sm font-['Barlow_Condensed'] font-700 text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <NotebookPen size={16} className="text-[oklch(0.65_0.22_260)]" />
                  Course Notes
                </div>
                <span className="text-xs text-white/35 font-['DM_Sans']">Autosaves after you pause typing</span>
              </div>

              <div className="p-5 sm:p-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="learner-name" className="block text-xs font-['DM_Sans'] text-white/60 mb-2">Your full name</label>
                    <input
                      id="learner-name"
                      value={draft.learnerName}
                      onChange={(event) => updateDraft('learnerName', event.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full rounded-md border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                    />
                  </div>
                  <div>
                    <label htmlFor="module" className="block text-xs font-['DM_Sans'] text-white/60 mb-2">Focus module</label>
                    <select
                      id="module"
                      value={draft.moduleSlug}
                      onChange={(event) => updateDraft('moduleSlug', event.target.value)}
                      className="w-full rounded-md border border-white/15 bg-[oklch(0.21_0.04_255)] px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                    >
                      <option value="">All modules / course reflection</option>
                      {MODULES.map((module) => (
                        <option key={module.slug} value={module.slug}>{module.number} — {module.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="note-title" className="block text-xs font-['DM_Sans'] text-white/60 mb-2">Note title</label>
                  <input
                    id="note-title"
                    value={draft.title}
                    onChange={(event) => updateDraft('title', event.target.value)}
                    placeholder="Give this reflection a title"
                    className="w-full rounded-md border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor="notes-body" className="block text-xs font-['DM_Sans'] text-white/60">Your notes and reflection</label>
                    <span className="text-xs text-white/30 font-['DM_Sans']">{draft.body.length.toLocaleString()} characters</span>
                  </div>
                  <textarea
                    id="notes-body"
                    value={draft.body}
                    onChange={(event) => updateDraft('body', event.target.value)}
                    placeholder={'Try this structure:\n\n• Key idea I learned\n• A real-world example\n• Question I still have\n• One action I will take'}
                    className="min-h-[360px] w-full resize-y rounded-md border border-white/15 bg-[oklch(0.17_0.04_255)] px-4 py-4 text-sm leading-7 text-white/85 placeholder:text-white/25 outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white/45 hover:text-white transition-colors font-['DM_Sans']"
                  >
                    <RotateCcw size={14} /> Clear draft
                  </button>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveNow}
                      className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/80 hover:border-[oklch(0.55_0.22_260/60%)] hover:text-white transition-colors font-['DM_Sans']"
                    >
                      <Save size={14} /> {isSaving ? 'Saving…' : 'Save now'}
                    </button>
                    <button
                      type="button"
                      onClick={exportPdf}
                      disabled={isExporting}
                      className="btn-lime inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Download size={15} /> {isExporting ? 'Preparing PDF…' : 'Download PDF for Canvas'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-24">
            <div className="signal-tab-panel border border-[oklch(0.55_0.22_260/30%)] bg-[oklch(0.55_0.22_260/8%)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-[oklch(0.65_0.22_260)]" />
                <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Canvas-ready export</h2>
              </div>
              <p className="text-xs leading-relaxed text-white/55 font-['DM_Sans']">
                Your downloaded PDF includes the course name, instructor, your name, selected module, date, and reflection notes in a clean letter-size layout.
              </p>
            </div>

            <div className="signal-tab-panel border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-[oklch(0.85_0.25_135)]" />
                <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Before you submit</h2>
              </div>
              <ol className="space-y-3 text-xs text-white/55 font-['DM_Sans'] leading-relaxed list-decimal list-inside">
                <li>Enter your full name and choose the relevant module.</li>
                <li>Write your reflection, examples, and open questions.</li>
                <li>Select <strong className="text-white/80 font-medium">Download PDF for Canvas</strong>.</li>
                <li>Upload the downloaded PDF to your Canvas assignment.</li>
              </ol>
            </div>

            <div className="signal-tab-panel border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Prompt to get started</h2>
              <p className="text-xs leading-relaxed text-white/55 font-['DM_Sans'] italic">
                “Which AI concept from this module changed how I see a real-world system, and what responsibility comes with applying it?”
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
