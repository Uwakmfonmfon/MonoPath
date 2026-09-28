import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Zap, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans relative overflow-hidden">
      {/* Atmospheric Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neonBlue-glow/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Background Architecture Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Hero Section */}
      <header className="relative z-10 overflow-hidden bg-obsidian-base/50 backdrop-blur-sm border-b border-obsidian-border">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonBlue-glow/10 text-neonBlue-glow text-xs font-mono uppercase tracking-widest border border-neonBlue-glow/20 mb-8 animate-boot">
            <Zap size={12} />
            <span>The Path to Mastery, Simplified</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-8 leading-tight">
            Stop Wandering. <br />
            <span className="text-neonBlue-glow drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">Start Mastering.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            MonoPath eliminates the noise of learning. We synthesize your goals into a
            <span className="text-white font-medium"> single, decisive path</span>—removing the paradox of choice so you can focus on execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/intake"
              className="group flex items-center gap-2 px-10 py-5 bg-neonBlue-glow text-obsidian-base rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95"
            >
              Begin Your Path
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="px-10 py-5 bg-obsidian-surface text-zinc-400 border border-obsidian-border rounded-xl font-semibold text-lg hover:bg-obsidian-border hover:text-white transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group p-10 bg-obsidian-surface rounded-3xl border border-obsidian-border hover:border-neonBlue-dim transition-all duration-500 shadow-2xl">
            <div className="w-14 h-14 bg-neonBlue-glow/10 text-neonBlue-glow rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Decisive Direction</h3>
            <p className="text-zinc-500 leading-relaxed font-light">
              No more "top 10" lists. Get a single, curated sequence of tasks tailored to your current level and goals.
            </p>
          </div>

          <div className="group p-10 bg-obsidian-surface rounded-3xl border border-obsidian-border hover:border-purple-500/50 transition-all duration-500 shadow-2xl">
            <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Synthesized Knowledge</h3>
            <p className="text-zinc-500 leading-relaxed font-light">
              Our AI assistant provides context-aware guidance that evolves as you level up, from casual basics to professional mastery.
            </p>
          </div>

          <div className="group p-10 bg-obsidian-surface rounded-3xl border border-obsidian-border hover:border-green-500/50 transition-all duration-500 shadow-2xl">
            <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Plateau Detection</h3>
            <p className="text-zinc-500 leading-relaxed font-light">
              Stuck? MonoPath identifies when you've hit a wall and pairs you with others facing the same plateau to break through together.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-obsidian-border py-16 bg-obsidian-base">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-600 text-sm font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} MonoPath. All rights reserved. Execute. Evolve. Repeat.</p>
        </div>
      </footer>
    </div>
  );
}
