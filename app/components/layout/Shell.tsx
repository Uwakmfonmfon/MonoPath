"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { calculateTotalLoad } from '@/lib/load-utils';
import { getGlobalProgress } from '@/lib/level-utils';
import LoadMeter from './LoadMeter';
import Link from 'next/link';
import { Award, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [load, setLoad] = useState(0);
  const [maxLoad, setMaxLoad] = useState(20); // Default max load
  const [user, setUser] = useState<User | null>(null);
  const userId = 'user_1';

  const updateStats = async () => {
    const currentLoad = await calculateTotalLoad(userId);
    setLoad(currentLoad);
    await db.updateUserLoad(userId, currentLoad);

    const userData = await db.getUser(userId);
    if (userData) setUser(userData);
  };

  useEffect(() => {
    updateStats();
    // Poll every 30 seconds to keep load synced across tabs
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-base text-white">
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-obsidian-border bg-obsidian-base/80 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold font-display tracking-tighter text-white hover:text-neonBlue-accent transition-colors">
            MONOPATH
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {/* Global Character Level Indicator */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-obsidian-surface border border-obsidian-border group hover:border-neonBlue-accent transition-all">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-0.5">Global Rank</span>
                <span className="text-xs font-bold font-mono text-white leading-none">LVL {user.globalLevel || 1}</span>
              </div>
              <div className="w-16 h-2 bg-obsidian-base rounded-full overflow-hidden border border-obsidian-border">
                <div
                  className="h-full bg-neonBlue-glow shadow-[0_0_8px_#00F0FF] transition-all duration-1000"
                  style={{ width: `${getGlobalProgress(user.globalXp || 0, user.globalLevel || 1)}%` }}
                />
              </div>
              <UserIcon size={14} className="text-zinc-500 group-hover:text-neonBlue-glow transition-colors" />
            </div>
          )}

          <Link
            href="/mastery"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-surface border border-obsidian-border hover:border-neonBlue-accent transition-all group"
          >
            <Award size={14} className="text-zinc-500 group-hover:text-neonBlue-glow transition-colors" />
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-200 uppercase tracking-widest transition-colors">Mastery</span>
          </Link>
          <LoadMeter currentLoad={load} maxLoad={maxLoad} />
        </div>
      </header>

      <main className="pt-20 px-6 pb-12">
        {children}
      </main>
    </div>
  );
}
