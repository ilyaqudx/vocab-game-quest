// VocabQuest Level Progression, Spaced Repetition & Mistakes Notebook

export class QuestManager {
  constructor() {
    this.stats = this.loadStats();
  }

  loadStats() {
    const raw = localStorage.getItem('vocab_quest_stats');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      xp: 0,
      level: 1,
      wordsMastered: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalGamesPlayed: 0
    };
  }

  saveStats() {
    localStorage.setItem('vocab_quest_stats', JSON.stringify(this.stats));
  }

  addXP(amount) {
    this.stats.xp += amount;
    // Calculate level: level up every 500 XP
    const newLevel = Math.floor(this.stats.xp / 500) + 1;
    const leveledUp = newLevel > this.stats.level;
    this.stats.level = newLevel;
    this.saveStats();
    return { level: this.stats.level, leveledUp, xp: this.stats.xp };
  }

  recordMasteredWord(word) {
    this.stats.wordsMastered++;
    this.saveStats();
  }

  getLevelTitle() {
    const lvl = this.stats.level;
    if (lvl >= 20) return { title: 'TOEFL Scholar (托福博学者)', badge: '👑' };
    if (lvl >= 15) return { title: 'IELTS Academic Elite (雅思学者)', badge: '💎' };
    if (lvl >= 10) return { title: 'CET-6 Master (六级领航者)', badge: '🥇' };
    if (lvl >= 5)  return { title: 'CET-4 Conqueror (四级征服者)', badge: '🥈' };
    return { title: 'Novice Wordsmith (词汇启航者)', badge: '🥉' };
  }

  getMistakes() {
    try {
      const raw = localStorage.getItem('vocab_mistakes') || '[]';
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  removeMistake(word) {
    const list = this.getMistakes().filter(w => w.word !== word);
    localStorage.setItem('vocab_mistakes', JSON.stringify(list));
    return list;
  }

  clearMistakes() {
    localStorage.setItem('vocab_mistakes', '[]');
  }
}

export const questManager = new QuestManager();
