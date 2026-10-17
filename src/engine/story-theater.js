// HongEn Situational Story Theater Engine (洪恩情境微剧场)
// Implements story-driven situational animations, complete character anatomy,
// high-visibility interactive triggers, top-anchored non-blocking HUD prompts,
// situational SFX, bilingual audio narration, and seamless word morphing.

import { audio } from '../audio.js';

export class StoryTheater {
  constructor() {
    this.currentScenarioType = null;
    this.hasInteracted = false;
  }

  render(container, wordObj, onInteractComplete) {
    this.hasInteracted = false;
    container.innerHTML = '';

    const scenario = wordObj.scenario || this.getGenericScenario(wordObj);
    this.currentScenarioType = scenario.type;

    // Viewport element
    const stage = document.createElement('div');
    stage.className = `theater-stage scene-${scenario.type}`;
    stage.id = 'theater-stage-canvas';

    // Build specific scene DOM based on scenario type
    switch (scenario.type) {
      case 'bus':
        this.buildBusScene(stage, scenario, onInteractComplete);
        break;
      case 'cat':
        this.buildCatScene(stage, scenario, onInteractComplete);
        break;
      case 'apple':
        this.buildAppleScene(stage, scenario, onInteractComplete);
        break;
      case 'rocket':
        this.buildRocketScene(stage, scenario, onInteractComplete);
        break;
      case 'book':
        this.buildBookScene(stage, scenario, onInteractComplete);
        break;
      case 'rain':
        this.buildRainScene(stage, scenario, onInteractComplete);
        break;
      case 'abandon':
        this.buildAbandonScene(stage, scenario, onInteractComplete);
        break;
      case 'accomplish':
        this.buildAccomplishScene(stage, scenario, onInteractComplete);
        break;
      default:
        this.buildGenericScene(stage, wordObj, scenario, onInteractComplete);
        break;
    }

    container.appendChild(stage);
  }

  getGenericScenario(wordObj) {
    const w = (wordObj.word || '').toUpperCase();
    const trans = wordObj.trans || '';
    return {
      type: 'generic',
      title: `✨ 神奇探索：${wordObj.word}`,
      intro: `小狐狸在魔法森林里，发现了关于【${trans}】的神秘线索...`,
      climax: `神秘宝箱正在微微颤动，散发出耀眼的光芒！`,
      actionPrompt: `👆 快点击魔法宝箱，解开【${w}】的秘密！`,
      afterAction: `宝箱打开了！奇妙的知识能量升腾而起！`,
      voiceNarrative: `揭开秘密！${trans}！${w}！`
    };
  }

  // ==========================================
  // SCENE 1: BUS (站台等公交车)
  // ==========================================
  // ==========================================
  // SCENE 1: BUS (真实 3D 动画视频与情境交互指引)
  // ==========================================
  buildBusScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="video-cinema-wrap" id="bus-cinema-wrap">
        <!-- 3D Animation Video Player -->
        <video 
          id="bus-video-player" 
          class="cinema-video" 
          src="/media/bus.mp4" 
          playsinline 
          webkit-playsinline 
          preload="auto">
          <source src="/media/bus.mp4" type="video/mp4">
          <source src="/bus.mp4" type="video/mp4">
        </video>

        <!-- Interactive Hotspot overlaid directly on the bus front door (appears at t ≈ 4.5s) -->
        <div class="video-interactive-hotspot" id="bus-door-hotspot" style="display: none;" title="点击车门上车！">
          <div class="hotspot-ripple-ring"></div>
          <div class="hotspot-click-target">
            <span class="hotspot-pulse-dot"></span>
          </div>
          <div class="hotspot-floating-cue">
            <span class="cue-pulse-radar"></span>
            <span class="cue-txt">🚌 点击车门上车！</span>
            <span class="cue-bounce-arrow">👇</span>
          </div>
        </div>

        <!-- Initial Play Overlay in case browser policies block autoplay -->
        <div class="video-play-overlay" id="video-start-overlay" style="display: none;">
          <button class="btn-start-video">
            <span class="play-triangle">▶</span>
            <span>点击观看公交车情境微剧场</span>
          </button>
        </div>

        <!-- Top Guidance HUD (Always Non-blocking) -->
        <div class="sc-prompt-box visible" id="sc-prompt">
          <span class="prompt-icon">💡</span>
          <span class="prompt-text" id="prompt-hud-text"><b>公交车进站啦！</b> 小朋友在站台等车...</span>
        </div>
      </div>
    `;

    const video = stage.querySelector('#bus-video-player');
    const hotspot = stage.querySelector('#bus-door-hotspot');
    const startOverlay = stage.querySelector('#video-start-overlay');
    const prompt = stage.querySelector('#sc-prompt');
    const promptText = stage.querySelector('#prompt-hud-text');

    let hasPausedForInteraction = false;
    let interactionCompleted = false;

    // Start video playback
    const startPlay = () => {
      if (startOverlay) startOverlay.style.display = 'none';
      if (video && typeof video.play === 'function') {
        try {
          const playPromise = video.play();
          if (playPromise !== undefined && typeof playPromise.catch === 'function') {
            playPromise.catch(err => {
              console.warn('Autoplay with audio was restricted by browser, showing play trigger:', err);
              if (startOverlay) startOverlay.style.display = 'flex';
            });
          }
        } catch (e) {
          console.warn('Error initiating video play:', e);
          if (startOverlay) startOverlay.style.display = 'flex';
        }
      }
    };

    if (startOverlay) {
      startOverlay.addEventListener('click', () => {
        if (video) video.muted = false;
        startPlay();
      });
    }

    // Trigger video playback
    setTimeout(startPlay, 100);

    // Monitor playback timeline for intelligent interactive guidance
    if (video && typeof video.addEventListener === 'function') {
      video.addEventListener('timeupdate', () => {
        const t = video.currentTime || 0;

        // Phase 1 (0s - 4.5s): Bus approaches and pulls in
        if (t < 4.4) {
          if (promptText && !hasPausedForInteraction) {
            promptText.innerHTML = '<b>公交车进站啦！</b> 绿色的公交车开过来啦...';
          }
        }

        // Phase 2 (at ~4.5s): Bus stops in front of student -> PAUSE and request user interaction!
        if (!hasPausedForInteraction && t >= 4.5 && t < 7.0) {
          hasPausedForInteraction = true;
          if (typeof video.pause === 'function') {
            video.pause();
          }

          // Show prominent door hotspot at left: 68%, top: 52%
          if (hotspot) hotspot.style.display = 'block';
          if (promptText) {
            promptText.innerHTML = '<b>车停好啦！</b> 👉 快点击黄色发光车门，让小朋友上车！';
          }
          audio.playBoing();
        }

        // Phase 3 (after 8.2s): Student inside waving, bus drives away
        if (t >= 8.2) {
          if (promptText) {
            promptText.innerHTML = '<b>小朋友坐好啦！</b> 挥手告别，公交车出发去上学！';
          }
        }
      });
    }

    // Handle user clicking the door hotspot (or video) to board
    const handleDoorClick = (e) => {
      if (e) e.stopPropagation();
      if (interactionCompleted || !hasPausedForInteraction) return;
      interactionCompleted = true;

      // Hide hotspot with satisfying audio feedback
      if (hotspot) hotspot.style.display = 'none';
      audio.playSnap();

      if (promptText) {
        promptText.innerHTML = '<b>车门打开了！</b> 小朋友快步上车~ 🎒';
      }

      // Resume video playback!
      if (video && typeof video.play === 'function') {
        try {
          video.play();
        } catch (e) {}
      }
    };

    hotspot?.addEventListener('click', handleDoorClick);
    video?.addEventListener('click', () => {
      if (hasPausedForInteraction && !interactionCompleted) {
        handleDoorClick();
      }
    });

    // On video end: finish scene and trigger word morph
    if (video && typeof video.addEventListener === 'function') {
      video.addEventListener('ended', () => {
        if (prompt) prompt.classList.remove('visible');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      });

      // Fallback: If video error occurs, gracefully proceed to next step
      video.addEventListener('error', (e) => {
        console.warn('Video failed to load:', e);
        if (promptText) {
          promptText.innerHTML = '<b>公交车已到达！</b> 点击进入下一步学习！';
        }
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
      });
    }
  }

  // ==========================================
  // SCENE 2: CAT (小猫与毛线球)
  // ==========================================
  buildCatScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-room-wall">
        <div class="sc-room-window">🪟</div>
        <div class="sc-room-clock">⏰</div>
      </div>
      <div class="sc-room-floor">
        <div class="sc-room-rug"></div>
      </div>

      <!-- Vector Cute Kitten -->
      <div class="sc-cat-wrap" id="scene-cat">
        <div class="cat-zzz" id="cat-zzz">💤</div>
        <svg class="cat-svg" viewBox="0 0 120 90" width="100" height="75">
          <defs>
            <linearGradient id="catFurGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fdba74"/>
              <stop offset="100%" stop-color="#f97316"/>
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="82" rx="38" ry="7" fill="rgba(0,0,0,0.2)"/>
          <path class="cat-tail" d="M 22 68 C 10 65 4 50 14 42 C 20 38 24 44 18 50 C 14 54 18 64 26 64" fill="none" stroke="#ea580c" stroke-width="7" stroke-linecap="round"/>
          <ellipse cx="58" cy="62" rx="34" ry="22" fill="url(#catFurGrad)"/>
          <path d="M 46 45 Q 52 56 46 68" stroke="#c2410c" stroke-width="2.5" fill="none"/>
          <path d="M 58 43 Q 64 56 58 70" stroke="#c2410c" stroke-width="2.5" fill="none"/>
          <path d="M 70 45 Q 76 56 70 68" stroke="#c2410c" stroke-width="2.5" fill="none"/>
          <ellipse cx="78" cy="74" rx="8" ry="5" fill="#fff7ed"/>
          <ellipse cx="50" cy="75" rx="7" ry="4" fill="#fff7ed"/>
          <circle cx="84" cy="46" r="18" fill="url(#catFurGrad)"/>
          <polygon points="72,34 76,18 84,30" fill="#f97316"/>
          <polygon points="74,32 77,22 82,30" fill="#fbcfe8"/>
          <polygon points="86,30 94,18 98,34" fill="#f97316"/>
          <polygon points="88,30 93,22 96,32" fill="#fbcfe8"/>
          <line x1="68" y1="46" x2="56" y2="44" stroke="#fff" stroke-width="1.8"/>
          <line x1="68" y1="50" x2="56" y2="52" stroke="#fff" stroke-width="1.8"/>
          <line x1="96" y1="46" x2="108" y2="44" stroke="#fff" stroke-width="1.8"/>
          <line x1="96" y1="50" x2="108" y2="52" stroke="#fff" stroke-width="1.8"/>
          <polygon points="82,47 86,47 84,50" fill="#f43f5e"/>
          <g class="cat-eyes-sleeping" id="cat-eyes-sleep">
            <path d="M 74 44 Q 78 48 82 44" stroke="#7c2d12" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M 86 44 Q 90 48 94 44" stroke="#7c2d12" stroke-width="2" fill="none" stroke-linecap="round"/>
          </g>
          <g class="cat-eyes-awake" id="cat-eyes-open" style="display:none;">
            <ellipse cx="78" cy="43" rx="4" ry="5" fill="#0284c7"/>
            <circle cx="79" cy="41" r="1.5" fill="#ffffff"/>
            <ellipse cx="90" cy="43" rx="4" ry="5" fill="#0284c7"/>
            <circle cx="91" cy="41" r="1.5" fill="#ffffff"/>
            <path d="M 82 52 Q 84 55 86 52" stroke="#b91c1c" stroke-width="1.5" fill="none"/>
          </g>
        </svg>
      </div>

      <!-- High Visibility Interactive Yarn Ball -->
      <div class="sc-yarn-interactive" id="scene-yarn" title="点击毛线球逗猫！">
        <div class="yarn-beacon-ring"></div>
        <div class="yarn-ball-svg">
          <svg viewBox="0 0 60 60" width="54" height="54">
            <defs>
              <radialGradient id="yarnGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#f472b6"/>
                <stop offset="70%" stop-color="#db2777"/>
                <stop offset="100%" stop-color="#9d174d"/>
              </radialGradient>
            </defs>
            <circle cx="30" cy="30" r="22" fill="url(#yarnGrad)"/>
            <path d="M 16 24 Q 30 16 44 24" stroke="#fbcfe8" stroke-width="2.5" fill="none"/>
            <path d="M 14 32 Q 30 40 46 32" stroke="#fbcfe8" stroke-width="2.5" fill="none"/>
            <path d="M 22 14 Q 32 30 22 46" stroke="#fbcfe8" stroke-width="2.5" fill="none"/>
            <path d="M 36 14 Q 28 30 38 46" stroke="#fbcfe8" stroke-width="2.5" fill="none"/>
            <path d="M 30 52 Q 24 58 10 56 Q 0 54 -15 56" stroke="#db2777" stroke-width="3" fill="none" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="yarn-floating-cue">
          <span class="cue-pulse-radar"></span>
          <span class="cue-txt">🧶 点击毛线球逗猫！</span>
          <span class="cue-bounce-arrow">👇</span>
        </div>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>小猫咪正在打盹！</b> 点击毛线球，让小猫醒来玩耍！</span>
      </div>
    `;

    const cat = stage.querySelector('#scene-cat');
    const yarn = stage.querySelector('#scene-yarn');
    const zzz = stage.querySelector('#cat-zzz');
    const prompt = stage.querySelector('#sc-prompt');
    const eyesSleep = stage.querySelector('#cat-eyes-sleep');
    const eyesOpen = stage.querySelector('#cat-eyes-open');

    setTimeout(() => {
      yarn?.classList?.add('yarn-rolled-in');
      audio.playBoing();
    }, 400);

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 1000);

    yarn?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      if (zzz) zzz.style.display = 'none';
      if (eyesSleep) eyesSleep.style.display = 'none';
      if (eyesOpen) eyesOpen.style.display = 'block';

      audio.playBoing();
      audio.playMeow();
      cat?.classList?.add('cat-pouncing');
      yarn?.classList?.add('yarn-caught');

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
    });
  }

  // ==========================================
  // SCENE 3: APPLE (果园摘苹果)
  // ==========================================
  buildAppleScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-orchard-sky">
        <div class="sc-sun"></div>
        <div class="sc-butterfly">🦋</div>
      </div>
      <div class="sc-orchard-hill"></div>

      <!-- Apple Tree -->
      <div class="sc-apple-tree">
        <div class="tree-trunk"></div>
        <div class="tree-foliage">
          <div class="ambient-apple aa-1">🍏</div>
          <div class="ambient-apple aa-2">🍎</div>

          <!-- PROMINENT TARGET APPLE -->
          <div class="interactive-apple" id="scene-target-apple" title="点击摘红苹果！">
            <div class="apple-beacon-ring"></div>
            <svg class="apple-svg" viewBox="0 0 60 60" width="56" height="56">
              <defs>
                <radialGradient id="appleGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stop-color="#f87171"/>
                  <stop offset="60%" stop-color="#dc2626"/>
                  <stop offset="100%" stop-color="#991b1b"/>
                </radialGradient>
              </defs>
              <path d="M 30 18 Q 32 10 38 6" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path d="M 32 12 Q 44 8 46 16 Q 38 18 32 12" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
              <path d="M 30 18 C 22 14 12 22 12 34 C 12 46 22 54 30 52 C 38 54 48 46 48 34 C 48 22 38 14 30 18 Z" fill="url(#appleGrad)"/>
              <ellipse cx="22" cy="28" rx="4" ry="7" fill="rgba(255,255,255,0.6)" transform="rotate(-25 22 28)"/>
            </svg>
            <div class="apple-floating-cue">
              <span class="cue-pulse-radar"></span>
              <span class="cue-txt">🍎 点击摘下大苹果！</span>
              <span class="cue-bounce-arrow">👇</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hedgehog Gatherer with Woven Basket -->
      <div class="sc-hedgehog-gatherer" id="scene-gatherer">
        <svg class="hedgehog-svg" viewBox="0 0 100 80" width="84" height="68">
          <defs>
            <linearGradient id="quillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#78350f"/>
              <stop offset="100%" stop-color="#451a03"/>
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="74" rx="30" ry="5" fill="rgba(0,0,0,0.25)"/>
          <path d="M 20 65 Q 10 40 35 25 Q 60 15 75 35 Q 85 50 78 68 Z" fill="url(#quillGrad)"/>
          <polygon points="22,38 10,32 24,30" fill="#451a03"/>
          <polygon points="32,25 24,15 36,20" fill="#451a03"/>
          <polygon points="48,18 45,8 55,16" fill="#451a03"/>
          <polygon points="65,22 68,12 73,22" fill="#451a03"/>
          <polygon points="78,32 88,26 80,38" fill="#451a03"/>
          <ellipse cx="74" cy="54" rx="16" ry="14" fill="#fde68a"/>
          <circle cx="86" cy="52" r="3" fill="#1e293b"/>
          <circle cx="76" cy="46" r="2.5" fill="#1e293b"/>
          <circle cx="77" cy="45" r="0.8" fill="#ffffff"/>
          <circle cx="72" cy="54" r="3" fill="#f43f5e" opacity="0.4"/>
          <path d="M 78 57 Q 82 60 85 57" stroke="#991b1b" stroke-width="1.5" fill="none"/>
          <ellipse cx="60" cy="62" rx="4" ry="4" fill="#fde68a"/>
          <ellipse cx="44" cy="62" rx="4" ry="4" fill="#fde68a"/>
          <g id="basket-group">
            <path d="M 40 54 L 64 54 L 60 72 L 44 72 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
            <line x1="42" y1="60" x2="62" y2="60" stroke="#b45309" stroke-width="1.5"/>
            <line x1="43" y1="66" x2="61" y2="66" stroke="#b45309" stroke-width="1.5"/>
            <path d="M 40 54 C 40 40 64 40 64 54" stroke="#92400e" stroke-width="2.5" fill="none"/>
          </g>
        </svg>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>树上的大苹果熟透啦！</b> 点击采摘，帮小刺猬装进竹篮！</span>
      </div>
    `;

    const apple = stage.querySelector('#scene-target-apple');
    const prompt = stage.querySelector('#sc-prompt');
    const gatherer = stage.querySelector('#scene-gatherer');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 600);

    apple?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playBoing();
      apple?.classList?.add('apple-dropping');

      setTimeout(() => {
        audio.playCrunch();
        gatherer?.classList?.add('gatherer-happy');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 850);
      }, 500);
    });
  }

  // ==========================================
  // SCENE 4: ROCKET (火箭点火升空)
  // ==========================================
  buildRocketScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-space-sky">
        <div class="sc-stars">✨ 🌟 🪐 ✨ 🌌</div>
        <div class="sc-moon">🌙</div>
      </div>
      <div class="sc-launch-pad">
        <div class="gantry-tower left"></div>
        <div class="gantry-tower right"></div>
      </div>

      <!-- Vector Sleek Rocket -->
      <div class="sc-space-rocket" id="scene-rocket">
        <svg class="rocket-svg" viewBox="0 0 80 140" width="70" height="120">
          <defs>
            <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e2e8f0"/>
              <stop offset="50%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#cbd5e1"/>
            </linearGradient>
            <linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="30%" stop-color="#fde047"/>
              <stop offset="70%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#dc2626"/>
            </linearGradient>
          </defs>
          <polygon points="18,85 4,115 22,110" fill="#dc2626"/>
          <polygon points="62,85 76,115 58,110" fill="#dc2626"/>
          <polygon points="36,88 44,88 44,114 36,114" fill="#b91c1c"/>
          <path d="M 40 8 C 30 25 24 55 24 105 L 56 105 C 56 55 50 25 40 8 Z" fill="url(#rocketBodyGrad)" stroke="#94a3b8" stroke-width="1.5"/>
          <path d="M 40 8 C 34 20 30 35 30 42 L 50 42 C 50 35 46 20 40 8 Z" fill="#ef4444"/>
          <rect x="24" y="68" width="32" height="6" fill="#2563eb"/>
          <circle cx="40" cy="56" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5"/>
          <circle cx="40" cy="56" r="7" fill="#0f172a"/>
          <text x="40" y="60" text-anchor="middle" font-size="9">👨‍🚀</text>
          <polygon points="32,105 48,105 52,114 28,114" fill="#475569"/>
          <g class="rocket-flame-group" id="rocket-flame" style="display:none;">
            <polygon points="30,114 50,114 40,148" fill="url(#fireGrad)"/>
            <polygon points="34,114 46,114 40,138" fill="#ffffff"/>
          </g>
        </svg>
      </div>

      <!-- Completely Unobstructed Launch Console at Bottom -->
      <div class="sc-launch-console" id="scene-launch-btn" title="点击点火发射！">
        <div class="console-box">
          <button class="btn-launch-red">
            <span class="launch-radar-ring"></span>
            <span class="btn-icon">🚀</span>
            <span class="btn-text">点击点火发射 (LAUNCH)</span>
          </button>
        </div>
      </div>

      <!-- Top Prompt Banner (At Top, NEVER covers launch button) -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>发射倒计时就绪！</b> 点击下方红色按钮点火升空！</span>
      </div>
    `;

    const btn = stage.querySelector('#scene-launch-btn');
    const rocket = stage.querySelector('#scene-rocket');
    const flame = stage.querySelector('#rocket-flame');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    btn?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      if (flame) flame.style.display = 'block';
      audio.playRocketWhoosh();
      rocket?.classList?.add('rocket-launching');

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1100);
    });
  }

  // ==========================================
  // SCENE 5: BOOK (魔法书本翻开)
  // ==========================================
  buildBookScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-magic-room">
        <div class="magic-sparkles">✨ 🔮 🕯️ ✨</div>
      </div>
      <div class="sc-magic-desk"></div>

      <!-- Interactive 3D Leather Grimoire -->
      <div class="sc-magic-book-interactive" id="scene-book" title="点击翻开魔法书！">
        <div class="book-beacon-ring"></div>
        <div class="grimoire-3d" id="grimoire-3d">
          <div class="book-cover-leaf" id="book-cover-leaf">
            <div class="cover-gold-border">
              <div class="cover-star-emblem">✨ 📖 ✨</div>
              <div class="cover-title">MYSTERY OF WORDS</div>
              <div class="cover-ribbon">🎗️</div>
            </div>
          </div>
          <div class="book-inside" id="book-inside">
            <div class="inside-magic-castle">🏰</div>
            <div class="inside-aurora">🌟 知识的力量 🌟</div>
          </div>
        </div>
        <div class="book-floating-cue">
          <span class="cue-pulse-radar"></span>
          <span class="cue-txt">✨ 点击翻开魔法书！</span>
          <span class="cue-bounce-arrow">👇</span>
        </div>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>魔法书静静沉睡！</b> 点击翻开书本，探索神奇知识！</span>
      </div>
    `;

    const book = stage.querySelector('#scene-book');
    const coverLeaf = stage.querySelector('#book-cover-leaf');
    const bookInside = stage.querySelector('#book-inside');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    book?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playPageFlip();
      coverLeaf?.classList?.add('book-opened');
      bookInside?.classList?.add('pages-revealed');

      setTimeout(() => {
        audio.playVictory();
        if (onComplete) onComplete();
      }, 950);
    });
  }

  // ==========================================
  // SCENE 6: RAIN (下雨滋润小花)
  // ==========================================
  buildRainScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-rain-sky">
        <!-- Interactive Rain Cloud -->
        <div class="rain-cloud-interactive" id="scene-cloud" title="点击云朵降雨！">
          <div class="cloud-beacon-ring"></div>
          <div class="cloud-body">
            <span class="cloud-face">🌧️</span>
          </div>
          <div class="cloud-floating-cue">
            <span class="cue-pulse-radar"></span>
            <span class="cue-txt">💧 点击云朵降雨！</span>
            <span class="cue-bounce-arrow">👇</span>
          </div>
        </div>

        <div class="rain-streaks-container" id="rain-drops">
          <span class="drop d1">💧</span>
          <span class="drop d2">💧</span>
          <span class="drop d3">💧</span>
          <span class="drop d4">💧</span>
          <span class="drop d5">💧</span>
        </div>
        <div class="rainbow-arc" id="scene-rainbow">🌈</div>
      </div>

      <div class="sc-rain-ground">
        <div class="thirsty-flowers" id="scene-flowers">
          <span class="flw f1">🥀</span>
          <span class="flw f2">🥀</span>
          <span class="flw f3">🥀</span>
        </div>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>小花渴得低下了头！</b> 点击云朵下起甘霖滋润大地！</span>
      </div>
    `;

    const cloud = stage.querySelector('#scene-cloud');
    const drops = stage.querySelector('#rain-drops');
    const flowers = stage.querySelector('#scene-flowers');
    const rainbow = stage.querySelector('#scene-rainbow');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    cloud?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      drops?.classList?.add('raining');

      setTimeout(() => {
        if (flowers) {
          flowers.innerHTML = `
            <span class="flw f1 bloomed">🌸</span>
            <span class="flw f2 bloomed">🌻</span>
            <span class="flw f3 bloomed">🌷</span>
          `;
        }
        rainbow?.classList?.add('rainbow-shining');
        audio.playVictory();
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 900);
      }, 650);
    });
  }

  // ==========================================
  // SCENE 7: ABANDON (惊涛骇浪弃船避险)
  // ==========================================
  buildAbandonScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-storm-sky">
        <div class="storm-cloud">🌩️</div>
      </div>
      <div class="sc-storm-sea">
        <div class="sea-wave w1">🌊</div>
        <div class="sea-wave w2">🌊</div>
      </div>
      <div class="sc-storm-ship" id="scene-ship">
        <div class="ship-hull">⛵</div>
      </div>

      <!-- Interactive Lifeboat -->
      <div class="lifeboat-interactive" id="scene-lifeboat" title="点击放下救生艇！">
        <div class="boat-beacon-ring"></div>
        <div class="lifeboat-svg-wrap">
          <span class="boat-icon">🛶</span>
        </div>
        <div class="boat-floating-cue">
          <span class="cue-pulse-radar"></span>
          <span class="cue-txt">🛶 点击释放救生艇！</span>
          <span class="cue-bounce-arrow">👇</span>
        </div>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>暴风雨受损进水！</b> 点击救生艇，果断弃船避险！</span>
      </div>
    `;

    const boat = stage.querySelector('#scene-lifeboat');
    const ship = stage.querySelector('#scene-ship');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    boat?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playBoing();
      boat?.classList?.add('boat-escaped');
      if (ship) ship.style.opacity = '0.35';

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
    });
  }

  // ==========================================
  // SCENE 8: ACCOMPLISH (勇攀高峰胜利登顶)
  // ==========================================
  buildAccomplishScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-mountain-sky">
        <div class="mountain-sun">☀️</div>
        <div class="mountain-eagle">🦅</div>
      </div>
      <div class="sc-snow-peak">
        <div class="peak-summit">🏔️</div>
      </div>
      <div class="sc-climber" id="scene-climber">
        <div class="climber-figure">🧗</div>
      </div>

      <!-- Interactive Flag Socket -->
      <div class="summit-flag-interactive" id="scene-flag" title="点击插上金旗！">
        <div class="flag-beacon-ring"></div>
        <div class="flag-stand">
          <span class="flag-cloth">🚩</span>
        </div>
        <div class="flag-floating-cue">
          <span class="cue-pulse-radar"></span>
          <span class="cue-txt">🚩 点击插上胜利金旗！</span>
          <span class="cue-bounce-arrow">👇</span>
        </div>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>终于到达雪山之巅！</b> 点击胜利之旗，将它插上最高峰！</span>
      </div>
    `;

    const flag = stage.querySelector('#scene-flag');
    const climber = stage.querySelector('#scene-climber');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    flag?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playVictory();
      flag?.classList?.add('flag-planted');
      climber?.classList?.add('climber-celebrate');

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 950);
    });
  }

  // ==========================================
  // GENERIC SCENARIO (全词库通用奇妙探险工坊)
  // ==========================================
  buildGenericScene(stage, wordObj, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-generic-backdrop">
        <div class="generic-stars">✨ 🌟 ✨ 🔮</div>
      </div>
      <div class="sc-generic-pedestal">
        <div class="generic-mascot">🦊</div>
        <!-- Interactive Magic Chest -->
        <div class="generic-chest-interactive" id="scene-chest" title="点击开启魔法宝箱！">
          <div class="chest-beacon-ring"></div>
          <div class="chest-box">🎁</div>
          <div class="chest-floating-cue">
            <span class="cue-pulse-radar"></span>
            <span class="cue-txt">🎁 点击开启宝箱！</span>
            <span class="cue-bounce-arrow">👇</span>
          </div>
        </div>
      </div>

      <!-- Top Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text"><b>发现神秘宝箱！</b> 点击宝箱，解开【${wordObj.word}】的奥秘！</span>
      </div>
    `;

    const chest = stage.querySelector('#scene-chest');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    chest?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playBoing();
      audio.playVictory();
      chest?.classList?.add('chest-opened');

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
    });
  }
}

export const storyTheater = new StoryTheater();
