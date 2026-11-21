import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GooeyNav from './gooey-nav.jsx';

let setActiveExternal = null;

function NavIsland({ items, onSelect }) {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(() => (matchMedia('(max-width: 899px)').matches ? 'sm' : 'md'));

  useEffect(() => {
    setActiveExternal = setActive;
    const mq = matchMedia('(max-width: 899px)');
    const onChange = (event) => setSize(event.matches ? 'sm' : 'md');
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      setActiveExternal = null;
    };
  }, []);

  return (
    <GooeyNav
      items={items.map((item) => ({ label: item.label, href: item.target }))}
      activeIndex={active}
      onChange={(index) => {
        setActive(index);
        onSelect?.(index);
        // R-11：激活后把焦点留在对应导航项（键盘用户不丢焦点）
        requestAnimationFrame(() => {
          const links = document.querySelectorAll(
            '.gooey-nav__list:not(.gooey-nav__list--active) .gooey-nav__link'
          );
          links[index]?.focus?.({ preventScroll: true });
        });
      }}
      theme="dark"
      size={size}
      frame={true}
      particleCount={size === 'sm' ? 10 : 14}
      spread={size === 'sm' ? 40 : 50}
      timeVariance={size === 'sm' ? 200 : 300}
      gooeyness={0.5}
      wobble={0.4}
      hoverEffect={true}
      className="site-gooey"
    />
  );
}

export function mountNav({ items, onSelect }) {
  const mount = document.getElementById('nav-mount');
  const fallback = document.querySelector('[data-nav-fallback]');
  if (!mount) return null;

  const root = createRoot(mount);
  root.render(
    <StrictMode>
      <NavIsland items={items} onSelect={onSelect} />
    </StrictMode>
  );

  fallback?.setAttribute('aria-hidden', 'true');
  fallback?.classList.add('nav-fallback--hidden');
  document.documentElement.dataset.nav = 'react';

  return {
    setActive(index) {
      setActiveExternal?.(index);
    }
  };
}
