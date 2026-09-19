import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Skill, LifeLedgerEntry, User } from '@/types';

export default function LifeLedger() {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [ledger, setLedger] = useState<LifeLedgerEntry[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const userData = await db.getUser('user_1');
      // Mocking the new category levels if they don't exist for v1 compatibility
      const userWithCats = {
        ...userData,
        categoryLevels: userData?.categoryLevels || {
          Health: 1, Creative: 1, Mind: 1, Social: 1, Career: 1
        },
        categoryXp: userData?.categoryXp || {
          Health: 0, Creative: 0, Mind: 0, Social: 0, Career: 0
        }
      };
      setUser(userWithCats);
      const skillData = await db.getSkills('user_1');
      setSkills(skillData);
      const ledgerData = await db.getLedger('user_1');
      setLedger(ledgerData);
    }
    loadProfile();
  }, []);

  const categories: (keyof typeof (user?.categoryLevels || {}))[] = ['Health', 'Creative', 'Mind', 'Social', 'Career'];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      {/* Header: Identity & Stat Grid */}
      <div className="p-12 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-500/20">
              {user?.username?.[0] || 'K'}
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display text-white">{user?.username || 'Architect'}</h1>
              <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Global Growth Ledger</p>
            </div>
          </div>

          {/* Character Sheet / Stat Grid */}
          <div className="grid grid-cols-5 gap-4 w-full md:w-auto">
            {categories.map(cat => (
              <div key={cat} className="flex flex-col items-center p-3 bg-zinc-950 border border-zinc-800 rounded-2xl min-w-[80px]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase mb-1">{cat}</span>
                <span className="text-2xl font-bold text-white">{user?.categoryLevels[cat] || 1}</span>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${((user?.categoryXp[cat] || 0) % 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Skill Constellation */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold font-display flex items-center gap-3">
            <span className="w-2 h-6 bg-blue-500 rounded-full" />
            Skill Constellation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map(skill => (
              <div
                key={skill.id}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-0.5 bg-zinc-800 rounded-full border border-zinc-700">
                      {skill.category}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md font-mono ${
                    skill.status === 'Mastered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {skill.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden mr-4">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(skill.totalXp / 1000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">{skill.totalXp} XP</span>
                </div>
                <div className="mt-3 text-[11px] font-mono text-zinc-600 uppercase tracking-tighter">
                  {skill.hoursInvested} Hours Invested
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: The Ledger of Growth */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold font-display flex items-center gap-3">
            <span className="w-2 h-6 bg-indigo-500 rounded-full" />
            Growth Ledger
          </h2>

          <div className="space-y-4">
            {ledger.length > 0 ? ledger.map(entry => (
              <div key={entry.id} className="p-4 bg-zinc-900/50 border-l-2 border-zinc-800 pl-6 relative">
                <div className="absolute left-[-5px] top-4 w-2 h-2 bg-zinc-700 rounded-full" />
                <div className="text-xs font-mono text-zinc-500 mb-1">{entry.timestamp}</div>
                <div className="text-sm text-zinc-300 font-medium">{entry.description}</div>
                <div className="text-xs text-blue-400 mt-1 font-mono uppercase tracking-tighter">{entry.eventType}</div>
              </div>
            )) : (
              <div className="p-6 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 text-sm">
                Your journey is just beginning. Your breakthroughs will be recorded here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
