/**
 * ЗАТМЕНИЕ 25 — Core Engine
 * Stars · Fog · Eclipse · Particles · Fire · State
 */

// ─── GAME STATE ──────────────────────────────────────────────────────────────
const STATE_KEY = 'zatmenie25_state';

const defaultState = {
  stars: 0,
  level: 1,
  energy: 5,
  phase: 1,           // moon phase 1-8
  daysActive: 0,
  lastActiveDate: null,
  completedMissions: [],
  unlockedZones: [0],  // zone indices unlocked
  fireIntensity: 10,   // 0-100
  portalUnlocked: false,
  filmHistory: [],
  lastSyncTime: Date.now(),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch(e) {}
  return { ...defaultState };
}

function saveState(st) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(st)); } catch(e) {}
}

window.gameState = loadState();

// ─── DAILY RESET ─────────────────────────────────────────────────────────────
function checkDailyReset() {
  const today = new Date().toDateString();
  if (window.gameState.lastActiveDate !== today) {
    window.gameState.lastActiveDate = today;
    window.gameState.daysActive += 1;
    // advance moon phase
    window.gameState.phase = ((window.gameState.phase) % 8) + 1;
    saveState(window.gameState);
  }
}
checkDailyReset();

// ─── STAR CANVAS ─────────────────────────────────────────────────────────────
function initStars(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  const STAR_COUNT = 280;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      // parallax offset
      px: (Math.random() - 0.5) * 0.04,
      py: (Math.random() - 0.5) * 0.02,
    });
  }

  // Shooting stars
  const shootingStars = [];
  let shootTimer = 0;

  function spawnShooting() {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      vx: (Math.random() * 6 + 4),
      vy: (Math.random() * 3 + 2),
      len: Math.random() * 80 + 60,
      alpha: 1,
      life: 1,
    });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Twinkling stars
    stars.forEach(s => {
      s.pulse += s.speed;
      const a = s.alpha * (0.6 + 0.4 * Math.sin(s.pulse));
      ctx.beginPath();
      ctx.arc(s.x + mouseX * s.px * 30, s.y + mouseY * s.py * 30, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 210, 255, ${a})`;
      ctx.fill();
    });

    // Shooting stars
    shootTimer++;
    if (shootTimer > 200 + Math.random() * 300) {
      spawnShooting();
      shootTimer = 0;
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
      grad.addColorStop(0, `rgba(200, 180, 255, ${ss.alpha})`);
      grad.addColorStop(1, 'rgba(200, 180, 255, 0)');
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.alpha -= 0.02;
      if (ss.alpha <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
        shootingStars.splice(i, 1);
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─── FOG CANVAS ──────────────────────────────────────────────────────────────
function initFog(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 120 + 60,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.06 + 0.02,
      hue: Math.random() * 40 + 240, // blue-purple range
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `hsla(${p.hue}, 70%, 40%, ${p.alpha})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -p.r) p.x = canvas.width + p.r;
      if (p.x > canvas.width + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = canvas.height + p.r;
      if (p.y > canvas.height + p.r) p.y = -p.r;
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─── FIRE CANVAS ─────────────────────────────────────────────────────────────
function initFire(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 200, H = 120;
  canvas.width = W; canvas.height = H;

  const grid = new Uint8Array(W * H);
  const palette = [];
  for (let i = 0; i < 256; i++) {
    const r = Math.min(255, i * 3);
    const g = Math.max(0, Math.min(255, i * 2 - 100));
    const b = Math.max(0, Math.min(255, i - 200));
    palette.push([r, g, b]);
  }

  let intensity = window.gameState.fireIntensity || 30;

  function updateFire() {
    // Seed bottom row
    for (let x = 0; x < W; x++) {
      grid[(H - 1) * W + x] = Math.random() * 255 < intensity * 2.5 ? 255 : 0;
    }
    // Propagate upward
    for (let y = 0; y < H - 1; y++) {
      for (let x = 0; x < W; x++) {
        const below = grid[(y + 1) * W + x];
        const belowL= grid[(y + 1) * W + Math.max(0, x - 1)];
        const belowR= grid[(y + 1) * W + Math.min(W - 1, x + 1)];
        const spread= (below + belowL + belowR) / 3;
        grid[y * W + x] = Math.max(0, spread - Math.random() * 8);
      }
    }
  }

  function renderFire() {
    const img = ctx.createImageData(W, H);
    for (let i = 0; i < W * H; i++) {
      const v = grid[i];
      const [r, g, b] = palette[Math.min(255, v * 2)];
      img.data[i * 4    ] = r;
      img.data[i * 4 + 1] = g;
      img.data[i * 4 + 2] = b;
      img.data[i * 4 + 3] = v > 0 ? 200 : 0;
    }
    ctx.putImageData(img, 0, 0);
  }

  function loop() {
    updateFire();
    renderFire();
    intensity = window.gameState.fireIntensity || 30;
    requestAnimationFrame(loop);
  }
  loop();
}

// ─── ECLIPSE ANIMATION ───────────────────────────────────────────────────────
function playEclipseTransition(onComplete) {
  const el = document.getElementById('eclipseTransition');
  if (!el) { if (onComplete) onComplete(); return; }
  el.style.opacity = '0';
  el.style.transition = 'none';
  // Fade to black
  setTimeout(() => {
    el.style.transition = 'opacity 0.8s ease';
    el.style.opacity = '1';
    setTimeout(() => {
      if (onComplete) onComplete();
      el.style.opacity = '0';
    }, 900);
  }, 10);
}

// ─── STAR COUNTER UPDATE ─────────────────────────────────────────────────────
function updateStarDisplay() {
  const els = document.querySelectorAll('.star-count-display');
  els.forEach(el => {
    el.textContent = window.gameState.stars;
    el.classList.remove('star-pop');
    void el.offsetWidth;
    el.classList.add('star-pop');
  });
}

function addStars(n, label) {
  window.gameState.stars += n;
  window.gameState.fireIntensity = Math.min(100, window.gameState.fireIntensity + n * 2);
  saveState(window.gameState);
  updateStarDisplay();
  showStarBurst(n, label);
}

function showStarBurst(n, label) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    z-index:9999; font-family:'Cinzel',serif;
    font-size:clamp(1.5rem,4vw,2.5rem);
    color:gold; text-shadow:0 0 20px gold,0 0 40px orange;
    pointer-events:none;
    animation: starBurstAnim 1.5s ease forwards;
    text-align:center;
  `;
  burst.innerHTML = `⭐ +${n}<br><span style="font-size:0.5em;letter-spacing:0.3em;opacity:0.7">${label || 'МИССИЯ ВЫПОЛНЕНА'}</span>`;
  const style = document.createElement('style');
  style.textContent = `@keyframes starBurstAnim {
    0%   { opacity:0; transform:translate(-50%,-50%) scale(0.5); }
    30%  { opacity:1; transform:translate(-50%,-60%) scale(1.1); }
    70%  { opacity:1; transform:translate(-50%,-70%) scale(1); }
    100% { opacity:0; transform:translate(-50%,-90%) scale(0.8); }
  }`;
  document.head.appendChild(style);
  document.body.appendChild(burst);
  setTimeout(() => { burst.remove(); style.remove(); }, 1600);
}

// ─── SPAWN FLOATING PARTICLES ─────────────────────────────────────────────────
function spawnParticles(x, y, count, color) {
  const container = document.getElementById('particleOverlay');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 8 + 3;
    const angle = Math.random() * 360;
    const dist  = Math.random() * 120 + 40;
    const dur   = Math.random() * 1000 + 800;
    p.style.cssText = `
      position:absolute;
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:${color || 'rgba(168,85,247,0.9)'};
      box-shadow:0 0 6px ${color || 'rgba(168,85,247,0.9)'};
      pointer-events:none;
      animation:particleFly${i%3} ${dur}ms ease forwards;
    `;
    const dx = Math.cos(angle * Math.PI / 180) * dist;
    const dy = Math.sin(angle * Math.PI / 180) * dist;
    const keyName = `particleFly${i%3}_${Date.now()}`;
    const style = document.createElement('style');
    style.textContent = `@keyframes particleFly${i%3} {
      0%   { opacity:1; transform:translate(0,0) scale(1); }
      100% { opacity:0; transform:translate(${dx}px,${dy}px) scale(0); }
    }`;
    document.head.appendChild(style);
    container.appendChild(p);
    setTimeout(() => { p.remove(); style.remove(); }, dur + 100);
  }
}

// ─── SYNC TIMER ───────────────────────────────────────────────────────────────
function startSyncTimer() {
  const display = document.getElementById('syncDisplay');
  if (!display) return;
  function update() {
    const now    = new Date();
    const target = new Date();
    // "sync time" = next 21:00 local
    target.setHours(21, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = target - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    display.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

// ─── COMET EVENTS ─────────────────────────────────────────────────────────────
const COMET_EVENTS = [
  { title: '☄️ КОМЕТА!', text: 'Неожиданное задание: опиши 3 вещи, которые делают тебя особенным.' },
  { title: '✨ ЗВЁЗДНЫЙ МОМЕНТ', text: 'Пришли мне голосовое сообщение прямо сейчас. Просто скажи что-нибудь.' },
  { title: '🌙 НОЧНАЯ МИССИЯ', text: 'Посмотри в окно и опиши, что видишь. Мы смотрим на одно небо.' },
  { title: '💫 СЕКРЕТНЫЙ ЗНАК', text: 'Найди что-нибудь красивое вокруг себя и сфотографируй для меня.' },
  { title: '🔮 МИСТИЧЕСКИЙ ЗОВ', text: 'Задание: пришли одно слово, которое описывает твоё настроение сейчас.' },
];

function showCometEvent() {
  const notif = document.getElementById('cometNotification');
  if (!notif) return;
  const evt = COMET_EVENTS[Math.floor(Math.random() * COMET_EVENTS.length)];
  notif.querySelector('.comet-title').textContent = evt.title;
  notif.querySelector('.comet-text').textContent  = evt.text;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 8000);
}

// Random comet every 3-8 minutes
function scheduleCometEvents() {
  const delay = (Math.random() * 5 + 3) * 60 * 1000;
  setTimeout(() => {
    showCometEvent();
    scheduleCometEvents();
  }, delay);
}

// ─── MOON PHASE NAMES ─────────────────────────────────────────────────────────
const MOON_PHASES = [
  { name: 'Новолуние',        symbol: '🌑' },
  { name: 'Молодая луна',     symbol: '🌒' },
  { name: 'Первая четверть',  symbol: '🌓' },
  { name: 'Прибывающая',      symbol: '🌔' },
  { name: 'Полнолуние',       symbol: '🌕' },
  { name: 'Убывающая',        symbol: '🌖' },
  { name: 'Последняя четверть','symbol': '🌗' },
  { name: 'Старая луна',      symbol: '🌘' },
];

function getMoonPhase() {
  return MOON_PHASES[(window.gameState.phase - 1) % 8];
}

// ─── ENERGY EMOJIS ────────────────────────────────────────────────────────────
function getEnergyEmoji(val) {
  if (val <= 2) return '😴';
  if (val <= 4) return '😔';
  if (val <= 6) return '😊';
  if (val <= 8) return '🔥';
  return '⚡';
}

// ─── PROGRESS CALCULATION ────────────────────────────────────────────────────
function getProgress() {
  const total    = 120 * 3; // 4 months × ~3 missions/day
  const done     = window.gameState.completedMissions.length;
  return Math.min(100, Math.round((done / total) * 100));
}

// ─── UTILITY: show/hide page ──────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.app-page').forEach(p => p.style.display = 'none');
  const page = document.getElementById(id);
  if (page) {
    page.style.display = 'block';
    page.classList.add('page-fade');
    setTimeout(() => page.classList.remove('page-fade'), 800);
  }
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
window.Z25 = {
  initStars, initFog, initFire,
  playEclipseTransition,
  updateStarDisplay, addStars, showStarBurst,
  spawnParticles, startSyncTimer,
  showCometEvent, scheduleCometEvents,
  getMoonPhase, getEnergyEmoji, getProgress,
  showPage,
  loadState, saveState,
  MOON_PHASES, COMET_EVENTS,
};
