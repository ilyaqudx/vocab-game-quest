import './style.css';
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

const modeTabs = document.querySelectorAll('.mode-tab-btn');
const catPills = document.querySelectorAll('.cat-pill');

const viewDefender = document.getElementById('view-defender');
const viewBlitz = document.getElementById('view-blitz');
const viewDetective = document.getElementById('view-detective');
const viewNotebook = document.getElementById('view-notebook');

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
let currentMode = 'defender'; // 'defender' | 'blitz' | 'detective' | 'notebook'

// Engines
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

    viewDefender.hidden = true;
    viewBlitz.hidden = true;
    viewDetective.hidden = true;
    viewNotebook.hidden = true;

    if (mode === 'defender') {
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

// Help Modal
btnHelp.addEventListener('click', () => { modalHelp.hidden = false; });
document.querySelectorAll('.modal-close').forEach(b => {
  b.addEventListener('click', () => { modalHelp.hidden = true; });
});
modalHelp.addEventListener('click', (e) => {
  if (e.target === modalHelp) modalHelp.hidden = true;
});

// Initialize on Load
initDefender();
