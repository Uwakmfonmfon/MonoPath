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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-24 h-24 bg-obsidian-surface rounded-full flex items-center justify-center text-mutedZinc border border-obsidian-border relative z-10">
            <Award size={48} />
          </div>
          <div className="absolute inset-0 bg-focusTeal/10 blur-2xl rounded-full animate-pulse-slow" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold font-display text-paperWhite tracking-tighter">The Garden is Empty</h1>
          <p className="text-mutedZinc font-mono text-sm max-w-md mx-auto leading-relaxed">
            Mastery is not a destination, but a curated collection of capabilities. Complete a skill path to plant your first seed of expertise.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold font-display text-paperWhite tracking-tighter">
          Mastery <span className="text-focusTeal">Showcase</span>
        </h1>
        <p className="text-mutedZinc font-mono text-sm uppercase tracking-widest">
          Curated resources for the specialized
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {masteredSkills.map(skill => (
          <div key={skill.id} className="bg-obsidian-surface border border-obsidian-border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-focusTeal/30">
            <div className="p-8 border-b border-obsidian-border bg-gradient-to-br from-obsidian-surface to-obsidian-base">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold text-paperWhite font-display tracking-tight">{skill.name}</h2>
                  <p className="text-xs font-mono text-focusTeal uppercase tracking-wider">{skill.category}</p>
                </div>
                <Award className="text-focusTeal" size={28} />
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {MASTERY_DATABASE[skill.category]?.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-5 rounded-2xl bg-obsidian-base border border-obsidian-border hover:border-focusTeal/50 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-3 rounded-xl bg-obsidian-surface border border-obsidian-border group-hover:border-focusTeal/50 transition-colors">
                        {resource.type === 'Certification' && <UserCheck size={20} className="text-focusTeal" />}
                        {resource.type === 'Community' && <Users size={20} className="text-focusTeal" />}
                        {resource.type === 'Competition' && <Trophy size={20} className="text-focusTeal" />}
                        {resource.type === 'Mentor' && <Award size={20} className="text-focusTeal" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-paperWhite group-hover:text-focusTeal transition-colors">{resource.name}</div>
                        <div className="text-xs text-mutedZinc font-mono">{resource.description}</div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-mutedZinc group-hover:text-focusTeal transition-colors" />
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
