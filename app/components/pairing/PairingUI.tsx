import React, { useState, useEffect } from 'react';

export default function PairingUI({
  userId,
  currentSkillId,
  plateauType
}: {
  userId: string;
  currentSkillId: string;
  plateauType: string
}) {
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [match, setMatch] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Simulate a matchmaking check
  useEffect(() => {
    if (isOptedIn && plateauType !== 'None') {
      setIsSearching(true);

      const timer = setTimeout(() => {
        // Simulate finding a match: in a real app, this would be a Supabase subscription or polling
        setMatch({
          userId: 'user_partner_123',
          username: 'Alex_Growth',
          skillName: 'Watercolor Painting',
          plateauContext: 'Struggling with color blending'
        });
        setIsSearching(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOptedIn, plateauType]);

  const handleOptOut = () => {
    setIsOptedIn(false);
    setMatch(null);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 w-80 animate-in slide-in-from-right-8 duration-500">
      {!isOptedIn ? (
        <div className="p-6 bg-zinc-900 border border-blue-500/30 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Breakthrough Signal</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            You've hit a plateau. A fellow traveler in your field is also struggling.
            <span className="block mt-2 font-bold text-white">Pair up to break through together?</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOptedIn(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all"
            >
              Opt-In
            </button>
            <button
              onClick={() => {}} // Dismiss
              className="px-4 py-2 bg-zinc-800 text-zinc-500 rounded-xl text-xs hover:bg-zinc-700 transition-all"
            >
              Ignore
            </button>
          </div>
        </div>
      ) : match ? (
        <div className="p-6 bg-blue-600 rounded-3xl shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase tracking-widest opacity-80">Partner Found</span>
            <button onClick={handleOptOut} className="text-white/50 hover:text-white text-xs">✕</button>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">{match.username}</h3>
            <p className="text-sm opacity-90 italic">"{match.plateauContext}"</p>
          </div>
          <div className="pt-4 flex flex-col gap-2">
            <button className="w-full bg-white text-blue-600 py-2 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-all">
              Open Shared Channel
            </button>
            <button
              onClick={handleOptOut}
              className="w-full bg-blue-700 text-white py-2 rounded-xl text-xs font-medium hover:bg-blue-800 transition-all"
            >
              End Pairing
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xs font-mono text-zinc-500 uppercase">Searching for Partner...</p>
          <button
            onClick={handleOptOut}
            className="text-xs text-zinc-400 hover:text-zinc-200 underline transition-all"
          >
            Stop Searching
          </button>
        </div>
      )}
    </div>
  );
}
