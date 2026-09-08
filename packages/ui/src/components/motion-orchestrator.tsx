'use client';

import { useEffect } from 'react';

const REVEAL_SELECTOR = [
  'main > section:not(:first-child)',
  'main > div:not(:first-child)',
  '[data-reveal]',
].join(',');

const HERO_SELECTOR = '.tech-cinematic-hero, .store-cinematic-hero';

export function MotionOrchestrator() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.classList.add('ah-motion-ready');

    const updateScrollState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty('--ah-scroll-progress', String(Math.min(scrollTop / maxScroll, 1)));
      body.classList.toggle('ah-scrolled', scrollTop > 24);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    revealTargets.forEach((element, index) => {
      element.classList.add('ah-reveal');
      element.style.setProperty('--ah-reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);
    });

    let observer: IntersectionObserver | null = null;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('ah-visible'));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).classList.add('ah-visible');
            observer?.unobserve(entry.target);
          }
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -7% 0px',
        },
      );

      revealTargets.forEach((element) => observer?.observe(element));
    }

    const heroes = Array.from(document.querySelectorAll<HTMLElement>(HERO_SELECTOR));
    const canParallax = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion;

    const pointerHandlers = heroes.map((hero) => {
      const onPointerMove = (event: PointerEvent) => {
        if (!canParallax) return;
        const rect = hero.getBoundingClientRect();
        const x = Math.min(Math.max((event.clientX - rect.left) / Math.max(rect.width, 1), 0), 1);
        const y = Math.min(Math.max((event.clientY - rect.top) / Math.max(rect.height, 1), 0), 1);

        hero.style.setProperty('--ah-pointer-x', `${x * 100}%`);
        hero.style.setProperty('--ah-pointer-y', `${y * 100}%`);
        hero.style.setProperty('--ah-parallax-x', `${(x - 0.5) * 14}px`);
        hero.style.setProperty('--ah-parallax-y', `${(y - 0.5) * 10}px`);
      };

      const onPointerLeave = () => {
        hero.style.setProperty('--ah-pointer-x', '72%');
        hero.style.setProperty('--ah-pointer-y', '44%');
        hero.style.setProperty('--ah-parallax-x', '0px');
        hero.style.setProperty('--ah-parallax-y', '0px');
      };

      hero.addEventListener('pointermove', onPointerMove);
      hero.addEventListener('pointerleave', onPointerLeave);
      return { hero, onPointerMove, onPointerLeave };
    });

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', updateScrollState);
      pointerHandlers.forEach(({ hero, onPointerMove, onPointerLeave }) => {
        hero.removeEventListener('pointermove', onPointerMove);
        hero.removeEventListener('pointerleave', onPointerLeave);
      });
      root.classList.remove('ah-motion-ready');
      body.classList.remove('ah-scrolled');
    };
  }, []);

  return null;
}
