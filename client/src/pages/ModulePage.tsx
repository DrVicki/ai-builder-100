// Signal & Clarity — Module Detail Page
// Shows module header, topics list, about, learning outcomes, prerequisites, tools, next module
import { useParams, Link } from 'wouter';
import { ArrowLeft, Play, BookOpen, Dumbbell, ClipboardCheck, Clock, ChevronRight, Lock, CheckCircle2, StickyNote } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MODULES } from '@/lib/data';
import { useProgress } from '@/contexts/ProgressContext';
import { useState } from 'react';
import { toast } from 'sonner';

function TypeIcon({ type }: { type: string }) {
  const cls = 'flex-shrink-0';
  if (type === 'video') return <Play size={14} className={`${cls} text-[oklch(0.75_0.15_260)]`} />;
  if (type === 'reading') return <BookOpen size={14} className={`${cls} text-[oklch(0.75_0.15_260)]`} />;
  if (type === 'exercise') return <Dumbbell size={14} className={`${cls} text-[oklch(0.85_0.25_135)]`} />;
  return <ClipboardCheck size={14} className={`${cls} text-[oklch(0.80_0.15_30)]`} />;
}

function TypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = { video: 'Video', reading: 'Reading', exercise: 'Exercise', quiz: 'Quiz' };
  return <span className="capitalize text-white/40 text-xs font-['DM_Sans']">{map[type] ?? type}</span>;
}

function DifficultyBadge({ level }: { level: string }) {
  const cls =
    level === 'Foundational'
      ? 'badge-beginner'
      : level === 'Intermediate'
      ? 'badge-intermediate'
      : 'badge-advanced';
  return (
    <span className={`${cls} text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest px-2.5 py-1 rounded-sm`}>
      {level}
    </span>
  );
}

export default function ModulePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const mod = MODULES.find((m) => m.slug === slug);
  const { isTopicComplete, toggleTopic, getModuleProgress } = useProgress();
  const [noteOpen, setNoteOpen] = useState<number | null>(null);

  if (!mod) {
    return (
      <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Module not found.</p>
          <Link href="/">
            <div className="btn-glow px-6 py-2 rounded-md text-sm inline-block">Back to Home</div>
          </Link>
        </div>
      </div>
    );
  }

  const progress = getModuleProgress(mod.slug);
  const firstIncompleteIndex = mod.topics.findIndex((t) => !isTopicComplete(mod.slug, t.id));

  return (
    <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white">
      <Navbar />

      {/* ── MODULE HERO ──────────────────────────────────────────────────────── */}
      <div className="relative pt-16 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${mod.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.16_0.04_255/60%)] via-[oklch(0.16_0.04_255/80%)] to-[oklch(0.16_0.04_255)]" />

        <div className="relative container pt-10 pb-12">
          {/* Back link */}
          <Link href="/">
            <div className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 font-['DM_Sans']">
              <ArrowLeft size={14} />
              Back to all modules
            </div>
          </Link>

          {/* Module number */}
          <div className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)] mb-3">
            Module {mod.number}
          </div>

          {/* Title */}
          <h1
            className="font-['Barlow_Condensed'] font-800 text-white mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1 }}
          >
            {mod.title}
          </h1>
          <p className="text-[oklch(0.65_0.22_260)] font-['DM_Sans'] mb-5 text-lg">{mod.tagline}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4">
            <DifficultyBadge level={mod.difficulty} />
            <div className="flex items-center gap-1.5 text-sm text-white/50 font-['DM_Sans']">
              <Clock size={13} />
              {mod.topics.length} topics
            </div>
            {progress.completed > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-[oklch(0.85_0.25_135)] font-['DM_Sans']">
                <CheckCircle2 size={13} />
                {progress.completed}/{progress.total} completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: About + Topics */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <h2
                className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
                About This Module
              </h2>
              <p className="text-white/60 font-['DM_Sans'] leading-relaxed text-sm">{mod.about}</p>
            </section>

            {/* Topics */}
            <section>
              <h2
                className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
                Topics ({mod.topics.length})
              </h2>

              {/* Progress bar */}
              {progress.total > 0 && (
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
              )}

              <div className="space-y-1">
                {mod.topics.map((topic, idx) => {
                  const complete = isTopicComplete(mod.slug, topic.id);
                  const locked = idx > (firstIncompleteIndex === -1 ? mod.topics.length : firstIncompleteIndex + 1);
                  return (
                    <div
                      key={topic.id}
                      className={`group flex items-center gap-4 px-4 py-3.5 rounded-md border transition-all duration-200 ${
                        complete
                          ? 'border-[oklch(0.55_0.22_260/30%)] bg-[oklch(0.55_0.22_260/8%)]'
                          : locked
                          ? 'border-white/5 bg-white/3 opacity-50'
                          : 'border-white/10 bg-[oklch(0.20_0.04_255)] hover:border-[oklch(0.55_0.22_260/40%)] hover:bg-[oklch(0.22_0.04_255)]'
                      }`}
                    >
                      {/* Complete toggle */}
                      <button
                        onClick={() => !locked && toggleTopic(mod.slug, topic.id)}
                        disabled={locked}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          complete
                            ? 'border-[oklch(0.55_0.22_260)] bg-[oklch(0.55_0.22_260)]'
                            : locked
                            ? 'border-white/20'
                            : 'border-white/30 hover:border-[oklch(0.55_0.22_260)]'
                        }`}
                      >
                        {complete && <CheckCircle2 size={12} className="text-white" />}
                        {locked && <Lock size={10} className="text-white/30" />}
                      </button>

                      {/* Type icon */}
                      <TypeIcon type={topic.type} />

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-['DM_Sans'] ${complete ? 'text-white/50 line-through' : 'text-white/80'}`}>
                          {topic.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <TypeLabel type={topic.type} />
                          <span className="text-white/25 text-xs">·</span>
                          <span className="text-xs text-white/35 font-['DM_Sans']">{topic.duration}</span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1 text-xs text-white/30 font-['DM_Sans'] flex-shrink-0">
                        <Clock size={11} />
                        {topic.duration}
                      </div>

                      {/* Note button */}
                      <button
                        title="Add note"
                        onClick={() => {
                          setNoteOpen(noteOpen === topic.id ? null : topic.id);
                          toast.info('Notes feature coming soon');
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/60"
                      >
                        <StickyNote size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-white/30 font-['DM_Sans'] mt-3">
                Click the circle to mark a topic complete · Topics unlock as you progress
              </p>
            </section>

            {/* What You'll Learn */}
            <section>
              <h2
                className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
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
                  const firstTopic = mod.topics[0];
                  if (firstTopic) toggleTopic(mod.slug, firstTopic.id);
                  toast.success(`Started: ${mod.title}`);
                }}
                className="btn-glow w-full py-3 rounded-md text-sm flex items-center justify-center gap-2"
              >
                <Play size={14} />
                Start Module
              </button>
              <p className="text-xs text-white/30 text-center mt-3 font-['DM_Sans']">
                No sign-up required · Begin immediately
              </p>

              {/* Progress mini */}
              {progress.total > 0 && progress.completed > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs text-white/40 font-['DM_Sans'] mb-1.5">
                    <span>Progress</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[oklch(0.85_0.25_135)] rounded-full transition-all duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Prerequisites */}
            <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-5">
              <h3 className="font-['Barlow_Condensed'] font-700 text-white text-base mb-3 flex items-center gap-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <Lock size={13} className="text-white/40" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {mod.prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-white/50 font-['DM_Sans']">
                    <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0 mt-1.5" />
                    {p}
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
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-full text-xs font-['DM_Sans'] bg-[oklch(0.55_0.22_260/15%)] text-[oklch(0.75_0.15_260)] border border-[oklch(0.55_0.22_260/20%)]"
                  >
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
          </div>
        </div>
      </div>
    </div>
  );
}
