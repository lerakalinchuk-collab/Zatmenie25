/**
 * ЗАТМЕНИЕ 25 — Cinema & Portal Engines
 * 3D Dice · Film Database · Rune Circle · Portal 18+
 */

// ─── FILM DATABASE ────────────────────────────────────────────────────────────
const FILMS = [
  { title: 'Достучаться до небес', year: 1997, genre: 'Драма · Роуд-муви', desc: 'Два смертельно больных незнакомца решают увидеть море.', questions: ['Что для тебя значит "успеть"?', 'Куда бы ты поехал, если бы ничего не боялся?', 'Что ты хочешь успеть нам сделать вместе?'] },
  { title: 'Вечное сияние чистого разума', year: 2004, genre: 'Sci-Fi · Романтика', desc: 'Что останется, если стереть воспоминания о любви?', questions: ['Какое воспоминание о нас ты бы никогда не стёр?', 'Что из нашей истории ты хочешь запомнить навсегда?', 'Если бы ты мог добавить воспоминание — какое?'] },
  { title: 'Интерстеллар', year: 2014, genre: 'Sci-Fi · Драма', desc: 'Любовь сильнее гравитации и времени.', questions: ['Ради чего ты готов ждать?', 'Что нас удерживает, даже когда далеко?', 'Опиши время, когда расстояние тебя не остановило.'] },
  { title: 'Мне не стыдно', year: 2021, genre: 'Триллер · Романтика', desc: 'Любовь, тайны и опасные игры.', questions: ['Есть ли у тебя секрет, который ты хочешь мне рассказать?', 'Что самое опасное, на что ты решался ради кого-то?', 'Какая тайна тебя привлекает?'] },
  { title: 'Прибытие', year: 2016, genre: 'Sci-Fi · Философия', desc: 'Если бы ты знал всё заранее — ты бы выбрал то же самое?', questions: ['Что ты выбрал бы снова, зная конец?', 'Какой наш момент ты бы прожил ещё раз?', 'О чём ты не жалеешь?'] },
  { title: 'Дорогой Джон', year: 2010, genre: 'Романтика · Война', desc: 'Письма как единственный мост между двумя людьми.', questions: ['Когда ты последний раз писал мне что-то настоящее?', 'Что бы ты написал мне в письме?', 'Как расстояние меняет твои слова?'] },
  { title: 'Ла-Ла Ленд', year: 2016, genre: 'Мюзикл · Романтика', desc: 'О мечтах и выборе между любовью и судьбой.', questions: ['Какой твой самый смелый сон?', 'Что ты бы выбрал — мечту или меня?', 'Какую музыку ты слушаешь, когда думаешь обо мне?'] },
  { title: 'Начало', year: 2010, genre: 'Sci-Fi · Экшн', desc: 'Можно ли добраться до самого глубокого сна?', questions: ['Что ты видишь в своих лучших снах?', 'Какая идея сидит в тебе глубже всего?', 'Что тебя пробуждает?'] },
  { title: 'Виолетта', year: 2021, genre: 'Мистика · Триллер', desc: 'Темнота внутри нас красивее, чем кажется.', questions: ['Что тёмного есть в тебе, что ты бы показал только мне?', 'Какая твоя тёмная сторона меня удивит?', 'Что тебя пугает в самом себе?'] },
  { title: 'Игра в имитацию', year: 2014, genre: 'Биография · Триллер', desc: 'Иногда самые важные вещи не видны снаружи.', questions: ['Какой твой код, который мало кто разгадал?', 'Что в тебе скрыто и чего не видно сразу?', 'Какой твой главный секрет?'] },
  { title: 'Малхолланд Драйв', year: 2001, genre: 'Мистика · Нуар', desc: 'Город, где сны неотличимы от реальности.', questions: ['Где заканчивается твоя фантазия и начинается реальность?', 'Что самое странное, что ты видел во сне обо мне?', 'Какой сон ты не хочешь забывать?'] },
  { title: 'Зеркало', year: 1975, genre: 'Арт-хаус · Поэзия', desc: 'Тарковский о памяти, времени и любви.', questions: ['Какой образ из детства ты хочешь мне показать?', 'Что в твоей памяти выглядит как стихотворение?', 'Опиши самый красивый день своей жизни.'] },
  { title: 'Форма воды', year: 2017, genre: 'Фэнтези · Романтика', desc: 'Любовь не знает форм и границ.', questions: ['Что в нас самое необычное?', 'Если бы мы были из разных миров — ты бы всё равно нашёл меня?', 'Что тебя во мне удивляет?'] },
  { title: 'Тёмный рыцарь', year: 2008, genre: 'Боевик · Философия', desc: 'Хаос против принципов. Кто победит?', questions: ['Есть ли у тебя принцип, который ты не нарушишь никогда?', 'Какой твой "тёмный рыцарь" — что защищаешь?', 'Что делает тебя сильным, когда всё рушится?'] },
  { title: 'Жизнь других', year: 2006, genre: 'Драма · Триллер', desc: 'Наблюдать за чужой жизнью и измениться.', questions: ['Что ты наблюдаешь в людях вокруг себя?', 'Что бы ты хотел, чтобы я знал о тебе?', 'Что в тебе изменилось за этот год?'] },
  { title: 'Матрица', year: 1999, genre: 'Sci-Fi · Философия', desc: 'Синяя или красная таблетка?', questions: ['Что ты выбрал бы — комфортную иллюзию или горькую правду?', 'Какую "матрицу" ты разрушил в своей жизни?', 'Что изменилось, когда ты проснулся?'] },
];

// ─── 3D DICE ──────────────────────────────────────────────────────────────────
class DiceRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.size = 90;
    this.canvas.width  = this.size * 2;
    this.canvas.height = this.size * 2;
    this.rotX = 0.3;
    this.rotY = 0.3;
    this.rotZ = 0;
    this.spinning = false;
    this.spinVX = 0;
    this.spinVY = 0;
    this.value = 1;
    this.frame = 0;
    this.animate();
  }

  spin(onDone) {
    this.spinning = true;
    this.spinVX = 0.12 + Math.random() * 0.12;
    this.spinVY = 0.15 + Math.random() * 0.12;
    const duration = 2000 + Math.random() * 1000;
    setTimeout(() => {
      this.spinning = false;
      this.value = Math.floor(Math.random() * FILMS.length);
      if (onDone) onDone(this.value);
    }, duration);
  }

  draw() {
    const ctx = this.ctx;
    const cx = this.size, cy = this.size;
    const s  = this.size * 0.8;
    ctx.clearRect(0, 0, this.size * 2, this.size * 2);

    if (this.spinning) {
      this.rotX += this.spinVX;
      this.rotY += this.spinVY;
      this.spinVX *= 0.995;
      this.spinVY *= 0.995;
    } else {
      this.rotY += 0.008;
    }

    // Simple isometric cube projection
    const faces = this.getCubeFaces(cx, cy, s);
    faces.sort((a, b) => a.z - b.z);
    faces.forEach(f => {
      ctx.beginPath();
      ctx.moveTo(f.pts[0][0], f.pts[0][1]);
      f.pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      const grad = ctx.createLinearGradient(f.pts[0][0], f.pts[0][1], f.pts[2][0], f.pts[2][1]);
      grad.addColorStop(0, f.colorA);
      grad.addColorStop(1, f.colorB);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(168,85,247,0.6)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(168,85,247,0.5)';
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Dots / symbols
      ctx.fillStyle = f.dotColor;
      ctx.font = `bold ${14}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cc = f.pts.reduce((a, p) => [a[0]+p[0], a[1]+p[1]], [0,0]);
      ctx.fillText(f.symbol, cc[0]/4, cc[1]/4);
    });
  }

  rotate3D(x, y, z) {
    const cx = Math.cos(this.rotX), sx = Math.sin(this.rotX);
    const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY);
    let [rx, ry, rz] = [x, y * cx - z * sx, y * sx + z * cx];
    [rx, ry, rz] = [rx * cy + rz * sy, ry, -rx * sy + rz * cy];
    return [rx, ry, rz];
  }

  project(x, y, z, cx, cy) {
    const fov = 400;
    const d   = fov / (fov + z + this.size * 1.5);
    return [cx + x * d, cy + y * d, z];
  }

  getCubeFaces(cx, cy, s) {
    const h = s * 0.5;
    const verts = [
      [-h,-h,-h],[h,-h,-h],[h,h,-h],[-h,h,-h],
      [-h,-h, h],[h,-h, h],[h,h, h],[-h,h, h],
    ].map(([x,y,z]) => {
      const [rx,ry,rz] = this.rotate3D(x,y,z);
      return this.project(rx, ry, rz, cx, cy);
    });

    const symbols = ['🌑','✶','ᛟ','ᚨ','ᛉ','🔮'];
    const faceDefs = [
      { idxs:[0,1,2,3], colorA:'rgba(40,20,80,0.9)',  colorB:'rgba(80,40,140,0.9)', dotColor:'rgba(192,132,252,1)' },
      { idxs:[4,5,6,7], colorA:'rgba(30,15,60,0.9)',  colorB:'rgba(60,30,110,0.9)', dotColor:'rgba(192,132,252,1)' },
      { idxs:[0,1,5,4], colorA:'rgba(20,10,50,0.9)',  colorB:'rgba(50,25,100,0.9)', dotColor:'rgba(192,132,252,1)' },
      { idxs:[2,3,7,6], colorA:'rgba(50,25,100,0.9)', colorB:'rgba(90,50,160,0.9)', dotColor:'rgba(192,132,252,1)' },
      { idxs:[0,3,7,4], colorA:'rgba(35,17,70,0.9)',  colorB:'rgba(70,35,120,0.9)', dotColor:'rgba(192,132,252,1)' },
      { idxs:[1,2,6,5], colorA:'rgba(45,22,90,0.9)',  colorB:'rgba(85,45,150,0.9)', dotColor:'rgba(192,132,252,1)' },
    ];
    return faceDefs.map((f, i) => {
      const pts = f.idxs.map(idx => [verts[idx][0], verts[idx][1]]);
      const z   = f.idxs.reduce((s, idx) => s + verts[idx][2], 0) / 4;
      return { ...f, pts, z, symbol: symbols[i] };
    });
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// ─── RUNE CIRCLE ──────────────────────────────────────────────────────────────
class RuneCircle {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.W = 300; this.H = 300;
    this.canvas.width  = this.W;
    this.canvas.height = this.H;
    this.cx = this.W / 2; this.cy = this.H / 2;
    this.time = 0;
    this.cracking = false;
    this.crackProgress = 0;
    this.cracks = [];
    this.particles = [];
    this.animate();
  }

  startCrack(onComplete) {
    this.cracking = true;
    this.crackProgress = 0;
    this.cracks = this.buildCracks();
    setTimeout(() => {
      this.spawnBreakParticles();
      if (onComplete) onComplete();
    }, 1500);
  }

  buildCracks() {
    const cracks = [];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const len   = 50 + Math.random() * 80;
      cracks.push({
        x1: this.cx, y1: this.cy,
        x2: this.cx + Math.cos(angle) * len,
        y2: this.cy + Math.sin(angle) * len,
        progress: 0,
        speed: 0.02 + Math.random() * 0.04,
        alpha: 0.8 + Math.random() * 0.2,
      });
    }
    return cracks;
  }

  spawnBreakParticles() {
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: this.cx + (Math.random() - 0.5) * 100,
        y: this.cy + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        r: Math.random() * 4 + 1,
        alpha: 1,
        color: Math.random() > 0.5 ? '#f87171' : '#c084fc',
      });
    }
  }

  draw() {
    const ctx = this.ctx;
    this.time += 0.016;
    ctx.clearRect(0, 0, this.W, this.H);

    const t = this.time;
    const cx = this.cx, cy = this.cy;

    if (this.cracking && this.crackProgress < 1) {
      this.crackProgress += 0.008;
    }

    // Outer glow
    const outerGlow = ctx.createRadialGradient(cx, cy, 80, cx, cy, 150);
    outerGlow.addColorStop(0, 'rgba(239,68,68,0.08)');
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.fillRect(0, 0, this.W, this.H);

    // Outer ring — 3 rotating circles
    [120, 108, 96].forEach((r, i) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1));
      ctx.strokeStyle = `rgba(239,68,68,${0.4 - i * 0.1})`;
      ctx.lineWidth = 1;
      ctx.setLineDash(i === 1 ? [4, 6] : []);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });

    // Rune marks on outer ring
    const RUNES = ['ᚨ','ᛟ','ᛉ','ᚱ','ᚷ','ᛗ','ᛏ','ᚦ','ᚾ','ᛁ','ᛊ','ᛒ'];
    RUNES.forEach((r, i) => {
      const angle = (i / 12) * Math.PI * 2 + t * 0.2;
      const rx = cx + Math.cos(angle) * 110;
      const ry = cy + Math.sin(angle) * 110;
      const alpha = 0.4 + 0.3 * Math.sin(t * 2 + i);
      ctx.fillStyle = `rgba(239,68,68,${alpha})`;
      ctx.font = '11px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(r, rx, ry);
    });

    // Inner pentagram
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.15);
    ctx.strokeStyle = 'rgba(239,68,68,0.5)';
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(239,68,68,0.6)';
    const pr = 65;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 / 5) * Math.PI * 2 - Math.PI / 2;
      const b = ((i * 4 + 4) / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.moveTo(Math.cos(a) * pr, Math.sin(a) * pr);
      ctx.lineTo(Math.cos(b) * pr, Math.sin(b) * pr);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(239,68,68,0.6)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(239,68,68,0.5)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center eye / symbol
    const eyeAlpha = 0.5 + 0.3 * Math.sin(t * 1.5);
    ctx.fillStyle = `rgba(239,68,68,${eyeAlpha})`;
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔐', cx, cy);

    // Cracks
    if (this.cracking) {
      this.cracks.forEach(c => {
        c.progress = Math.min(1, c.progress + c.speed);
        const ex = c.x1 + (c.x2 - c.x1) * c.progress;
        const ey = c.y1 + (c.y2 - c.y1) * c.progress;
        ctx.beginPath();
        ctx.moveTo(c.x1, c.y1);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(248,113,113,${c.alpha * this.crackProgress})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6; ctx.shadowColor = '#f87171';
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    // Break particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `,${p.alpha})`).replace('rgba', 'rgba').replace('#f87171', `rgba(248,113,113,${p.alpha})`).replace('#c084fc', `rgba(192,132,252,${p.alpha})`);
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.1;
      p.alpha -= 0.02;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

window.FILMS        = FILMS;
window.DiceRenderer = DiceRenderer;
window.RuneCircle   = RuneCircle;
