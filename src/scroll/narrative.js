// M3 滚动叙事：参考《网站主体》§10 的 CSS 变量驱动 + rAF 视频擦洗。
// 只写 CSS 自定义属性与 video.currentTime，不写布局属性（参考 §12 不变量）。
import { gsap } from 'gsap';

const CONFIG = {
  shrink: [0, 0.4],
  dissolveCap: [0.05, 0.34],
  dissolve: [0.45, 0.7],
  revealVh: 80,
  brandEndPx: 120,
  brandMaxScale: 0.51,
  lerp: 0.08,
  epsilon: 0.01,
  s2Words: [0.02, 0.26],
  s2Exit: [0.02, 0.32],
  s3Words: [0.55, 0.88],
  cardK: 0.26,
  titleHysteresis: 0.01
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const norm = (v, [a, b]) => clamp01((v - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const root = document.documentElement;
const hero = document.querySelector('[data-hero]');
const revealVideo = document.querySelector('[data-reveal]');
const revealBox = document.querySelector('[data-reveal-box]');
const brand = document.querySelector('[data-brand]');
const station = document.querySelector('[data-stage]');

let navApiHook = null;
let activeNav = -1;
const NAV_TARGETS = ['#top', '#about', '#projects', '#contact'];

let span = 1;
let span2 = 1;
let span3 = 1;
let revealStart = 0.68;
let titleAltAt = 0.8;
let titleCrewAt = 0.42;
let titleState = 'main';
let revealWanted = false;
let smoothed = 0;
let target = 0;
let raf = 0;
let dipRaf = 0;
let lastRevealTime = 0;

/* ---------- 文字分组：中文按 4 字一组，保证不拆词过长、可逐组入场 ---------- */function groupChars(text, size) {
  const chars = [...text.replace(/\s+/g, '')];
  const groups = [];
  for (let i = 0; i < chars.length; i += size) groups.push(chars.slice(i, i + size).join(''));
  return groups;
}

function splitStatement(el, entry, exit) {
  if (!el) return;
  const groups = groupChars(el.textContent.trim(), 4);
  const total = Math.max(1, groups.length - 1);
  el.textContent = '';
  groups.forEach((text, i) => {
    const word = document.createElement('span');
    word.className = 's2-word';
    word.textContent = text;
    word.style.setProperty('--w0', (entry[0] + (entry[1] - entry[0]) * (i / total)).toFixed(4));
    word.style.setProperty('--x0', (exit[0] + (exit[1] - exit[0]) * (i / total)).toFixed(4));
    el.append(word);
  });
}

function splitClosing(el, lines, range) {
  if (!el) return;
  const chunks = [];
  lines.forEach((line, li) => {
    groupChars(line, 4).forEach((text) => chunks.push({ text, li }));
  });
  const total = Math.max(1, chunks.length - 1);
  el.textContent = '';
  let currentLine = null;
  let currentLineIndex = -1;
  chunks.forEach((chunk, i) => {
    if (chunk.li !== currentLineIndex) {
      currentLine = document.createElement('span');
      currentLine.className = 's3-line';
      el.append(currentLine);
      currentLineIndex = chunk.li;
    }
    const word = document.createElement('span');
    word.className = 's3-word';
    word.textContent = chunk.text;
    word.style.setProperty('--w0', (range[0] + (range[1] - range[0]) * (i / total)).toFixed(4));
    currentLine.append(word);
  });
}

/* ---------- 测量与几何求解 ---------- */
function measure() {
  const runway = document.querySelector('[data-runway="1"]');
  const runway2 = document.querySelector('[data-runway="2"]');
  const runway3 = document.querySelector('[data-runway="3"]');
  span = Math.max(1, runway.offsetHeight - innerHeight);
  span2 = Math.max(1, runway2.offsetHeight);
  span3 = Math.max(1, runway3.offsetHeight);
  revealStart = Math.max(0.35, 1 - ((CONFIG.revealVh / 100) * innerHeight) / span);

  // 标题块（只算两个 slot，不含 cap）在“收缩后”的右下角，用于几何求解
  const slots = [...brand.querySelectorAll('.brand__slot')];
  const blockHeight = slots.reduce((sum, slot) => sum + slot.getBoundingClientRect().height, 0);
  const shrinkEnd = Math.min(CONFIG.brandEndPx / Math.max(1, blockHeight), CONFIG.brandMaxScale);
  root.style.setProperty('--shrink-end', shrinkEnd.toFixed(3));

  const brandBox = brand.getBoundingClientRect();
  const px = brandBox.left + brandBox.width * shrinkEnd - innerWidth / 2;
  const py = brandBox.top + blockHeight * shrinkEnd - innerHeight / 2;
  solveTitleTrigger(px, py);
  solveTitleOut(px, py);
}

function solveTitleTrigger(px, py) {
  const spanLen = 0.72 * innerWidth + 0.72 * innerHeight;
  const deg = Math.PI / 180;
  for (let r = 0.01; r <= 1; r += 0.005) {
    const theta = r * 45 * deg;
    const half = (r * spanLen) / 2;
    const d = Math.abs(px * Math.cos(theta) + py * Math.sin(theta));
    if (d <= half) {
      titleAltAt = clamp01(revealStart + r * (1 - revealStart));
      return;
    }
  }
  titleAltAt = 0.95;
}

// 卡片收缩后，左边缘 x 回到标题右侧、或上边缘 y 回到标题下侧时，标题让位给 crew 态（参考 §10 的 solveTitleOut，上限 0.45）
function solveTitleOut(px, py) {
  const W = innerWidth;
  const H = innerHeight;
  const titleRight = px + W / 2;
  const titleBottom = py + H / 2;
  for (let s = 0.01; s <= 0.45; s += 0.005) {
    const k = 1 - s * (1 - CONFIG.cardK);
    const edgeX = (W - W * k) / 2;
    const edgeY = (H - H * k) / 2;
    if (edgeX >= titleRight || edgeY >= titleBottom) {
      titleCrewAt = s;
      return;
    }
  }
  titleCrewAt = 0.42;
}

/* ---------- 视频 ---------- */
function scrubTime(p) {
  const q = Math.min(1, p / revealStart);
  const duration = Number.isFinite(hero.duration) ? hero.duration : 7.9;
  return q * Math.max(0, duration - 0.05);
}

function drawFrame() {
  raf = 0;
  if (Math.abs(target - smoothed) < CONFIG.epsilon / 100) return;
  smoothed = lerp(smoothed, target, CONFIG.lerp);
  if (!hero.seeking && hero.readyState >= 2) {
    try { hero.currentTime = scrubTime(smoothed); } catch { /* seek 失败不阻塞滚动 */ }
  }
  if (Math.abs(target - smoothed) > 0.0005) raf = requestAnimationFrame(drawFrame);
}

function wakeScrub() {
  if (!raf) raf = requestAnimationFrame(drawFrame);
}

function setRevealWanted(wanted) {
  if (wanted === revealWanted) return;
  revealWanted = wanted;
  if (wanted) {
    try { revealVideo.currentTime = 0; } catch { /* noop */ }
    const p = revealVideo.play();
    if (p && p.catch) p.catch(() => {});
    if (!dipRaf) dipRaf = requestAnimationFrame(dipTick);
  } else {
    revealVideo.pause();
    revealBox?.style.setProperty('--dip', '0');
    if (dipRaf) { cancelAnimationFrame(dipRaf); dipRaf = 0; }
  }
}

/* X-07：循环点前后压黑（CSS 100ms 过渡 + 200ms 保持），遮住硬切、避免闪白 */
let dipHoldUntil = 0;

function dipTick() {
  dipRaf = 0;
  if (!revealWanted || !revealBox) return;
  const duration = Number.isFinite(revealVideo.duration) ? revealVideo.duration : 8;
  const t = revealVideo.currentTime;
  const wrapped = t + 0.5 < lastRevealTime;
  lastRevealTime = t;
  const now = performance.now();
  if (now > dipHoldUntil) {
    const nearEnd = t >= duration - 0.12;
    if (wrapped || nearEnd) {
      dipHoldUntil = now + 200;
      revealBox.style.setProperty('--dip', '1');
    } else {
      revealBox.style.setProperty('--dip', '0');
    }
  } else {
    revealBox.style.setProperty('--dip', '1');
  }
  dipRaf = requestAnimationFrame(dipTick);
}

/* ---------- 标题三态 ---------- */
function updateTitle(p, p3) {
  let next = 'main';
  if (p3 >= titleCrewAt) next = 'crew';
  else if (p >= titleAltAt + (titleState === 'alt' ? -CONFIG.titleHysteresis : 0)) next = 'alt';
  if (next === titleState) return;
  titleState = next;
  brand.dataset.title = next;
}

/* ---------- 导航（真实落点 + active 同步） ---------- */
let navLinks = [];

// 文档流内容区（M6.1 / X-05）：用真实元素位置导航，轮播/网格后续可扩展
function contentOffset(id) {
  const el = document.querySelector(id);
  if (!el) return null;
  return Math.round(el.getBoundingClientRect().top + scrollY);
}

function navTop(id) {
  if (id === '#top') return 0;
  const offset = contentOffset(id);
  return offset ?? 0;
}

function markNav(p, p2, p3) {
  const contentStart = contentOffset('#about');
  const inContent = contentStart != null && scrollY >= contentStart - innerHeight * 0.5;
  let current;
  if (inContent) {
    const contactTop = contentOffset('#contact') ?? Infinity;
    const projectsTop = contentOffset('#projects') ?? Infinity;
    current = scrollY >= contactTop - innerHeight * 0.5
      ? '#contact'
      : scrollY >= projectsTop - innerHeight * 0.5
        ? '#projects'
        : '#about';
  } else {
    current = p3 > 0.35 ? '#contact' : p2 > 0.35 ? '#projects' : p > 0.55 ? '#about' : '#top';
  }
  navLinks.forEach((a) => {
    if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
  const index = NAV_TARGETS.indexOf(current);
  if (index !== activeNav) {
    activeNav = index;
    navApiHook?.(index);
  }
}

navLinks.forEach((a) => {
  a.addEventListener('click', (event) => {
    const top = navTop(a.getAttribute('href'));
    event.preventDefault();
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- 主循环 ---------- */
function apply() {
  const y = scrollY;
  const p = clamp01(y / span);
  const p2 = clamp01((y - span) / span2);
  const p3 = clamp01((y - span - span2) / span3);
  const shrinkEnd = parseFloat(getComputedStyle(root).getPropertyValue('--shrink-end')) || 0.51;
  const aboutTop = contentOffset('#about');
  const pastNarrative = aboutTop != null && y >= aboutTop - innerHeight * 0.45;
  root.classList.toggle('past-narrative', pastNarrative);
  // M8.5：开场幕内隐藏三章固定层（避免叠在 Bloom 视频上）
  const actEl = document.getElementById('act');
  if (actEl) {
    const actRect = actEl.getBoundingClientRect();
    const inAct = actRect.top < innerHeight * 0.5 && actRect.bottom > innerHeight * 0.5;
    root.classList.toggle('in-act', inAct);
  }

  root.style.setProperty('--shrink', (1 - (1 - shrinkEnd) * norm(p, CONFIG.shrink)).toFixed(4));
  root.style.setProperty('--exit', norm(p, CONFIG.dissolve).toFixed(4));
  root.style.setProperty('--exit-cap', norm(p, CONFIG.dissolveCap).toFixed(4));
  root.style.setProperty('--reveal', norm(p, [revealStart, 1]).toFixed(4));
  root.style.setProperty('--s2', p2.toFixed(4));
  root.style.setProperty('--s3', p3.toFixed(4));

  setRevealWanted(p >= revealStart && !pastNarrative);
  updateTitle(p, p3);
  target = p;
  wakeScrub();
  markNav(p, p2, p3);
}

/* ---------- 开场（GSAP） ---------- */
function intro() {
  if (!window.gsap) return;
  const tl = gsap.timeline({
    defaults: { ease: 'expo.out', immediateRender: true },
    onComplete: () => gsap.set('.stage__media, .brand__slot, .brand__cap, .clock, .nav a, .lede, .foot > *', { clearProps: 'all' })
  });
  tl.fromTo('.stage__media', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.6 }, 0)
    .fromTo('.brand__slot', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.15)
    .fromTo('.brand__cap', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.45)
    .fromTo('.clock, .nav a', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04 }, 0.55)
    .fromTo('.lede', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 0.7)
    .fromTo('.foot > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.8);
  return tl;
}

/* ---------- 初始化 ---------- */
export function initNarrative({ statement, closing, onActive }) {
  splitStatement(statement, CONFIG.s2Words, CONFIG.s2Exit);
  splitClosing(document.querySelector('[data-closing]'), closing, CONFIG.s3Words);
  navApiHook = onActive ?? null;
  navLinks = [...document.querySelectorAll('[data-nav-fallback] a')];
  navLinks.forEach((a) => {
    a.addEventListener('click', (event) => {
      const top = navTop(a.getAttribute('href'));
      event.preventDefault();
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const reduced = reduceMotion();
  if (reduced) {
    // reduced-motion：不进入叙事模式，保持静态可读文档（R-14）
    return { reduced: true };
  }

  root.classList.add('narrative');
  measure();

  hero.preload = 'auto';
  try { hero.load(); } catch { /* noop */ }
  hero.pause();
  hero.addEventListener('loadedmetadata', () => {
    const p = clamp01(scrollY / span);
    smoothed = target = p;
    try { hero.currentTime = scrubTime(p); } catch { /* noop */ }
  });

  addEventListener('scroll', apply, { passive: true });
  // 旋转/视口变化：记录归一化进度 → 重测 → 映射 scrollY → 更新变量与视频 seek（150ms 防抖）
  let rotateTimer = 0;
  const onViewportChange = () => {
    clearTimeout(rotateTimer);
    rotateTimer = setTimeout(() => {
      const progress = clamp01(scrollY / span);
      measure();
      window.scrollTo({ top: progress * span, behavior: 'instant' });
      const mapped = clamp01(scrollY / span);
      smoothed = target = mapped;
      if (Number.isFinite(hero.duration)) {
        try { hero.currentTime = scrubTime(mapped); } catch { /* noop */ }
      }
      lastRevealTime = revealVideo.currentTime || 0;
      apply();
    }, 150);
  };
  addEventListener('resize', onViewportChange, { passive: true });
  addEventListener('orientationchange', onViewportChange);
  window.visualViewport?.addEventListener('resize', onViewportChange);
  document.fonts?.ready.then(() => { measure(); apply(); });

  intro();
  apply();
  return {
    reduced: false,
    measure,
    apply,
    // 给 React 导航 / 键盘用：滚到真实落点
    scrollToSection(id) {
      window.scrollTo({ top: navTop(id), behavior: 'smooth' });
    }
  };
}
