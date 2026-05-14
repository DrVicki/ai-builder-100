// Signal & Clarity — Dashboard / My Progress Page
import { Link } from 'wouter';
import { BarChart2, CheckCircle2, Layers, Zap, ArrowLeft, RotateCcw, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MODULES } from '@/lib/data';
import { useProgress } from '@/contexts/ProgressContext';
import { toast } from 'sonner';

function StatCard({ icon, value, label, accent = false }: { icon: React.ReactNode; value: string | number; label: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 flex items-center gap-4 ${accent ? 'border-[oklch(0.55_0.22_260/40%)] bg-[oklch(0.55_0.22_260/10%)]' : 'border-white/10 bg-[oklch(0.20_0.04_255)]'}`}>
      <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${accent ? 'bg-[oklch(0.55_0.22_260/20%)]' : 'bg-white/5'}`}>
        {icon}
      </div>
      <div>
        <div
          className="font-['Barlow_Condensed'] font-800 text-white text-2xl leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
        >
          {value}
        </div>
        <div className="text-xs text-white/40 font-['DM_Sans'] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { getOverallProgress, getModuleProgress, isTopicComplete, resetAll } = useProgress();
  const overall = getOverallProgress();

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetAll();
      toast.success('Progress reset successfully');
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white">
      <Navbar />

      <div className="container pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)] mb-3">
            AI Builder 100 · Foundations for Application
          </div>
          <h1
            className="font-['Barlow_Condensed'] font-800 text-white mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}
          >
            Your Progress
          </h1>
          <p className="text-white/50 font-['DM_Sans'] text-sm">
            Track your journey through all {MODULES.length} modules
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={<BarChart2 size={18} className="text-[oklch(0.65_0.22_260)]" />}
            value={`${overall.percent}%`}
            label="Overall Progress"
            accent
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-[oklch(0.85_0.25_135)]" />}
            value={`${overall.completedTopics}/${overall.totalTopics}`}
            label="Topics Completed"
          />
          <StatCard
            icon={<Layers size={18} className="text-[oklch(0.75_0.15_260)]" />}
            value={`${overall.completedModules}/${overall.totalModules}`}
            label="Modules Completed"
          />
          <StatCard
            icon={<Zap size={18} className="text-[oklch(0.80_0.15_30)]" />}
            value={overall.totalModules - overall.completedModules}
            label="Modules Remaining"
          />
        </div>

        {/* Overall progress bar */}
        <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-['Barlow_Condensed'] font-700 text-white text-lg"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              Bootcamp Progress
            </h2>
            <span className="text-sm font-['Barlow_Condensed'] font-700 text-[oklch(0.65_0.22_260)]">
              {overall.percent}%
            </span>
          </div>

          {/* Track */}
          <div className="relative mb-3">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[oklch(0.55_0.22_260)] to-[oklch(0.85_0.25_135)] rounded-full transition-all duration-700"
                style={{ width: `${overall.percent}%` }}
              />
            </div>
          </div>

          {/* Module milestones */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {MODULES.map((mod) => {
              const p = getModuleProgress(mod.slug);
              const done = p.completed === p.total && p.total > 0;
              const started = p.completed > 0;
              return (
                <Link key={mod.slug} href={`/module/${mod.slug}`}>
                  <div className="text-center group">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto mb-1.5 transition-all ${
                        done
                          ? 'border-[oklch(0.85_0.25_135)] bg-[oklch(0.85_0.25_135/20%)]'
                          : started
                          ? 'border-[oklch(0.55_0.22_260)] bg-[oklch(0.55_0.22_260/20%)]'
                          : 'border-white/20 bg-white/5'
                      } group-hover:border-[oklch(0.55_0.22_260)] group-hover:scale-110`}
                    >
                      {done ? (
                        <CheckCircle2 size={14} className="text-[oklch(0.85_0.25_135)]" />
                      ) : (
                        <span
                          className={`text-xs font-['Barlow_Condensed'] font-700 ${started ? 'text-[oklch(0.65_0.22_260)]' : 'text-white/30'}`}
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          {mod.number}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/30 font-['DM_Sans'] hidden sm:block truncate">{mod.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Module Roadmap */}
        <div className="mb-10">
          <h2
            className="font-['Barlow_Condensed'] font-700 text-white text-2xl mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
          >
            Module Roadmap
          </h2>

          <div className="space-y-4">
            {MODULES.map((mod) => {
              const p = getModuleProgress(mod.slug);
              const done = p.completed === p.total && p.total > 0;
              const started = p.completed > 0 && !done;

              return (
                <div
                  key={mod.slug}
                  className={`rounded-lg border p-5 transition-all ${
                    done
                      ? 'border-[oklch(0.85_0.25_135/30%)] bg-[oklch(0.85_0.25_135/5%)]'
                      : 'border-white/10 bg-[oklch(0.20_0.04_255)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Number badge */}
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 font-['Barlow_Condensed'] font-800 text-sm ${
                        done
                          ? 'bg-[oklch(0.85_0.25_135/20%)] text-[oklch(0.85_0.25_135)]'
                          : started
                          ? 'bg-[oklch(0.55_0.22_260/20%)] text-[oklch(0.65_0.22_260)]'
                          : 'bg-white/5 text-white/40'
                      }`}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {mod.number}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <h3
                            className="font-['Barlow_Condensed'] font-700 text-white text-lg leading-tight"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                          >
                            {mod.title}
                          </h3>
                          <p className="text-xs text-white/40 font-['DM_Sans']">{mod.tagline}</p>
                        </div>
                        <Link href={`/module/${mod.slug}`}>
                          <div className="btn-glow px-4 py-2 rounded-md text-xs flex items-center gap-1.5 flex-shrink-0">
                            {done ? 'Review' : started ? 'Continue' : 'Start'}
                            <ChevronRight size={12} />
                          </div>
                        </Link>
                      </div>

                      {/* Topic dots */}
                      <div className="flex flex-wrap gap-1.5 mt-3 mb-2">
                        {mod.topics.map((topic) => {
                          const complete = isTopicComplete(mod.slug, topic.id);
                          return (
                            <div
                              key={topic.id}
                              title={topic.title}
                              className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center font-['Barlow_Condensed'] font-700 transition-all ${
                                complete
                                  ? 'border-[oklch(0.55_0.22_260)] bg-[oklch(0.55_0.22_260)] text-white'
                                  : 'border-white/20 bg-white/5 text-white/30'
                              }`}
                              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px' }}
                            >
                              {topic.id}
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-[oklch(0.85_0.25_135)]' : 'bg-[oklch(0.55_0.22_260)]'}`}
                            style={{ width: `${p.percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/30 font-['DM_Sans'] flex-shrink-0">
                          {p.completed}/{p.total} · {p.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <Link href="/">
            <div className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-['DM_Sans']">
              <ArrowLeft size={14} />
              Back to all modules
            </div>
          </Link>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-white/30 hover:text-red-400 transition-colors font-['DM_Sans']"
          >
            <RotateCcw size={13} />
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
}
