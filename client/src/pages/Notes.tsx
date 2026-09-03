// Signal & Clarity — Module Note Manager
// Separate, persistent entries for all five modules with a review-before-download Canvas PDF flow.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  FilePlus2,
  FileText,
  NotebookPen,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MODULES } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type ModuleNote = {
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type NotesWorkspace = {
  learnerName: string;
  activeModuleSlug: string;
  notes: Record<string, ModuleNote | undefined>;
};

type LegacyDraft = {
  learnerName?: string;
  moduleSlug?: string;
  title?: string;
  body?: string;
  updatedAt?: string;
};

const STORAGE_KEY = 'ai-builder-100:module-notes';
const LEGACY_STORAGE_KEY = 'ai-builder-100:learner-notes';

const defaultWorkspace = (): NotesWorkspace => ({
  learnerName: '',
  activeModuleSlug: MODULES[0]?.slug ?? '',
  notes: {},
});

function moduleBySlug(slug: string) {
  return MODULES.find((module) => module.slug === slug) ?? MODULES[0];
}

function newModuleNote(slug: string): ModuleNote {
  const module = moduleBySlug(slug);
  return {
    title: `${module?.number ?? ''} — ${module?.title ?? 'Module'} Notes`,
    body: '',
    createdAt: '',
    updatedAt: '',
  };
}

function loadWorkspace(): NotesWorkspace {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<NotesWorkspace>;
      return {
        ...defaultWorkspace(),
        ...parsed,
        notes: parsed.notes ?? {},
      };
    }

    // Preserve any notes created in the original single-entry workspace.
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as LegacyDraft;
      const slug = parsed.moduleSlug || MODULES[0]?.slug || '';
      const hasLegacyContent = Boolean(parsed.body?.trim() || parsed.title?.trim());
      return {
        learnerName: parsed.learnerName ?? '',
        activeModuleSlug: slug,
        notes: hasLegacyContent
          ? {
              [slug]: {
                title: parsed.title || newModuleNote(slug).title,
                body: parsed.body ?? '',
                createdAt: parsed.updatedAt ?? '',
                updatedAt: parsed.updatedAt ?? '',
              },
            }
          : {},
      };
    }
  } catch {
    // Return a clean workspace when local storage is unavailable or malformed.
  }
  return defaultWorkspace();
}

function formatDate(value?: string) {
  if (!value) return 'Not saved yet';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function cleanFilename(value: string) {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'learner';
}

function noteState(note?: ModuleNote) {
  if (!note) return { label: 'No entry', tone: 'text-white/35 border-white/10 bg-white/[0.03]' };
  if (note.body.trim()) return { label: 'Ready', tone: 'text-[oklch(0.85_0.25_135)] border-[oklch(0.85_0.25_135/28%)] bg-[oklch(0.85_0.25_135/8%)]' };
  return { label: 'Draft', tone: 'text-[oklch(0.65_0.22_260)] border-[oklch(0.55_0.22_260/28%)] bg-[oklch(0.55_0.22_260/8%)]' };
}

export default function Notes() {
  const [workspace, setWorkspace] = useState<NotesWorkspace>(loadWorkspace);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparingPreview, setIsPreparingPreview] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewFilename, setPreviewFilename] = useState('');

  const activeModule = useMemo(
    () => moduleBySlug(workspace.activeModuleSlug),
    [workspace.activeModuleSlug]
  );
  const activeNote = workspace.notes[workspace.activeModuleSlug];
  const entriesCreated = Object.values(workspace.notes).filter(Boolean).length;
  const entriesReady = Object.values(workspace.notes).filter((note) => note?.body.trim()).length;

  const persistWorkspace = (next: NotesWorkspace) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      toast.error('Your browser could not save these notes locally');
    }
  };

  useEffect(() => {
    if (!activeNote) return;
    const saveTimer = window.setTimeout(() => {
      setWorkspace((current) => {
        const note = current.notes[current.activeModuleSlug];
        if (!note) return current;
        const next: NotesWorkspace = {
          ...current,
          notes: {
            ...current.notes,
            [current.activeModuleSlug]: {
              ...note,
              createdAt: note.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        };
        persistWorkspace(next);
        return next;
      });
    }, 650);
    return () => window.clearTimeout(saveTimer);
  }, [workspace.learnerName, workspace.activeModuleSlug, activeNote?.title, activeNote?.body]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const switchModule = (slug: string) => {
    setWorkspace((current) => ({ ...current, activeModuleSlug: slug }));
  };

  const createEntry = (slug = workspace.activeModuleSlug) => {
    const module = moduleBySlug(slug);
    setWorkspace((current) => {
      if (current.notes[slug]) return { ...current, activeModuleSlug: slug };
      const now = new Date().toISOString();
      const next: NotesWorkspace = {
        ...current,
        activeModuleSlug: slug,
        notes: {
          ...current.notes,
          [slug]: { ...newModuleNote(slug), createdAt: now, updatedAt: now },
        },
      };
      persistWorkspace(next);
      return next;
    });
    toast.success(`Created a note entry for ${module?.title ?? 'this module'}`);
  };

  const updateLearnerName = (learnerName: string) => {
    setWorkspace((current) => ({ ...current, learnerName }));
  };

  const updateActiveNote = (key: 'title' | 'body', value: string) => {
    if (!activeNote) return;
    setWorkspace((current) => ({
      ...current,
      notes: {
        ...current.notes,
        [current.activeModuleSlug]: {
          ...current.notes[current.activeModuleSlug]!,
          [key]: value,
        },
      },
    }));
  };

  const saveActiveNote = () => {
    if (!activeNote) {
      createEntry();
      return;
    }
    setIsSaving(true);
    setWorkspace((current) => {
      const currentNote = current.notes[current.activeModuleSlug];
      if (!currentNote) return current;
      const now = new Date().toISOString();
      const next: NotesWorkspace = {
        ...current,
        notes: {
          ...current.notes,
          [current.activeModuleSlug]: {
            ...currentNote,
            createdAt: currentNote.createdAt || now,
            updatedAt: now,
          },
        },
      };
      persistWorkspace(next);
      return next;
    });
    window.setTimeout(() => setIsSaving(false), 220);
    toast.success(`${activeModule?.title ?? 'Module'} notes saved`);
  };

  const deleteActiveNote = () => {
    if (!activeNote || !window.confirm(`Delete the notes for ${activeModule?.title ?? 'this module'}? This cannot be undone.`)) return;
    setWorkspace((current) => {
      const { [current.activeModuleSlug]: _deleted, ...remainingNotes } = current.notes;
      const next = { ...current, notes: remainingNotes };
      persistWorkspace(next);
      return next;
    });
    toast.success('Module note deleted');
  };

  const createPdfDocument = async (note: ModuleNote, module = activeModule) => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 54;
    const contentWidth = pageWidth - margin * 2;
    const learnerName = workspace.learnerName.trim() || 'Learner Name Not Provided';
    const noteTitle = note.title.trim() || `${module?.title ?? 'AI Builder 100'} Notes`;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const moduleLabel = module ? `${module.number} — ${module.title}` : 'AI Builder 100';

    const footer = (pageNumber: number) => {
      pdf.setDrawColor(197, 211, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(101, 121, 158);
      pdf.text('AI Builder 100 — Foundations for Application · Instructor: Dr. Vicki Bealman', margin, pageHeight - 22);
      pdf.text(`Canvas-ready notes · Page ${pageNumber}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
    };

    const pageHeader = (pageNumber: number) => {
      if (pageNumber > 1) pdf.addPage();
      pdf.setFillColor(8, 23, 52);
      pdf.rect(0, 0, pageWidth, 66, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text('AI BUILDER 100 · LEARNER NOTES', margin, 39);
      footer(pageNumber);
    };

    pageHeader(1);
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
    const bodyLines = pdf.splitTextToSize(note.body.trim(), contentWidth);
    const lineHeight = 16;
    let lineIndex = 0;
    let pageNumber = 1;
    while (lineIndex < bodyLines.length) {
      const availableLines = Math.floor((pageHeight - 58 - cursorY) / lineHeight);
      if (availableLines <= 0) {
        pageNumber += 1;
        pageHeader(pageNumber);
        cursorY = 94;
        continue;
      }
      const nextLines = bodyLines.slice(lineIndex, lineIndex + availableLines);
      pdf.text(nextLines, margin, cursorY, { lineHeightFactor: lineHeight / 10.5 });
      lineIndex += nextLines.length;
      cursorY += nextLines.length * lineHeight;
    }

    const generatedDate = new Date().toISOString().slice(0, 10);
    return {
      pdf,
      filename: `ai-builder-100-${module?.number ?? 'notes'}-${cleanFilename(learnerName)}-${generatedDate}.pdf`,
    };
  };

  const openPdfPreview = async () => {
    if (!activeNote?.body.trim()) {
      toast.error('Add reflection notes before previewing the PDF');
      return;
    }
    setIsPreparingPreview(true);
    try {
      const { pdf, filename } = await createPdfDocument(activeNote);
      const nextUrl = URL.createObjectURL(pdf.output('blob'));
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextUrl;
      });
      setPreviewFilename(filename);
      setPreviewOpen(true);
      toast.success('PDF preview is ready');
    } catch (error) {
      console.error('Unable to prepare notes PDF preview', error);
      toast.error('PDF preview could not be prepared. Please try again.');
    } finally {
      setIsPreparingPreview(false);
    }
  };

  const downloadFromPreview = async () => {
    if (!activeNote?.body.trim()) return;
    try {
      const { pdf, filename } = await createPdfDocument(activeNote);
      pdf.save(filename);
      toast.success('Canvas-ready PDF downloaded');
    } catch (error) {
      console.error('Unable to download notes PDF', error);
      toast.error('PDF download could not start. Please try again.');
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
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

        <div className="signal-heading mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-['Barlow_Condensed'] font-700 uppercase tracking-[0.18em] text-[oklch(0.65_0.22_260)] mb-3">Learner Workspace</p>
            <h1 className="font-['Barlow_Condensed'] font-800 text-white leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 4.25rem)' }}>
              Module <span className="text-[oklch(0.65_0.22_260)]">Notes</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/55 font-['DM_Sans'] leading-relaxed">
              Build the reflection. Preview the packet. Submit with confidence. Create one focused note entry for each module and keep every Canvas-ready PDF separate.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="signal-file-tab border border-[oklch(0.55_0.22_260/30%)] bg-[oklch(0.55_0.22_260/8%)] px-4 py-2 text-center">
              <div className="font-['Barlow_Condensed'] font-800 text-xl text-[oklch(0.65_0.22_260)]">{entriesCreated}/5</div>
              <div className="text-[10px] uppercase tracking-wider text-white/35 font-['DM_Sans']">Entries</div>
            </div>
            <div className="signal-file-tab border border-[oklch(0.85_0.25_135/28%)] bg-[oklch(0.85_0.25_135/7%)] px-4 py-2 text-center">
              <div className="font-['Barlow_Condensed'] font-800 text-xl text-[oklch(0.85_0.25_135)]">{entriesReady}/5</div>
              <div className="text-[10px] uppercase tracking-wider text-white/35 font-['DM_Sans']">Ready</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_300px] gap-6 items-start">
          <aside className="signal-tab-panel border border-white/10 bg-[oklch(0.20_0.04_255)] p-4 xl:sticky xl:top-24">
            <div className="flex items-center justify-between gap-3 mb-4 px-1">
              <div className="flex items-center gap-2">
                <NotebookPen size={16} className="text-[oklch(0.65_0.22_260)]" />
                <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Module Library</h2>
              </div>
              <span className="text-xs text-white/35 font-['DM_Sans']">{entriesCreated} saved</span>
            </div>
            <div className="space-y-2">
              {MODULES.map((module) => {
                const note = workspace.notes[module.slug];
                const status = noteState(note);
                const active = module.slug === workspace.activeModuleSlug;
                return (
                  <button
                    key={module.slug}
                    type="button"
                    onClick={() => switchModule(module.slug)}
                    className={`signal-file-tab w-full text-left border p-3 transition-all ${active ? 'border-[oklch(0.55_0.22_260/65%)] bg-[oklch(0.55_0.22_260/14%)]' : 'border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`font-['Barlow_Condensed'] font-800 text-xl leading-none ${active ? 'text-[oklch(0.65_0.22_260)]' : 'text-white/35'}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{module.number}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-['Barlow_Condensed'] font-700 text-white text-sm leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{module.title}</span>
                        <span className={`mt-2 inline-flex border px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-['DM_Sans'] ${status.tone}`}>{status.label}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="signal-tab-panel signal-stripe signal-command-center border border-white/10 bg-[oklch(0.20_0.04_255)] overflow-hidden shadow-[0_20px_65px_oklch(0_0_0/18%)]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.025]">
              <div className="flex items-center gap-2">
                <span className="font-['Barlow_Condensed'] font-800 text-[oklch(0.65_0.22_260)] text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeModule?.number}</span>
                <div>
                  <p className="font-['Barlow_Condensed'] font-700 text-white text-base leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeModule?.title}</p>
                  <p className="text-xs text-white/35 font-['DM_Sans'] mt-1">{activeNote ? `Last saved ${formatDate(activeNote.updatedAt)}` : 'No note created yet'}</p>
                </div>
              </div>
              {activeNote && (
                <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] uppercase tracking-wider font-['DM_Sans'] ${noteState(activeNote).tone}`}>
                  {activeNote.body.trim() ? <FileCheck2 size={12} /> : <FileText size={12} />}
                  {noteState(activeNote).label}
                </span>
              )}
            </div>

            {!activeNote ? (
              <div className="min-h-[520px] px-7 py-14 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 grid place-items-center border border-[oklch(0.55_0.22_260/40%)] bg-[oklch(0.55_0.22_260/10%)] mb-5" style={{ clipPath: 'polygon(0 0, 85% 0, 100% 20%, 100% 100%, 0 100%)' }}>
                  <FilePlus2 size={25} className="text-[oklch(0.65_0.22_260)]" />
                </div>
                <h2 className="font-['Barlow_Condensed'] font-800 text-white text-3xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Start {activeModule?.number} Notes</h2>
                <p className="max-w-sm mt-3 text-sm text-white/50 leading-relaxed font-['DM_Sans']">Create a dedicated entry for <span className="text-white/80">{activeModule?.title}</span>. It will stay separate from every other module and can be exported on its own.</p>
                <button type="button" onClick={() => createEntry()} className="btn-glow mt-7 inline-flex items-center gap-2 px-5 py-3 text-sm">
                  <Plus size={15} /> Create Module Entry
                </button>
              </div>
            ) : (
              <div className="p-5 sm:p-7 space-y-6">
                <div>
                  <label htmlFor="learner-name" className="block text-xs font-['DM_Sans'] text-white/60 mb-2">Your full name <span className="text-[oklch(0.85_0.25_135)]">*</span></label>
                  <input
                    id="learner-name"
                    value={workspace.learnerName}
                    onChange={(event) => updateLearnerName(event.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                  />
                </div>

                <div>
                  <label htmlFor="note-title" className="block text-xs font-['DM_Sans'] text-white/60 mb-2">Entry title</label>
                  <input
                    id="note-title"
                    value={activeNote.title}
                    onChange={(event) => updateActiveNote('title', event.target.value)}
                    placeholder={`Reflection notes for ${activeModule?.title}`}
                    className="w-full border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor="notes-body" className="block text-xs font-['DM_Sans'] text-white/60">Notes and reflection</label>
                    <span className="text-xs text-white/30 font-['DM_Sans']">{activeNote.body.length.toLocaleString()} characters</span>
                  </div>
                  <textarea
                    id="notes-body"
                    value={activeNote.body}
                    onChange={(event) => updateActiveNote('body', event.target.value)}
                    placeholder={'Use this module reflection structure:\n\n• Key concept I learned\n• A real-world example\n• A question I still have\n• One action I will take'}
                    className="min-h-[330px] w-full resize-y border border-white/15 bg-[oklch(0.17_0.04_255)] px-4 py-4 text-sm leading-7 text-white/85 placeholder:text-white/25 outline-none transition-colors focus:border-[oklch(0.55_0.22_260)] font-['DM_Sans']"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button type="button" onClick={deleteActiveNote} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-red-300 transition-colors font-['DM_Sans']">
                    <Trash2 size={14} /> Delete entry
                  </button>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={saveActiveNote} className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/80 hover:border-[oklch(0.55_0.22_260/60%)] hover:text-white transition-colors font-['DM_Sans']">
                      <Save size={14} /> {isSaving ? 'Saving…' : 'Save entry'}
                    </button>
                    <button type="button" onClick={openPdfPreview} disabled={isPreparingPreview} className="btn-lime inline-flex items-center gap-2 px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60">
                      <Eye size={15} /> {isPreparingPreview ? 'Preparing preview…' : 'Preview PDF for Canvas'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-5 xl:sticky xl:top-24">
            <div className="signal-file-tab signal-helper-panel border border-[oklch(0.55_0.22_260/30%)] bg-[oklch(0.55_0.22_260/8%)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-[oklch(0.65_0.22_260)]" />
                <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>One entry per module</h2>
              </div>
              <p className="text-xs leading-relaxed text-white/55 font-['DM_Sans']">Create, update, or delete independent note entries from the library. A completed reflection is marked <span className="text-[oklch(0.85_0.25_135)]">Ready</span> when it contains notes.</p>
            </div>

            <div className="signal-file-tab signal-helper-panel border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-[oklch(0.85_0.25_135)]" />
                <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Preview before download</h2>
              </div>
              <ol className="space-y-3 text-xs text-white/55 font-['DM_Sans'] leading-relaxed list-decimal list-inside">
                <li>Save your module reflection.</li>
                <li>Select <strong className="text-white/80 font-medium">Preview PDF for Canvas</strong>.</li>
                <li>Review the formatted, letter-size document.</li>
                <li>Download it directly from the preview modal.</li>
              </ol>
            </div>

            <div className="signal-file-tab signal-helper-panel border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <h2 className="font-['Barlow_Condensed'] font-700 text-white text-lg mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Reflection prompt</h2>
              <p className="text-xs leading-relaxed text-white/55 font-['DM_Sans'] italic">“Which AI concept from this module changed how I see a real-world system, and what responsibility comes with applying it?”</p>
            </div>
          </aside>
        </div>
      </main>

      <Dialog open={previewOpen} onOpenChange={(open) => (open ? setPreviewOpen(true) : closePreview())}>
        <DialogContent className="max-w-[min(1120px,calc(100vw-2rem))] h-[min(88vh,900px)] gap-0 overflow-hidden rounded-none border-[oklch(0.55_0.22_260/45%)] bg-[oklch(0.16_0.04_255)] p-0">
          <DialogHeader className="border-b border-white/10 bg-[oklch(0.20_0.04_255)] px-6 py-5 pr-14 text-left">
            <div className="flex items-center gap-2 text-[oklch(0.65_0.22_260)]">
              <FileCheck2 size={16} />
              <span className="font-['Barlow_Condensed'] font-700 uppercase tracking-widest text-xs">Canvas Submission Preview</span>
            </div>
            <DialogTitle className="font-['Barlow_Condensed'] font-800 text-white text-2xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {activeNote?.title || activeModule?.title}
            </DialogTitle>
            <DialogDescription className="text-white/45 font-['DM_Sans']">Review the exact formatted document before downloading it for Canvas.</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 bg-[oklch(0.10_0.03_255)] p-4 sm:p-6">
            {previewUrl ? (
              <iframe title="Canvas-ready notes PDF preview" src={previewUrl} className="h-full min-h-[420px] w-full border border-white/15 bg-white" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-white/45 font-['DM_Sans']">Preparing your PDF preview…</div>
            )}
          </div>
          <DialogFooter className="border-t border-white/10 bg-[oklch(0.20_0.04_255)] px-6 py-4 sm:justify-between sm:flex-row">
            <span className="truncate text-xs text-white/35 font-['DM_Sans']">{previewFilename}</span>
            <div className="flex gap-3">
              <button type="button" onClick={closePreview} className="border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/75 hover:text-white font-['DM_Sans']">Return to notes</button>
              <button type="button" onClick={downloadFromPreview} className="btn-lime inline-flex items-center gap-2 px-4 py-2.5 text-sm"><Download size={15} /> Download PDF for Canvas</button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
