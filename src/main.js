import { siteContent as content } from './content/site-content.js';
import { initNarrative } from './scroll/narrative.js';
import { initOrientationPrompt } from './ui/orientation-prompt.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setMeta() {
  const { meta } = content;
  document.documentElement.lang = meta.lang;
  document.title = meta.title;
  $('meta[name="description"]')?.setAttribute('content', meta.description);
  $('meta[name="robots"]')?.setAttribute('content', meta.robots);
  $('meta[name="theme-color"]')?.setAttribute('content', meta.themeColor);
  $('meta[property="og:image"]')?.setAttribute('content', meta.ogImage);
}

function setBrand() {
  const { brand, cap } = content.identity;
  for (const role of ['main', 'alt', 'crew']) {
    const lines = brand[role];
    const nodes = $$(`[data-brand-line="${role}"]`);
    nodes.forEach((node, i) => {
      if (lines[i]) node.textContent = lines[i];
    });
  }
  $$('[data-cap]').forEach((node) => {
    const i = Number(node.dataset.cap);
    if (cap[i]) node.textContent = cap[i];
  });
}

function setHero() {
  const lede = $('[data-lede]');
  if (lede) lede.textContent = content.hero.lede;
  $$('[data-foot]').forEach((node) => {
    const i = Number(node.dataset.foot);
    if (content.hero.foot[i]) node.textContent = content.hero.foot[i];
  });
  const zone = $('[data-clock-zone]');
  if (zone) {
    zone.textContent = '';
    content.clock.zoneLabel.forEach((line, i) => {
      if (i) zone.append(document.createElement('br'));
      zone.append(document.createTextNode(line));
    });
  }
}

function setSections() {
  const statement = $('[data-statement]');
  if (statement) statement.textContent = content.section2.statement;
  $$('[data-note]').forEach((node) => {
    const i = Number(node.dataset.note);
    if (content.section3.notes[i]) node.textContent = content.section3.notes[i];
  });
  const closing = $('[data-closing]');
  if (closing) {
    // 静态模式直接给可读文本；叙事模式由 narrative.js 拆成逐组 span
    closing.textContent = content.section3.closing.join('\n');
    closing.style.whiteSpace = 'pre-line';
  }
}

function setClock() {
  const el = $('[data-clock]');
  if (!el) return;
  const paint = () => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: content.clock.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(now);
    const get = (type) => parts.find((part) => part.type === type)?.value ?? '00';
    el.textContent = `[ ${get('hour')}:${get('minute')} ]`;
    el.setAttribute('datetime', now.toISOString());
  };
  paint();
  setInterval(paint, 30_000);
}

function markContentState() {
  document.documentElement.dataset.content = content.placeholders.length ? 'placeholder' : 'final';
  document.documentElement.dataset.placeholders = content.placeholders.join(',');
}

/* ===== P0：区块独立 render + enabled/order 配置（M6.1） ===== */
const SECTION_DEFAULTS = {
  about: { enabled: true, order: 10 },
  experience: { enabled: true, order: 20 },
  projects: { enabled: true, order: 30 },
  honors: { enabled: true, order: 40 },
  contact: { enabled: true, order: 50 }
};

const STATUS_LABEL = { live: '在线演示', wip: '进行中', archived: '已归档', nda: 'NDA' };
const SOURCE_LABEL = { experiment: '实验', local: '本地项目', 'case-study': '复盘', nda: 'NDA' };

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function sectionConfig() {
  const merged = {};
  for (const [key, defaults] of Object.entries(SECTION_DEFAULTS)) {
    merged[key] = { ...defaults, ...(content.sections?.[key] ?? {}) };
  }
  // P0 验收用：仅在 dev 下通过 URL 参数测试配置（生产构建会被移除）
  if (import.meta.env.DEV) {
    const params = new URLSearchParams(location.search);
    const hide = params.get('p0hide');
    if (hide && merged[hide]) merged[hide].enabled = false;
    if (params.get('p0rev') === '1') {
      for (const cfg of Object.values(merged)) cfg.order = 1000 - cfg.order;
    }
  }
  return merged;
}

function renderAbout() {
  const summary = $('[data-about-summary]');
  if (summary) summary.textContent = content.about?.summary ?? '';
  const mission = $('[data-about-mission]');
  if (mission) mission.textContent = content.about?.mission ?? '';
  const pills = $('[data-about-pills]');
  if (pills) for (const pill of content.about?.pills ?? []) pills.append(make('li', null, pill));
  const skills = $('[data-skills]');
  if (!skills) return;
  for (const skill of content.skills ?? []) {
    const li = make('li', 'skill-card');
    li.append(make('h3', 'skill-card__title', skill.title ?? ''), make('p', 'skill-card__detail', skill.detail ?? ''));
    skills.append(li);
  }
}

function renderExperience() {
  const exp = $('[data-experience]');
  if (exp) {
    for (const job of content.experience ?? []) {
      const card = make('article', 'exp-card');
      const head = make('div', 'exp-card__head');
      head.append(make('h3', 'exp-card__company', job.company ?? ''), make('span', 'exp-card__period', job.period ?? ''));
      card.append(head, make('p', 'exp-card__role', job.role ?? ''));
      const ul = make('ul', 'exp-card__list');
      for (const line of job.highlights ?? []) ul.append(make('li', null, line));
      card.append(ul);
      exp.append(card);
    }
  }
}

function renderProjects() {
  const BASE = import.meta.env.BASE_URL;
  const projectsEl = $('[data-projects]');
  if (!projectsEl) return;
  for (const project of content.projects ?? []) {
    // P0 向后兼容：缺字段给默认值，老数据不填也能渲染
    const status = project.status ?? 'live';
    const source = project.sourceType ?? 'external';
    const stack = project.stack ?? [];
    const links = project.links ?? {};
    const card = make('article', 'project-card');
    card.dataset.status = status;
    card.dataset.source = source;
    const link = links.live || project.externalUrl || '';
    const cover = link ? make('a', 'project-card__media') : make('div', 'project-card__media');
    if (link) {
      cover.href = link;
      cover.target = '_blank';
      cover.rel = 'noopener noreferrer';
      cover.setAttribute('aria-label', `${project.title ?? '作品'}（${STATUS_LABEL[status] ?? '作品'}，新窗口打开）`);
    }
    if (project.cover) {
      const img = document.createElement('img');
      img.src = `${BASE}${project.cover}`;
      img.alt = project.alt || project.title || '作品封面';
      img.width = 1600;
      img.height = 1000;
      img.loading = 'lazy';
      img.decoding = 'async';
      cover.append(img);
    }
    card.append(cover);

    const body = make('div', 'project-card__body');
    const titleRow = make('div', 'project-card__title-row');
    const suffix = status === 'live' ? '' : ` · ${SOURCE_LABEL[source] ?? ''}`;
    titleRow.append(
      make('h3', 'project-card__title', `${project.title ?? '未命名作品'}${suffix}`),
      make('span', 'project-card__status', STATUS_LABEL[status] ?? status)
    );
    const chips = make('ul', 'project-card__stack');
    for (const tech of stack) chips.append(make('li', null, tech));
    const meta = make('p', 'project-card__meta', `${project.role ?? ''}${project.role && project.period ? ' · ' : ''}${project.period ?? ''}`);
    const linksEl = make('div', 'project-card__links');
    if (links.live) {
      const live = make('a', 'project-card__link', '在线演示');
      live.href = links.live;
      live.target = '_blank';
      live.rel = 'noopener noreferrer';
      linksEl.append(live);
    }
    if (links.repo) {
      const repo = make('a', 'project-card__link', '公开仓库');
      repo.href = links.repo;
      repo.target = '_blank';
      repo.rel = 'noopener noreferrer';
      linksEl.append(repo);
    }
    if (!links.live && !links.repo) {
      linksEl.append(make('span', 'project-card__link project-card__link--muted', SOURCE_LABEL[source] ?? '本地'));
    }
    // M6.3：静态网格回退路径——点击「详情」打开同一个详情卡（HTML 降级或 3D）
    const detailBtn = make('button', 'project-card__detail', '详情');
    detailBtn.type = 'button';
    detailBtn.setAttribute('aria-label', `查看 ${project.title ?? '作品'} 详情`);
    detailBtn.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      detailBtn.click();
    });
    detailBtn.addEventListener('click', () => {
      import('./islands/reflective-card-mount.jsx')
        .then(({ openProjectDetail }) => openProjectDetail(project.slug, { trigger: detailBtn }))
        .catch((error) => console.warn('[detail] 详情加载失败', error));
    });
    linksEl.append(detailBtn);
    body.append(titleRow, make('p', 'project-card__value', project.value ?? ''), chips, meta, linksEl);
    if (project.note) body.append(make('p', 'project-card__note', project.note));
    card.append(body);
    projectsEl.append(card);
  }
  const nda = $('[data-nda]');
  if (nda) nda.textContent = content.ndaNote?.display ?? '';
}

function renderHonors() {
  const list = $('[data-honors]');
  if (!list) return;
  const add = (items, kind) => {
    for (const item of items ?? []) {
      const li = make('li', 'honor-card');
      li.append(make('span', 'honor-card__kind', kind));
      li.append(make('span', 'honor-card__text', item));
      list.append(li);
    }
  };
  add(content.honors, '荣誉');
  add(content.certificates, '证书');
}

function renderContact() {
  const note = $('[data-contact-note]');
  if (note) note.textContent = content.contact?.note ?? '';
  const mission = $('[data-contact-mission]');
  if (mission) mission.textContent = content.contact?.mission ?? '';
  const pills = $('[data-contact-pills]');
  if (pills) for (const pill of content.contact?.pills ?? []) pills.append(make('li', null, pill));
  const cta = $('[data-contact-cta]');
  if (cta && content.contact?.email) cta.href = `mailto:${content.contact.email}`;
  const email = $('[data-contact-email]');
  if (email && content.contact?.email) {
    email.href = `mailto:${content.contact.email}`;
    email.textContent = content.contact.email;
  }
  const github = $('[data-contact-github]');
  if (github && content.contact?.github) github.href = content.contact.github;
}

const SECTION_RENDERERS = {
  about: renderAbout,
  experience: renderExperience,
  projects: renderProjects,
  honors: renderHonors,
  contact: renderContact
};

function renderContentFlow() {
  const config = sectionConfig();
  const flow = $('[data-content-flow]');
  if (!flow) return;
  const ordered = Object.entries(config)
    .filter(([, cfg]) => cfg.enabled !== false)
    .sort((a, b) => a[1].order - b[1].order);
  for (const [key] of ordered) {
    const section = document.getElementById(key);
    if (!section) continue;
    SECTION_RENDERERS[key]?.();
    flow.append(section); // 按配置顺序重排，其它区块不受影响
  }
  // 被禁用的区块从 DOM 移除（仅影响该区块）
  for (const key of Object.keys(config)) {
    const cfg = config[key];
    if (cfg.enabled === false) document.getElementById(key)?.remove();
  }
}

/* P0 验收用假数据（仅 dev；生产构建不会包含） */
function applyP0Fixtures() {
  if (!import.meta.env.DEV) return;
  const params = new URLSearchParams(location.search);
  if (params.get('p0fake') === '1') {
    content.projects = [
      ...(content.projects ?? []),
      { slug: 'p0-fake', title: 'P0 假作品', cover: 'media/projects/ai-flight-lab/cover.webp' }
    ];
  }
  if (params.get('p0nonav') === '1' && content.islands) content.islands.gooeyNav = false;
  if (params.get('p0nolanyard') === '1' && content.islands) content.islands.lanyard = false;
  if (params.get('p0nogallery') === '1' && content.islands) content.islands.gallery = false;
  if (params.get('p0nocard') === '1' && content.islands) content.islands.reflectiveCard = false;
}
setMeta();
setBrand();
setHero();
setSections();
setClock();
markContentState();
applyP0Fixtures();
renderContentFlow();
document.documentElement.dataset.lanyardState = 'static'; // 加载中/降级默认静态卡 + CSS 挂绳

let navApi = null;

const narrative = initNarrative({
  statement: $('[data-statement]'),
  closing: content.section3.closing,
  onActive: (index) => navApi?.setActive(index)
});
document.documentElement.dataset.motion = narrative.reduced ? 'reduce' : 'narrative';
initOrientationPrompt();

/* M6.2：CircularGallery 懒加载（projects 前 300px 才请求；失败/无 WebGL2 回退静态网格） */
function initProjectsGallery() {
  if (content.islands?.gallery === false || content.islands?.circularGallery === false) return;
  const section = document.getElementById('projects');
  if (!section) return;
  let started = false;
  const fallback = () => { section.dataset.view = 'grid'; };
  const start = () => {
    if (started) return;
    started = true;
    let ok = false;
    try { ok = !!document.createElement('canvas').getContext('webgl2'); } catch { ok = false; }
    if (!ok) { fallback(); return; }
    const timer = setTimeout(() => { if (section.dataset.view !== 'gallery') fallback(); }, 2500);
    import('./islands/circular-gallery-mount.jsx')
      .then(({ mountGallery }) => {
        const api = mountGallery({ reduced: narrative.reduced });
        clearTimeout(timer);
        if (!api) fallback();
      })
      .catch((error) => {
        clearTimeout(timer);
        fallback();
        console.warn('[gallery] 轮播加载失败，回退静态网格', error);
      });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        io.disconnect();
        start();
      }
    }, { rootMargin: '300px 0px' });
    io.observe(section);
  } else {
    const onScroll = () => {
      if (innerHeight + scrollY >= section.offsetTop - 300) {
        removeEventListener('scroll', onScroll);
        start();
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
  }
}
initProjectsGallery();

// M4：React GooeyNav 岛屿按需加载；失败/降级/配置关闭时保留 HTML 里的普通 <a> 导航
if (!narrative.reduced && content.islands?.gooeyNav !== false) {
  import('./islands/nav-mount.jsx')
    .then(({ mountNav }) => {
      navApi = mountNav({
        items: content.nav,
        onSelect: (index) => narrative.scrollToSection(content.nav[index].target)
      });
    })
    .catch((error) => {
      console.warn('[nav] GooeyNav 加载失败，保留普通导航', error);
    });
}

// M5：three Lanyard 岛屿按需加载。reduced-motion / 无 WebGL / 省流 / 加载失败 → 保持静态 front.jpg 卡
const canUseLanyard = (() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (navigator.connection?.saveData) return false;
  if (!('requestIdleCallback' in window)) return true;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
})();

if (content.islands?.lanyard !== false && canUseLanyard) {
  const startLanyard = () => {
    import('./islands/lanyard-mount.jsx')
      .then(({ mountLanyard }) =>
        mountLanyard({
          front: content.media.lanyardFront,
          back: content.media.lanyardBack
        })
      )
      .catch((error) => {
        console.warn('[lanyard] three 岛加载失败，保留静态卡', error);
        document.documentElement.dataset.lanyardState = 'static';
      });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(startLanyard, { timeout: 2200 });
  else setTimeout(startLanyard, 1400);
}

/* M8.1 Bloom：入场 reveal（只 transform/opacity；reduced 与无 JS 静态可见） */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-inview');
      io.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('#about .skill-card, #experience .exp-card, #about .about-pills li, .doc-kicker').forEach((el, i) => {
    el.style.setProperty('--reveal-i', String(i % 6));
    io.observe(el);
  });
})();
/* M9 详情区单一状态源：video 背景 + 粒子；离开即移除 class / pause / cancel rAF，tick 不得回写 */
function initDetailScene() {
  const layer = $('[data-detail-bg]');
  const about = document.getElementById('about');
  const video = $('[data-detail-video]');
  const pCanvas = $('[data-detail-particles]');
  if (!layer || !about || !video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 900;
  let aboutTop = 0;
  let active = false;
  let started = false;
  let videoRaf = 0;
  let partRaf = 0;
  let current = 0;
  let currentParticles = [];
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const pctx = pCanvas ? pCanvas.getContext('2d') : null;
  const measure = () => { aboutTop = about.getBoundingClientRect().top + scrollY; };
  const dur = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10);
  const seek = (t) => {
    if (video.seeking || Math.abs(video.currentTime - t) < 0.08) return;
    try { if (typeof video.fastSeek === 'function') video.fastSeek(t); else video.currentTime = t; } catch { /* ignore */ }
  };
  const videoTick = () => {
    videoRaf = 0;
    if (!active) return;
    const p = Math.min(1, Math.max(0, (scrollY - aboutTop) / Math.max(1, document.documentElement.scrollHeight - innerHeight - aboutTop)));
    const target = p * Math.max(0, dur() - 0.05);
    current += (target - current) * 0.12;
    seek(current);
    videoRaf = requestAnimationFrame(videoTick);
  };
  const startVideo = () => { if (!videoRaf) videoRaf = requestAnimationFrame(videoTick); };
  const stopVideo = () => { if (videoRaf) { cancelAnimationFrame(videoRaf); videoRaf = 0; } video.pause(); };
  const buildParticles = () => {
    if (!pCanvas || !pctx) return;
    pCanvas.width = Math.max(1, Math.round(innerWidth * dpr));
    pCanvas.height = Math.max(1, Math.round(innerHeight * dpr));
    const count = Math.max(18, Math.round((innerWidth * innerHeight) / 12000));
    currentParticles = Array.from({ length: count }, () => ({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: (0.5 + Math.random() * 1.5) * dpr,
      vy: (0.08 + Math.random() * 0.22) * dpr,
      a: 0.18 + Math.random() * 0.5
    }));
    pCanvas.dataset.particles = String(count);
  };
  let lastP = 0;
  const particleTick = (now) => {
    partRaf = 0;
    if (!active || !pctx) return;
    if (now - lastP < 1000 / 30) { partRaf = requestAnimationFrame(particleTick); return; }
    lastP = now;
    pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (const p of currentParticles) {
      p.y -= p.vy;
      if (p.y < -4) { p.y = pCanvas.height + 4; p.x = Math.random() * pCanvas.width; }
      pctx.beginPath();
      pctx.fillStyle = `rgba(255,255,255,${p.a})`;
      pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pctx.fill();
    }
    partRaf = requestAnimationFrame(particleTick);
  };
  const startParticles = () => { if (pctx && !partRaf) { lastP = 0; partRaf = requestAnimationFrame(particleTick); } };
  const stopParticles = () => { if (partRaf) { cancelAnimationFrame(partRaf); partRaf = 0; } if (pctx) pctx.clearRect(0, 0, pCanvas.width, pCanvas.height); };
  const load = () => {
    if (reduced || coarse) return;
    if (started) return;
    started = true;
    video.src = '/media/detail/veldara-loop.mp4';
    video.load();
    video.addEventListener('loadeddata', () => { layer.classList.add('is-ready'); layer.dataset.duration = dur().toFixed(2); seek(0); }, { once: true });
    video.addEventListener('error', () => { started = false; layer.dataset.error = 'video-error'; });
  };
  const setActive = (on) => {
    if (on === active) return;
    active = on;
    document.documentElement.classList.toggle('detail-bg-on', on);
    if (on) {
      if (!started && scrollY + innerHeight >= aboutTop - 600) load();
      startVideo();
      startParticles();
    } else {
      stopVideo();
      stopParticles();
      document.documentElement.classList.remove('detail-bg-on');
    }
    layer.dataset.active = on ? '1' : '0';
  };
  const onScroll = () => { measure(); setActive(scrollY + innerHeight >= aboutTop); };
  buildParticles(); measure(); onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); buildParticles(); onScroll(); });
  addEventListener('pagehide', () => { stopVideo(); stopParticles(); });
}
initDetailScene();
/* M9 fixed cards：内容来自 site-content.experience，滚动 fadeIn/fadeOut，移动/无 JS 回退原列表 */
/* M9 静态三卡：复用经验数据，普通 grid + IO reveal（无 JS 时正常文档流可见） */
function initExpCards() {
  const list = document.querySelector('[data-experience]');
  if (!list) return;
  if (!list.querySelector('.exp-card--campus') && (content.campus ?? []).length) {
    const card = document.createElement('article');
    card.className = 'exp-card exp-card--campus';
    const head = document.createElement('div');
    head.className = 'exp-card__head';
    const h3 = document.createElement('h3');
    h3.className = 'exp-card__company';
    h3.textContent = '校园与教育';
    const period = document.createElement('span');
    period.className = 'exp-card__period';
    period.textContent = content.education?.period ?? '2023—2027';
    head.append(h3, period);
    const role = document.createElement('p');
    role.className = 'exp-card__role';
    role.textContent = [content.education?.school, content.education?.major].filter(Boolean).join(' · ');
    const ul = document.createElement('ul');
    ul.className = 'exp-card__list';
    for (const item of content.campus) {
      const li = document.createElement('li');
      li.textContent = [item.title, item.detail].filter(Boolean).join('：');
      ul.append(li);
    }
    card.append(head, role, ul);
    list.append(card);
  }
  document.documentElement.classList.add('exp-reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-inview', entry.isIntersecting);
    }, { threshold: 0.12 });
    for (const card of list.querySelectorAll('.exp-card')) io.observe(card);
  } else {
    for (const card of list.querySelectorAll('.exp-card')) card.classList.add('is-inview');
  }
}
initExpCards();
/* M9 收尾：hero 只淡出 #about；section-three IO 加 visible；只动 opacity/transform */
function initM9Outro() {
  const about = document.getElementById('about');
  const contact = document.getElementById('contact');
  // M11.1b：字号变化后 about 位置改变，强制在 about 进入视口前退出三章固定层
  const syncPast = () => {
    if (!about) return;
    const top = about.getBoundingClientRect().top;
    if (top < innerHeight * 0.85) document.documentElement.classList.add('past-narrative');
    else if (scrollY < about.getBoundingClientRect().top + scrollY - innerHeight) document.documentElement.classList.remove('past-narrative');
  };
  if (about) {
    let ticking = false;
    const fadeAbout = () => {
      ticking = false;
      const top = about.getBoundingClientRect().top + scrollY;
      const h = Math.max(1, about.offsetHeight);
      const fade = Math.min(1, Math.max(0, 1 - (scrollY - top) / Math.max(1, h * 0.9)));
      about.style.opacity = String(fade);
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(fadeAbout); } };
    addEventListener('scroll', () => { syncPast(); req(); }, { passive: true });
    addEventListener('resize', () => { syncPast(); req(); });
    syncPast(); fadeAbout();
  }
  if (contact && 'IntersectionObserver' in window) {
    contact.classList.add('sec-io');
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }, { threshold: 0.15 });
    io.observe(contact);
  }
}
initM9Outro();
/* M10G 花瓣收口：28 扇区预渲染羽化 + 飞行显隐 + qRaw 淡出/清空（v5.5） */
function initDetailPetals() {
  const canvas = $('[data-detail-petals]');
  const about = document.getElementById('about');
  if (!canvas || !about) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 900;
  if (reduced || coarse) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const CROP = { x: 600, y: 180, w: 480, h: 480 };
  const N = 28;
  const TARGET = 440;
  const OVERLAP = (1.75 * Math.PI) / 180; // v5.5: adjacent sector overlap 1.5-2deg
  const FEATHER = 1.35; // v5.5: pre-render gaussian sigma 1.2-1.5px (never per-frame blur)
  const FLOWER_MAX_ALPHA = 0.78;
  const fragments = [];
  const fragSectors = [];
  let img = null;
  let w = 0, h = 0, cx = 0, cy = 0, scale = 1;
  let raf = 0, active = false, q = 0, qRaw = 0, fadeOut = 1, flowerAlpha = FLOWER_MAX_ALPHA, last = 0, detailStart = 0;
  let assembled = null;
  let flightBuf = null;
  let lastQ = -1;
  let lastFlight = 0;
  let built = false;
  const clamp01 = (t) => Math.min(1, Math.max(0, t));
  const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const makeFragments = () => {
    const S = CROP.w * dpr;
    for (let i = 0; i < N; i++) {
      const a1 = (i / N) * Math.PI * 2;
      const a2 = ((i + 1) / N) * Math.PI * 2 + OVERLAP;
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const g = c.getContext('2d');
      g.save();
      g.beginPath();
      g.moveTo(S / 2, S / 2);
      g.arc(S / 2, S / 2, S * 0.72, a1, a2);
      g.closePath();
      g.clip();
      g.drawImage(img, -CROP.x * dpr, -CROP.y * dpr, img.naturalWidth * dpr, img.naturalHeight * dpr);
      g.restore();
      // pre-rendered gaussian alpha feather (blurred sector mask, composited once)
      const mask = document.createElement('canvas');
      mask.width = S; mask.height = S;
      const mg = mask.getContext('2d');
      mg.filter = 'blur(' + (FEATHER * dpr) + 'px)';
      mg.fillStyle = '#fff';
      mg.beginPath();
      mg.moveTo(S / 2, S / 2);
      mg.arc(S / 2, S / 2, S * 0.72, a1, a2);
      mg.closePath();
      mg.fill();
      g.save();
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(mask, 0, 0);
      g.restore();
      fragments.push(c);
      fragSectors.push({
        a1,
        angle: (a1 + a2) / 2,
        scatter: { x: (Math.random() - 0.5) * 2.4, y: (Math.random() - 0.5) * 2.4, rot: (Math.random() - 0.5) * 2.2 },
        seed: Math.random(),
        alpha: 0.92 + Math.random() * 0.04
      });
    }
  };
  const buildAssembled = () => {
    assembled = document.createElement('canvas');
    assembled.width = CROP.w; assembled.height = CROP.h;
    const g = assembled.getContext('2d');
    for (const frag of fragments) g.drawImage(frag, 0, 0, CROP.w, CROP.h);
    const id = g.getImageData(0, 0, CROP.w, CROP.h);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = Math.max(d[i], d[i + 1], d[i + 2]);
      const a = Math.min(255, Math.max(0, (lum - 24) * 1.8)) * 0.9;
      d[i + 3] = Math.round(a);
    }
    g.putImageData(id, 0, 0);
  };
  const ensureFlight = () => {
    if (!flightBuf) { flightBuf = document.createElement('canvas'); flightBuf.width = 720; flightBuf.height = 450; }
  };
  const measure = () => {
    canvas.width = Math.max(1, Math.round(innerWidth * dpr));
    canvas.height = Math.max(1, Math.round(innerHeight * dpr));
    w = canvas.width; h = canvas.height;
    cx = w * 0.525; cy = h * 0.467;
    scale = (TARGET / CROP.w) * dpr;
    detailStart = about.getBoundingClientRect().top + scrollY;
  };
  // v5.6 lifecycle: fade 1.0 -> 1.12, clear at >= 1.12; flight alpha below t=0 -> .22, t>=.9 -> .90, landed -> meta.alpha (.92-.96)
  const flightAlpha = (t, meta) => {
    if (t >= 0.9) return 0.90 + (meta.alpha - 0.90) * clamp01((t - 0.9) / 0.1);
    return 0.22 + (0.90 - 0.22) * (t / 0.9);
  };
  const drawSettled = () => {
    if (!assembled || flowerAlpha <= 0) return;
    const breathe = q > 0.94 ? 1 + Math.sin(performance.now() / 1600) * 0.01 : 1;
    const rotB = q > 0.94 ? Math.sin(performance.now() / 1600) * 0.004 : 0;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = flowerAlpha;
    ctx.translate(cx, cy); ctx.rotate(rotB); ctx.scale(breathe, breathe);
    ctx.scale(scale, scale);
    ctx.drawImage(assembled, -CROP.w / 2, -CROP.h / 2);
    ctx.restore();
  };
  const draw = (now) => {
    raf = 0;
    if (!active || !fragments.length) return;
    if (qRaw >= 1.12) { ctx.clearRect(0, 0, w, h); return; }
    if (now - last < 33) { raf = requestAnimationFrame(draw); return; }
    last = now;
    if (qRaw >= 0.84 && qRaw < 0.94 && Math.abs(qRaw - lastQ) < 0.0005) { raf = requestAnimationFrame(draw); return; }
    lastQ = qRaw;
    // flight is throttled to 10fps: skip before clearing so a throttled frame never blanks the canvas
    if (qRaw < 0.70 && now - lastFlight < 100) { raf = requestAnimationFrame(draw); return; }
    if (qRaw < 0.70) lastFlight = now;
    const breathe = q > 0.90 ? 1 + Math.sin(now / 1600) * 0.01 : 1;
    const rotB = q > 0.90 ? Math.sin(now / 1600) * 0.004 : 0;
    const glow = clamp01((q - 0.84) / 0.10);
    ctx.clearRect(0, 0, w, h);
    if (qRaw >= 0.70) { drawSettled(); raf = requestAnimationFrame(draw); return; }
    ensureFlight();
    const fx = 720 / innerWidth;
    const fc = flightBuf.getContext('2d');
    fc.clearRect(0, 0, 720, 450);
    fc.save();
    fc.translate(cx * fx, cy * fx); fc.rotate(rotB); fc.scale(breathe, breathe); fc.translate(-cx * fx, -cy * fx);
    for (let i = 0; i < N; i++) {
      const frag = fragments[i];
      const meta = fragSectors[i];
      const start = 0.06 + meta.seed * 0.35;
      const t = easeOut(clamp01((q - start) / 0.28));
      const sx = meta.scatter.x * 420 * dpr;
      const sy = meta.scatter.y * 420 * dpr;
      const x = cx + sx * (1 - t);
      const y = cy + sy * (1 - t);
      const rot = meta.scatter.rot * (1 - t);
      const s = scale * fx * (1 + (meta.seed - 0.5) * 0.16 * (1 - t));
      const intro = clamp01(q / 0.06);
      // trailing echoes fade to 0.06 / 0.03 while airborne (v5.5)
      if (t < 1) {
        for (const [off, ta] of [[0.03, 0.06], [0.06, 0.03]]) {
          const tx = cx + sx * (1 - t + off);
          const ty = cy + sy * (1 - t + off);
          fc.save();
          fc.translate(tx * fx, ty * fx);
          fc.rotate(rot);
          fc.scale(s, s);
          fc.globalAlpha = flowerAlpha * ta * intro;
          fc.drawImage(frag, -CROP.w / 2, -CROP.h / 2);
          fc.restore();
        }
      }
      fc.save();
      fc.translate(x * fx, y * fx);
      fc.rotate(rot);
      fc.scale(s, s);
      fc.globalAlpha = flowerAlpha * flightAlpha(t, meta) * intro;
      fc.drawImage(frag, -CROP.w / 2, -CROP.h / 2);
      fc.restore();
    }
    fc.restore();
    ctx.drawImage(flightBuf, 0, 0, w, h);
    if (glow > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 * dpr);
      g2.addColorStop(0, 'rgba(255,248,238,' + (0.28 * glow * flowerAlpha) + ')');
      g2.addColorStop(1, 'rgba(255,248,238,0)');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(cx, cy, 70 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  };
  const onScroll = () => {
    measure();
    if (!built && scrollY + innerHeight >= detailStart - 600) { built = true; makeFragments(); buildAssembled(); }
    qRaw = detailStart ? (scrollY - detailStart) / (innerHeight * 2.2) : 0;
    q = clamp01(qRaw);
    fadeOut = 1 - smoothstep(1.0, 1.12, qRaw);
    flowerAlpha = FLOWER_MAX_ALPHA * fadeOut;
    if (qRaw >= 1.12) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      active = false;
      lastQ = -1;
      ctx.clearRect(0, 0, w, h);
      return;
    }
    const on = scrollY + innerHeight >= detailStart;
    if (on && !active) { active = true; lastQ = -1; if (!raf) raf = requestAnimationFrame(draw); }
    if (!on && active) { active = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } ctx.clearRect(0, 0, w, h); }
  };
  img = new Image();
  img.onload = () => { measure(); onScroll(); };
  img.src = '/media/detail/veldara-poster.jpg';
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); });
}
initDetailPetals();