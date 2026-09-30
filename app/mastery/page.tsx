"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { MASTERY_DATABASE } from '@/lib/mastery-data';
import { StatCategory, Skill } from '@/types';
import { ExternalLink, Award, Users, Trophy, UserCheck } from 'lucide-react';

export default function MasteryPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const userId = 'user_1';

  useEffect(() => {
    async function loadSkills() {
      const data = await db.getSkills(userId);
      setSkills(data);
    }
    loadSkills();
  }, []);

  const masteredSkills = skills.filter(s => s.status === 'Mastered');

  if (masteredSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-obsidian-surface rounded-full flex items-center justify-center text-zinc-600 border border-obsidian-border">
          <Award size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-display text-white">No Masteries Yet</h1>
          <p className="text-zinc-500 font-mono text-sm max-w-md mx-auto">
            Complete a skill path to unlock the curated resources, certifications, and communities of a master.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold font-display text-white tracking-tighter">
          Mastery <span className="text-neonBlue-accent">Showcase</span>
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Curated resources for the specialized
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {masteredSkills.map(skill => (
          <div key={skill.id} className="bg-obsidian-surface border border-obsidian-border rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-obsidian-border bg-gradient-to-r from-obsidian-surface to-obsidian-base">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">{skill.name}</h2>
                  <p className="text-xs font-mono text-neonBlue-accent uppercase tracking-wider">{skill.category}</p>
                </div>
                <Award className="text-neonBlue-glow" size={24} />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {MASTERY_DATABASE[skill.category]?.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-2xl bg-obsidian-base border border-obsidian-border hover:border-neonBlue-accent transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-obsidian-surface border border-obsidian-border group-hover:border-neonBlue-glow transition-colors">
                        {resource.type === 'Certification' && <UserCheck size={18} className="text-neonBlue-accent" />}
                        {resource.type === 'Community' && <Users size={18} className="text-neonBlue-accent" />}
                        {resource.type === 'Competition' && <Trophy size={18} className="text-neonBlue-accent" />}
                        {resource.type === 'Mentor' && <Award size={18} className="text-neonBlue-accent" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{resource.name}</div>
                        <div className="text-xs text-zinc-500 font-mono">{resource.description}</div>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-zinc-600 group-hover:text-neonBlue-accent transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
