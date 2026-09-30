export function calculateGlobalLevel(xp: number): number {
  // Formula: Level = floor(sqrt(xp / 100)) + 1
  // Level 1: 0-99 XP
  // Level 2: 100-399 XP
  // Level 3: 400-899 XP
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXpForLevel(level: number): number {
  // Inverse of calculateGlobalLevel
  // xp = (level - 1)^2 * 100
  return Math.pow(level - 1, 2) * 100;
}

export function getGlobalProgress(currentXp: number, currentLevel: number): number {
  const currentLevelXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(currentLevel + 1);

  const progress = ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return Math.max(0, Math.min(100, progress));
}
