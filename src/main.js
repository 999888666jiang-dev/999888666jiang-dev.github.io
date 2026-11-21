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
  const campus = $('[data-campus]');
  if (campus) {
    for (const item of content.campus ?? []) {
      const row = make('p', 'campus-row');
      row.append(make('span', 'campus-row__title', item.title ?? ''));
      if (item.period) row.append(make('span', 'campus-row__period', item.period));
      row.append(make('span', 'campus-row__detail', item.detail ?? ''));
      campus.append(row);
    }
  }
  const education = $('[data-education]');
  if (education && content.education) {
    const e = content.education;
    education.textContent = `${e.school ?? ''} · ${e.major ?? ''} · ${e.degree ?? ''} · ${e.period ?? ''}${e.note ? `（${e.note}）` : ''}`;
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
  const honors = $('[data-honors]');
  if (honors) for (const item of content.honors ?? []) honors.append(make('li', null, item));
  const certs = $('[data-certificates]');
  if (certs) for (const item of content.certificates ?? []) certs.append(make('li', null, item));
}

function renderContact() {
  const note = $('[data-contact-note]');
  if (note) note.textContent = content.contact?.note ?? '';
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
