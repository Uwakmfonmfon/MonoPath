import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, question, taskId, skillId } = body;

  try {
    // 1. Context Gathering
    const user = await db.getUser(userId);
    const skill = (await db.getSkills(userId)).find(s => s.id === skillId);
    const levels = await db.getLevels(skillId);
    const currentLevel = levels.find(l => !l.isCompleted);

    // In a real app, this is the system prompt sent to Claude:
    // "You are the MonoPath Synthesizer. Provide exactly ONE clear, decisive answer.
    // User is Level ${currentLevel.levelNumber} in ${skill.name}.
    // Task: ${task.title}.
    // Avoid jargon if Level < 3. Be technical if Level > 7.
    // Do not give options. Give the best single path."

    const mockResponses: Record<string, string> = {
      'watercolor': 'Use a "wet-on-wet" technique: dampen the paper first with clean water, then drop in your pigment. This allows the colors to bleed naturally without hard edges.',
      'rust': 'Use the `unwrap()` method to extract the value from a Result, but only in prototypes. In production, use a `match` statement to handle the Error case explicitly.',
      'default': 'Focus on the most basic iteration of the task first. Set a timer for 10 minutes and produce an imperfect version. Analysis comes after execution.'
    };

    const response = mockResponses[skill?.name.toLowerCase()] || mockResponses['default'];

    return NextResponse.json({
      answer: response,
      source: 'Synthesized from MonoPath Knowledge Base'
    });
  } catch (error) {
    console.error('Assistant Error:', error);
    return NextResponse.json({ error: 'Assistant unavailable' }, { status: 500 });
  }
}
