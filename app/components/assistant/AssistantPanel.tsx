import React, { useState } from 'react';

export default function AssistantPanel({ task, skillId }: { task: any, skillId: string }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Single-Answer Assistant</span>
      </div>

      {answer ? (
        <div className="space-y-4">
          <p className="text-lg text-zinc-200 leading-relaxed">
            {answer}
          </p>
          <button
            onClick={() => { setAnswer(null); setQuery(''); }}
            className="text-sm text-blue-500 hover:text-blue-400 transition-all"
          >
            Ask something else
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
            placeholder="I'm stuck on..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
          />
          <button
            onClick={askAssistant}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? 'Synthesizing...' : 'Ask'}
          </button>
        </div>
      )}
    </div>
  );
}
