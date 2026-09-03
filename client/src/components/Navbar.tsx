import { useProgress } from '@/contexts/ProgressContext';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { Menu, X, BarChart2, Zap, Award, NotebookPen } from 'lucide-react';

export default function Navbar() {
  const [location] = useLocation();
  const { getOverallProgress } = useProgress();
  const overall = getOverallProgress();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (location !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[oklch(0.16_0.04_255/90%)] backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 group">
            <div className="signal-mark w-8 h-8 bg-[oklch(0.55_0.22_260)] flex items-center justify-center animate-pulse-glow">
              <Zap size={16} className="text-white" />
            </div>
            <span
              className="signal-wordmark text-xl text-white"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              AI Builder <span className="text-[oklch(0.65_0.22_260)]">100</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scrollTo('modules')}
            className="px-4 py-2 text-sm font-['DM_Sans'] text-white/70 hover:text-white transition-colors hover:bg-white/5 rounded-md"
          >
            Modules
          </button>
          <button
            onClick={() => scrollTo('curriculum')}
            className="px-4 py-2 text-sm font-['DM_Sans'] text-white/70 hover:text-white transition-colors hover:bg-white/5 rounded-md"
          >
            Curriculum
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="px-4 py-2 text-sm font-['DM_Sans'] text-white/70 hover:text-white transition-colors hover:bg-white/5 rounded-md"
          >
            FAQ
          </button>
          <Link href="/notes">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-white/60 hover:text-white transition-colors text-sm font-['DM_Sans']">
              <NotebookPen size={14} />
              <span>Notes</span>
            </div>
          </Link>
          <Link href="/certificate">
            <div className="flex items-center gap-2 px-4 py-2 rounded-md text-white/60 hover:text-white transition-colors text-sm font-['DM_Sans']">
              <Award size={14} />
              <span>Certificate</span>
            </div>
          </Link>
          <Link href="/dashboard">
            <div className="ml-1 flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 text-white/80 hover:border-[oklch(0.55_0.22_260)] hover:text-white transition-all text-sm font-['DM_Sans']">
              <BarChart2 size={14} />
              <span>My Progress</span>
              {overall.percent > 0 && (
                <span className="text-xs text-[oklch(0.85_0.25_135)] font-semibold">{overall.percent}%</span>
              )}
            </div>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[oklch(0.16_0.04_255)] px-4 py-4 flex flex-col gap-2">
          <button onClick={() => scrollTo('modules')} className="text-left px-3 py-2 text-white/70 hover:text-white text-sm rounded-md hover:bg-white/5">Modules</button>
          <button onClick={() => scrollTo('curriculum')} className="text-left px-3 py-2 text-white/70 hover:text-white text-sm rounded-md hover:bg-white/5">Curriculum</button>
          <button onClick={() => scrollTo('faq')} className="text-left px-3 py-2 text-white/70 hover:text-white text-sm rounded-md hover:bg-white/5">FAQ</button>
          <Link href="/notes">
            <div className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white text-sm rounded-md hover:bg-white/5" onClick={() => setMobileOpen(false)}>
              <NotebookPen size={14} />
              Notes
            </div>
          </Link>
          <Link href="/certificate">
            <div className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white text-sm rounded-md hover:bg-white/5" onClick={() => setMobileOpen(false)}>
              <Award size={14} />
              Certificate
            </div>
          </Link>
          <Link href="/dashboard">
            <div className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white text-sm rounded-md hover:bg-white/5" onClick={() => setMobileOpen(false)}>
              <BarChart2 size={14} />
              My Progress
              {overall.percent > 0 && <span className="text-xs text-[oklch(0.85_0.25_135)]">{overall.percent}%</span>}
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
