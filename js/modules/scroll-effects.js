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
    const countUp = (el, target, duration, suffix) => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if(progress < 1) requestAnimationFrame(step);
        else el.textContent = el.dataset.finalText || target.toLocaleString() + suffix;
      };
      requestAnimationFrame(step);
    };

    const statNums = document.querySelectorAll('.stat-num, .march-stat-num, .dl-total');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          const text = e.target.textContent.trim();
          const suffix = text.endsWith('+') ? '+' : '';
          const raw = text.replace(/,/g, '').replace('+', '');
          const n = parseFloat(raw);
          if(!isNaN(n)) {
            countUp(e.target, n, 1500, suffix);
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNums.forEach(el => io.observe(el));
  }
};
