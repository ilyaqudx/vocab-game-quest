// HongEn Literacy Style 4-Step Interactive Word Studio Engine
// Step 1: 玩·场景发现与具象演变 (Play & Discover)
// Step 2: 读·自然拼读拆解与语音跟读 (Read & Phonics & Star Rating)
// Step 3: 拼·果冻字母磁吸积木 (Spell & Jelly Blocks)
// Step 4: 测·萌宠喂食闯关与金章认证 (Quiz & Feeding Mini-Game & Mastered Stamp)

import { audio } from '../audio.js';
import { questManager } from './quest-manager.js';
import { getWordPool } from '../data/extended-vocab.js';

export class HongEnStudioEngine {
  constructor(category = 'all') {
    this.category = category;
    this.wordPool = getWordPool(category);
    this.currentWord = null;
    this.currentStep = 1; // 1 | 2 | 3 | 4 | 'completed'

    // Step 2 State
    this.speechRate = 0.92;
    this.isRecording = false;
    this.readStars = 0;
    this.recognition = null;
    this.initSpeechRecognition();

    // Step 3 State (Letter Puzzle)
    this.slots = []; // [{ char, filled: bool, currentTileId: null }]
    this.tiles = []; // [{ id, char, placed: bool, color }]

    // Step 4 State (Quiz)
    this.quizOptions = [];
    this.petState = 'idle'; // 'idle' | 'eating' | 'wrong' | 'celebrate'

    // Mastered Album persistence
    this.masteredWords = this.loadMasteredWords();

    // Pick first word
    this.nextWord();
  }

  setCategory(cat) {
    this.category = cat;
    this.wordPool = getWordPool(cat);
    this.nextWord();
  }

  loadMasteredWords() {
    try {
      const data = localStorage.getItem('hongen_mastered_words');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveMasteredWords() {
    try {
      localStorage.setItem('hongen_mastered_words', JSON.stringify(this.masteredWords));
    } catch (e) {}
  }

  isWordMastered(word) {
    return this.masteredWords.some(w => w.word.toUpperCase() === word.toUpperCase());
  }

  markWordMastered(wordObj) {
    if (!this.isWordMastered(wordObj.word)) {
      this.masteredWords.unshift({
        word: wordObj.word,
        phonetic: wordObj.phonetic,
        pos: wordObj.pos,
        trans: wordObj.trans,
        category: wordObj.category,
        masteredAt: new Date().toLocaleDateString()
      });
      this.saveMasteredWords();
    }
  }

  nextWord(specificWord = null) {
    if (typeof specificWord === 'string') {
      const found = this.wordPool.find(w => w.word.toUpperCase() === specificWord.toUpperCase()) ||
                    getWordPool('all').find(w => w.word.toUpperCase() === specificWord.toUpperCase());
      if (found) {
        this.currentWord = found;
      }
    } else if (specificWord && typeof specificWord === 'object') {
      this.currentWord = specificWord;
    } else {
      // On initial launch in 'all' category, showcase BUS!
      if (!this.currentWord && this.category === 'all') {
        const busWord = this.wordPool.find(w => w.word === 'BUS');
        if (busWord) this.currentWord = busWord;
      }

      if (!this.currentWord) {
        // Prioritize unmastered words if possible
        const unmastered = this.wordPool.filter(w => !this.isWordMastered(w.word));
        const source = unmastered.length > 0 ? unmastered : this.wordPool;
        this.currentWord = source[Math.floor(Math.random() * source.length)];
      }
    }

    this.currentStep = 1;
    this.readStars = 0;
    this.petState = 'idle';
    this.setupPuzzle();
    this.setupQuiz();
  }

  getScenario() {
    if (this.currentWord?.scenario) {
      return this.currentWord.scenario;
    }

    const w = (this.currentWord?.word || '').toUpperCase();
    const pos = this.currentWord?.pos || '';
    const trans = this.currentWord?.trans || '';

    // Smart heuristic for any word
    if (pos.includes('v.')) {
      return {
        type: 'action',
        title: `⚡ 魔法行动：${trans}`,
        intro: `小探险家在魔法森林中，准备行动施展【${trans}】...`,
        climax: `魔法能量在指尖汇聚，准备行动啦！`,
        actionPrompt: `👆 点击魔法水晶，触发【${w}】！`,
        afterAction: `一道炫目金光划过，魔法成功施展！`,
        voiceNarrative: `准备行动！${trans}！${w}！`
      };
    } else if (pos.includes('adj.')) {
      return {
        type: 'attribute',
        title: `✨ 神奇特质：${trans}`,
        intro: `探险队发现了一件奇异的宝物，它展现出【${trans}】的独特光彩...`,
        climax: `宝物释放出神秘的光芒，照亮了整个暗夜！`,
        actionPrompt: `👆 点击发光宝物，感受它的特质！`,
        afterAction: `宝物发出清脆悦耳的共鸣，能量充盈全身！`,
        voiceNarrative: `神奇特质！${trans}！${w}！`
      };
    } else {
      return {
        type: 'discovery',
        title: `📦 奇妙探索：${trans}`,
        intro: `在神秘宝箱里，静静沉睡着与【${trans}】相关的神奇之物...`,
        climax: `宝箱锁扣咔哒一声弹开，里面的秘密就要揭晓了！`,
        actionPrompt: `👆 点击打开宝箱，探索【${w}】！`,
        afterAction: `彩带烟花从宝箱中喷涌而出，宝物华丽登场！`,
        voiceNarrative: `揭开秘密！${trans}！${w}！`
      };
    }
  }

  // --- Step 1: Visual Theme & Scene Generation ---
  getWordTheme() {
    const w = (this.currentWord?.word || '').toUpperCase();
    const trans = this.currentWord?.trans || '';

    // Smart theme mapping
    if (/CAT|DOG|BEAR|BIRD|ANIMAL|CARNIVORE|HERBIVORE|PET|WILD/i.test(w + trans)) {
      return { type: 'animal', icon: '🐾', item: '🐱', bgGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', sceneTitle: '萌宠森林 (Animal Kingdom)' };
    }
    if (/STAR|SPACE|METEORITE|GALAXY|ROCKET|ASTRONOMY|COSMIC|ORBIT/i.test(w + trans)) {
      return { type: 'space', icon: '🚀', item: '🪐', bgGradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', sceneTitle: '浩瀚星系 (Cosmic Journey)' };
    }
    if (/TREE|FOREST|PLANT|CHLOROPHYLL|ECOSYSTEM|LEAF|FLOWER|NATURE/i.test(w + trans)) {
      return { type: 'nature', icon: '🌿', item: '🌱', bgGradient: 'linear-gradient(135deg, #10b981, #059669)', sceneTitle: '奇迹自然 (Nature Wonders)' };
    }
    if (/WATER|OCEAN|RIVER|AQUIFER|SEA|RAIN|INTERTIDAL/i.test(w + trans)) {
      return { type: 'water', icon: '🌊', item: '🐳', bgGradient: 'linear-gradient(135deg, #06b6d4, #2563eb)', sceneTitle: '深海探秘 (Ocean Mystery)' };
    }
    if (/FIRE|VOLCANO|HEAT|HOT|ENERGY|CONVECTION/i.test(w + trans)) {
      return { type: 'fire', icon: '🔥', item: '🌋', bgGradient: 'linear-gradient(135deg, #f97316, #dc2626)', sceneTitle: '能量火石 (Fire Energy)' };
    }
    if (/BOOK|ACCOMPLISH|ACQUIRE|STUDY|LEARN|EVALUATE|CRITICAL|LOGICAL/i.test(w + trans)) {
      return { type: 'wisdom', icon: '💡', item: '📚', bgGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', sceneTitle: '智慧之光 (Wisdom Tower)' };
    }
    if (/BRILLIANT|GEM|DIAMOND|ACCURATE|GOLD|TREASURE|BENEFIT/i.test(w + trans)) {
      return { type: 'treasure', icon: '💎', item: '👑', bgGradient: 'linear-gradient(135deg, #eab308, #f59e0b)', sceneTitle: '黄金宝藏 (Golden Treasure)' };
    }
    // Default discovery theme
    return { type: 'magic', icon: '✨', item: '🔮', bgGradient: 'linear-gradient(135deg, #6366f1, #a855f7)', sceneTitle: '魔法工坊 (Magic Workshop)' };
  }

  // --- Step 2: Phonics / Syllables Generation ---
  getSyllables() {
    if (!this.currentWord) return [];
    const word = this.currentWord.word.toUpperCase();

    // Vowel regex for syllable chunking heuristic
    const vowels = /[AEIOUY]+/g;
    const chunks = [];
    let lastIndex = 0;
    let match;

    const vPositions = [];
    while ((match = vowels.exec(word)) !== null) {
      vPositions.push({ start: match.index, end: match.index + match[0].length });
    }

    if (vPositions.length <= 1 || word.length <= 4) {
      return [word];
    }

    // Split mid-way between vowel clusters
    for (let i = 0; i < vPositions.length - 1; i++) {
      const vCurr = vPositions[i];
      const vNext = vPositions[i + 1];
      const distance = vNext.start - vCurr.end;

      let splitPoint = vCurr.end + Math.floor(distance / 2);
      if (distance >= 2) {
        splitPoint = vCurr.end + 1; // Split between double consonants like com-plish
      }
      chunks.push(word.slice(lastIndex, splitPoint));
      lastIndex = splitPoint;
    }
    chunks.push(word.slice(lastIndex));

    return chunks.filter(c => c.length > 0);
  }

  // Speech Recognition Init
  initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  startSpeechRecognition(onResult, onError) {
    if (!this.recognition) {
      if (onError) onError('Browser does not support SpeechRecognition');
      return;
    }

    this.isRecording = true;
    this.recognition.onresult = (event) => {
      this.isRecording = false;
      const transcript = event.results[0][0].transcript.trim().toUpperCase();
      const confidence = event.results[0][0].confidence;
      if (onResult) onResult({ transcript, confidence });
    };

    this.recognition.onerror = (err) => {
      this.isRecording = false;
      if (onError) onError(err);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isRecording = false;
      if (onError) onError(e);
    }
  }

  // --- Step 3: Letter Blocks Setup ---
  setupPuzzle() {
    if (!this.currentWord) return;
    const cleanWord = this.currentWord.word.toUpperCase();
    const chars = cleanWord.split('');

    // Colors for jelly blocks
    const colors = [
      'linear-gradient(135deg, #38bdf8, #0284c7)',
      'linear-gradient(135deg, #f43f5e, #be123c)',
      'linear-gradient(135deg, #10b981, #047857)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #a855f7, #7e22ce)',
      'linear-gradient(135deg, #06b6d4, #0e7490)',
      'linear-gradient(135deg, #ec4899, #be185d)'
    ];

    this.slots = chars.map((char, index) => ({
      index,
      targetChar: char,
      filled: false,
      tileId: null
    }));

    // Scramble tiles
    const tilesArr = chars.map((char, index) => ({
      id: `tile-${index}`,
      char,
      color: colors[index % colors.length],
      placed: false,
      slotIndex: null
    }));

    // Fisher-Yates shuffle
    for (let i = tilesArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tilesArr[i], tilesArr[j]] = [tilesArr[j], tilesArr[i]];
    }

    this.tiles = tilesArr;
  }

  // Handle letter block click
  placeTileInNextSlot(tileId) {
    const tile = this.tiles.find(t => t.id === tileId);
    if (!tile || tile.placed) return { success: false };

    // Find first empty slot
    const nextSlot = this.slots.find(s => !s.filled);
    if (!nextSlot) return { success: false };

    // Check if tile matches expected slot character
    if (tile.char === nextSlot.targetChar) {
      nextSlot.filled = true;
      nextSlot.tileId = tile.id;
      tile.placed = true;
      tile.slotIndex = nextSlot.index;

      audio.playSnap();
      audio.speakPhonics(tile.char);

      const allComplete = this.slots.every(s => s.filled);
      if (allComplete) {
        audio.playVictory();
        setTimeout(() => audio.speak(this.currentWord.word), 400);
      }

      return {
        success: true,
        slotIndex: nextSlot.index,
        char: tile.char,
        allComplete
      };
    } else {
      // Mismatch
      audio.playError();
      return {
        success: false,
        mismatch: true,
        char: tile.char
      };
    }
  }

  // --- Step 4: Hungry Pet Quiz Setup ---
  setupQuiz() {
    if (!this.currentWord) return;

    // Pick 2 distractors from wordPool
    const pool = this.wordPool.filter(w => w.word !== this.currentWord.word);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const distractors = shuffledPool.slice(0, 2);

    const options = [
      { word: this.currentWord.word, trans: this.currentWord.trans, isCorrect: true },
      ...distractors.map(d => ({ word: d.word, trans: d.trans, isCorrect: false }))
    ];

    // Shuffle options
    this.quizOptions = options.sort(() => 0.5 - Math.random());
  }

  answerQuiz(selectedWord) {
    const isCorrect = selectedWord.toUpperCase() === this.currentWord.word.toUpperCase();
    if (isCorrect) {
      this.petState = 'eating';
      audio.playYum();

      setTimeout(() => {
        this.petState = 'celebrate';
        audio.playStamp();
        this.markWordMastered(this.currentWord);
        questManager.addXP(50);
      }, 700);

      return { isCorrect: true };
    } else {
      this.petState = 'wrong';
      audio.playError();
      setTimeout(() => {
        this.petState = 'idle';
      }, 900);
      return { isCorrect: false };
    }
  }
}
