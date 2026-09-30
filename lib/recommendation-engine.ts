import { User, StatCategory, RecommendedSkill } from '@/types';
import { db } from '@/lib/supabase';

const SYNERGY_MATRIX: Record<StatCategory, StatCategory> = {
  Creative: 'Mind',
  Career: 'Social',
  Health: 'Mind',
  Social: 'Career',
  Mind: 'Creative',
};

const SAMPLE_GOALS: Record<StatCategory, string[]> = {
  Health: ['Advanced Yoga Flow', 'Endurance Running', 'Mindful Nutrition'],
  Creative: ['Digital Illustration', 'Architectural Design', 'Ambient Soundscapes'],
  Mind: ['Stoic Philosophy', 'Quantum Mechanics Basics', 'Deep Work Mastery'],
  Social: ['Conflict Resolution', 'Public Speaking', 'Active Listening'],
  Career: ['Strategic Leadership', 'Project Management', 'Product Growth'],
};

export function analyzeUserStats(user: User): RecommendedSkill[] {
  const recommendations: RecommendedSkill[] = [];

  // 1. Balanced Growth: Find the lowest category
  const categories = Object.keys(user.categoryLevels) as StatCategory[];
  const lowestCat = categories.reduce((a, b) =>
    user.categoryLevels[a] < user.categoryLevels[b] ? a : b
  );

  recommendations.push({
    id: `rec_bal_${lowestCat}`,
    category: lowestCat,
    suggestedGoal: SAMPLE_GOALS[lowestCat][0],
    reasoning: `Your ${lowestCat} level is currently your lowest. Balancing this will stabilize your overall growth.`,
    type: 'Balanced',
  });

  // 2. Synergistic Growth: Find the highest category and its partner
  const highestCat = categories.reduce((a, b) =>
    user.categoryLevels[a] > user.categoryLevels[b] ? a : b
  );
  const synergyCat = SYNERGY_MATRIX[highestCat];

  recommendations.push({
    id: `rec_syn_${synergyCat}`,
    category: synergyCat,
    suggestedGoal: SAMPLE_GOALS[synergyCat][1] || SAMPLE_GOALS[synergyCat][0],
    reasoning: `Your mastery of ${highestCat} creates a perfect synergy with ${synergyCat}. This will amplify your effectiveness.`,
    type: 'Synergistic',
  });

  // 3. Purpose-Driven Growth: Based on Global Why
  if (user.globalWhy) {
    const purposeMap: Record<string, StatCategory> = {
      'creative': 'Creative',
      'career': 'Career',
      'health': 'Health',
      'mind': 'Mind',
      'social': 'Social',
      'money': 'Career',
      'learning': 'Mind',
    };

    const lowerWhy = user.globalWhy.toLowerCase();
    for (const [keyword, cat] of Object.entries(purposeMap)) {
      if (lowerWhy.includes(keyword)) {
        recommendations.push({
          id: `rec_purp_${cat}`,
          category: cat,
          suggestedGoal: SAMPLE_GOALS[cat][2] || SAMPLE_GOALS[cat][0],
          reasoning: `This aligns with your overarching purpose: "${user.globalWhy}".`,
          type: 'Balanced',
        });
        break;
      }
    }
  }

  return recommendations;
}
