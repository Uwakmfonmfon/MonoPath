"use client";
import React, { useState, useEffect } from 'react';
import { RecommendedSkill } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';

function RecommendationCard({ rec }: { rec: RecommendedSkill }) {
  return (
    <div className="group p-4 bg-obsidian-base border border-white/10 rounded-xl hover:border-neonBlue-accent transition-all cursor-pointer active:scale-95">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
          rec.type === 'Balanced' ? 'border-green-500/30 text-green-400' : 'border-neonBlue-accent/30 text-neonBlue-accent'
        }`}>
          {rec.type} Vector
        </span>
        <Sparkles size={12} className="text-zinc-600 group-hover:text-neonBlue-glow transition-colors" />
      </div>
      <div className="text-sm font-bold text-white mb-1 group-hover:text-neonBlue-glow transition-colors">
        {rec.suggestedGoal}
      </div>
      <p className="text-xs text-zinc-500 font-mono mb-3 leading-relaxed">
        {rec.reasoning}
      </p>
      <button
        onClick={() => {
          window.location.href = `/intake?goal=${encodeURIComponent(rec.suggestedGoal)}&cat=${encodeURIComponent(rec.category)}`;
        }}
        className="flex items-center gap-2 text-[10px] font-mono text-neonBlue-accent uppercase tracking-widest hover:text-neonBlue-glow transition-colors"
      >
        Accept Suggestion <ArrowRight size={10} />
      </button>
    </div>
  );
}

export default function AssistantPanel({ task = { id: 'default_task' }, skillId = 'default_skill' }: { task?: any, skillId?: string }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedSkill[]>([]);

  useEffect(() => {
    async function fetchRecs() {
      try {
        const res = await fetch('/api/recommend');
        const data = await res.json();
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (e) {
        console.error('Failed to fetch recommendations');
      }
    }
    fetchRecs();
  }, []);

  async function askAssistant() {
    if (!query) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_1',
          question: query,
          taskId: task.id,
          skillId: skillId
        }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      setAnswer('The assistant is resting. Try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative mt-12 animate-boot duration-1000">
      {/* Holographic Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neonBlue-glow/20 to-transparent rounded-2xl blur-xl opacity-50" />

      <div className="relative p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neonBlue-glow to-transparent opacity-50" />

        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-neonBlue-glow rounded-full animate-pulse shadow-[0_0_8px_#00F0FF]" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
            Synthesizer HUD v1.0.4
          </span>
        </div>

        {answer ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-neonBlue-glow/30" />
              <p className="text-lg text-zinc-200 leading-relaxed font-light pl-4">
                {answer}
              </p>
            </div>

            <button
              onClick={() => { setAnswer(null); setQuery(''); }}
              className="group flex items-center gap-2 text-xs font-mono text-neonBlue-accent hover:text-neonBlue-glow transition-all uppercase tracking-widest"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              New Inquiry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {recommendations.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-neonBlue-glow" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Recommended Growth Vectors</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {recommendations.map(rec => (
                    <RecommendationCard key={rec.id} rec={rec} />
                  ))}
                </div>
              </div>
            )}

            <div className="relative group">
              <input
                className="w-full bg-obsidian-base/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-neonBlue-glow transition-all font-mono text-sm"
                placeholder="Input query to Synthesizer..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-700 pointer-events-none uppercase">
                CMD+Enter
              </div>
            </div>

            <button
              onClick={askAssistant}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-30
                bg-white/5 text-white border border-white/10
                hover:bg-neonBlue-glow hover:text-obsidian-base hover:border-neonBlue-glow
                active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  Synthesizing...
                </span>
              ) : (
                'Initiate Synthesis'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
