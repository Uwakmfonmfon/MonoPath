export type StatCategory = 'Health' | 'Creative' | 'Mind' | 'Social' | 'Career';

export type User = {
  id: string;
  username: string;
  globalWhy: string;
  categoryLevels: Record<StatCategory, number>;
  categoryXp: Record<StatCategory, number>;
  globalLevel: number;
  globalXp: number;
  currentLoad: number;
  maxLoad: number;
  createdAt: string;
};

export type RecommendedSkill = {
  id: string;
  category: StatCategory;
  suggestedGoal: string;
  reasoning: string;
  type: 'Balanced' | 'Synergistic';
};

export type SkillStatus = 'Locked' | 'Active' | 'Mastered';

export type Skill = {
  id: string;
  userId: string;
  name: string;
  category: StatCategory;
  description: string;
  totalXp: number;
  hoursInvested: number;
  status: SkillStatus;
  plateauState: PlateauType | null;
  isInZone: boolean;
  intakeData: {
    why: string;
    where: string;
    depth: 'casual' | 'competence' | 'mastery';
    experienceLevel: string;
    availableTime: string;
    deadline?: string;
  };
  createdAt: string;
};

export type Level = {
  id: string;
  skillId: string;
  levelNumber: number;
  title: string;
  xpRequired: number;
  isCompleted: boolean;
  unlockedAt?: string;
};

export type TaskStatus = 'Pending' | 'InProgress' | 'Completed' | 'Blocked';

export type Task = {
  id: string;
  levelId: string;
  type: 'Learning' | 'Rest';
  title: string;
  description: string;
  estimatedLoad: number;
  xpReward: number;
  status: TaskStatus;
  isMilestone?: boolean;
  attempts: number;
  startedAt?: string;
  completedAt?: string;
};

export type EventType = 'SkillUnlocked' | 'LevelUp' | 'Breakthrough' | 'Milestone';

export type LifeLedgerEntry = {
  id: string;
  userId: string;
  timestamp: string;
  eventType: EventType;
  description: string;
  snapshotData: any;
};

export type PlateauType = 'Confusion' | 'Motivation' | 'None';

export type PairingState = {
  userId: string;
  plateauType: PlateauType;
  skillId: string;
  joinedAt: string;
};
