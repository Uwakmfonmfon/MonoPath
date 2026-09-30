import React from 'react';
import { Search } from 'lucide-react';

export default function PairingQueueStatus() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-obsidian-surface border border-neonBlue-accent/50 rounded-2xl p-3 flex items-center justify-between shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="text-neonBlue-accent animate-pulse" size={18} />
            <div className="absolute inset-0 bg-neonBlue-accent blur-sm opacity-50 animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white uppercase tracking-widest leading-none">Pairing Queue</span>
            <span className="text-xs font-mono text-neonBlue-accent/80">Scanning for compatible plateau...</span>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-neonBlue-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-1 bg-neonBlue-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-1 bg-neonBlue-accent rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
