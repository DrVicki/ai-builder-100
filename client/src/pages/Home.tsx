// Signal & Clarity — Bold Geometric Futurism
// Home page: Hero, Stats, Curriculum, FAQ, CTA, Footer
import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronRight, Play, BookOpen, Dumbbell, ClipboardCheck, Star, Users, Layers, CheckCircle2, GraduationCap, Linkedin, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MODULES, FAQ_ITEMS, STATS } from '@/lib/data';

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
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

// ─── Topic type icon ──────────────────────────────────────────────────────────
function TypeIcon({ type }: { type: string }) {
  if (type === 'video') return <Play size={12} className="text-[oklch(0.75_0.15_260)]" />;
  if (type === 'reading') return <BookOpen size={12} className="text-[oklch(0.75_0.15_260)]" />;
  if (type === 'exercise') return <Dumbbell size={12} className="text-[oklch(0.85_0.25_135)]" />;
  return <ClipboardCheck size={12} className="text-[oklch(0.80_0.15_30)]" />;
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span
          className="text-base font-['DM_Sans'] font-500 text-white/90 group-hover:text-white transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        >
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-[oklch(0.55_0.22_260)] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="text-sm font-['DM_Sans'] text-white/60 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.16_0.04_255)] text-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/7jkvNcR3wFqQGyjiBuyQFW/hero-bg-CiQPQZFu2F6RMBXjy3NuJw.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.04_255/95%)] via-[oklch(0.12_0.04_255/70%)] to-[oklch(0.12_0.04_255/30%)]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.16_0.04_255)] to-transparent" />

        <div className="relative container pt-24 pb-16">
          {/* Badge */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[oklch(0.55_0.22_260/40%)] bg-[oklch(0.55_0.22_260/10%)] text-[oklch(0.75_0.15_260)] text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.85_0.25_135)] animate-pulse" />
            Virtual Bootcamp · Foundations for Application
          </div>

          {/* Instructor byline */}
          <div className="animate-fade-up flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[oklch(0.55_0.22_260)] to-[oklch(0.45_0.22_280)] flex items-center justify-center border-2 border-[oklch(0.55_0.22_260/50%)] flex-shrink-0">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/40 font-['DM_Sans'] leading-none mb-0.5">Instructor</p>
              <p className="text-sm font-['Barlow_Condensed'] font-700 text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Dr. Vicki Bealman</p>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up delay-100 font-['Barlow_Condensed'] font-800 text-white leading-none mb-6"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              lineHeight: 0.95,
            }}
          >
            Build the
            <br />
            <span className="text-[oklch(0.65_0.22_260)]">Intelligence</span>
            <br />
            Behind AI
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up delay-200 text-white/60 max-w-lg mb-10 font-['DM_Sans'] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem' }}
          >
            A practical, structured curriculum covering how AI is applied to real-world problems — from foundational concepts to agents and automation.
          </p>

          {/* Meta row */}
          <div className="animate-fade-up delay-300 flex flex-wrap items-center gap-6 mb-10 text-sm text-white/50 font-['DM_Sans']">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-[oklch(0.85_0.25_135)] fill-[oklch(0.85_0.25_135)]" />
              <span className="text-white font-semibold">4.9</span>
              <span>rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span className="text-white font-semibold">1,200+</span>
              <span>learners enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers size={14} />
              <span className="text-white font-semibold">5 modules</span>
              <span>· 40+ hours</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up delay-400 flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-lime px-8 py-3 rounded-md text-sm"
            >
              Explore Curriculum
            </button>
            <Link href="/dashboard">
              <div className="btn-glow px-8 py-3 rounded-md text-sm">
                My Progress
              </div>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown size={24} className="text-white" />
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section id="modules" className="border-y border-white/10 bg-[oklch(0.19_0.04_255)]">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="text-center">
              <div
                className="font-['Barlow_Condensed'] font-800 text-[oklch(0.65_0.22_260)] mb-1"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '3rem', lineHeight: 1 }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs font-['DM_Sans'] text-white/50 uppercase tracking-widest">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CURRICULUM ───────────────────────────────────────────────────────── */}
      <section id="curriculum" className="py-24">
        <div className="container">
          <Reveal className="mb-4">
            <span className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)]">
              Curriculum
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-['Barlow_Condensed'] font-800 text-white mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.05 }}
            >
              Five Modules.
              <br />
              <span className="text-[oklch(0.65_0.22_260)]">One Complete Foundation.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/50 font-['DM_Sans'] max-w-xl mb-16 leading-relaxed">
              A carefully sequenced curriculum that takes you from understanding AI fundamentals to designing responsible, automated AI systems.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((mod, i) => (
              <Reveal key={mod.slug} delay={i * 80}>
                <Link href={`/module/${mod.slug}`}>
                  <div className="card-hover group rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={mod.image}
                        alt={mod.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.20_0.04_255)] via-transparent to-transparent" />
                      {/* Number badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="font-['Barlow_Condensed'] font-800 text-white/30 text-4xl leading-none select-none"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
                        >
                          {mod.number}
                        </span>
                      </div>
                      {/* Difficulty */}
                      <div className="absolute top-3 right-3">
                        <DifficultyBadge level={mod.difficulty} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3
                        className="font-['Barlow_Condensed'] font-700 text-white text-xl mb-1 leading-tight group-hover:text-[oklch(0.75_0.15_260)] transition-colors"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                      >
                        {mod.title}
                      </h3>
                      <p className="text-xs text-[oklch(0.65_0.22_260)] font-['DM_Sans'] mb-3">{mod.tagline}</p>
                      <p className="text-sm text-white/50 font-['DM_Sans'] leading-relaxed flex-1 mb-4">{mod.description}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-3 text-xs text-white/40 font-['DM_Sans']">
                          <span>{mod.topics.length} topics</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[oklch(0.65_0.22_260)] font-['Barlow_Condensed'] font-600 uppercase tracking-wider group-hover:gap-2 transition-all">
                          Explore <ChevronRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTRUCTOR ───────────────────────────────────────────────────────── */}
      <section id="instructor" className="py-24">
        <div className="container">
          <Reveal className="mb-4">
            <span className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)]">
              Your Instructor
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <Reveal delay={80}>
                <h2
                  className="font-['Barlow_Condensed'] font-800 text-white mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}
                >
                  Dr. Vicki Bealman
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-[oklch(0.65_0.22_260)] font-['DM_Sans'] text-sm mb-6">
                  AI Educator &amp; Practitioner · Virtual Bootcamp · Foundations for Application
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-white/60 font-['DM_Sans'] text-sm leading-relaxed mb-6">
                  Dr. Vicki Bealman brings deep expertise in applied AI education, helping learners at every level build a confident, practical understanding of how artificial intelligence shapes the world around them. Her curriculum bridges the gap between abstract AI concepts and real-world application — equipping students with the frameworks, vocabulary, and critical thinking skills to engage with AI responsibly and effectively.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-white/50 font-['DM_Sans'] text-sm leading-relaxed mb-8">
                  Through AI Builder 100, Dr. Bealman guides learners from foundational problem-solving principles through to the emerging world of AI agents and automation — all grounded in ethical awareness and practical application.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap gap-3">
                  {['Applied AI', 'Responsible AI', 'AI Ethics', 'Workflow Automation', 'AI Education'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-['DM_Sans'] bg-[oklch(0.55_0.22_260/12%)] text-[oklch(0.75_0.15_260)] border border-[oklch(0.55_0.22_260/20%)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: Card */}
            <Reveal delay={120}>
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-4 bg-[oklch(0.55_0.22_260/8%)] rounded-2xl blur-2xl" />
                <div className="relative rounded-xl border border-[oklch(0.55_0.22_260/30%)] bg-[oklch(0.20_0.04_255)] overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-[oklch(0.55_0.22_260)] to-[oklch(0.85_0.25_135)]" />
                  <div className="p-8">
                    {/* Avatar */}
                    <div className="flex items-center gap-5 mb-6">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[oklch(0.55_0.22_260/50%)]"
                        style={{ background: 'linear-gradient(135deg, oklch(0.35 0.15 260), oklch(0.25 0.10 270))' }}
                      >
                        <span
                          className="font-['Barlow_Condensed'] font-800 text-white text-3xl"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
                        >
                          VB
                        </span>
                      </div>
                      <div>
                        <h3
                          className="font-['Barlow_Condensed'] font-700 text-white text-xl"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                        >
                          Dr. Vicki Bealman
                        </h3>
                        <p className="text-sm text-[oklch(0.65_0.22_260)] font-['DM_Sans'] mt-0.5">AI Educator &amp; Practitioner</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[['1,200+', 'Learners'], ['5', 'Modules'], ['40+', 'Hours']].map(([val, lbl]) => (
                        <div key={lbl} className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                          <div
                            className="font-['Barlow_Condensed'] font-800 text-[oklch(0.65_0.22_260)] text-xl"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
                          >
                            {val}
                          </div>
                          <div className="text-xs text-white/40 font-['DM_Sans']">{lbl}</div>
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="border-l-2 border-[oklch(0.55_0.22_260/50%)] pl-4">
                      <p className="text-sm text-white/60 font-['DM_Sans'] leading-relaxed italic">
                        "AI literacy is not a technical skill — it is a human one. My goal is to help every learner build the confidence to engage with AI thoughtfully, critically, and creatively."
                      </p>
                      <footer className="text-xs text-white/30 font-['DM_Sans'] mt-2">— Dr. Vicki Bealman</footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-[oklch(0.19_0.04_255)]">
        <div className="container max-w-3xl">
          <Reveal className="mb-4">
            <span className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)]">
              FAQ
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-['Barlow_Condensed'] font-800 text-white mb-12"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1 }}
            >
              Common Questions
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <div className="rounded-lg border border-white/10 bg-[oklch(0.20_0.04_255)] px-6 divide-y divide-white/0">
              {FAQ_ITEMS.map((item) => (
                <FAQItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.55_0.22_260/8%)] via-transparent to-[oklch(0.85_0.25_135/5%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.55_0.22_260/50%)] to-transparent" />

        <div className="relative container text-center">
          <Reveal>
            <span className="text-xs font-['Barlow_Condensed'] font-600 uppercase tracking-widest text-[oklch(0.55_0.22_260)] mb-4 block">
              Get Started Today
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-['Barlow_Condensed'] font-800 text-white mb-6 mx-auto"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', lineHeight: 1, maxWidth: '700px' }}
            >
              Your AI Journey
              <br />
              <span className="text-[oklch(0.65_0.22_260)]">Starts Here</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/50 font-['DM_Sans'] max-w-md mx-auto mb-10 leading-relaxed">
              Join learners who are building the skills to understand, apply, and lead with AI. No prior experience required.
            </p>
          </Reveal>

          {/* Feature pills */}
          <Reveal delay={240}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Self-paced', 'Certificate included', 'Practical exercises', 'No coding required', 'Lifetime access'].map((f) => (
                <div key={f} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm text-white/70 font-['DM_Sans']">
                  <CheckCircle2 size={13} className="text-[oklch(0.85_0.25_135)]" />
                  {f}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-lime px-10 py-4 rounded-md text-base"
              >
                Start Learning
              </button>
              <Link href="/dashboard">
                <div className="btn-glow px-10 py-4 rounded-md text-base">
                  View My Progress
                </div>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-10 bg-[oklch(0.14_0.04_255)]">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[oklch(0.55_0.22_260)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="font-['Barlow_Condensed'] font-700 text-white/80 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              AI Builder 100
            </span>
          </div>
          <p className="text-xs text-white/30 font-['DM_Sans']">
            © 2025 AI Builder 100 — Foundations for Application. Instructor: Dr. Vicki Bealman.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40 font-['DM_Sans']">
            <button className="hover:text-white/70 transition-colors">Privacy Policy</button>
            <button className="hover:text-white/70 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
