import { getWordPool } from '../data/extended-vocab.js';
import { audio } from '../audio.js';

export class MatchBlitzEngine {
  constructor(category = 'all') {
    this.category = category;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.matchedPairs = 0;
    this.timeLeft = 60;
    this.timerId = null;
    this.status = 'ready'; // 'ready' | 'playing' | 'gameover'

    this.cards = []; // Array of card objects
    this.selectedCard = null;
  }

  start() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.matchedPairs = 0;
    this.timeLeft = 60;
    this.status = 'playing';
    this.selectedCard = null;

    this.generateBoard(6); // 6 pairs = 12 cards

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (this.status === 'playing') {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.endGame();
        }
      }
    }, 1000);
  }

  setCategory(cat) {
    this.category = cat;
  }

  generateBoard(pairCount = 6) {
    const pool = [...getWordPool(this.category)];
    // Shuffle pool
    pool.sort(() => Math.random() - 0.5);
    const chosen = pool.slice(0, pairCount);

    const cards = [];
    chosen.forEach((item, idx) => {
      // English card
      cards.push({
        id: `en-${idx}`,
        pairId: idx,
        type: 'en',
        text: item.word,
        phonetic: item.phonetic,
        data: item,
        matched: false,
        selected: false
      });
      // Chinese translation card
      cards.push({
        id: `zh-${idx}`,
        pairId: idx,
        type: 'zh',
        text: item.trans.split('；')[0],
        data: item,
        matched: false,
        selected: false
      });
    });

    // Shuffle the cards on the board
    cards.sort(() => Math.random() - 0.5);
    this.cards = cards;
  }

  selectCard(cardId) {
    if (this.status !== 'playing') return null;

    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.matched) return null;

    // Tapping already selected card cancels it
    if (this.selectedCard === card) {
      card.selected = false;
      this.selectedCard = null;
      return { action: 'deselected', card };
    }

    // No previous card selected
    if (!this.selectedCard) {
      card.selected = true;
      this.selectedCard = card;
      if (card.type === 'en') {
        audio.speak(card.text);
      }
      return { action: 'first_select', card };
    }

    // Second card selected -> Evaluate match!
    const first = this.selectedCard;
    const second = card;

    if (first.pairId === second.pairId && first.type !== second.type) {
      // Successful match!
      first.matched = true;
      second.matched = true;
      first.selected = false;
      second.selected = false;
      this.selectedCard = null;

      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.matchedPairs++;

      const wordData = first.data;
      audio.speak(wordData.word);
      audio.playMatch();
      audio.playCombo(this.combo);

      // Score calculation
      const gainedPoints = 100 * (1 + Math.floor(this.combo / 3));
      this.score += gainedPoints;

      // Bonus time reward (+2 seconds)
      this.timeLeft = Math.min(90, this.timeLeft + 2);

      // If all cleared, spawn next wave
      const remaining = this.cards.filter(c => !c.matched);
      if (remaining.length === 0) {
        setTimeout(() => {
          this.generateBoard(6);
        }, 350);
      }

      return { action: 'matched', wordData, score: this.score, combo: this.combo };
    } else {
      // Mismatch
      audio.playError();
      this.combo = 0;
      first.selected = false;
      second.selected = false;
      this.selectedCard = null;

      return { action: 'mismatch', first, second };
    }
  }

  endGame() {
    this.status = 'gameover';
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    audio.playVictory();
  }

  destroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
