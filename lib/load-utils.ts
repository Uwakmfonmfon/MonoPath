import { db } from './supabase';

/**
 * Calculates the total cognitive load of the user based on pending tasks
 * in the active levels of all their skills.
 */
export async function calculateTotalLoad(userId: string): Promise<number> {
  const skills = await db.getSkills(userId);
  let totalLoad = 0;

  for (const skill of skills) {
    const levels = await db.getLevels(skill.id);
    const activeLevel = levels.find(l => !l.isCompleted);
    if (activeLevel) {
      const tasks = await db.getTasks(activeLevel.id);
      totalLoad += tasks
        .filter(t => t.status === 'Pending')
        .reduce((acc, t) => acc + t.estimatedLoad, 0);
    }
  }

  return totalLoad;
}
