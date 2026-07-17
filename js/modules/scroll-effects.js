/**
 * Scroll Effects - Reveal animations & Count-up
 */
export const ScrollEffects = {
  init() {
    this.setupScrollReveal();
    this.setupCountUp();
  },

  setupScrollReveal() {
    const selectors = [
      '.tool-card', '.challenge-banner', '.platform-card',
      '.march-banner', '.section-title', '.ext-card',
      '.dl-banner', '.updated-strip', '.collab-section',
      '.terminal-section', '.ama-section'
    ];
    
    const els = document.querySelectorAll(selectors.join(','));
    els.forEach(el => el.classList.add('reveal'));
    
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    
    els.forEach(el => io.observe(el));
  },

  setupCountUp() {
    const countUp = (el, target, duration) => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if(progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
    };

    const statNums = document.querySelectorAll('.stat-num, .march-stat-num, .dl-total');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          const raw = e.target.textContent.replace(/,/g, '').replace('+', '').trim();
          const n = parseFloat(raw);
          if(!isNaN(n)) {
            countUp(e.target, n, 1500);
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNums.forEach(el => io.observe(el));
  }
};
