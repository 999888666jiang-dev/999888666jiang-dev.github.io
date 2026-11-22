import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import CircularGallery from './circular-gallery.jsx';
import { siteContent } from '../content/site-content.js';
import './circular-gallery.css';

const BASE = import.meta.env.BASE_URL;
const SUFFIX = { experiment: '（实验）', local: '（本地）', 'case-study': '（复盘）' };

function gallerySize() {
  // X-08：组件内部 cardHeight = 0.6 × 容器高 × itemSize；按锁定目标卡高反推
  if (matchMedia('(orientation: landscape) and (max-height: 500px)').matches) return { itemSize: 1.2, autoScroll: 0.15 };
  if (matchMedia('(max-width: 639px)').matches) return { itemSize: 1.15, autoScroll: 0.15 };
  if (matchMedia('(max-width: 899px)').matches) return { itemSize: 1.2, autoScroll: 0.15 };
  return { itemSize: 1.3, autoScroll: 0.15 };
}

export function buildGalleryItems() {
  return (siteContent.projects ?? []).map((project) => ({
    image: `${BASE}${project.cover}`,
    text: `${project.title ?? '作品'}${SUFFIX[project.sourceType] ?? ''}`,
    description: project.value ?? '',
    alt: project.alt || project.title || '作品封面',
    slug: project.slug
  }));
}

function openDetail(slug, index, triggerOverride = null) {
  if (document.querySelector('.detail-modal:not([hidden])')) return; // opening guard：防双开
  const trigger = triggerOverride ?? document.querySelector('.circular-gallery');
  import('./reflective-card-mount.jsx')
    .then(({ openProjectDetail }) => openProjectDetail(slug, { trigger }))
    .catch((error) => console.warn('[detail] 详情卡加载失败', error));
}

function GalleryApp({ reduced }) {
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(gallerySize);

  useEffect(() => {
    const sync = () => setSize(gallerySize());
    addEventListener('resize', sync);
    addEventListener('orientationchange', sync);
    return () => {
      removeEventListener('resize', sync);
      removeEventListener('orientationchange', sync);
    };
  }, []);

  useEffect(() => {
    const pause = () => setPaused(true);
    const resume = () => setPaused(false);
    addEventListener('gallery:pause', pause);
    addEventListener('gallery:resume', resume);
    return () => {
      removeEventListener('gallery:pause', pause);
      removeEventListener('gallery:resume', resume);
    };
  }, []);

  // 键盘路径：Tab 到隐藏列表按钮 → Enter/Space 打开详情卡（与鼠标点击共用同一 openDetail）
  useEffect(() => {
    const root = document.querySelector('.circular-gallery');
    if (!root) return;
    const indexOfButton = (btn) => {
      const buttons = [...root.querySelectorAll('[data-gallery-list] button')];
      return buttons.indexOf(btn);
    };
    const onClick = (event) => {
      const btn = event.target.closest?.('[data-gallery-list] button');
      if (!btn) return;
      const index = indexOfButton(btn);
      if (index >= 0) openDetail(buildGalleryItems()[index]?.slug, index);
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const galleryEl = root;
      const active = galleryEl.querySelector('[data-gallery-list] button[aria-current="true"]');
      const index = active ? indexOfButton(active) : -1;
      if (index < 0) return;
      event.preventDefault();
      openDetail(buildGalleryItems()[index]?.slug, index, galleryEl);
    };
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown, true);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  // wheel 严格性：轮播聚焦后 / Shift+指针在轮播上时，捕获阶段先 preventDefault，页面位移严格为 0
  useEffect(() => {
    const onWheelCapture = (event) => {
      const gallery = document.querySelector('.circular-gallery');
      const focused = gallery && (gallery.contains(document.activeElement) || gallery.matches(':focus-within'));
      const shiftOver = gallery && event.shiftKey && gallery.contains(event.target);
      if (focused || shiftOver) event.preventDefault();
    };
    addEventListener('wheel', onWheelCapture, { capture: true, passive: false });
    return () => removeEventListener('wheel', onWheelCapture, { capture: true });
  }, []);

  return (
    <CircularGallery
      items={buildGalleryItems()}
      bend={0.8}
      itemSize={size.itemSize}
      itemAspect={1.2}
      gap={0.16}
      borderRadius={0.12}
      wave={reduced ? 0 : 1.5}
      fadeEdges={0.1}
      shadow={0.8}
      scrollSpeed={3.5}
      scrollEase={0.12}
      snap
      autoScroll={paused || reduced ? 0 : size.autoScroll}
      grayscale={false}
      openOnClick={false}
      intro={!reduced}
      dpr={Math.min(window.devicePixelRatio || 1, 2)}
      textColor="#ffffff"
      fontUrl={`${BASE}fonts/Inter-SemiBold.woff2`}
      onItemClick={(item, index) => openDetail(item?.slug, index)}
    />
  );
}

// M6.2：把静态网格替换为 CircularGallery（失败时不调用，保留静态网格）
export function mountGallery({ reduced = false } = {}) {
  const stage = document.querySelector('[data-projects-stage]');
  const host = stage?.querySelector('[data-gallery-mount]');
  const section = document.getElementById('projects');
  if (!stage || !host || !section) return null;
  const root = createRoot(host);
  root.render(<GalleryApp reduced={reduced} />);
  stage.hidden = false;
  section.dataset.view = 'gallery';
  section.dataset.islandState = 'gallery';
  // 验收/调试用：暴露 X-08 锁值与组件公式下的预期卡高（不参与渲染）
  const syncMetrics = () => {
    const { itemSize } = gallerySize();
    const cardH = Math.round(0.6 * stage.getBoundingClientRect().height * itemSize);
    section.dataset.itemSize = String(itemSize);
    section.dataset.cardHeight = String(cardH);
  };
  syncMetrics();
  addEventListener('resize', syncMetrics);
  addEventListener('orientationchange', syncMetrics);
  return { root };
}
