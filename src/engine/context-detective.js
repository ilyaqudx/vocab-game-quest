import { getWordPool } from '../data/extended-vocab.js';
import { audio } from '../audio.js';

export class ContextDetectiveEngine {
  constructor(category = 'all') {
    this.category = category;
    this.score = 0;
    this.streak = 0;
    this.currentQuestion = null;
    this.questionsAnswered = 0;
    this.status = 'ready'; // 'ready' | 'question' | 'answered'
  }

  setCategory(cat) {
    this.category = cat;
  }

  nextQuestion() {
    const pool = getWordPool(this.category);
    // Find candidates with examples
    const candidates = pool.filter(w => w.example && w.example.length > 10);
    if (candidates.length === 0) return null;

    const target = candidates[Math.floor(Math.random() * candidates.length)];
    const word = target.word;

    // Create cloze sentence (replace target word with blank, case-insensitive)
    const regex = new RegExp(`\\b${word}\\b|\\b${word.toLowerCase()}\\b|\\b${word[0] + word.slice(1).toLowerCase()}\\b`, 'gi');
    const clozeSentence = target.example.replace(regex, '________');

    // Pick 3 distractors from same category
    const otherWords = pool.filter(w => w.word !== target.word);
    otherWords.sort(() => Math.random() - 0.5);
    const distractors = otherWords.slice(0, 3).map(w => w.word);

    const options = [word, ...distractors];
    options.sort(() => Math.random() - 0.5);

    this.currentQuestion = {
      target,
      clozeSentence,
      options,
      answered: false,
      userChoice: null,
      isCorrect: false
    };

    this.status = 'question';
    return this.currentQuestion;
  }

  answer(chosenWord) {
    if (!this.currentQuestion || this.currentQuestion.answered) return null;

    this.currentQuestion.answered = true;
    this.currentQuestion.userChoice = chosenWord;
    const isCorrect = chosenWord.toUpperCase() === this.currentQuestion.target.word.toUpperCase();
    this.currentQuestion.isCorrect = isCorrect;
    this.questionsAnswered++;

    if (isCorrect) {
      this.streak++;
      this.score += 150 * (1 + Math.floor(this.streak / 3));
      audio.playMatch();
      audio.speak(this.currentQuestion.target.word);
    } else {
      this.streak = 0;
      audio.playError();
      this.saveMistake(this.currentQuestion.target);
    }

    this.status = 'answered';
    return {
      isCorrect,
      target: this.currentQuestion.target,
      score: this.score,
      streak: this.streak
    };
  }

  saveMistake(wordItem) {
    try {
      const raw = localStorage.getItem('vocab_mistakes') || '[]';
      const list = JSON.parse(raw);
      if (!list.some(item => item.word === wordItem.word)) {
        list.push(wordItem);
        localStorage.setItem('vocab_mistakes', JSON.stringify(list));
      }
    } catch (e) {}
  }
}
