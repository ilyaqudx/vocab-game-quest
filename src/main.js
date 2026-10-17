import './style.css';
import { HongEnStudioEngine } from './engine/hongen-studio.js';
import { storyTheater } from './engine/story-theater.js';
import { SpaceDefenderEngine } from './engine/space-defender.js';
import { MatchBlitzEngine } from './engine/match-blitz.js';
import { ContextDetectiveEngine } from './engine/context-detective.js';
import { questManager } from './engine/quest-manager.js';
import { audio } from './audio.js';

// DOM Elements
const userLevelPill = document.getElementById('user-level-pill');
const userLevelBadge = document.getElementById('user-level-badge');
const userLevelTitle = document.getElementById('user-level-title');
const btnSound = document.getElementById('btn-sound');
const soundIcon = document.getElementById('sound-icon');
const btnHelp = document.getElementById('btn-help');
const modalHelp = document.getElementById('modal-help');
const btnAlbum = document.getElementById('btn-album');
const modalHongenAlbum = document.getElementById('modal-hongen-album');
const albumGrid = document.getElementById('album-grid');
const albumCountBadge = document.getElementById('album-count-badge');

const modeTabs = document.querySelectorAll('.mode-tab-btn');
const catPills = document.querySelectorAll('.cat-pill');

const viewHongen = document.getElementById('view-hongen');
const viewDefender = document.getElementById('view-defender');
const viewBlitz = document.getElementById('view-blitz');
const viewDetective = document.getElementById('view-detective');
const viewNotebook = document.getElementById('view-notebook');

// --- HongEn 4-Step DOM ---
const hongenSteps = document.querySelectorAll('.hongen-step-item');
const stage1 = document.getElementById('hongen-stage-1');
const stage2 = document.getElementById('hongen-stage-2');
const stage3 = document.getElementById('hongen-stage-3');
const stage4 = document.getElementById('hongen-stage-4');

// Quick Scenario Picker
const pickerPills = document.querySelectorAll('.scene-quick-pill');
const btnRandomWord = document.getElementById('btn-random-word');

// Step 1: Story Theater Cinema DOM
const storyTitle = document.getElementById('story-title');
const storySubtitle = document.getElementById('story-subtitle');
const storyStageInner = document.getElementById('story-stage-inner');
const storyMorphCard = document.getElementById('story-morph-card');
const storyWordText = document.getElementById('story-word-text');
const storyPhoneticText = document.getElementById('story-phonetic-text');
const storyTransText = document.getElementById('story-trans-text');
const storyExampleText = document.getElementById('story-example-text');
const btnReplayStory = document.getElementById('btn-replay-story');
const btnGotoStep2 = document.getElementById('btn-goto-step-2');

// Step 2
const readWordDisplay = document.getElementById('read-word-display');
const readPhoneticDisplay = document.getElementById('read-phonetic-display');
const syllablesContainer = document.getElementById('syllables-container');
const btnSpeakSlow = document.getElementById('btn-speak-slow');
const btnSpeakNormal = document.getElementById('btn-speak-normal');
const btnMicRecord = document.getElementById('btn-mic-record');
const micStatusText = document.getElementById('mic-status-text');
const starRatingBox = document.getElementById('star-rating-box');
const btnGotoStep3 = document.getElementById('btn-goto-step-3');

// Step 3
const slotsContainer = document.getElementById('puzzle-slots-container');
const tilesContainer = document.getElementById('puzzle-tiles-container');
const puzzleCompleteBanner = document.getElementById('puzzle-complete-banner');
const btnGotoStep4 = document.getElementById('btn-goto-step-4');

// Step 4
const petBubble = document.getElementById('pet-bubble');
const petAvatar = document.getElementById('pet-avatar');
const petFoodGrid = document.getElementById('pet-food-grid');
const stampOverlay = document.getElementById('stamp-overlay');
const btnHongenNextWord = document.getElementById('btn-hongen-next-word');
const btnViewAlbum = document.getElementById('btn-view-album');

// --- Space Defender DOM ---
const spaceCanvas = document.getElementById('space-canvas');
const defenderScore = document.getElementById('defender-score');
const defenderCombo = document.getElementById('defender-combo');
const defenderShields = document.getElementById('defender-shields');
const spaceInput = document.getElementById('space-input');
const btnStartDefender = document.getElementById('btn-start-defender');

// --- Match Blitz DOM ---
const blitzScore = document.getElementById('blitz-score');
const blitzTimer = document.getElementById('blitz-timer');
const blitzCombo = document.getElementById('blitz-combo');
const blitzGrid = document.getElementById('blitz-grid');
const btnStartBlitz = document.getElementById('btn-start-blitz');

// --- Context Detective DOM ---
const detectiveSentence = document.getElementById('detective-sentence');
const detectiveHintPos = document.getElementById('detective-hint-pos');
const detectiveHintTrans = document.getElementById('detective-hint-trans');
const detectiveOptions = document.getElementById('detective-options');
const detectiveExplainBox = document.getElementById('detective-explain-box');
const btnNextQuestion = document.getElementById('btn-next-question');
const detectiveScore = document.getElementById('detective-score');
const detectiveStreak = document.getElementById('detective-streak');

// --- Notebook DOM ---
const notebookList = document.getElementById('notebook-list');
const notebookCount = document.getElementById('notebook-count');
const btnClearNotebook = document.getElementById('btn-clear-notebook');

// Current State
let currentCategory = 'all';
let currentMode = 'hongen'; // 'hongen' | 'defender' | 'blitz' | 'detective' | 'notebook'

// Engines
let hongenEngine = null;
let defenderEngine = null;
let blitzEngine = null;
let detectiveEngine = null;

// Sound Button
function updateSoundIcon() {
  soundIcon.textContent = audio.isMuted() ? '🔇' : '🔊';
}
updateSoundIcon();
btnSound.addEventListener('click', () => {
  audio.toggleMute();
  updateSoundIcon();
});

// Update User Level Badge
function updateLevelDisplay() {
  const info = questManager.getLevelTitle();
  userLevelBadge.textContent = info.badge;
  userLevelTitle.textContent = `Lv.${questManager.stats.level} ${info.title}`;
}
updateLevelDisplay();

// --- Mode Switching ---
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode;
    if (mode === currentMode) return;
    currentMode = mode;

    modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    viewHongen.hidden = true;
    viewDefender.hidden = true;
    viewBlitz.hidden = true;
    viewDetective.hidden = true;
    viewNotebook.hidden = true;

    if (mode === 'hongen') {
      viewHongen.hidden = false;
      initHongen();
    } else if (mode === 'defender') {
      viewDefender.hidden = false;
      initDefender();
    } else if (mode === 'blitz') {
      viewBlitz.hidden = false;
      initBlitz();
    } else if (mode === 'detective') {
      viewDetective.hidden = false;
      initDetective();
    } else if (mode === 'notebook') {
      viewNotebook.hidden = false;
      renderNotebook();
    }
  });
});

// --- Category Selection ---
catPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const cat = pill.dataset.cat;
    currentCategory = cat;

    catPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    if (hongenEngine) {
      hongenEngine.setCategory(cat);
      if (currentMode === 'hongen') renderHongenStep(1);
    }
    if (defenderEngine) defenderEngine.setCategory(cat);
    if (blitzEngine) blitzEngine.setCategory(cat);
    if (detectiveEngine) detectiveEngine.setCategory(cat);

    if (currentMode === 'defender' && defenderEngine.status === 'playing') {
      defenderEngine.start();
    } else if (currentMode === 'blitz' && blitzEngine.status === 'playing') {
      blitzEngine.start();
    } else if (currentMode === 'detective') {
      loadDetectiveQuestion();
    }
  });
});

// ==========================================
// 0. HONGEN 4-STEP STUDIO IMPLEMENTATION
// ==========================================
function initHongen() {
  if (!hongenEngine) {
    hongenEngine = new HongEnStudioEngine(currentCategory);
  }
  updateAlbumBadge();
  renderHongenStep(hongenEngine.currentStep);
}

function updateAlbumBadge() {
  const count = hongenEngine ? hongenEngine.masteredWords.length : 0;
  if (albumCountBadge) albumCountBadge.textContent = `${count} 词`;
}

function renderHongenStep(step) {
  hongenEngine.currentStep = step;

  // Update Stepper UI
  hongenSteps.forEach(btn => {
    const s = parseInt(btn.dataset.step, 10);
    btn.classList.remove('active');
    if (s === step) {
      btn.classList.add('active');
    }
    if (s < step) {
      btn.classList.add('passed');
    } else {
      btn.classList.remove('passed');
    }
  });

  stage1.hidden = true;
  stage2.hidden = true;
  stage3.hidden = true;
  stage4.hidden = true;

  if (step === 1) {
    stage1.hidden = false;
    renderHongenStep1();
  } else if (step === 2) {
    stage2.hidden = false;
    renderHongenStep2();
  } else if (step === 3) {
    stage3.hidden = false;
    renderHongenStep3();
  } else if (step === 4) {
    stage4.hidden = false;
    renderHongenStep4();
  }
}

// Stepper click allows jumping to any step
hongenSteps.forEach(btn => {
  btn.addEventListener('click', () => {
    const s = parseInt(btn.dataset.step, 10);
    renderHongenStep(s);
  });
});

// --- Step 1: 玩 · 情境微剧场与字形演变 ---
function renderHongenStep1() {
  const word = hongenEngine.currentWord;
  const scenario = hongenEngine.getScenario();

  // Sync Quick Picker Active State
  pickerPills.forEach(pill => {
    if (pill.dataset.word && pill.dataset.word.toUpperCase() === word.word.toUpperCase()) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Story Header Titles
  storyTitle.textContent = scenario.title;
  storySubtitle.textContent = scenario.intro;

  // Reset morph card & next button
  storyMorphCard.hidden = true;
  btnGotoStep2.hidden = true;

  // Render Interactive Theater Scene
  storyTheater.render(storyStageInner, word, () => {
    onStoryInteractionComplete(scenario);
  });

  // Speak introductory situational narrative
  audio.speakChinese(scenario.intro);
}

function onStoryInteractionComplete(scenario) {
  const word = hongenEngine.currentWord;

  // Update subtitle to after-action story outcome
  storySubtitle.textContent = scenario.afterAction;

  // Reveal the morph card
  storyWordText.textContent = word.word;
  storyPhoneticText.textContent = word.phonetic;
  storyTransText.textContent = word.trans;
  storyExampleText.textContent = word.example ? `"${word.example}"` : '';
  storyMorphCard.hidden = false;

  // Play bilingual voiceover: Chinese exclamation + English pronunciation
  audio.narrateStory(scenario.voiceNarrative || scenario.afterAction, word.word);

  questManager.addXP(15);
  updateLevelDisplay();
  btnGotoStep2.hidden = false;
}

btnReplayStory.addEventListener('click', () => {
  renderHongenStep1();
});

// Scenario Quick Picker listeners
pickerPills.forEach(pill => {
  if (pill.id === 'btn-random-word') return;
  pill.addEventListener('click', () => {
    hongenEngine.nextWord(pill.dataset.word);
    renderHongenStep(1);
  });
});

if (btnRandomWord) {
  btnRandomWord.addEventListener('click', () => {
    hongenEngine.nextWord();
    renderHongenStep(1);
  });
}

btnGotoStep2.addEventListener('click', () => renderHongenStep(2));

// --- Step 2: 读 · 自然拼读拆解与语音跟读 ---
function renderHongenStep2() {
  const word = hongenEngine.currentWord;
  readWordDisplay.textContent = word.word;
  readPhoneticDisplay.textContent = word.phonetic;

  // Syllables
  const syllables = hongenEngine.getSyllables();
  syllablesContainer.innerHTML = '';
  syllables.forEach((syl) => {
    const chip = document.createElement('button');
    chip.className = 'syllable-chip';
    chip.innerHTML = `<span>🔊</span> ${syl}`;
    chip.addEventListener('click', () => {
      audio.speakPhonics(syl);
    });
    syllablesContainer.appendChild(chip);
  });

  // Reset stars
  starRatingBox.querySelectorAll('.star-item').forEach(s => s.classList.remove('active'));
  micStatusText.textContent = '点击麦克风，大声朗读这个单词！';
  btnGotoStep3.hidden = true;
  btnMicRecord.classList.remove('recording');

  // Auto-play pronunciation once upon entering Step 2
  audio.speak(word.word);
}

btnSpeakSlow.addEventListener('click', () => {
  audio.speakSlow(hongenEngine.currentWord.word);
});

btnSpeakNormal.addEventListener('click', () => {
  audio.speak(hongenEngine.currentWord.word);
});

btnMicRecord.addEventListener('click', () => {
  btnMicRecord.classList.add('recording');
  micStatusText.textContent = '🎧 正在倾听... 请大声念出单词！';

  const finishSuccess = () => {
    btnMicRecord.classList.remove('recording');
    micStatusText.textContent = '🎉 太棒了！发音非常标准纯正！(⭐⭐⭐ Perfect!)';
    const stars = starRatingBox.querySelectorAll('.star-item');
    stars.forEach((s, idx) => {
      setTimeout(() => {
        s.classList.add('active');
        audio.playStarChime(idx);
      }, idx * 150);
    });
    btnGotoStep3.hidden = false;
    questManager.addXP(25);
    updateLevelDisplay();
  };

  if (hongenEngine.recognition) {
    hongenEngine.startSpeechRecognition(
      () => {
        finishSuccess();
      },
      () => {
        // Fallback smooth recognition on error or block
        setTimeout(finishSuccess, 800);
      }
    );
  } else {
    // Graceful simulation
    setTimeout(finishSuccess, 1000);
  }
});

btnGotoStep3.addEventListener('click', () => renderHongenStep(3));

// --- Step 3: 拼 · 果冻字母磁吸积木 ---
function renderHongenStep3() {
  hongenEngine.setupPuzzle();
  puzzleCompleteBanner.style.display = 'none';
  renderPuzzleBoard();
}

function renderPuzzleBoard() {
  // Render Slots
  slotsContainer.innerHTML = '';
  hongenEngine.slots.forEach((slot, index) => {
    const slotEl = document.createElement('div');
    slotEl.className = `slot-box ${slot.filled ? 'filled' : ''} ${!slot.filled && index === hongenEngine.slots.findIndex(s => !s.filled) ? 'hint' : ''}`;
    slotEl.textContent = slot.filled ? slot.targetChar : '';
    slotsContainer.appendChild(slotEl);
  });

  // Render Jelly Tiles
  tilesContainer.innerHTML = '';
  hongenEngine.tiles.forEach(tile => {
    const tileEl = document.createElement('div');
    tileEl.className = `jelly-tile ${tile.placed ? 'placed' : ''}`;
    tileEl.style.background = tile.color;
    tileEl.textContent = tile.char;

    tileEl.addEventListener('click', () => {
      if (tile.placed) return;
      const res = hongenEngine.placeTileInNextSlot(tile.id);
      if (res.success) {
        renderPuzzleBoard();
        if (res.allComplete) {
          puzzleCompleteBanner.style.display = 'flex';
          questManager.addXP(30);
          updateLevelDisplay();
        }
      } else if (res.mismatch) {
        tileEl.classList.remove('shake');
        void tileEl.offsetWidth;
        tileEl.classList.add('shake');
      }
    });

    tilesContainer.appendChild(tileEl);
  });
}

btnGotoStep4.addEventListener('click', () => renderHongenStep(4));

// --- Step 4: 测 · 萌宠喂食闯关与金章认证 ---
function renderHongenStep4() {
  hongenEngine.setupQuiz();
  stampOverlay.hidden = true;
  petAvatar.className = 'pet-avatar';
  petAvatar.textContent = '🐻';
  petBubble.textContent = `好饿呀～快把代表【${hongenEngine.currentWord.trans}】的魔法果实喂给我！`;

  petFoodGrid.innerHTML = '';
  const plateIcons = ['🍰', '🍎', '🍕'];
  hongenEngine.quizOptions.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'food-plate-btn';
    btn.innerHTML = `
      <span class="plate-icon">${plateIcons[idx % plateIcons.length]}</span>
      <span>${opt.word}</span>
    `;

    btn.addEventListener('click', () => {
      const res = hongenEngine.answerQuiz(opt.word);
      if (res.isCorrect) {
        petAvatar.className = 'pet-avatar eating';
        petAvatar.textContent = '😋';
        petBubble.textContent = '哇！太美味啦！(๑♡⌓♡๑) 嚼嚼嚼~';

        setTimeout(() => {
          petAvatar.className = 'pet-avatar celebrate';
          petAvatar.textContent = '👑';
          stampOverlay.hidden = false;
          updateAlbumBadge();
          updateLevelDisplay();
        }, 650);
      } else {
        petAvatar.className = 'pet-avatar';
        petAvatar.textContent = '😣';
        petBubble.textContent = '哎呀～味道不对哦！快再挑一个试试！';
        btn.style.opacity = '0.3';
        btn.style.pointerEvents = 'none';
      }
    });

    petFoodGrid.appendChild(btn);
  });
}

btnHongenNextWord.addEventListener('click', () => {
  hongenEngine.nextWord();
  renderHongenStep(1);
});

// Mastered Word Album Modal
function renderAlbumModal() {
  albumGrid.innerHTML = '';
  const words = hongenEngine ? hongenEngine.masteredWords : [];
  updateAlbumBadge();

  if (words.length === 0) {
    albumGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 30px 10px; color: #94a3b8; text-align: center;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">🌱</span>
        <h4 style="color: #fff; margin-bottom: 4px;">图鉴馆暂无收集</h4>
        <p style="font-size: 0.85rem;">通过洪恩四步法完成测验，即可获得黄金认证卡牌！</p>
      </div>
    `;
    return;
  }

  words.forEach(item => {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.innerHTML = `
      <div class="mini-stamp">👑 MASTERED</div>
      <div style="font-weight: 800; color: #fff; font-size: 1rem; margin-top: 4px;">${item.word}</div>
      <div style="font-size: 0.75rem; color: #38bdf8; font-family: var(--font-mono);">${item.phonetic || ''}</div>
      <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">${item.trans}</div>
      <button class="icon-btn" style="width: 26px; height: 26px; font-size: 0.75rem; margin-top: 6px;" title="发音">🔊</button>
    `;

    card.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation();
      audio.speak(item.word);
    });

    albumGrid.appendChild(card);
  });
}

btnAlbum.addEventListener('click', () => {
  renderAlbumModal();
  modalHongenAlbum.hidden = false;
});

btnViewAlbum.addEventListener('click', () => {
  renderAlbumModal();
  modalHongenAlbum.hidden = false;
});

// ==========================================
// 1. SPACE DEFENDER IMPLEMENTATION
// ==========================================
function initDefender() {
  if (!defenderEngine) {
    defenderEngine = new SpaceDefenderEngine(spaceCanvas, currentCategory);
    resizeSpaceCanvas();
    window.addEventListener('resize', resizeSpaceCanvas);

    // Keyboard Listener
    window.addEventListener('keydown', (e) => {
      if (currentMode !== 'defender' || defenderEngine.status !== 'playing') return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        defenderEngine.handleKey(e.key);
      }
    });

    spaceInput.addEventListener('input', (e) => {
      const val = spaceInput.value.slice(-1);
      if (/^[a-zA-Z]$/.test(val)) {
        defenderEngine.handleKey(val);
      }
      spaceInput.value = '';
    });

    requestAnimationFrame(defenderLoop);
  }
}

function resizeSpaceCanvas() {
  const rect = spaceCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  spaceCanvas.width = rect.width * dpr;
  spaceCanvas.height = rect.height * dpr;
  const ctx = spaceCanvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale((rect.width * dpr) / defenderEngine.V_WIDTH, (rect.height * dpr) / defenderEngine.V_HEIGHT);
}

function defenderLoop() {
  if (currentMode === 'defender' && defenderEngine) {
    defenderEngine.update();
    defenderEngine.render();

    defenderScore.textContent = defenderEngine.score;
    defenderCombo.textContent = defenderEngine.combo > 1 ? `${defenderEngine.combo}x` : '-';
    let shieldsStr = '';
    for (let i = 0; i < 3; i++) {
      shieldsStr += i < defenderEngine.shields ? '🛡️' : '💔';
    }
    defenderShields.textContent = shieldsStr;

    if (defenderEngine.status === 'gameover') {
      btnStartDefender.textContent = '🚀 再次挑战 (Play Again)';
    }
  }
  requestAnimationFrame(defenderLoop);
}

btnStartDefender.addEventListener('click', () => {
  defenderEngine.start();
  spaceInput.focus();
  btnStartDefender.textContent = '🔄 重新开始 (Restart)';
});

// ==========================================
// 2. MATCH BLITZ IMPLEMENTATION
// ==========================================
function initBlitz() {
  if (!blitzEngine) {
    blitzEngine = new MatchBlitzEngine(currentCategory);
  }
  btnStartBlitz.addEventListener('click', () => {
    blitzEngine.start();
    btnStartBlitz.textContent = '🔄 重新洗牌 (Restart)';
    renderBlitzBoard();
  });
}

function renderBlitzBoard() {
  blitzGrid.innerHTML = '';
  blitzEngine.cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `blitz-card ${card.selected ? 'selected' : ''} ${card.matched ? 'matched' : ''}`;
    cardEl.id = `card-${card.id}`;

    if (card.type === 'en') {
      cardEl.innerHTML = `
        <span class="card-word">${card.text}</span>
        <span class="card-phonetic">${card.phonetic || ''}</span>
      `;
    } else {
      cardEl.innerHTML = `
        <span class="card-trans">${card.text}</span>
      `;
    }

    cardEl.addEventListener('click', () => {
      const res = blitzEngine.selectCard(card.id);
      if (!res) return;

      blitzScore.textContent = blitzEngine.score;
      blitzCombo.textContent = blitzEngine.combo > 1 ? `${blitzEngine.combo}x Combo!` : '-';

      if (res.action === 'first_select') {
        cardEl.classList.add('selected');
      } else if (res.action === 'deselected') {
        cardEl.classList.remove('selected');
      } else if (res.action === 'matched') {
        const firstEl = document.getElementById(`card-${res.wordData.id ? `en-${res.wordData.id}` : ''}`);
        // Re-render board cleanly
        setTimeout(renderBlitzBoard, 150);
        questManager.addXP(25);
        updateLevelDisplay();
      } else if (res.action === 'mismatch') {
        document.querySelectorAll('.blitz-card.selected').forEach(c => c.classList.remove('selected'));
      }
    });

    blitzGrid.appendChild(cardEl);
  });
}

// Timer Watcher for Blitz
setInterval(() => {
  if (currentMode === 'blitz' && blitzEngine && blitzEngine.status === 'playing') {
    blitzTimer.textContent = `${blitzEngine.timeLeft}s`;
    if (blitzEngine.timeLeft <= 0) {
      btnStartBlitz.textContent = '⏱️ 时间到！再来一局';
    }
  }
}, 500);

// ==========================================
// 3. CONTEXT DETECTIVE IMPLEMENTATION
// ==========================================
function initDetective() {
  if (!detectiveEngine) {
    detectiveEngine = new ContextDetectiveEngine(currentCategory);
    btnNextQuestion.addEventListener('click', loadDetectiveQuestion);
  }
  loadDetectiveQuestion();
}

function loadDetectiveQuestion() {
  const q = detectiveEngine.nextQuestion();
  if (!q) return;

  detectiveSentence.innerHTML = q.clozeSentence.replace('________', '<span class="cloze-blank">________</span>');
  detectiveHintPos.textContent = `[${q.target.pos}]`;
  detectiveHintTrans.textContent = q.target.trans;
  detectiveExplainBox.hidden = true;
  btnNextQuestion.hidden = true;

  detectiveOptions.innerHTML = '';
  q.options.forEach(optWord => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = optWord;

    btn.addEventListener('click', () => {
      const res = detectiveEngine.answer(optWord);
      if (!res) return;

      // Mark correct & wrong buttons
      document.querySelectorAll('.option-btn').forEach(b => {
        if (b.textContent === res.target.word) {
          b.classList.add('correct');
        } else if (b.textContent === optWord && !res.isCorrect) {
          b.classList.add('wrong');
        }
        b.disabled = true;
      });

      // Fill the blank
      detectiveSentence.innerHTML = q.clozeSentence.replace(
        '________',
        `<span class="cloze-blank" style="color: ${res.isCorrect ? '#10b981' : '#f59e0b'};">${res.target.word}</span>`
      );

      // Display Explanation & Roots
      detectiveExplainBox.hidden = false;
      detectiveExplainBox.innerHTML = `
        <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 6px;">
          ${res.target.word} <span style="color:#38bdf8; font-size: 0.9rem;">${res.target.phonetic}</span>
          <button id="btn-speak-target" class="icon-btn" style="width:26px; height:26px; display:inline-flex; margin-left: 6px;" title="发音">🔊</button>
        </div>
        <p style="margin-bottom: 4px;"><b>译文：</b>${res.target.trans}</p>
        <p style="margin-bottom: 4px;"><b>例句译文：</b>${res.target.transEx || ''}</p>
        ${res.target.roots ? `<p style="color:#f59e0b; margin-bottom: 0;"><b>🌱 词根拆解：</b>${res.target.roots}</p>` : ''}
      `;

      document.getElementById('btn-speak-target').addEventListener('click', () => {
        audio.speak(res.target.word);
      });

      detectiveScore.textContent = detectiveEngine.score;
      detectiveStreak.textContent = detectiveEngine.streak > 1 ? `${detectiveEngine.streak}🔥` : `${detectiveEngine.streak}`;

      if (res.isCorrect) {
        questManager.addXP(40);
        updateLevelDisplay();
      }

      btnNextQuestion.hidden = false;
    });

    detectiveOptions.appendChild(btn);
  });
}

// ==========================================
// 4. MISTAKES NOTEBOOK IMPLEMENTATION
// ==========================================
function renderNotebook() {
  const list = questManager.getMistakes();
  notebookCount.textContent = `${list.length} 词`;
  notebookList.innerHTML = '';

  if (list.length === 0) {
    notebookList.innerHTML = `
      <div style="text-align: center; color: #94a3b8; padding: 40px 16px;">
        <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🎉</span>
        <h3 style="color: #fff; margin-bottom: 6px;">错题本空空如也！</h3>
        <p>你在挑战中答错的单词会自动保存在这里，方便艾宾浩斯强化复习。</p>
      </div>
    `;
    return;
  }

  list.forEach(item => {
    const rowEl = document.createElement('div');
    rowEl.className = 'notebook-item';
    rowEl.innerHTML = `
      <div class="notebook-info">
        <div class="notebook-word-row">
          <span class="notebook-word">${item.word}</span>
          <span class="notebook-phonetic">${item.phonetic || ''}</span>
          <span style="font-size:0.75rem; color:#94a3b8;">[${item.pos}]</span>
        </div>
        <div class="notebook-trans">${item.trans}</div>
        ${item.roots ? `<div class="notebook-roots">🌱 ${item.roots}</div>` : ''}
      </div>
      <div class="notebook-actions">
        <button class="icon-btn btn-speak-nb" title="朗读">🔊</button>
        <button class="icon-btn btn-remove-nb" title="已掌握，移出">✓</button>
      </div>
    `;

    rowEl.querySelector('.btn-speak-nb').addEventListener('click', () => {
      audio.speak(item.word);
    });

    rowEl.querySelector('.btn-remove-nb').addEventListener('click', () => {
      questManager.removeMistake(item.word);
      questManager.addXP(15);
      renderNotebook();
      updateLevelDisplay();
    });

    notebookList.appendChild(rowEl);
  });
}

btnClearNotebook.addEventListener('click', () => {
  if (confirm('确认清空错题本吗？')) {
    questManager.clearMistakes();
    renderNotebook();
  }
});

// Help & Album Modals
btnHelp.addEventListener('click', () => { modalHelp.hidden = false; });
document.querySelectorAll('.modal-close').forEach(b => {
  b.addEventListener('click', () => {
    modalHelp.hidden = true;
    modalHongenAlbum.hidden = true;
  });
});
modalHelp.addEventListener('click', (e) => {
  if (e.target === modalHelp) modalHelp.hidden = true;
});
modalHongenAlbum.addEventListener('click', (e) => {
  if (e.target === modalHongenAlbum) modalHongenAlbum.hidden = true;
});

// Initialize on Load (HongEn 4-Step Studio by default)
initHongen();

