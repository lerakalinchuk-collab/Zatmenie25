/**
 * ЗАТМЕНИЕ 25 — Map Engine
 * Neon cyberpunk district map with zones
 */

class DistrictMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.W = Math.min(800, window.innerWidth - 40);
    this.H = Math.round(this.W * 0.7);
    this.canvas.width  = this.W;
    this.canvas.height = this.H;
    this.scale = this.W / 800;

    this.time = 0;
    this.hoveredZone = -1;
    this.selectedZone = -1;
    this.cameraX = 0;
    this.cameraY = 0;
    this.zoom = 1;

    this.zones = this.buildZones();
    this.roads = this.buildRoads();
    this.particles = this.buildParticles();

    this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    this.canvas.addEventListener('click', e => this.onClick(e));
    this.canvas.addEventListener('touchstart', e => this.onTouch(e));

    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.W = Math.min(800, window.innerWidth - 40);
    this.H = Math.round(this.W * 0.7);
    this.canvas.width  = this.W;
    this.canvas.height = this.H;
    this.scale = this.W / 800;
  }

  buildZones() {
    const s = this.scale;
    const unlocked = window.gameState.unlockedZones || [0];
    return [
      {
        id: 0, name: 'ЦЕНТР', subtitle: 'Точка отсчёта',
        x: 380*s, y: 280*s, r: 55*s,
        color: '#7c3aed', glow: 'rgba(124,58,237,',
        missions: 8, icon: '🌑',
        desc: 'Начало пути. Здесь всё началось.',
      },
      {
        id: 1, name: 'КВАРТАЛ ТУМАНОВ', subtitle: 'Западный район',
        x: 180*s, y: 200*s, r: 45*s,
        color: '#2563eb', glow: 'rgba(37,99,235,',
        missions: 6, icon: '🌫️',
        desc: 'Старые фонари и вечный туман.',
      },
      {
        id: 2, name: 'НЕОНОВЫЙ РЯД', subtitle: 'Восточный квартал',
        x: 600*s, y: 200*s, r: 45*s,
        color: '#0891b2', glow: 'rgba(8,145,178,',
        missions: 6, icon: '💠',
        desc: 'Неон и дождь на стекле.',
      },
      {
        id: 3, name: 'СТАРЫЙ ПОРТ', subtitle: 'Южная набережная',
        x: 240*s, y: 420*s, r: 42*s,
        color: '#d97706', glow: 'rgba(217,119,6,',
        missions: 5, icon: '⚓',
        desc: 'Запах соли и звёзды в воде.',
      },
      {
        id: 4, name: 'БАШНЯ МАСТЕРОВ', subtitle: 'Северная высота',
        x: 540*s, y: 420*s, r: 42*s,
        color: '#be185d', glow: 'rgba(190,24,93,',
        missions: 5, icon: '🗼',
        desc: 'Отсюда виден весь город.',
      },
      {
        id: 5, name: 'ТЁМНЫЙ РЫНОК', subtitle: 'Скрытая зона',
        x: 680*s, y: 360*s, r: 35*s,
        color: '#991b1b', glow: 'rgba(153,27,27,',
        missions: 4, icon: '🔮',
        desc: 'Место тайных встреч.',
      },
      {
        id: 6, name: 'ЗОНА ТИШИНЫ', subtitle: 'Далёкий север',
        x: 100*s, y: 380*s, r: 35*s,
        color: '#065f46', glow: 'rgba(6,95,70,',
        missions: 4, icon: '🌿',
        desc: 'Тишина и живой огонь.',
      },
    ].map((z, i) => ({
      ...z,
      unlocked: unlocked.includes(i),
    }));
  }

  buildRoads() {
    const s = this.scale;
    return [
      { x1:380*s, y1:280*s, x2:180*s, y2:200*s, color:'#2563eb' },
      { x1:380*s, y1:280*s, x2:600*s, y2:200*s, color:'#0891b2' },
      { x1:380*s, y1:280*s, x2:240*s, y2:420*s, color:'#d97706' },
      { x1:380*s, y1:280*s, x2:540*s, y2:420*s, color:'#be185d' },
      { x1:600*s, y1:200*s, x2:680*s, y2:360*s, color:'#991b1b' },
      { x1:180*s, y1:200*s, x2:100*s, y2:380*s, color:'#065f46' },
      { x1:240*s, y1:420*s, x2:540*s, y2:420*s, color:'#7c3aed' },
    ];
  }

  buildParticles() {
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hue: Math.random() * 60 + 240,
      });
    }
    return particles;
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width  / rect.width),
      y: (e.clientY - rect.top ) * (this.canvas.height / rect.height),
    };
  }

  onMouseMove(e) {
    const { x, y } = this.getMousePos(e);
    this.hoveredZone = -1;
    this.zones.forEach((z, i) => {
      const dx = x - z.x, dy = y - z.y;
      if (Math.sqrt(dx*dx + dy*dy) < z.r) this.hoveredZone = i;
    });
    this.canvas.style.cursor = this.hoveredZone >= 0 ? 'pointer' : 'crosshair';
  }

  onClick(e) {
    const { x, y } = this.getMousePos(e);
    this.zones.forEach(z => {
      const dx = x - z.x, dy = y - z.y;
      if (Math.sqrt(dx*dx + dy*dy) < z.r) {
        this.selectedZone = z.id;
        if (z.unlocked) {
          window.onZoneSelected && window.onZoneSelected(z);
        } else {
          window.onZoneLocked && window.onZoneLocked(z);
        }
      }
    });
  }

  onTouch(e) {
    e.preventDefault();
    if (e.touches.length) {
      const touch = e.touches[0];
      this.onClick({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }

  draw() {
    const ctx = this.ctx;
    this.time += 0.016;

    // Background
    ctx.fillStyle = '#020814';
    ctx.fillRect(0, 0, this.W, this.H);

    // Grid
    ctx.strokeStyle = 'rgba(96,165,250,0.05)';
    ctx.lineWidth = 1;
    const gs = 40 * this.scale;
    for (let x = 0; x < this.W; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.H); ctx.stroke();
    }
    for (let y = 0; y < this.H; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.W, y); ctx.stroke();
    }

    // Floating particles
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},60%,60%,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = this.W;
      if (p.x > this.W) p.x = 0;
      if (p.y < 0) p.y = this.H;
      if (p.y > this.H) p.y = 0;
    });

    // Roads
    this.roads.forEach(r => {
      // Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = r.color;
      ctx.beginPath();
      ctx.moveTo(r.x1, r.y1); ctx.lineTo(r.x2, r.y2);
      ctx.strokeStyle = r.color + '60';
      ctx.lineWidth = 8 * this.scale;
      ctx.stroke();
      // Center line
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(r.x1, r.y1); ctx.lineTo(r.x2, r.y2);
      ctx.strokeStyle = r.color + 'cc';
      ctx.lineWidth = 2 * this.scale;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving light on road
      const t = (this.time * 0.4 + r.x1 * 0.001) % 1;
      const lx = r.x1 + (r.x2 - r.x1) * t;
      const ly = r.y1 + (r.y2 - r.y1) * t;
      ctx.beginPath();
      ctx.arc(lx, ly, 3 * this.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Zones
    this.zones.forEach((z, i) => {
      const hovered  = this.hoveredZone === i;
      const selected = this.selectedZone === i;
      const pulse = 0.8 + 0.2 * Math.sin(this.time * 2 + i);
      const r = z.r * (hovered ? 1.12 : 1) * pulse;

      if (!z.unlocked) {
        // Locked zone — dimmed
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.r * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20,10,40,0.7)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(100,80,150,0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Lock icon
        ctx.fillStyle = 'rgba(150,120,200,0.4)';
        ctx.font = `${18 * this.scale}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', z.x, z.y);
        ctx.fillStyle = 'rgba(150,120,200,0.3)';
        ctx.font = `bold ${8 * this.scale}px Cinzel,serif`;
        ctx.fillText(z.name, z.x, z.y + 28 * this.scale);
        return;
      }

      // Glow rings
      ctx.shadowBlur = hovered ? 40 : 20;
      ctx.shadowColor = z.color;

      // Outer ring
      ctx.beginPath();
      ctx.arc(z.x, z.y, r * 1.3, 0, Math.PI * 2);
      ctx.strokeStyle = z.glow + (0.15 + 0.05 * pulse) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Main circle gradient
      const grad = ctx.createRadialGradient(z.x - r * 0.2, z.y - r * 0.2, r * 0.1, z.x, z.y, r);
      grad.addColorStop(0, z.glow + '0.4)');
      grad.addColorStop(0.6, z.glow + '0.25)');
      grad.addColorStop(1, z.glow + '0.05)');
      ctx.beginPath();
      ctx.arc(z.x, z.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Border
      ctx.strokeStyle = hovered ? z.color : z.glow + '0.7)';
      ctx.lineWidth = (hovered ? 2.5 : 1.5) * this.scale;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Rotating rune ring
      ctx.save();
      ctx.translate(z.x, z.y);
      ctx.rotate(this.time * 0.3 + i);
      ctx.strokeStyle = z.glow + '0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3 * this.scale, 6 * this.scale]);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Icon
      ctx.font = `${22 * this.scale}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(z.icon, z.x, z.y - 6 * this.scale);

      // Name
      ctx.fillStyle = hovered ? '#ffffff' : 'rgba(220,210,255,0.85)';
      ctx.font = `bold ${8 * this.scale}px Cinzel,serif`;
      ctx.fillText(z.name, z.x, z.y + 22 * this.scale);
      ctx.fillStyle = 'rgba(200,180,255,0.4)';
      ctx.font = `${6.5 * this.scale}px serif`;
      ctx.fillText(z.subtitle, z.x, z.y + 31 * this.scale);
    });

    // Tooltip
    if (this.hoveredZone >= 0 && this.zones[this.hoveredZone].unlocked) {
      const z = this.zones[this.hoveredZone];
      const tw = 180 * this.scale;
      const th = 60 * this.scale;
      let tx = z.x + z.r + 12 * this.scale;
      let ty = z.y - th / 2;
      if (tx + tw > this.W) tx = z.x - z.r - tw - 12 * this.scale;
      ty = Math.max(10, Math.min(this.H - th - 10, ty));
      ctx.fillStyle = 'rgba(5,2,20,0.92)';
      ctx.strokeStyle = z.color + '80';
      ctx.lineWidth = 1;
      this.roundRect(ctx, tx, ty, tw, th, 8 * this.scale);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(220,210,255,0.9)';
      ctx.font = `bold ${8 * this.scale}px Cinzel,serif`;
      ctx.textAlign = 'left';
      ctx.fillText(z.name, tx + 10 * this.scale, ty + 18 * this.scale);
      ctx.fillStyle = 'rgba(200,180,255,0.6)';
      ctx.font = `${7 * this.scale}px serif`;
      ctx.fillText(z.desc, tx + 10 * this.scale, ty + 30 * this.scale);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`⭐ ${z.missions} миссий`, tx + 10 * this.scale, ty + 44 * this.scale);
    }
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// ─── WALK SCENE ───────────────────────────────────────────────────────────────
class WalkScene {
  constructor(canvasId, zone) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.zone = zone || { name: 'ЦЕНТР', color: '#7c3aed' };
    this.time = 0;
    this.cameraZ = 0;
    this.lamps    = this.buildLamps();
    this.walkers  = this.buildWalkers();
    this.clickables = this.buildClickables();
    this.fogLayers = this.buildFog();

    this.canvas.addEventListener('click', e => this.handleClick(e));
    this.animate();
  }

  buildLamps() {
    const lamps = [];
    for (let i = 0; i < 8; i++) {
      lamps.push({
        x: 100 + i * 120,
        y: this.H * 0.55,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.08 + 0.02,
        on: Math.random() > 0.15,
      });
    }
    return lamps;
  }

  buildWalkers() {
    const walkers = [];
    for (let i = 0; i < 5; i++) {
      walkers.push({
        x: Math.random() * this.W,
        y: this.H * 0.62 + Math.random() * 40,
        speed: (Math.random() * 0.6 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        height: 40 + Math.random() * 20,
        alpha: 0.3 + Math.random() * 0.3,
      });
    }
    return walkers;
  }

  buildClickables() {
    return [
      { x: 180, y: this.H * 0.58, label: '🗑 Мусорный бак', mission: { text: 'Опиши запахи вокруг тебя прямо сейчас.', stars: 2, icon: '👃' } },
      { x: 350, y: this.H * 0.56, label: '📮 Почтовый ящик', mission: { text: 'Напиши мне 3 слова о своём дне. Просто 3 слова.', stars: 2, icon: '✉️' } },
      { x: 550, y: this.H * 0.54, label: '🏠 Светящееся окно', mission: { text: 'Пришли фото того, что видишь из своего окна.', stars: 3, icon: '📸' } },
      { x: 720, y: this.H * 0.57, label: '🕯 Свеча в витрине', mission: { text: 'Зажги свечу или включи тихий свет. Посиди 2 минуты.', stars: 3, icon: '🕯️' } },
    ];
  }

  buildFog() {
    const layers = [];
    for (let i = 0; i < 8; i++) {
      layers.push({
        x: Math.random() * this.W,
        y: this.H * 0.6 + Math.random() * 80,
        r: 100 + Math.random() * 150,
        speed: (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        alpha: 0.04 + Math.random() * 0.04,
      });
    }
    return layers;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    this.clickables.forEach(c => {
      const dx = mx - c.x, dy = my - c.y;
      if (Math.sqrt(dx*dx + dy*dy) < 30) {
        window.showWalkMission && window.showWalkMission(c.mission);
      }
    });
  }

  draw() {
    const ctx = this.ctx;
    this.time += 0.016;
    this.cameraZ += 0.3;

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.H);
    skyGrad.addColorStop(0, '#000008');
    skyGrad.addColorStop(0.6, '#050215');
    skyGrad.addColorStop(1, '#0a0520');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.W, this.H);

    // Stars in sky
    for (let i = 0; i < 80; i++) {
      const sx = (i * 137.5) % this.W;
      const sy = (i * 73.1) % (this.H * 0.55);
      const sa = 0.3 + 0.4 * Math.sin(this.time * 1.5 + i);
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,210,255,${sa})`;
      ctx.fill();
    }

    // Moon
    ctx.beginPath();
    ctx.arc(this.W * 0.75, this.H * 0.18, 35, 0, Math.PI * 2);
    const moonGrad = ctx.createRadialGradient(this.W*0.73, this.H*0.16, 5, this.W*0.75, this.H*0.18, 35);
    moonGrad.addColorStop(0, 'rgba(200,180,255,0.9)');
    moonGrad.addColorStop(0.5, 'rgba(150,100,220,0.6)');
    moonGrad.addColorStop(1, 'rgba(80,40,160,0.1)');
    ctx.fillStyle = moonGrad;
    ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(168,85,247,0.7)';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Buildings
    this.drawBuildings(ctx);

    // Ground
    const groundGrad = ctx.createLinearGradient(0, this.H*0.63, 0, this.H);
    groundGrad.addColorStop(0, '#08051a');
    groundGrad.addColorStop(1, '#040210');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, this.H * 0.63, this.W, this.H * 0.37);

    // Road
    ctx.fillStyle = '#060420';
    ctx.fillRect(0, this.H * 0.67, this.W, this.H * 0.08);
    // Road lines
    for (let i = 0; i < 10; i++) {
      const lx = ((i * 120 - this.cameraZ * 0.5) % (this.W + 120)) - 60;
      ctx.fillStyle = 'rgba(168,85,247,0.3)';
      ctx.fillRect(lx, this.H * 0.707, 60, 2);
    }

    // Fog on ground
    this.fogLayers.forEach(f => {
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      g.addColorStop(0, `rgba(80,50,180,${f.alpha})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      f.x += f.speed;
      if (f.x > this.W + f.r) f.x = -f.r;
      if (f.x < -f.r) f.x = this.W + f.r;
    });

    // Lamp posts
    this.lamps.forEach(l => {
      l.flicker += l.flickerSpeed;
      const isOn = l.on && (Math.sin(l.flicker) > -0.9 || Math.random() > 0.01);
      // Pole
      ctx.fillStyle = 'rgba(100,80,140,0.8)';
      ctx.fillRect(l.x - 2, this.H * 0.48, 4, this.H * 0.2);
      // Light
      if (isOn) {
        const brightness = 0.5 + 0.3 * Math.sin(l.flicker * 8);
        ctx.beginPath();
        ctx.arc(l.x, l.y - this.H * 0.14, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,180,${brightness})`;
        ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(255,200,80,0.8)';
        ctx.fill();
        // Cone of light
        const cone = ctx.createRadialGradient(l.x, l.y - this.H * 0.14, 0, l.x, l.y - this.H * 0.14, 100);
        cone.addColorStop(0, `rgba(255,200,80,${0.08 * brightness})`);
        cone.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(l.x, l.y - this.H * 0.14);
        ctx.lineTo(l.x - 50, l.y + 40);
        ctx.lineTo(l.x + 50, l.y + 40);
        ctx.closePath();
        ctx.fillStyle = cone; ctx.shadowBlur = 0; ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

    // Walkers (silhouettes)
    this.walkers.forEach(w => {
      ctx.fillStyle = `rgba(20,10,40,${w.alpha})`;
      // Body
      ctx.fillRect(w.x - 6, w.y - w.height, 12, w.height * 0.65);
      // Head
      ctx.beginPath();
      ctx.arc(w.x, w.y - w.height * 0.85, 7, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      const legPhase = this.time * 3 + w.x * 0.1;
      ctx.fillRect(w.x - 7, w.y - w.height * 0.35, 6, w.height * 0.35 + Math.sin(legPhase) * 5);
      ctx.fillRect(w.x + 1, w.y - w.height * 0.35, 6, w.height * 0.35 + Math.sin(legPhase + Math.PI) * 5);
      w.x += w.speed;
      if (w.x > this.W + 30) w.x = -30;
      if (w.x < -30) w.x = this.W + 30;
    });

    // Clickable objects
    this.clickables.forEach(c => {
      const pulse = 0.7 + 0.3 * Math.sin(this.time * 2 + c.x * 0.1);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168,85,247,${pulse * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.mission.icon, c.x, c.y);
      // Label on hover (just subtle pulse)
      ctx.fillStyle = `rgba(200,180,255,${pulse * 0.5})`;
      ctx.font = `${8 * this.W / 800}px Cinzel,serif`;
      ctx.fillText(c.label, c.x, c.y - 26);
    });

    // Salt protection circle in center
    this.drawSaltCircle(ctx, this.W * 0.5, this.H * 0.7, 60);
  }

  drawBuildings(ctx) {
    const buildings = [
      { x: 0,   w: 100, h: 180, color: '#0a0520' },
      { x: 80,  w: 80,  h: 240, color: '#080418' },
      { x: 140, w: 120, h: 160, color: '#0c0625' },
      { x: 240, w: 90,  h: 200, color: '#0a0520' },
      { x: 310, w: 110, h: 140, color: '#060315' },
      { x: 400, w: 130, h: 260, color: '#0e0730' },
      { x: 510, w: 80,  h: 190, color: '#0a0520' },
      { x: 570, w: 100, h: 150, color: '#080418' },
      { x: 650, w: 120, h: 220, color: '#0c0625' },
      { x: 750, w: 90,  h: 170, color: '#0a0520' },
    ];
    const groundY = this.H * 0.63;
    buildings.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
      // Neon window accents
      for (let wy = groundY - b.h + 20; wy < groundY - 20; wy += 25) {
        for (let wx = b.x + 10; wx < b.x + b.w - 10; wx += 18) {
          if (Math.random() > 0.6) {
            const alpha = 0.3 + 0.4 * Math.sin(this.time * 0.5 + wx * 0.3 + wy * 0.2);
            const hue = 220 + Math.random() * 80;
            ctx.fillStyle = `hsla(${hue},70%,60%,${alpha})`;
            ctx.fillRect(wx, wy, 8, 10);
          }
        }
      }
      // Neon sign on top
      ctx.strokeStyle = `hsl(${260 + b.x % 80},80%,60%)`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 6;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.beginPath();
      ctx.moveTo(b.x + 10, groundY - b.h + 8);
      ctx.lineTo(b.x + b.w - 10, groundY - b.h + 8);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  drawSaltCircle(ctx, cx, cy, r) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.time * 0.2);
    // Outer ring
    ctx.strokeStyle = 'rgba(168,85,247,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    // Rune marks
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const mx = Math.cos(angle) * r;
      const my = Math.sin(angle) * r;
      ctx.fillStyle = 'rgba(168,85,247,0.6)';
      ctx.font = '10px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const runes = ['ᚨ','ᛟ','ᛉ','ᚱ','ᚷ','ᛗ','ᛏ','ᚦ'];
      ctx.fillText(runes[i], mx, my);
    }
    // Inner star
    ctx.strokeStyle = 'rgba(192,132,252,0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a1 = (i * 4 / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i * 4 + 4) / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.moveTo(Math.cos(a1) * r * 0.5, Math.sin(a1) * r * 0.5);
      ctx.lineTo(Math.cos(a2) * r * 0.5, Math.sin(a2) * r * 0.5);
    }
    ctx.stroke();
    ctx.restore();
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

window.DistrictMap  = DistrictMap;
window.WalkScene    = WalkScene;
