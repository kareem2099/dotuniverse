/**
 * Particle System with Spatial Grid Optimization
 * ✅ Performance: O(n) instead of O(n²)
 * ✅ Supports: responsive canvas, dynamic particle count
 * ✅ Mobile: auto-reduce on low-end devices
 */

export const ParticleSystem = {
  init(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.grid = [];
    
    // Configuration
    this.gridSize = options.gridSize || 150;
    this.particleCount = options.count || 55;
    this.connectDist = options.connectDist || 120;
    this.colors = options.colors || [
      'rgba(0,229,255,',
      'rgba(57,255,20,',
      'rgba(255,107,53,'
    ];
    
    // Detect mobile for optimization
    this.isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    if(this.isMobile) {
      this.particleCount = Math.floor(this.particleCount * 0.5);  // 50% reduction
    }
    
    this.setup();
    this.animate();
  },

  setup() {
    // Responsive canvas sizing
    const resize = () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.rebuildGrid();
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Create particles
    for(let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        colorIdx: Math.floor(Math.random() * this.colors.length),
        alpha: Math.random() * 0.5 + 0.15
      });
    }
  },

  rebuildGrid() {
    const cols = Math.ceil(this.width / this.gridSize);
    const rows = Math.ceil(this.height / this.gridSize);
    this.gridCols = cols;
    this.gridRows = rows;
    this.grid = Array.from({length: rows * cols}, () => []);
    
    // Place particles in grid cells
    this.particles.forEach((p, idx) => {
      const cx = Math.max(0, Math.min(cols - 1, Math.floor(p.x / this.gridSize)));
      const cy = Math.max(0, Math.min(rows - 1, Math.floor(p.y / this.gridSize)));
      this.grid[cy * cols + cx].push(idx);
    });
  },

  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    this.ctx.fillStyle = this.colors[p.colorIdx] + p.alpha + ')';
    this.ctx.fill();
  },

  drawConnections() {
    const connectDistSq = this.connectDist * this.connectDist;
    const checked = new Set();
    const cols = this.gridCols;
    
    this.particles.forEach((p, i) => {
      const cx = Math.floor(p.x / this.gridSize);
      const cy = Math.floor(p.y / this.gridSize);
      const neighbors = new Set();
      
      // Check 3x3 grid around particle
      for(let dy = -1; dy <= 1; dy++) {
        for(let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if(nx >= 0 && nx < cols && ny >= 0 && ny < this.gridRows) {
            const idx = ny * cols + nx;
            if(this.grid[idx]) {
              this.grid[idx].forEach(j => neighbors.add(j));
            }
          }
        }
      }
      
      // Draw lines to nearby neighbors
      neighbors.forEach(j => {
        if(i >= j) return; // Avoid duplicate pairs
        
        const key = `${i},${j}`;
        if(checked.has(key)) return;
        checked.add(key);
        
        const dx = p.x - this.particles[j].x;
        const dy = p.y - this.particles[j].y;
        const distSq = dx * dx + dy * dy;
        
        if(distSq < connectDistSq) {
          const dist = Math.sqrt(distSq);
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'rgba(0,229,255,' + (0.06 * (1 - dist / this.connectDist)) + ')';
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      });
    });
  },

  animate(timestamp = 0) {
    // Mobile: cap at 30fps (skip frames to halve CPU usage)
    if(this.isMobile) {
      const elapsed = timestamp - (this._lastFrame || 0);
      if(elapsed < 33) { // 33ms = ~30fps
        requestAnimationFrame(ts => this.animate(ts));
        return;
      }
      this._lastFrame = timestamp;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around screen
      if(p.x < 0) p.x = this.width;
      if(p.x > this.width) p.x = 0;
      if(p.y < 0) p.y = this.height;
      if(p.y > this.height) p.y = 0;
      
      this.drawParticle(p);
    });
    
    // Draw connections using spatial grid
    this.rebuildGrid();
    this.drawConnections();
    
    requestAnimationFrame(ts => this.animate(ts));
  }
};
