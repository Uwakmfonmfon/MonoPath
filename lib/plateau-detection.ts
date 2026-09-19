import { TaskStatus } from '@/types';

export type PlateauType = 'Confusion' | 'Motivation' | 'None';

export function detectPlateau(
  attempts: number,
  completions: number,
  avgTimePerTask: number,
  globalLoad: number
): PlateauType {
  // 1. The "Wall" (Confusion)
  // High attempt rate but low completion rate = cognitive struggle
  if (attempts > 3 && completions === 0) {
    return 'Confusion';
  }

  // 2. The "Slump" (Motivation)
  // Low activity overall, low load = lack of momentum
  if (attempts < 1 && globalLoad < 5) {
    return 'Motivation';
  }

  return 'None';
}

export function getBreakthroughAction(type: PlateauType): {
  message: string;
  action: 'Assistant' | 'Rest' | 'Community';
} {
  switch (type) {
    case 'Confusion':
      return {
        message: "It looks like you've hit a knowledge gap. Let's simplify the concept or find a mentor.",
        action: 'Community'
      };
    case 'Motivation':
      return {
        message: "The momentum has stalled. This isn't a skill gap, it's a fuel gap. Time for a total reset.",
        action: 'Rest'
      };
    default:
      return {
        message: "Keep pushing. You're in the flow.",
        action: 'Assistant'
      };
  }
}
