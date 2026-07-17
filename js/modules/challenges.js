/**
 * Challenges Module - Progress Bar Animations
 */
export const Challenges = {
  init() {
    this.setupBars();
    this.setupBarAnimation();
  },

  setupBars() {
    const rows = document.querySelectorAll('#challengeGrid .challenge-row');
    rows.forEach(row => {
      const now = parseFloat(row.dataset.now);
      const goal = parseFloat(row.dataset.goal);
      const color = row.dataset.color;
      const pct = Math.min(100, (now / goal) * 100);

      const fill = row.querySelector('.bar-fill');
      if(fill) {
        fill.style.width = pct.toFixed(1) + '%';
        fill.style.background = color;
      }

      const delta = row.querySelector('.challenge-delta');
      if(delta) delta.style.color = color;

      const badge = row.querySelector('.pct-badge');
      if(badge) badge.textContent = pct.toFixed(0) + '%';
    });
  },

  setupBarAnimation() {
    const bars = document.querySelectorAll('.bar-fill');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          setTimeout(() => e.target.classList.add('animated'), 200);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    
    bars.forEach(b => io.observe(b));
  }
};
