import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './lanyard.jsx';

// §5.1 表格：卡片高 / layer 高 = size；卡片 top / layer 高 = strapLength。
// layer 高恒为 100vh，因此 size/strapLength 可直接由目标像素反推（视口切换时重算）。
function metrics() {
  const w = innerWidth;
  const h = innerHeight;
  const landscape = matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
  if (landscape) return { cardW: 220, cardH: 293, top: 80 };
  if (w >= 900) return { cardW: 374, cardH: 486, top: 168 };
  if (w >= 640) return { cardW: 300, cardH: 400, top: 300 };
  return { cardW: 240, cardH: 320, top: 244 };
}

function toProps() {
  const m = metrics();
  const h = innerHeight;
  return {
    cardW: m.cardW,
    cardH: m.cardH,
    top: m.top,
    size: m.cardH / h,
    strapLength: m.top / h,
    isMobile: innerWidth < 900,
    landscape: matchMedia('(orientation: landscape) and (max-height: 500px)').matches
  };
}

function LanyardIsland({ front, back }) {
  const [p, setP] = useState(toProps);
  useEffect(() => {
    const sync = () => setP(toProps());
    addEventListener('resize', sync);
    addEventListener('orientationchange', sync);
    return () => {
      removeEventListener('resize', sync);
      removeEventListener('orientationchange', sync);
    };
  }, []);

  return (
    <Lanyard
      frontImage={front}
      backImage={back}
      orientation="portrait"
      size={p.size}
      finish="matte"
      cornerRadius={0.3}
      anchor="center"
      strapColor="#2b3033"
      strapWidth={0.8}
      strapLength={p.strapLength}
      metal="graphite"
      gravity={1.05}
      damping={0.5}
      elasticity={0.85}
      breeze={0.65}
      interactive
      intro={!p.isMobile}
    />
  );
}

// 指针代理：canvas pointer-events:none；hit 代理把指针事件转发给 canvas，
// 让卡片可拖拽/甩出 rest bbox 并松手回摆，同时不挡页面其它区域。
function bindHitProxy(layer) {
  const hit = layer.querySelector('[data-lanyard-hit]');
  const canvasOf = () => layer.querySelector('canvas');
  const forward = (type) => (event) => {
    const canvas = canvasOf();
    if (!canvas) return;
    const Ctor = type.startsWith('pointer') ? PointerEvent : MouseEvent;
    const evt = new Ctor(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: event.clientX,
      clientY: event.clientY,
      button: event.button ?? 0,
      buttons: event.buttons ?? 0,
      pointerId: event.pointerId ?? 1,
      pointerType: event.pointerType ?? 'mouse',
      isPrimary: true
    });
    canvas.dispatchEvent(evt);
  };
  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) {
    hit.addEventListener(type, forward(type));
  }
  hit.addEventListener('click', forward('click'));
  return hit;
}

export function mountLanyard({ front, back }) {
  const layer = document.querySelector('[data-lanyard-layer]');
  if (!layer) return null;
  const mount = layer.querySelector('[data-lanyard-3d]');
  if (!mount) return null;
  const staticCard = layer.querySelector('.lanyard-card');
  const strap = layer.querySelector('.lanyard-css-strap');
  const clamp = layer.querySelector('.lanyard-clamp');

  const root = createRoot(mount);
  root.render(<LanyardIsland front={front} back={back} />);
  bindHitProxy(layer);

  let tries = 0;
  const revealCanvas = () => {
    const canvas = mount.querySelector('canvas');
    if (canvas) {
      canvas.style.pointerEvents = 'none';
      document.documentElement.dataset.lanyardState = 'three';
      layer.dataset.islandState = 'three';
      staticCard?.classList.add('lanyard-card--hidden');
      strap?.classList.add('lanyard-css-strap--hidden');
      clamp?.classList.add('lanyard-clamp--hidden');
      return;
    }
    if (tries++ < 40) setTimeout(revealCanvas, 100);
    else document.documentElement.dataset.lanyardState = 'static';
  };
  setTimeout(revealCanvas, 120);

  return { root };
}
