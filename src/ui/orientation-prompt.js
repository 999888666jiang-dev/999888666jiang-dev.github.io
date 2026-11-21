// M5.5 竖屏引导：浏览器不能强制翻转，只能“提示 + 尝试全屏并锁横屏 + 失败降级为手动旋转”。
// 规则：仅 (orientation: portrait) and (max-width:640px) and 粗指针 时提示；>640 不弹；横屏自动隐藏。
// sessionStorage 'orientationPromptDismissed' 记录本会话不再弹；无 JS 时只有 CSS 顶部横幅（不锁滚动）。

const KEY = 'orientationPromptDismissed';
const mqPortrait = matchMedia('(orientation: portrait) and (max-width: 640px)');
const mqCoarse = matchMedia('(pointer: coarse)');

const isCoarse = () => mqCoarse.matches || (navigator.maxTouchPoints ?? 0) > 0;

const readDismissed = () => {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
};
const writeDismissed = () => {
  try { sessionStorage.setItem(KEY, '1'); } catch { /* 隐私模式忽略 */ }
};

function buildDialog() {
  const wrap = document.createElement('div');
  wrap.className = 'orientation-prompt';
  wrap.hidden = true;
  wrap.innerHTML = `
    <div class="orientation-card" role="dialog" aria-modal="true"
         aria-labelledby="orientation-title" aria-describedby="orientation-desc">
      <h2 class="orientation-title" id="orientation-title">建议横屏浏览</h2>
      <p class="orientation-desc" id="orientation-desc">这个页面按横屏构图，竖屏会挤压标题和卡片。把手机横过来，或点下面按钮尝试全屏横屏。</p>
      <div class="orientation-actions">
        <button type="button" class="orientation-primary">尝试全屏横屏</button>
        <button type="button" class="orientation-secondary">仍要竖屏浏览</button>
      </div>
      <p class="orientation-fallback" hidden>请手动旋转手机。</p>
      <p class="orientation-hint">部分浏览器不支持自动横屏，可手动旋转手机。</p>
    </div>`;
  document.body.append(wrap);
  return wrap;
}

export function initOrientationPrompt() {
  if (document.documentElement.classList.contains('orientation-js')) return null;
  document.documentElement.classList.add('orientation-js');

  let wrap = null;
  let card = null;
  let primary = null;
  let secondary = null;
  let fallback = null;
  let lastFocus = null;
  let savedScrollY = 0;
  let open = false;
  let scrollLocked = false;

  const shouldPrompt = () => mqPortrait.matches && isCoarse() && !readDismissed();

  const lockScroll = () => {
    if (scrollLocked) return;
    savedScrollY = window.scrollY;
    document.documentElement.classList.add('orientation-lock');
    document.body.style.overflow = 'hidden';
    scrollLocked = true;
  };
  const unlockScroll = () => {
    if (!scrollLocked) return;
    document.documentElement.classList.remove('orientation-lock');
    document.body.style.overflow = '';
    scrollLocked = false;
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  };

  const show = () => {
    if (open) return;
    wrap = wrap ?? buildDialog();
    card = wrap.querySelector('.orientation-card');
    primary = wrap.querySelector('.orientation-primary');
    secondary = wrap.querySelector('.orientation-secondary');
    fallback = wrap.querySelector('.orientation-fallback');
    lastFocus = document.activeElement;
    wrap.hidden = false;
    open = true;
    lockScroll();
    requestAnimationFrame(() => primary?.focus());
  };

  const close = ({ dismiss = true, restoreFocus = true } = {}) => {
    if (!open) return;
    wrap.hidden = true;
    open = false;
    document.removeEventListener('keydown', onKeyDown, true);
    if (dismiss) writeDismissed();
    unlockScroll();
    if (restoreFocus && lastFocus && document.contains(lastFocus)) {
      try { lastFocus.focus({ preventScroll: true }); } catch { /* noop */ }
    }
  };

  const tryLandscape = async () => {
    if (fallback) fallback.hidden = true;
    try {
      const root = document.documentElement;
      if (root.requestFullscreen) await root.requestFullscreen({ navigationUI: 'hide' });
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
      const orientation = window.screen?.orientation;
      if (orientation?.lock) await orientation.lock('landscape');
      close();
    } catch {
      // 不支持/被拒绝：退出全屏，提示手动旋转；不报错、不假装成功
      try {
        if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
      } catch { /* noop */ }
      if (fallback) fallback.hidden = false;
    }
  };

  const onKeyDown = (event) => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...card.querySelectorAll('button:not([disabled])')];
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
  };

  const bind = () => {
    if (!primary) return;
    primary.addEventListener('click', tryLandscape);
    secondary.addEventListener('click', () => close());
    // Esc / Tab 锁在 document 上（焦点可能落在遮罩或 body 上）
    document.addEventListener('keydown', onKeyDown, true);
  };

  const evaluate = () => {
    if (mqPortrait.matches && isCoarse() && !readDismissed()) {
      if (!open) {
        show();
        bind();
      }
    } else if (open) {
      // 旋转到横屏 / 视口变化后不再满足条件 → 关闭并记录本会话
      close({ dismiss: true });
    }
  };

  mqPortrait.addEventListener?.('change', evaluate);
  mqCoarse.addEventListener?.('change', evaluate);
  addEventListener('orientationchange', evaluate);
  let timer = 0;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(evaluate, 120);
  }, { passive: true });
  window.visualViewport?.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(evaluate, 120);
  });

  if (shouldPrompt()) {
    // 等首屏稳定再弹，避免和开场动画抢焦点
    if ('requestIdleCallback' in window) requestIdleCallback(() => evaluate(), { timeout: 1200 });
    else setTimeout(evaluate, 600);
  }

  return { evaluate, close, shouldPrompt };
}
