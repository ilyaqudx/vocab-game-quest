import { getWordPool } from '../data/extended-vocab.js';
import { audio } from '../audio.js';

export class SpaceDefenderEngine {
  constructor(canvas, category = 'all') {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.category = category;

    this.V_WIDTH = 480;
    this.V_HEIGHT = 640;

    this.status = 'ready'; // 'ready' | 'playing' | 'gameover'
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.shields = 3;
    this.wordsDefeated = 0;

    this.asteroids = [];
    this.lasers = [];
    this.particles = [];
    this.stars = [];

    this.activeAsteroid = null;
    this.spawnTimer = 0;
    this.speedMultiplier = 1.0;

    this.initStars();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 55; i++) {
      this.stars.push({
        x: Math.random() * this.V_WIDTH,
        y: Math.random() * this.V_HEIGHT,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.8 + 0.2
      });
    }
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.shields = 3;
    this.wordsDefeated = 0;
    this.asteroids = [];
    this.lasers = [];
    this.particles = [];
    this.activeAsteroid = null;
    this.spawnTimer = 0;
    this.speedMultiplier = 1.0;

    this.spawnAsteroid();
  }

  setCategory(cat) {
    this.category = cat;
  }

  spawnAsteroid() {
    const pool = getWordPool(this.category);
    if (!pool || pool.length === 0) return;

    const data = pool[Math.floor(Math.random() * pool.length)];
    const word = data.word.toUpperCase();

    // Check if word already on screen
    if (this.asteroids.some(a => a.word === word)) return;

    const width = Math.max(90, word.length * 15 + 24);
    const x = Math.floor(15 + Math.random() * (this.V_WIDTH - width - 30));

    this.asteroids.push({
      x,
      y: -30,
      width,
      height: 38,
      word,
      data,
      typedIdx: 0,
      speed: (0.55 + Math.random() * 0.35) * this.speedMultiplier,
      color: this.getCategoryColor(data.category),
      pulse: 0
    });
  }

  getCategoryColor(cat) {
    switch (cat) {
      case 'cet4': return '#38bdf8'; // Sky Blue
      case 'cet6': return '#a855f7'; // Purple
      case 'ielts': return '#f59e0b'; // Amber Gold
      case 'toefl': return '#ec4899'; // Pink
      default: return '#22c55e'; // Green
    }
  }

  handleKey(char) {
    if (this.status !== 'playing') return null;

    char = char.toUpperCase();

    // If an asteroid is currently being typed
    if (this.activeAsteroid) {
      const nextChar = this.activeAsteroid.word[this.activeAsteroid.typedIdx];
      if (char === nextChar) {
        this.hitLetter(this.activeAsteroid);
        return { hit: true, finished: this.activeAsteroid.typedIdx >= this.activeAsteroid.word.length };
      } else {
        // Wrong key for current active
        audio.playError();
        this.combo = 0;
        return { hit: false };
      }
    }

    // No active asteroid: find candidates whose starting letter matches
    const candidates = this.asteroids.filter(a => a.word[0] === char);
    if (candidates.length > 0) {
      // Prioritize the asteroid closest to bottom
      candidates.sort((a, b) => b.y - a.y);
      this.activeAsteroid = candidates[0];
      this.hitLetter(this.activeAsteroid);
      return { hit: true, finished: this.activeAsteroid.typedIdx >= this.activeAsteroid.word.length };
    }

    audio.playError();
    this.combo = 0;
    return { hit: false };
  }

  hitLetter(ast) {
    ast.typedIdx++;
    audio.playLaser();

    // Fire laser beam from bottom ship to asteroid
    const shipX = this.V_WIDTH / 2;
    const shipY = this.V_HEIGHT - 35;
    const targetX = ast.x + (ast.typedIdx / ast.word.length) * ast.width;
    const targetY = ast.y + ast.height / 2;

    this.lasers.push({
      x1: shipX,
      y1: shipY,
      x2: targetX,
      y2: targetY,
      life: 1.0
    });

    // Spark particles at impact point
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: targetX,
        y: targetY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: '#38bdf8',
        life: 1.0,
        decay: 0.08
      });
    }

    // Check if word complete!
    if (ast.typedIdx >= ast.word.length) {
      this.destroyAsteroid(ast);
    }
  }

  destroyAsteroid(ast) {
    audio.playExplosion();
    audio.speak(ast.word); // Native human pronunciation!

    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    audio.playCombo(this.combo);

    const points = ast.word.length * 15 * (1 + Math.floor(this.combo / 4));
    this.score += points;
    this.wordsDefeated++;

    // Massive explosion particles
    for (let i = 0; i < 18; i++) {
      this.particles.push({
        x: ast.x + ast.width / 2,
        y: ast.y + ast.height / 2,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        color: ast.color,
        life: 1.0,
        decay: 0.04
      });
    }

    // Remove from array
    this.asteroids = this.asteroids.filter(a => a !== ast);
    if (this.activeAsteroid === ast) {
      this.activeAsteroid = null;
    }

    // Slightly increase speed every 6 words
    if (this.wordsDefeated % 6 === 0) {
      this.speedMultiplier = Math.min(2.5, this.speedMultiplier + 0.12);
    }

    return ast.data;
  }

  update() {
    if (this.status !== 'playing') return;

    // 1. Move stars
    this.stars.forEach(s => {
      s.y += s.speed;
      if (s.y > this.V_HEIGHT) s.y = 0;
    });

    // 2. Spawn asteroids periodically
    this.spawnTimer++;
    const interval = Math.max(80, Math.floor(180 / this.speedMultiplier));
    if (this.spawnTimer >= interval) {
      this.spawnAsteroid();
      this.spawnTimer = 0;
    }

    // 3. Move asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const ast = this.asteroids[i];
      ast.y += ast.speed;

      // Check barrier impact
      if (ast.y + ast.height >= this.V_HEIGHT - 60) {
        audio.playExplosion();
        this.shields--;
        this.combo = 0;

        // Failure explosion particles
        for (let p = 0; p < 15; p++) {
          this.particles.push({
            x: ast.x + ast.width / 2,
            y: ast.y + ast.height,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: '#ef4444',
            life: 1.0,
            decay: 0.05
          });
        }

        if (this.activeAsteroid === ast) {
          this.activeAsteroid = null;
        }

        this.asteroids.splice(i, 1);

        if (this.shields <= 0) {
          this.status = 'gameover';
          return;
        }
      }
    }

    // 4. Update lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.life -= 0.18;
      if (l.life <= 0) this.lasers.splice(i, 1);
    }

    // 5. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  render() {
    const W = this.V_WIDTH;
    const H = this.V_HEIGHT;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, W, H);

    // Deep Space Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#060814');
    bgGrad.addColorStop(0.5, '#0b1126');
    bgGrad.addColorStop(1, '#111836');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Twinkling Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    this.stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Defensive Barrier Base
    ctx.strokeStyle = this.shields > 1 ? '#38bdf8' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H - 60);
    ctx.lineTo(W, H - 60);
    ctx.stroke();

    // Laser Beams
    this.lasers.forEach(l => {
      ctx.strokeStyle = `rgba(56, 189, 248, ${l.life})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    });

    // Particles
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Asteroids
    this.asteroids.forEach(ast => {
      this.drawAsteroid(ast);
    });

    // Spaceship Cannon
    this.drawShip();
  }

  drawAsteroid(ast) {
    const ctx = this.ctx;
    const isActive = this.activeAsteroid === ast;

    // Body
    ctx.fillStyle = isActive ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = isActive ? '#facc15' : ast.color;
    ctx.lineWidth = isActive ? 2.5 : 1.5;

    if (isActive) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
    }

    ctx.beginPath();
    ctx.roundRect(ast.x, ast.y, ast.width, ast.height, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Word text with typed progress highlighted
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const textY = ast.y + 13;
    let curX = ast.x + 12;

    for (let i = 0; i < ast.word.length; i++) {
      const ch = ast.word[i];
      if (i < ast.typedIdx) {
        ctx.fillStyle = '#4ade80'; // Typed green
      } else if (i === ast.typedIdx && isActive) {
        ctx.fillStyle = '#facc15'; // Next char target yellow
      } else {
        ctx.fillStyle = '#f8fafc'; // Untyped white
      }
      ctx.fillText(ch, curX, textY);
      curX += 13.5;
    }

    // Chinese Translation preview below word
    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    const cleanTrans = ast.data.trans.split('；')[0].slice(0, 9);
    ctx.fillText(cleanTrans, ast.x + ast.width / 2, ast.y + 28);
  }

  drawShip() {
    const ctx = this.ctx;
    const x = this.V_WIDTH / 2;
    const y = this.V_HEIGHT - 35;

    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x + 16, y + 14);
    ctx.lineTo(x, y + 8);
    ctx.lineTo(x - 16, y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Thruster flame
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 10);
    ctx.lineTo(x, y + 18 + Math.random() * 6);
    ctx.lineTo(x + 6, y + 10);
    ctx.closePath();
    ctx.fill();
  }
}
