import { User, Skill, Level, Task, LifeLedgerEntry, PairingState } from '../types';

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

    return match || null;
  }

  async removeFromQueue(userId: string) {
    this.pairingQueue = this.pairingQueue.filter(p => p.userId !== userId);
  }
}

export const db = new MockDB();
