import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Zap, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian-base text-paperWhite font-sans relative overflow-hidden">
      {/* Atmospheric Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-focusTeal/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-obsidian-surface blur-[120px] rounded-full pointer-events-none" />

      {/* Background Architecture Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(var(--color-steel-slate) 1px, transparent 1px), linear-gradient(90deg, var(--color-steel-slate) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,205,197,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Hero Section */}
      <header className="relative z-10 overflow-hidden bg-obsidian-surface/30 backdrop-blur-sm border-b border-obsidian-border">
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-focusTeal/10 text-focusTeal text-xs font-mono uppercase tracking-widest border border-focusTeal/20 mb-8 animate-boot">
            <Zap size={12} />
            <span>The Path to Mastery, Simplified</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-paperWhite mb-8 leading-tight font-display">
            Stop Wandering. <br />
            <span className="text-focusTeal">Start Mastering.</span>
          </h1>
          <p className="text-xl text-mutedZinc max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            MonoPath eliminates the noise of learning. We synthesize your goals into a
            <span className="text-paperWhite font-medium"> single, decisive path</span>—removing the paradox of choice so you can focus on execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/intake"
              className="group flex items-center gap-2 px-10 py-5 bg-focusTeal text-obsidian-base rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Begin Your Path
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="px-10 py-5 bg-obsidian-surface text-mutedZinc border border-obsidian-border rounded-xl font-semibold text-lg hover:bg-obsidian-border hover:text-paperWhite transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="group space-y-6">
            <div className="w-12 h-12 bg-focusTeal/10 text-focusTeal rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-paperWhite font-display">Decisive Direction</h3>
            <p className="text-mutedZinc leading-relaxed font-light">
              No more "top 10" lists. Get a single, curated sequence of tasks tailored to your current level and goals.
            </p>
          </div>

          <div className="group space-y-6">
            <div className="w-12 h-12 bg-focusTeal/10 text-focusTeal rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110">
              <BookOpen size={24} />
            </div>
            <h3 className="text-2xl font-bold text-paperWhite font-display">Synthesized Knowledge</h3>
            <p className="text-mutedZinc leading-relaxed font-light">
              Our AI assistant provides context-aware guidance that evolves as you level up, from casual basics to professional mastery.
            </p>
          </div>

          <div className="group space-y-6">
            <div className="w-12 h-12 bg-focusTeal/10 text-focusTeal rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-paperWhite font-display">Plateau Detection</h3>
            <p className="text-mutedZinc leading-relaxed font-light">
              Stuck? MonoPath identifies when you've hit a wall and pairs you with others facing the same plateau to break through together.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-obsidian-border py-16 bg-obsidian-base">
        <div className="max-w-7xl mx-auto px-6 text-center text-mutedZinc text-xs font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} MonoPath. All rights reserved. Execute. Evolve. Repeat.</p>
        </div>
      </footer>
    </div>
  );
}
