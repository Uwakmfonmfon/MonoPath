import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Zap, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <Zap size={14} />
            <span>The Path to Mastery, Simplified</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Stop Wandering. <br />
            <span className="text-blue-600">Start Mastering.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            MonoPath eliminates the noise of learning. We synthesize your goals into a
            single, decisive path—removing the paradox of choice so you can focus on execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/intake"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200"
            >
              Begin Your Path
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Decisive Direction</h3>
            <p className="text-slate-600 leading-relaxed">
              No more "top 10" lists. Get a single, curated sequence of tasks tailored to your current level and goals.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Synthesized Knowledge</h3>
            <p className="text-slate-600 leading-relaxed">
              Our AI assistant provides context-aware guidance that evolves as you level up, from casual basics to professional mastery.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Plateau Detection</h3>
            <p className="text-slate-600 leading-relaxed">
              Stuck? MonoPath identifies when you've hit a wall and pairs you with others facing the same plateau to break through together.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} MonoPath. All rights reserved. Execute. Evolve. Repeat.</p>
        </div>
      </footer>
    </div>
  );
}
