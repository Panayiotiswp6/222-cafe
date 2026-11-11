import {useEffect, useState} from 'react';
import {ArrowUpRight} from 'lucide-react';

/** Animated 222 logo intro. Rendered on the server so there is no flash; removed after the animation. */
export function SplashScreen() {
  const [phase, setPhase] = useState<'show' | 'leave' | 'gone'>('show');
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = sessionStorage.getItem('222-splash') === '1'; sessionStorage.setItem('222-splash', '1'); } catch { /* storage disabled */ }
    const hold = reduced ? 300 : seen ? 900 : 2300;
    const a = window.setTimeout(() => setPhase('leave'), hold);
    const b = window.setTimeout(() => setPhase('gone'), hold + 900);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('splash-active', phase === 'show');
    return () => document.documentElement.classList.remove('splash-active');
  }, [phase]);
  if (phase === 'gone') return null;
  return <div className={`splash ${phase === 'leave' ? 'is-leaving' : ''}`} aria-hidden="true" onClick={() => setPhase('leave')}>
    <div className="splash-inner">
      <svg className="splash-ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92"/></svg>
      <div className="splash-steam"><span/><span/><span/></div>
      <div className="splash-digits"><span>2</span><span>2</span><span>2</span></div>
      <div className="splash-rule"/>
      <p className="splash-name">ESPRESSO BAR</p>
      <p className="splash-place">ZOGRAFOU · ATHENS</p>
    </div>
  </div>;
}

/** Thin progress line at the top of the page. */
export function ScrollProgress() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('.scroll-progress');
    let raf = 0;
    const update = () => { raf = 0; const max = document.documentElement.scrollHeight - window.innerHeight; if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`; };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); document.documentElement.classList.toggle('is-scrolled', window.scrollY > 40); };
    update(); window.addEventListener('scroll', onScroll, {passive: true}); window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"/>;
}

/** Floating order button that appears once the visitor scrolls past the opening image. */
export function FloatingOrder({href, label}: {href: string; label: string}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => { const footer = document.querySelector('.footer')?.getBoundingClientRect(); setVisible(window.scrollY > window.innerHeight * 0.8 && !(footer && footer.top < window.innerHeight)); };
    onScroll(); window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <a className={`floating-order ${visible ? 'is-visible' : ''}`} href={href} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1}>
    <span className="floating-order-dot"/>{label}<ArrowUpRight size={16}/>
  </a>;
}

const REVEAL = ['.ambient-story-content > *', '.ambient-reasons li', '.ambient-coffee-content > *', '.section-heading', '.menu-tabs', '.menu-card', '.menu-bottom', '.ambient-space-content > *', '.ambient-visit-copy > *', '.ambient-map', '.footer-top', '.footer-main'].join(',');

/** Gentle fade-up of content as it scrolls into view. Content stays visible if JS or the observer is unavailable. */
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement; root.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => { for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); observer.unobserve(e.target); } }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
    const scan = () => document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
      if (el.dataset.reveal) return; el.dataset.reveal = '1';
      const siblings = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty('--reveal-delay', `${Math.min(siblings, 6) * 80}ms`); observer.observe(el);
    });
    scan();
    const mo = new MutationObserver(scan); mo.observe(document.getElementById('main') ?? document.body, {childList: true, subtree: true});
    return () => { observer.disconnect(); mo.disconnect(); root.classList.remove('reveal-ready'); };
  }, []);
}
