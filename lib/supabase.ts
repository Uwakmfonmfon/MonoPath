import { User, Skill, Level, Task, LifeLedgerEntry, PairingState, StatCategory } from '../types';

class MockDB {
  private users: User[] = [];
  private skills: Skill[] = [];
  private levels: Level[] = [];
  private tasks: Task[] = [];
  private ledger: LifeLedgerEntry[] = [];
  private pairingQueue: PairingState[] = [];

  async getUser(id: string) {
    return this.users.find(u => u.id === id);
  }

  async setUser(user: User) {
    const idx = this.users.findIndex(u => u.id === user.id);
    if (idx === -1) this.users.push(user);
    else this.users[idx] = user;
    return user;
  }

  async updateUserLoad(userId: string, load: number) {
    let idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) {
      // Auto-initialize user if not found to prevent crash in mock environment
      const newUser: User = {
        id: userId,
        username: 'Architect',
        globalWhy: 'Self-actualization',
        categoryLevels: { Health: 1, Creative: 1, Mind: 1, Social: 1, Career: 1 },
        categoryXp: { Health: 0, Creative: 0, Mind: 0, Social: 0, Career: 0 },
        globalLevel: 1,
        globalXp: 0,
        currentLoad: load,
        maxLoad: 20,
        createdAt: new Date().toISOString(),
      };
      this.users.push(newUser);
      return newUser;
    }
    this.users[idx].currentLoad = load;
    return this.users[idx];
  }

  async updateSkill(skillId: string, updates: Partial<Skill>) {
    const idx = this.skills.findIndex(s => s.id === skillId);
    if (idx === -1) throw new Error('Skill not found');
    this.skills[idx] = { ...this.skills[idx], ...updates };
    return this.skills[idx];
  }

  async getSkills(userId: string) {
    return this.skills.filter(s => s.userId === userId);
  }

  async addSkill(skill: Skill) {
    this.skills.push(skill);
    return skill;
  }

  async getLevels(skillId: string) {
    return this.levels.filter(l => l.skillId === skillId).sort((a, b) => a.levelNumber - b.levelNumber);
  }

  async addLevel(level: Level) {
    this.levels.push(level);
    return level;
  }

  async getTasks(levelId: string) {
    return this.tasks.filter(t => t.levelId === levelId);
  }

  async addTask(task: Task) {
    this.tasks.push(task);
    return task;
  }

  async updateTask(taskId: string, updates: Partial<Task>) {
    const idx = this.tasks.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');
    this.tasks[idx] = { ...this.tasks[idx], ...updates };
    return this.tasks[idx];
  }

  async logEvent(entry: LifeLedgerEntry) {
    this.ledger.push(entry);
    return entry;
  }

  async getLedger(userId: string) {
    return this.ledger.filter(e => e.userId === userId);
  }

  // --- Phase 2: Pairing Queue Methods ---

  async addToPairingQueue(state: PairingState) {
    // Remove if already in queue
    this.removeFromQueue(state.userId);
    this.pairingQueue.push(state);
    return state;
  }

  async findMatch(userId: string) {
    const userState = this.pairingQueue.find(p => p.userId === userId);
    if (!userState) return null;

    // Find another user with same plateau type and skill
    const match = this.pairingQueue.find(p =>
      p.userId !== userId &&
      p.plateauType === userState.plateauType &&
      p.skillId === userState.skillId
    );

    if (match) {
      // Remove both from queue once matched
      this.removeFromQueue(userId);
      this.removeFromQueue(match.userId);
    }

    return match || null;
  }

  async removeFromQueue(userId: string) {
    this.pairingQueue = this.pairingQueue.filter(p => p.userId !== userId);
  }

  async setGlobalWhy(userId: string, globalWhy: string) {
    let idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) {
      // Auto-initialize user if not found to prevent crash in mock environment
      const newUser: User = {
        id: userId,
        username: 'Architect',
        globalWhy: globalWhy,
        categoryLevels: { Health: 1, Creative: 1, Mind: 1, Social: 1, Career: 1 },
        categoryXp: { Health: 0, Creative: 0, Mind: 0, Social: 0, Career: 0 },
        globalLevel: 1,
        globalXp: 0,
        currentLoad: 0,
        maxLoad: 20,
        createdAt: new Date().toISOString(),
      };
      this.users.push(newUser);
      return newUser;
    }
    this.users[idx].globalWhy = globalWhy;
    return this.users[idx];
  }

  async updateGlobalXp(userId: string, xpGain: number) {
    let idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) {
      // Auto-initialize user if not found to prevent crash in mock environment
      const newUser: User = {
        id: userId,
        username: 'Architect',
        globalWhy: 'Self-actualization',
        categoryLevels: { Health: 1, Creative: 1, Mind: 1, Social: 1, Career: 1 },
        categoryXp: { Health: 0, Creative: 0, Mind: 0, Social: 0, Career: 0 },
        globalLevel: 1,
        globalXp: 0,
        currentLoad: 0,
        maxLoad: 20,
        createdAt: new Date().toISOString(),
      };
      this.users.push(newUser);
      idx = this.users.length - 1;
    }

    const user = this.users[idx];
    const oldLevel = user.globalLevel || 1;

    user.globalXp = (user.globalXp || 0) + xpGain;

    // Import dynamic to avoid circular dependency if level-utils eventually imports db
    const { calculateGlobalLevel } = await import('./level-utils');
    user.globalLevel = calculateGlobalLevel(user.globalXp);

    if (user.globalLevel > oldLevel) {
      await this.logEvent({
        id: `event_lvlup_${Date.now()}`,
        userId,
        timestamp: new Date().toISOString(),
        eventType: 'LevelUp',
        description: `Global Character Level Up! Reached Level ${user.globalLevel}`,
        snapshotData: { oldLevel, newLevel: user.globalLevel, totalXp: user.globalXp }
      });
    }

    return user;
  }

  async updateCategoryXp(userId: string, category: any, xpGain: number) {
    let idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) {
      // Auto-initialize user if not found to prevent crash in mock environment
      const newUser: User = {
        id: userId,
        username: 'Architect',
        globalWhy: 'Self-actualization',
        categoryLevels: { Health: 1, Creative: 1, Mind: 1, Social: 1, Career: 1 },
        categoryXp: { Health: 0, Creative: 0, Mind: 0, Social: 0, Career: 0 },
        globalLevel: 1,
        globalXp: 0,
        currentLoad: 0,
        maxLoad: 20,
        createdAt: new Date().toISOString(),
      };
      this.users.push(newUser);
      idx = this.users.length - 1;
    }

    const user = this.users[idx];
    const oldLevel = user.categoryLevels[category as StatCategory] || 1;

    user.categoryXp[category as StatCategory] = (user.categoryXp[category as StatCategory] || 0) + xpGain;

    // Simple category leveling: 1 level per 500 XP
    const newLevel = Math.floor(user.categoryXp[category as StatCategory] / 500) + 1;
    user.categoryLevels[category as StatCategory] = newLevel;

    if (newLevel > oldLevel) {
      await this.logEvent({
        id: `event_cat_lvlup_${Date.now()}`,
        userId,
        timestamp: new Date().toISOString(),
        eventType: 'LevelUp',
        description: `Category Level Up! Your ${category} stats reached Level ${newLevel}`,
        snapshotData: { category, oldLevel, newLevel }
      });
    }

    return user;
  }
}

export const db = new MockDB();
