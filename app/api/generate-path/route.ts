import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { Skill, Level, Task } from '@/types';

// This is a simulation of the AI Path Architect.
async function generateAIPath(goal: string, intake: any, existingLevels?: Level[]) {
  console.log(`Generating path for: ${goal}. Existing levels: ${existingLevels?.length || 0}`);

  // If existingLevels is provided, we are in 'Reflow' mode.
  // We preserve the structure of completed levels and only generate the gap.
  const completedLevelCount = existingLevels?.filter(l => l.isCompleted).length || 0;

  // In a real AI call, we would pass the existing progress to the LLM
  // and ask it to "evolve" the remaining path based on the new intake data.
  const levels = [
    {
      levelNumber: 1,
      title: 'The First Spark',
      xpRequired: 100,
      tasks: [
        { title: 'Gather basic tools', description: 'Acquire the minimum required supplies for this skill.', load: 1, xp: 20 },
        { title: 'First fundamental', description: 'Complete one core basic exercise.', load: 2, xp: 30 },
        { title: 'Observation', description: 'Find and analyze one example of mastery in this field.', load: 1, xp: 20 },
      ]
    },
    {
      levelNumber: 2,
      title: 'Building Momentum',
      xpRequired: 250,
      tasks: [
        { title: 'Technique Drill', description: 'Repeat a core movement/concept 10 times.', load: 3, xp: 50 },
        { title: 'Small Project', description: 'Create one tiny, imperfect result.', load: 4, xp: 80 },
        { title: 'Correction Loop', description: 'Identify one mistake in your work and fix it.', load: 2, xp: 40 },
      ]
    },
    {
      levelNumber: 3,
      title: 'Expanding Horizons',
      xpRequired: 500,
      tasks: [
        { title: 'Combined Application', description: 'Use two different techniques in one piece.', load: 5, xp: 100 },
        { title: 'External Feedback', description: 'Show your work to one other person.', load: 2, xp: 50 },
        { title: 'Complexity Jump', description: 'Tackle a task that feels slightly too hard.', load: 5, xp: 120 },
      ]
    }
  ];

  // Filter out levels that were already completed in the original path
  return levels.filter(l => l.levelNumber > completedLevelCount);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, goal, intake, skillId, isReflow } = body;

  try {
    let skill: Skill;
    let existingLevels: Level[] = [];

    if (isReflow && skillId) {
      // Handle Reflow Logic
      const skills = await db.getSkills(userId);
      skill = skills.find(s => s.id === skillId)!;
      existingLevels = await db.getLevels(skillId);

      // Update skill metadata with new intake data
      await db.addSkill({ ...skill, intakeData: intake });
    } else {
      // Handle Initial Generation
      skill = await db.addSkill({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        name: goal,
        category: 'General',
        description: `Learning ${goal} based on intent: ${intake.why}`,
        totalXp: 0,
        hoursInvested: 0,
        status: 'Active',
        intakeData: intake,
        createdAt: new Date().toISOString(),
      });
    }

    const path = await generateAIPath(goal, intake, existingLevels);

    // Create/Update Levels and Tasks
    for (const lvl of path) {
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
