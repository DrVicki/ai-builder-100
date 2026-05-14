// Signal & Clarity — Module Detail Page
// Topics are fully expandable: video topics open an iframe embed, reading/exercise topics open a content panel
import { useState } from 'react';
import { useParams, Link } from 'wouter';
import {
  ArrowLeft, Play, BookOpen, Dumbbell, ClipboardCheck,
  Clock, ChevronRight, Lock, CheckCircle2, ChevronDown,
  ExternalLink, FileText, Pencil
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MODULES } from '@/lib/data';
import { useProgress } from '@/contexts/ProgressContext';
import { toast } from 'sonner';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: string }) {
  const base = 'flex-shrink-0';
  if (type === 'video')    return <Play         size={14} className={`${base} text-[oklch(0.75_0.15_260)]`} />;
  if (type === 'reading')  return <BookOpen     size={14} className={`${base} text-[oklch(0.75_0.15_260)]`} />;
  if (type === 'exercise') return <Dumbbell     size={14} className={`${base} text-[oklch(0.85_0.25_135)]`} />;
  return                          <ClipboardCheck size={14} className={`${base} text-[oklch(0.80_0.15_30)]`} />;
}

const TYPE_LABEL: Record<string, string> = {
  video: 'Video', reading: 'Reading', exercise: 'Exercise', quiz: 'Quiz',
};

function DifficultyBadge({ level }: { level: string }) {
  const cls =
    level === 'Foundational' ? 'badge-beginner' :
    level === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced';
  return (
    <span className={`${cls} text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest px-2.5 py-1 rounded-sm`}>
      {level}
    </span>
  );
}

// ─── Reading / Exercise placeholder panel ────────────────────────────────────
function ReadingPanel({ title, type }: { title: string; type: string }) {
  const isExercise = type === 'exercise';
  return (
    <div className="bg-[oklch(0.18_0.04_255)] border-t border-white/10 p-6">
      <div className="flex items-start gap-3 mb-4">
        {isExercise
          ? <Pencil size={16} className="text-[oklch(0.85_0.25_135)] flex-shrink-0 mt-0.5" />
          : <FileText size={16} className="text-[oklch(0.65_0.22_260)] flex-shrink-0 mt-0.5" />}
        <div>
          <p className="text-sm font-['Barlow_Condensed'] font-700 text-white mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {isExercise ? 'Hands-On Exercise' : 'Reading Material'}
          </p>
          <p className="text-xs text-white/50 font-['DM_Sans'] leading-relaxed">
            {isExercise
              ? `This exercise guides you through a practical application of the concepts covered in "${title}". Work through the prompts below at your own pace and mark complete when finished.`
              : `This reading covers "${title}". Study the material carefully — key concepts will appear in the module assessment.`}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {(isExercise
          ? ['Review the scenario brief', 'Complete the structured worksheet', 'Reflect on your findings', 'Mark the exercise complete']
          : ['Read the full article', 'Take notes on key definitions', 'Consider the discussion questions', 'Mark as read when done']
        ).map((step, i) => (
          <div key={step} className="flex items-center gap-3 text-xs text-white/50 font-['DM_Sans']">
            <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-white/30 flex-shrink-0 font-['Barlow_Condensed'] font-700" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px' }}>
              {i + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quiz placeholder panel ───────────────────────────────────────────────────
function QuizPanel() {
  return (
    <div className="bg-[oklch(0.18_0.04_255)] border-t border-white/10 p-6">
      <div className="flex items-start gap-3 mb-5">
        <ClipboardCheck size={16} className="text-[oklch(0.80_0.15_30)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-['Barlow_Condensed'] font-700 text-white mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Module Assessment
          </p>
          <p className="text-xs text-white/50 font-['DM_Sans'] leading-relaxed">
            Test your understanding of this module with a short assessment. Complete all topics before attempting the quiz.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[['10', 'Questions'], ['20', 'Minutes'], ['70%', 'Pass mark']].map(([val, lbl]) => (
          <div key={lbl} className="rounded-md border border-white/10 bg-white/5 p-3 text-center">
            <div className="font-['Barlow_Condensed'] font-800 text-[oklch(0.65_0.22_260)] text-xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{val}</div>
            <div className="text-xs text-white/40 font-['DM_Sans']">{lbl}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => toast.info('Assessment feature coming soon')}
        className="btn-glow w-full py-2.5 rounded-md text-sm flex items-center justify-center gap-2"
      >
        <ClipboardCheck size={14} />
        Start Assessment
      </button>
    </div>
  );
}

// ─── Video embed panel ────────────────────────────────────────────────────────
function VideoPanel({ videoUrl, title }: { videoUrl: string; title: string }) {
  return (
    <div className="bg-[oklch(0.13_0.04_255)] border-t border-white/10">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`${videoUrl}?rel=0&modestbranding=1&color=white`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
        />
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10">
        <span className="text-xs text-white/40 font-['DM_Sans'] truncate pr-4">{title}</span>
        <a
          href={videoUrl.replace('/embed/', '/watch?v=')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[oklch(0.65_0.22_260)] hover:text-white transition-colors flex-shrink-0 font-['DM_Sans']"
        >
          Open in YouTube <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

// ─── Single topic row ─────────────────────────────────────────────────────────
function TopicRow({
  topic,
  moduleSlug,
  index,
  isLocked,
  isOpen,
  onToggleOpen,
}: {
  topic: { id: number; title: string; type: string; duration: string; videoUrl?: string };
  moduleSlug: string;
  index: number;
  isLocked: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  const { isTopicComplete, toggleTopic } = useProgress();
  const complete = isTopicComplete(moduleSlug, topic.id);
  const hasContent = topic.videoUrl || topic.type === 'reading' || topic.type === 'exercise' || topic.type === 'quiz';

  const handleRowClick = () => {
    if (isLocked) {
      toast.error('Complete previous topics to unlock this one');
      return;
    }
    if (hasContent) onToggleOpen();
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) return;
    toggleTopic(moduleSlug, topic.id);
    if (!complete) toast.success(`Completed: ${topic.title}`);
  };

  return (
    <div
      className={`rounded-md border overflow-hidden transition-all duration-200 ${
        isOpen
          ? 'border-[oklch(0.55_0.22_260/50%)] shadow-[0_0_20px_oklch(0.55_0.22_260/15%)]'
          : complete
          ? 'border-[oklch(0.55_0.22_260/25%)] bg-[oklch(0.55_0.22_260/6%)]'
          : isLocked
          ? 'border-white/5 bg-white/2 opacity-50'
          : 'border-white/10 bg-[oklch(0.20_0.04_255)] hover:border-[oklch(0.55_0.22_260/35%)]'
      }`}
    >
      {/* Row header — always visible, clickable */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 ${hasContent && !isLocked ? 'cursor-pointer' : ''}`}
        onClick={handleRowClick}
      >
        {/* Complete circle */}
        <button
          onClick={handleComplete}
          disabled={isLocked}
          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            complete
              ? 'border-[oklch(0.55_0.22_260)] bg-[oklch(0.55_0.22_260)]'
              : isLocked
              ? 'border-white/20'
              : 'border-white/30 hover:border-[oklch(0.55_0.22_260)]'
          }`}
        >
          {complete && <CheckCircle2 size={11} className="text-white" />}
          {isLocked && <Lock size={9} className="text-white/30" />}
        </button>

        {/* Type icon */}
        <TypeIcon type={topic.type} />

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-['DM_Sans'] ${complete ? 'text-white/40 line-through' : 'text-white/85'}`}>
            {topic.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-white/35 font-['DM_Sans']">{TYPE_LABEL[topic.type] ?? topic.type}</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="flex items-center gap-1 text-xs text-white/30 font-['DM_Sans']">
              <Clock size={10} />{topic.duration}
            </span>
          </div>
        </div>

        {/* Expand chevron (only when content exists and not locked) */}
        {hasContent && !isLocked && (
          <ChevronDown
            size={15}
            className={`text-white/30 flex-shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-180 text-[oklch(0.65_0.22_260)]' : ''}`}
          />
        )}
      </div>

      {/* Expandable content panel */}
      {isOpen && hasContent && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {topic.videoUrl ? (
            <VideoPanel videoUrl={topic.videoUrl} title={topic.title} />
          ) : topic.type === 'quiz' ? (
            <QuizPanel />
          ) : (
            <ReadingPanel title={topic.title} type={topic.type} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ModulePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const mod = MODULES.find((m) => m.slug === slug);
  const { getModuleProgress, isTopicComplete } = useProgress();
  const [openTopicId, setOpenTopicId] = useState<number | null>(null);

  if (!mod) {
    return (
      <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Module not found.</p>
          <Link href="/"><div className="btn-glow px-6 py-2 rounded-md text-sm inline-block">Back to Home</div></Link>
        </div>
      </div>
    );
  }

  const progress = getModuleProgress(mod.slug);

  // A topic is locked if the previous topic is not yet complete
  const isLocked = (idx: number) => {
    if (idx === 0) return false;
    return !isTopicComplete(mod.slug, mod.topics[idx - 1].id);
  };

  const handleToggleOpen = (topicId: number) => {
    setOpenTopicId((prev) => (prev === topicId ? null : topicId));
  };

  return (
    <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white">
      <Navbar />

      {/* ── MODULE HERO ──────────────────────────────────────────────────────── */}
      <div className="relative pt-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${mod.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.16_0.04_255/60%)] via-[oklch(0.16_0.04_255/80%)] to-[oklch(0.16_0.04_255)]" />

        <div className="relative container pt-10 pb-12">
          <Link href="/">
            <div className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 font-['DM_Sans']">
              <ArrowLeft size={14} /> Back to all modules
            </div>
          </Link>
          <div className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)] mb-3">
            Module {mod.number}
          </div>
          <h1
            className="font-['Barlow_Condensed'] font-800 text-white mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1 }}
          >
            {mod.title}
          </h1>
          <p className="text-[oklch(0.65_0.22_260)] font-['DM_Sans'] mb-5 text-lg">{mod.tagline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <DifficultyBadge level={mod.difficulty} />
            <div className="flex items-center gap-1.5 text-sm text-white/50 font-['DM_Sans']">
              <Clock size={13} />{mod.topics.length} topics
            </div>
            {progress.completed > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-[oklch(0.85_0.25_135)] font-['DM_Sans']">
                <CheckCircle2 size={13} />{progress.completed}/{progress.total} completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left: About + Topics + Learning Outcomes */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <h2 className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                About This Module
              </h2>
              <p className="text-white/60 font-['DM_Sans'] leading-relaxed text-sm">{mod.about}</p>
            </section>

            {/* Topics */}
            <section>
              <h2 className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                Topics ({mod.topics.length})
              </h2>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-white/40 font-['DM_Sans'] mb-1.5">
                  <span>{progress.completed} of {progress.total} completed</span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[oklch(0.55_0.22_260)] rounded-full transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {mod.topics.map((topic, idx) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    moduleSlug={mod.slug}
                    index={idx}
                    isLocked={isLocked(idx)}
                    isOpen={openTopicId === topic.id}
                    onToggleOpen={() => handleToggleOpen(topic.id)}
                  />
                ))}
              </div>
              <p className="text-xs text-white/25 font-['DM_Sans'] mt-3">
                Click a topic row to expand its content · Click the circle to mark complete
              </p>
            </section>

            {/* What You'll Learn */}
            <section>
              <h2 className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                What You'll Learn
              </h2>
              <div className="space-y-3">
                {mod.learningOutcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[oklch(0.85_0.25_135)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/70 font-['DM_Sans'] leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24">

            {/* Start CTA */}
            <div className="rounded-lg border border-[oklch(0.55_0.22_260/30%)] bg-[oklch(0.20_0.04_255)] p-6">
              <button
                onClick={() => {
                  const first = mod.topics[0];
                  setOpenTopicId(first.id);
                  document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-glow w-full py-3 rounded-md text-sm flex items-center justify-center gap-2"
              >
                <Play size={14} /> Start Module
              </button>
              <p className="text-xs text-white/30 text-center mt-3 font-['DM_Sans']">
                Click any topic row to expand its content
              </p>
              {progress.completed > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs text-white/40 font-['DM_Sans'] mb-1.5">
                    <span>Progress</span><span>{progress.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[oklch(0.85_0.25_135)] rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Prerequisites */}
            <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <h3 className="font-['Barlow_Condensed'] font-700 text-white text-base mb-3 flex items-center gap-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <Lock size={13} className="text-white/40" /> Prerequisites
              </h3>
              <ul className="space-y-2">
                {mod.prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-white/50 font-['DM_Sans']">
                    <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0 mt-1.5" />{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <h3 className="font-['Barlow_Condensed'] font-700 text-white text-base mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {mod.tools.map((tool) => (
                  <span key={tool} className="px-3 py-1 rounded-full text-xs font-['DM_Sans'] bg-[oklch(0.55_0.22_260/15%)] text-[oklch(0.75_0.15_260)] border border-[oklch(0.55_0.22_260/20%)]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Next module */}
            {mod.nextSlug && (
              <Link href={`/module/${mod.nextSlug}`}>
                <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-5 hover:border-[oklch(0.55_0.22_260/40%)] transition-colors group">
                  <div className="text-xs text-white/40 font-['DM_Sans'] mb-1">Next Module</div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Barlow_Condensed'] font-700 text-white group-hover:text-[oklch(0.75_0.15_260)] transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {mod.nextTitle}
                    </span>
                    <ChevronRight size={16} className="text-white/40 group-hover:text-[oklch(0.55_0.22_260)] transition-colors" />
                  </div>
                </div>
              </Link>
            )}

            {/* Instructor */}
            <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <h3 className="font-['Barlow_Condensed'] font-700 text-white text-base mb-3 flex items-center gap-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <span className="text-white/40 text-xs">Instructor</span>
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-[oklch(0.55_0.22_260/40%)]"
                  style={{ background: 'linear-gradient(135deg, oklch(0.35 0.15 260), oklch(0.25 0.10 270))' }}
                >
                  <span className="font-['Barlow_Condensed'] font-800 text-white text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}>VB</span>
                </div>
                <div>
                  <p className="text-sm font-['Barlow_Condensed'] font-700 text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Dr. Vicki Bealman</p>
                  <p className="text-xs text-[oklch(0.65_0.22_260)] font-['DM_Sans']">AI Educator &amp; Practitioner</p>
                </div>
              </div>
            </div>

            {/* Certificate link */}
            <Link href="/certificate">
              <div className="rounded-lg border border-[oklch(0.85_0.25_135/25%)] bg-[oklch(0.85_0.25_135/5%)] p-5 hover:border-[oklch(0.85_0.25_135/50%)] transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[oklch(0.85_0.25_135)] font-['DM_Sans'] mb-0.5">Complete all modules</div>
                    <div className="font-['Barlow_Condensed'] font-700 text-white text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Earn Your Certificate
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[oklch(0.85_0.25_135/50%)] group-hover:text-[oklch(0.85_0.25_135)] transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
