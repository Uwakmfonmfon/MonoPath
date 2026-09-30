"use client";
import React from 'react';
import { Users, Zap, X } from 'lucide-react';

interface MatchFoundModalProps {
  match: any;
  onBreakthrough: () => void;
  onClose: () => void;
}

export default function MatchFoundModal({ match, onBreakthrough, onClose }: MatchFoundModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian-base/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg bg-obsidian-surface border-2 border-neonBlue-accent rounded-3xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neonBlue-accent/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neonBlue-accent/20 blur-[100px] rounded-full" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-neonBlue-accent/10 border border-neonBlue-accent/30 rounded-full flex items-center justify-center animate-pulse-glow">
              <Users className="text-neonBlue-accent" size={40} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight">Match Synchronized</h2>
            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Compatible Plateau Detected</p>
          </div>

          <div className="p-6 bg-obsidian-base/50 border border-obsidian-border rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-500 uppercase">Partner</span>
              <span className="text-sm font-bold text-white font-mono">{match.username || 'Cognitive Peer #842'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-500 uppercase">Plateau</span>
              <span className="text-sm font-bold text-neonBlue-accent font-mono">{match.plateauType}</span>
            </div>
            <div className="pt-2 border-t border-obsidian-border">
              <p className="text-xs text-zinc-400 italic text-center">"Collaborative breakthrough sequence initiated."</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onBreakthrough}
              className="group relative w-full py-4 bg-neonBlue-accent text-obsidian-base font-bold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-2 text-lg uppercase tracking-tighter">
                <Zap size={20} fill="currentColor" />
                Trigger Breakthrough
              </div>
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-obsidian-base text-zinc-500 font-mono text-xs uppercase tracking-widest rounded-2xl border border-obsidian-border hover:text-zinc-300 transition-all"
            >
              End Pairing Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
