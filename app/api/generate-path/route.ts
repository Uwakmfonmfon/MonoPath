import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { Skill, Level, Task } from '@/types';
import { calculateTotalLoad } from '@/lib/load-utils';

// This is a simulation of the AI Path Architect.
async function generateAIPath(goal: string, intake: any, existingLevels?: Level[], currentGlobalLoad?: number) {
  console.log(`Generating path for: ${goal}. Existing levels: ${existingLevels?.length || 0}. Global Load: ${currentGlobalLoad}`);

  const completedLevelCount = existingLevels?.filter(l => l.isCompleted).length || 0;

  const levels = [
    {
      levelNumber: 1,
      title: 'The First Spark',
      xpRequired: 100,
      tasks: [
        { title: 'Gather basic tools', description: 'Acquire the minimum required supplies for this skill.', load: 1, xp: 20, type: 'Learning' },
        { title: 'First fundamental', description: 'Complete one core basic exercise.', load: 2, xp: 30, type: 'Learning' },
        { title: 'Observation', description: 'Find and analyze one example of mastery in this field.', load: 1, xp: 20, type: 'Learning' },
      ]
    },
    {
      levelNumber: 2,
      title: 'Building Momentum',
      xpRequired: 250,
      tasks: [
        { title: 'Technique Drill', description: 'Repeat a core movement/concept 10 times.', load: 3, xp: 50, type: 'Learning' },
        { title: 'Small Project', description: 'Create one tiny, imperfect result.', load: 4, xp: 80, type: 'Learning' },
        { title: 'Correction Loop', description: 'Identify one mistake in your work and fix it.', load: 2, xp: 40, type: 'Learning' },
      ]
    },
    {
      levelNumber: 3,
      title: 'Expanding Horizons',
      xpRequired: 500,
      tasks: [
        { title: 'Combined Application', description: 'Use two different techniques in one piece.', load: 5, xp: 100, type: 'Learning' },
        { title: 'External Feedback', description: 'Show your work to one other person.', load: 2, xp: 50, type: 'Learning' },
        { title: 'Complexity Jump', description: 'Tackle a task that feels slightly too hard.', load: 5, xp: 120, type: 'Learning' },
      ]
    }
  ];

  const processedLevels = levels.filter(l => l.levelNumber > completedLevelCount).map(lvl => {
    const totalLoad = lvl.tasks.reduce((acc, t) => acc + t.load, 0);

    // Refined Scheduler Logic:
    // Instead of a fixed 15, we adjust based on Global Load.
    const loadThreshold = currentGlobalLoad ? Math.max(5, 20 - currentGlobalLoad) : 15;

    if (totalLoad > loadThreshold) {
      return {
        ...lvl,
        tasks: [
          ...lvl.tasks,
          {
            title: 'System Recovery',
            description: 'Step back and reflect on your progress to prevent burnout.',
            load: 0,
            xp: 10,
            type: 'Rest'
          }
        ]
      };
    }
    return lvl;
  });

  return processedLevels;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, goal, intake, skillId, isReflow } = body;

  try {
    let skill: Skill;
    let existingLevels: Level[] = [];

    if (isReflow && skillId) {
      const skills = await db.getSkills(userId);
      skill = skills.find(s => s.id === skillId)!;
      existingLevels = await db.getLevels(skillId);

      await db.addSkill({ ...skill, intakeData: intake });
    } else {
      skill = await db.addSkill({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        name: goal,
        category: 'Creative',
        description: `Learning ${goal} based on intent: ${intake.why}`,
        totalXp: 0,
        hoursInvested: 0,
        status: 'Active',
        intakeData: intake,
        createdAt: new Date().toISOString(),
      });
    }

    const currentGlobalLoad = await calculateTotalLoad(userId);
    const path = await generateAIPath(goal, intake, existingLevels, currentGlobalLoad);

    for (const lvl of path) {
      const levelExists = existingLevels.find(el => el.levelNumber === lvl.levelNumber);
      if (levelExists) continue;

      const level = await db.addLevel({
        id: Math.random().toString(36).substr(2, 9),
        skillId: skill.id,
        levelNumber: lvl.levelNumber,
        title: lvl.title,
        xpRequired: lvl.xpRequired,
        isCompleted: false,
        unlockedAt: lvl.levelNumber === 1 && !isReflow ? new Date().toISOString() : undefined,
      });

      for (const t of lvl.tasks) {
        await db.addTask({
          id: Math.random().toString(36).substr(2, 9),
          levelId: level.id,
          title: t.title,
          description: t.description,
          estimatedLoad: t.load,
          xpReward: t.xp,
          status: 'Pending',
        });
      }
    }

    return NextResponse.json({ success: true, skillId: skill.id });
  } catch (error) {
    console.error('Path Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate path' }, { status: 500 });
  }
}
