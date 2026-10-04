/**
 * CampusConnect — Playful & High-Energy Anime.js Animation Engine
 * Handles staggered entrances, number counter tickers, button spring physics,
 * and floating geometric ambient motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initStatTickers();
  initBentoCardEntrances();
  initButtonPhysics();
  initFloatingGeometry();
});

/**
 * 1. Hero Section Entrance Animation
 */
function initHeroAnimations() {
  if (!document.querySelector('.anime-hero-title')) return;

  const tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 900
  });

  tl
    .add({
      targets: '.hero-pill-badge',
      translateY: [-25, 0],
      opacity: [0, 1],
      duration: 700
    })
    .add({
      targets: '.anime-hero-title',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 1000
    }, '-=500')
    .add({
      targets: '.anime-hero-lead',
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 800
    }, '-=600')
    .add({
      targets: '.anime-hero-cta .btn',
      translateY: [20, 0],
      opacity: [0, 1],
      scale: [0.92, 1],
      delay: anime.stagger(120),
      duration: 800
    }, '-=500')
    .add({
      targets: '.anime-hero-preview',
      translateY: [60, 0],
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 1100
    }, '-=700')
    .add({
      targets: '.floating-badge-card',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      duration: 900
    }, '-=600');
}

/**
 * 2. Animated Number Ticker Counters
 */
function initStatTickers() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  statElements.forEach(el => {
    const rawTarget = el.getAttribute('data-target') || el.innerText.replace(/[^0-9]/g, '');
    const targetValue = parseInt(rawTarget, 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    if (isNaN(targetValue)) return;

    el.innerText = prefix + '0' + suffix;

    const obj = { value: 0 };
    anime({
      targets: obj,
      value: targetValue,
      round: 1,
      easing: 'easeOutExpo',
      duration: 2200,
      update: () => {
        el.innerText = prefix + obj.value.toLocaleString() + suffix;
      }
    });
  });
}

/**
 * 3. Staggered Bento Cards Entrance
 */
function initBentoCardEntrances() {
  const cards = document.querySelectorAll('.anime-card');
  if (!cards.length) return;

  anime({
    targets: cards,
    translateY: [40, 0],
    opacity: [0, 1],
    delay: anime.stagger(100, { start: 200 }),
    duration: 800,
    easing: 'easeOutCubic'
  });
}

/**
 * 4. Playful Spring Physics on Buttons
 */
function initButtonPhysics() {
  const buttons = document.querySelectorAll('.btn-editorial-primary, .btn-editorial-outline, .spring-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      anime.remove(btn);
      anime({
        targets: btn,
        scale: 1.04,
        duration: 300,
        easing: 'easeOutElastic(1, .6)'
      });
    });

    btn.addEventListener('mouseleave', () => {
      anime.remove(btn);
      anime({
        targets: btn,
        scale: 1.0,
        duration: 350,
        easing: 'easeOutElastic(1, .5)'
      });
    });

    btn.addEventListener('mousedown', () => {
      anime({
        targets: btn,
        scale: 0.94,
        duration: 150,
        easing: 'easeOutQuad'
      });
    });

    btn.addEventListener('mouseup', () => {
      anime({
        targets: btn,
        scale: 1.04,
        duration: 250,
        easing: 'easeOutElastic(1, .5)'
      });
    });
  });
}

/**
 * 5. Ambient Floating Geometry (Playful Infinite Drift)
 */
function initFloatingGeometry() {
  const floaters = document.querySelectorAll('.floating-geo');
  if (!floaters.length) return;

  floaters.forEach((floater, i) => {
    const deltaX = (i % 2 === 0 ? 1 : -1) * (15 + i * 5);
    const deltaY = (i % 2 === 0 ? -1 : 1) * (12 + i * 4);
    const rot = (i % 2 === 0 ? 15 : -20);

    anime({
      targets: floater,
      translateX: [0, deltaX],
      translateY: [0, deltaY],
      rotate: [0, rot],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 3500 + i * 800
    });
  });
}

/**
 * 6. Particle Burst Celebration Utility (for Enrollments & Actions)
 */
function triggerCelebrationBurst(x, y) {
  const burstContainer = document.createElement('div');
  burstContainer.style.position = 'fixed';
  burstContainer.style.left = (x || window.innerWidth / 2) + 'px';
  burstContainer.style.top = (y || window.innerHeight / 2) + 'px';
  burstContainer.style.pointerEvents = 'none';
  burstContainer.style.zIndex = '99999';
  document.body.appendChild(burstContainer);

  const colors = ['#C2410C', '#1E3A8A', '#D97706', '#059669', '#E11D48'];
  const particles = [];

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = (6 + Math.random() * 6) + 'px';
    p.style.height = p.style.width;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    burstContainer.appendChild(p);
    particles.push(p);
  }

  anime({
    targets: particles,
    translateX: () => (Math.random() - 0.5) * 320,
    translateY: () => (Math.random() - 0.5) * 320,
    scale: [1, 0],
    rotate: () => Math.random() * 360,
    opacity: [1, 0],
    duration: 1200,
    easing: 'easeOutExpo',
    complete: () => {
      burstContainer.remove();
    }
  });
}

window.triggerCelebrationBurst = triggerCelebrationBurst;
