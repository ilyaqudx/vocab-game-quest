// HongEn Situational Story Theater Engine (洪恩情境微剧场)
// Implements story-driven situational animations, interactive triggers,
// bilingual narration, and seamless word morphing (e.g. Bus stop scenario for BUS)

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
    const w = wordObj.word.toUpperCase();
    const trans = wordObj.trans;
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
  buildBusScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <!-- Sky & Clouds -->
      <div class="sc-sky">
        <div class="sc-sun"></div>
        <div class="sc-cloud cloud-1">☁️</div>
        <div class="sc-cloud cloud-2">☁️</div>
      </div>
      <!-- City Skyline Background -->
      <div class="sc-cityline"></div>
      <!-- Road & Sidewalk -->
      <div class="sc-sidewalk"></div>
      <div class="sc-road">
        <div class="sc-road-dashes"></div>
      </div>
      <!-- Bus Stop Sign -->
      <div class="sc-bus-stop-sign">
        <div class="sign-board">🚏 BUS STOP</div>
        <div class="sign-pole"></div>
      </div>
      <!-- Waiting School Boy -->
      <div class="sc-character boy" id="scene-boy">
        <div class="char-backpack">🎒</div>
        <div class="char-figure">👦</div>
        <div class="char-bubble" id="char-speech">等车去上学...</div>
      </div>
      <!-- Yellow Big Bus -->
      <div class="sc-bus" id="scene-bus">
        <div class="bus-body">
          <div class="bus-roof"></div>
          <div class="bus-windows">
            <div class="bus-window">🪟</div>
            <div class="bus-window passenger" id="bus-driver">👨‍✈️</div>
            <div class="bus-window passenger" id="bus-front-window"></div>
          </div>
          <div class="bus-stripe"></div>
          <div class="bus-door" id="scene-bus-door" title="点击上车！">
            <div class="door-leaf"></div>
            <div class="door-leaf"></div>
            <div class="door-glow-cue">👆 点击上车</div>
          </div>
          <div class="bus-headlight"></div>
        </div>
        <div class="bus-wheel wheel-front">⚙️</div>
        <div class="bus-wheel wheel-rear">⚙️</div>
        <div class="bus-exhaust" id="bus-exhaust">💨</div>
      </div>
      <!-- Action Prompt Banner -->
      <div class="sc-prompt-box" id="sc-prompt">
        <span>🚏 公交车进站啦！</span>
        <b>👆 点击黄色车门，送小明上公交车！</b>
      </div>
    `;

    const bus = stage.querySelector('#scene-bus');
    const door = stage.querySelector('#scene-bus-door');
    const boy = stage.querySelector('#scene-boy');
    const speech = stage.querySelector('#char-speech');
    const prompt = stage.querySelector('#sc-prompt');
    const frontWindow = stage.querySelector('#bus-front-window');

    // Phase 1: Bus arrives with honk
    setTimeout(() => {
      audio.playHonk();
      bus?.classList?.add('bus-arrived');
      speech.textContent = '公交车来啦！';
    }, 300);

    // Show prompt after bus stops
    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 1200);

    // Phase 2: User interaction (Click door)
    const handleBoarding = () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      door?.classList?.add('door-open');
      audio.playSnap();

      // Boy walks into bus
      boy?.classList?.add('boy-boarding');
      setTimeout(() => {
        boy.style.display = 'none';
        frontWindow.textContent = '👦👋'; // Boy smiles and waves from window
        door?.classList?.remove('door-open');
        audio.playHonk();

        // Bus zooms off!
        setTimeout(() => {
          bus?.classList?.add('bus-depart');
          if (onComplete) onComplete();
        }, 600);
      }, 500);
    };

    door?.addEventListener('click', handleBoarding);
    bus?.addEventListener('click', handleBoarding);
  }

  // ==========================================
  // SCENE 2: CAT (小猫玩毛线球)
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
      <div class="sc-cat" id="scene-cat">
        <div class="cat-body">🐱</div>
        <div class="cat-zzz" id="cat-zzz">💤</div>
      </div>
      <div class="sc-yarn-ball" id="scene-yarn" title="点击毛线球！">
        <div class="yarn-sphere">🧶</div>
        <div class="yarn-cue">👆 点我逗猫</div>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>🧶 毛线球滚过来了！</span>
        <b>👆 点击毛线球，让小猫抓球玩耍！</b>
      </div>
    `;

    const cat = stage.querySelector('#scene-cat');
    const yarn = stage.querySelector('#scene-yarn');
    const zzz = stage.querySelector('#cat-zzz');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      yarn?.classList?.add('yarn-rolled-in');
      audio.playBoing();
    }, 400);

    setTimeout(() => {
      zzz.style.display = 'none';
      cat?.classList?.add('cat-awake');
      audio.playMeow();
      prompt?.classList?.add('visible');
    }, 1000);

    yarn?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
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
      <div class="sc-apple-tree">
        <div class="tree-trunk"></div>
        <div class="tree-foliage">
          <div class="hanging-apple apple-1" id="scene-target-apple" title="点击摘苹果！">
            🍎
            <div class="apple-cue">👆 摘我</div>
          </div>
          <div class="hanging-apple apple-2">🍎</div>
          <div class="hanging-apple apple-3">🍎</div>
        </div>
      </div>
      <div class="sc-gatherer" id="scene-gatherer">
        <div class="gatherer-basket" id="scene-basket">🧺</div>
        <div class="gatherer-figure">🦔</div>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>🌳 树上的红苹果熟透啦！</span>
        <b>👆 点击最红的大苹果，帮小刺猬采摘！</b>
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
        gatherer.innerHTML = `<div class="gatherer-basket">🧺🍎</div><div class="gatherer-figure">🦔😋</div>`;
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }, 450);
    });
  }

  // ==========================================
  // SCENE 4: ROCKET (太空火箭点火)
  // ==========================================
  buildRocketScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-space-sky">
        <div class="sc-stars">✨ 🌟 🪐 ✨</div>
        <div class="sc-moon">🌙</div>
      </div>
      <div class="sc-launch-pad">
        <div class="gantry-tower left"></div>
        <div class="gantry-tower right"></div>
      </div>
      <div class="sc-space-rocket" id="scene-rocket">
        <div class="rocket-fuselage">🚀</div>
        <div class="rocket-exhaust" id="rocket-flames">🔥</div>
      </div>
      <div class="sc-launch-console" id="scene-launch-btn" title="点击发射！">
        <button class="btn-launch-red">🔴 点火发射 (LAUNCH)</button>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>⚡ 倒计时已就绪：3... 2... 1...</span>
        <b>👆 点击红色按钮，点火发射火箭！</b>
      </div>
    `;

    const btn = stage.querySelector('#scene-launch-btn');
    const rocket = stage.querySelector('#scene-rocket');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    btn?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playRocketWhoosh();
      rocket?.classList?.add('rocket-launching');

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
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
      <div class="sc-magic-book-container" id="scene-book" title="点击翻开书本！">
        <div class="magic-book-cover" id="book-cover">
          <div class="book-emblem">📖</div>
          <div class="book-title-gold">MYSTERY OF WORDS</div>
          <div class="book-cue">👆 点击翻开</div>
        </div>
        <div class="magic-book-pages" id="book-pages">
          <div class="popup-castle">🏰</div>
          <div class="popup-aura">✨ 光明知识 ✨</div>
        </div>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>📜 神秘魔法书静静沉睡在书桌上...</span>
        <b>👆 点击精装书本，翻开奇妙知识世界！</b>
      </div>
    `;

    const book = stage.querySelector('#scene-book');
    const cover = stage.querySelector('#book-cover');
    const pages = stage.querySelector('#book-pages');
    const prompt = stage.querySelector('#sc-prompt');

    setTimeout(() => {
      prompt?.classList?.add('visible');
    }, 500);

    book?.addEventListener('click', () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;

      prompt?.classList?.remove('visible');
      audio.playPageFlip();
      cover?.classList?.add('book-opened');
      pages?.classList?.add('pages-revealed');

      setTimeout(() => {
        audio.playVictory();
        if (onComplete) onComplete();
      }, 900);
    });
  }

  // ==========================================
  // SCENE 6: RAIN (下雨滋润小花)
  // ==========================================
  buildRainScene(stage, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-rain-sky">
        <div class="rain-cloud" id="scene-cloud" title="点击降雨！">
          <span class="cloud-icon">🌧️</span>
          <div class="cloud-cue">👆 点我降雨</div>
        </div>
        <div class="rain-droplets" id="rain-drops">
          <span class="drop d1">💧</span>
          <span class="drop d2">💧</span>
          <span class="drop d3">💧</span>
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
      <div class="sc-prompt-box" id="sc-prompt">
        <span>☁️ 天空聚齐了饱满的雨云！</span>
        <b>👆 点击雨云，让甘霖滋润大地！</b>
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
        flowers.innerHTML = `<span class="flw f1 bloomed">🌸</span><span class="flw f2 bloomed">🌻</span><span class="flw f3 bloomed">🌷</span>`;
        rainbow?.classList?.add('rainbow-shining');
        audio.playVictory();
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 900);
      }, 600);
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
      <div class="sc-lifeboat" id="scene-lifeboat" title="点击放下救生艇！">
        <span>🛶</span>
        <div class="boat-cue">👆 放下救生筏</div>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>🌊 暴风雨来临，船只受损进水！</span>
        <b>👆 点击救生艇，果断弃船避险！</b>
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
      ship.style.opacity = '0.4';

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
      <div class="sc-summit-flag" id="scene-flag" title="点击插上金旗！">
        <span class="flag-icon">🚩</span>
        <div class="flag-cue">👆 插上胜利旗帜</div>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>🏔️ 克服艰难险阻，终于到达雪山之巅！</span>
        <b>👆 点击金色旗帜，将它插上最高峰！</b>
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
      }, 900);
    });
  }

  // ==========================================
  // GENERIC SCENARIO (全词库通用奇妙探险工坊)
  // ==========================================
  buildGenericScene(stage, wordObj, scenario, onComplete) {
    stage.innerHTML = `
      <div class="sc-generic-backdrop">
        <div class="generic-stars">✨ 🌟 ✨</div>
      </div>
      <div class="sc-generic-pedestal">
        <div class="generic-mascot">🦊</div>
        <div class="generic-chest" id="scene-chest" title="点击开启魔法宝箱！">
          <div class="chest-box">🎁</div>
          <div class="chest-cue">👆 点我开启</div>
        </div>
      </div>
      <div class="sc-prompt-box" id="sc-prompt">
        <span>✨ 发现关于【${wordObj.trans}】的神秘宝箱！</span>
        <b>👆 点击魔法宝箱，解开【${wordObj.word}】的奥秘！</b>
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
