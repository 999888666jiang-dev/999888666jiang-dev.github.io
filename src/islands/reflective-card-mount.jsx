import { createRoot } from 'react-dom/client';
import ReflectiveCard from './reflective-card.jsx';
import { siteContent } from '../content/site-content.js';
import './reflective-card.css';

const STATUS = {
  live: { label: '在线演示', color: '#22c55e' },
  wip: { label: '进行中', color: '#f59e0b' },
  archived: { label: '案例复盘', color: '#94a3b8' }
};

const BASE = import.meta.env.BASE_URL;

function statusFor(project) {
  if (project.sourceType === 'experiment') return { label: '实验', color: '#f59e0b' };
  if (project.sourceType === 'local') return { label: '本地', color: '#9ca3af' };
  if (project.sourceType === 'case-study') return { label: '案例复盘', color: '#94a3b8' };
  return STATUS[project.status] ?? STATUS.live;
}

function cardSize() {
  const css = getComputedStyle(document.documentElement);
  const num = (name, fallback) => parseFloat(css.getPropertyValue(name)) || fallback;
  const landscape = matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
  if (landscape) {
    return { width: num('--modal-w-landscape', 520), height: num('--modal-h-landscape', 340), radius: num('--modal-r-landscape', 22) };
  }
  if (innerWidth <= 640) {
    return { width: num('--modal-w-mobile', 320), height: num('--modal-h-mobile', 520), radius: num('--modal-r-mobile', 24) };
  }
  return { width: num('--modal-w-desktop', 420), height: num('--modal-h-desktop', 540), radius: num('--modal-r-desktop', 27) };
}

function DetailContent({ project }) {
  const status = statusFor(project);
  const links = project.links ?? {};
  return (
    <div className="pd-detail">
      {project.cover && (
        <figure className="pd-cover">
          <img
            src={`${BASE}${project.cover}`}
            alt={project.alt || project.title}
            width="1600"
            height="1000"
            loading="eager"
            decoding="async"
          />
        </figure>
      )}
      <div className="pd-body">
        <div className="pd-head">
          <span className="pd-badge">{status.label}</span>
        </div>
        <h3 className="pd-title" id="project-detail-title">{project.title}</h3>
        <p className="pd-value" id="project-detail-desc">{project.value}</p>
        <dl className="pd-meta">
          <div><dt>角色</dt><dd>{project.role}</dd></div>
          <div><dt>时间</dt><dd>{project.period}</dd></div>
        </dl>
        <ul className="pd-stack" aria-label="技术栈">
          {(project.stack ?? []).map((tech) => <li key={tech}>{tech}</li>)}
        </ul>
        <div className="pd-links">
          {links.live && <a href={links.live} target="_blank" rel="noopener noreferrer">在线演示</a>}
          {links.repo && <a href={links.repo} target="_blank" rel="noopener noreferrer">公开仓库</a>}
          {!links.live && !links.repo && <span className="pd-muted">{project.note ? '本地 / 复盘项目' : '无公开链接'}</span>}
        </div>
      </div>
    </div>
  );
}

let overlay = null;
let root = null;
let keydown = null;
let savedScrollY = 0;
let lastTrigger = null;
let wasOpen = false;
let historyPushed = false;

function buildOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'detail-modal';
  overlay.dataset.island = 'reflective-card';
  overlay.dataset.islandState = 'html';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="project-detail-title" aria-describedby="project-detail-desc">
      <button type="button" class="detail-close" aria-label="关闭详情">关闭</button>
      <div class="detail-host"></div>
    </div>`;
  document.body.append(overlay);
  overlay.querySelector('.detail-close').addEventListener('click', () => close());
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  // 浏览器返回键：详情打开时返回 = 关闭详情并停在原位置，不离开站点
  addEventListener('popstate', () => {
    if (wasOpen) close({ fromHistory: true });
  });
  return overlay;
}

function lockScroll() {
  savedScrollY = window.scrollY;
  document.documentElement.classList.add('detail-lock');
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.documentElement.classList.remove('detail-lock');
  document.body.style.overflow = '';
  const y = savedScrollY;
  window.scrollTo({ top: y, behavior: 'instant' });
  // 焦点归还/浏览器恢复可能在下一帧改变滚动位置，再断言一次
  requestAnimationFrame(() => {
    window.scrollTo({ top: y, behavior: 'instant' });
  });
  setTimeout(() => {
    if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: 'instant' });
  }, 80);
}

function trapFocus(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
    return;
  }
  if (event.key !== 'Tab') return;
  const panel = overlay.querySelector('.detail-panel');
  const focusable = [...panel.querySelectorAll('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function close({ fromHistory = false } = {}) {
  if (!overlay || !wasOpen) return;
  wasOpen = false;
  overlay.hidden = true;
  root?.unmount();
  root = null;
  document.removeEventListener('keydown', trapFocus, true);
  unlockScroll();
  dispatchEvent(new CustomEvent('gallery:resume'));
  // 清理为详情打开而压入的历史条目（不改变当前页面位置）
  if (historyPushed) {
    historyPushed = false;
    if (!fromHistory) {
      try { history.back(); } catch { /* noop */ }
    }
  }
  const canFocus = (el) => {
    if (!el || !document.contains(el)) return false;
    if (el.getClientRects().length === 0) return false; // 被隐藏的触发元素不夺焦
    return true;
  };
  if (canFocus(lastTrigger)) {
    try { lastTrigger.focus({ preventScroll: true }); } catch { /* noop */ }
  } else {
    // 拿不到/不可见触发元素：回轮播容器并保持可见焦点
    const gallery = document.querySelector('.circular-gallery');
    try {
      if (gallery) gallery.focus({ preventScroll: true });
      else document.getElementById('projects')?.focus?.({ preventScroll: true });
    } catch { /* noop */ }
  }
}

export function openProjectDetail(slugOrIndex, { trigger = null } = {}) {
  const projects = siteContent.projects ?? [];
  const project = typeof slugOrIndex === 'string'
    ? projects.find((item) => item.slug === slugOrIndex)
    : projects[slugOrIndex];
  if (!project) return false;
  if (!overlay) buildOverlay();
  const host = overlay.querySelector('.detail-host');
  host.innerHTML = '';
  lastTrigger = trigger ?? document.activeElement;
  lockScroll();
  dispatchEvent(new CustomEvent('gallery:pause'));

  let canWebgl = false;
  try { canWebgl = !!document.createElement('canvas').getContext('webgl2'); } catch { canWebgl = false; }
  // islands.reflectiveCard=false 或无 WebGL2 → HTML 详情面板（同一交互路径/同一份数据）
  const use3d = canWebgl && siteContent.islands?.reflectiveCard !== false;

  if (use3d) {
    overlay.dataset.islandState = 'reflective-card';
    const size = cardSize();
    const coarse = matchMedia('(pointer: coarse)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    root = createRoot(host);
    root.render(
      <ReflectiveCard
        webcam={false}
        theme="dark"
        tint="#dfe6e8"
        metalness={0.9}
        roughness={0.35}
        blurStrength={8}
        grayscale={0.5}
        warp={0.6}
        shine={0.8}
        glare={0.35}
        enableTilt={!coarse && !reduced}
        tiltStrength={8}
        intro={!reduced && !coarse}
        width={size.width}
        height={size.height}
        radius={size.radius}
      >
        <DetailContent project={project} />
      </ReflectiveCard>
    );
  } else {
    // WebGL2/组件失败：HTML 详情面板（同样信息/链接/关闭/焦点）
    const html = document.createElement('div');
    html.className = 'detail-html';
    html.innerHTML = `
      <div class="detail-html__inner">
        <p class="detail-html__kicker">作品详情 · HTML</p>
        <img class="detail-html__cover" alt="" width="1600" height="1000">
        <h3 class="detail-html__title" id="project-detail-title"></h3>
        <p class="detail-html__value" id="project-detail-desc"></p>
        <p class="detail-html__meta"></p>
        <p class="detail-html__stack"></p>
        <p class="detail-html__links"></p>
      </div>`;
    const status = statusFor(project);
    const cover = html.querySelector('.detail-html__cover');
    if (project.cover) {
      cover.src = `${BASE}${project.cover}`;
      cover.alt = project.alt || project.title;
    } else {
      cover.remove();
    }
    html.querySelector('.detail-html__title').textContent = project.title;
    html.querySelector('.detail-html__value').textContent = project.value;
    html.querySelector('.detail-html__meta').textContent = `${project.role} · ${project.period} · ${status.label}`;
    html.querySelector('.detail-html__stack').textContent = (project.stack ?? []).join(' / ');
    const linksEl = html.querySelector('.detail-html__links');
    const links = project.links ?? {};
    if (links.live) {
      const a = document.createElement('a');
      a.href = links.live; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = '在线演示';
      linksEl.append(a);
    }
    if (links.repo) {
      const a = document.createElement('a');
      a.href = links.repo; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = '公开仓库';
      linksEl.append(a);
    }
    if (!links.live && !links.repo) linksEl.textContent = '本地 / 复盘项目，无公开链接';
    host.append(html);
  }

  overlay.hidden = false;
  wasOpen = true;
  document.addEventListener('keydown', trapFocus, true);
  if (!historyPushed) {
    try {
      history.pushState({ dshDetail: project.slug ?? 'detail' }, '', location.href);
      historyPushed = true;
    } catch { /* 某些环境禁止 pushState，忽略 */ }
  }
  requestAnimationFrame(() => overlay.querySelector('.detail-close')?.focus());
  return true;
}

export { close as closeProjectDetail };
