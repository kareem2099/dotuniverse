/* ── DYNAMIC TIMESTAMP ── */
(function(){
  const now = new Date();
  const opts = { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' };
  const str = now.toLocaleDateString('en-GB', opts).replace(',','');
  document.getElementById('lastUpdated').textContent = str;
  document.getElementById('footerTs').textContent = '// snapshot: ' + str;
})();

/* ── CHALLENGE BARS — calculated from data attributes ── */
(function(){
  const rows = document.querySelectorAll('#challengeGrid .challenge-row');
  rows.forEach(row => {
    const now   = parseFloat(row.dataset.now);
    const goal  = parseFloat(row.dataset.goal);
    const color = row.dataset.color;
    const pct   = Math.min(100, (now / goal) * 100);

    const fill  = row.querySelector('.bar-fill');
    fill.style.width      = pct.toFixed(1) + '%';
    fill.style.background = color;

    const delta = row.querySelector('.challenge-delta');
    delta.style.color = color;

    const badge = row.querySelector('.pct-badge');
    badge.textContent = pct.toFixed(0) + '%';
  });
})();

/* ── PARTICLES ── */
(function(){
  const c   = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function resize(){ W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(0,229,255,','rgba(57,255,20,','rgba(255,107,53,'];
  for(let i=0;i<55;i++){
    pts.push({
      x:Math.random()*2000, y:Math.random()*1200,
      r:Math.random()*1.4+0.4,
      vx:(Math.random()-.5)*0.3,
      vy:(Math.random()-.5)*0.3,
      col:COLORS[Math.floor(Math.random()*3)],
      a:Math.random()*0.5+0.15
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.col+p.a+')';
      ctx.fill();
    });
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.strokeStyle='rgba(0,229,255,'+(0.06*(1-dist/120))+')';
          ctx.lineWidth=0.5;
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── SCROLL REVEAL ── */
(function(){
  const els = document.querySelectorAll(
    '.tool-card,.challenge-banner,.platform-card,.march-banner,.section-title,.ext-card,.dl-banner,.updated-strip,.collab-section,.terminal-section,.ama-section'
  );
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  },{ threshold:0.08 });
  els.forEach(el => io.observe(el));
})();

/* ── ANIMATE BARS on scroll ── */
(function(){
  const bars = document.querySelectorAll('.bar-fill');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        setTimeout(()=> e.target.classList.add('animated'), 200);
        io.unobserve(e.target);
      }
    });
  },{ threshold:0.3 });
  bars.forEach(b => io.observe(b));
})();

/* ── COUNT-UP for stats ── */
(function(){
  function countUp(el, target, dur){
    const start = performance.now();
    function step(now){
      const p = Math.min((now-start)/dur,1);
      const ease = 1-Math.pow(1-p,3);
      el.textContent = Math.round(ease*target).toLocaleString();
      if(p<1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  const statNums = document.querySelectorAll('.stat-num, .march-stat-num, .dl-total');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const raw = e.target.textContent.replace(/,/g,'').replace('+','').trim();
        const n = parseFloat(raw);
        if(!isNaN(n)) countUp(e.target,n,1800);
        io.unobserve(e.target);
      }
    });
  },{ threshold:0.5 });
  statNums.forEach(el => io.observe(el));
})();

/* ── CURSOR GLOW TRAIL ── */
(function(){
  const trail=[];
  for(let i=0;i<8;i++){
    const d=document.createElement('div');
    d.style.cssText=`
      position:fixed;pointer-events:none;border-radius:50%;z-index:9999;
      width:${6-i*0.5}px;height:${6-i*0.5}px;
      background:rgba(0,229,255,${0.35-i*0.04});
      transition:left ${0.05+i*0.03}s,top ${0.05+i*0.03}s;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(d);
    trail.push(d);
  }
  window.addEventListener('mousemove',e=>{
    trail.forEach(d=>{ d.style.left=e.clientX+'px'; d.style.top=e.clientY+'px'; });
  });
})();

/* ── TERMINAL CONTACT ── */
const output   = document.getElementById('termOutput');
const inputEl  = document.getElementById('termInput');
const history  = [];
let histIdx    = -1;
let currentPath = '~';
let installedPackages = new Set(); // Track installed packages
let tabMatches = [];
let tabIdx = -1;
let lastTabInput = '';
const fileSystem = {
  '~': ['tools/', 'platforms/', 'challenges/', 'README.md', 'brain.exe', '.env', 'todo.md'],
  '~/tools': ['DotGhostBoard', 'dotcommand', 'CodeTune', 'DotShare', 'DotFetch', 'DotReadme'],
  '~/platforms': ['dev.to', 'linkedin', 'github', 'tiktok'],
  '~/challenges': ['april-2026.log']
};

// File data for nano editor (persistent during session)
let fileData = {
  'README.md': "# FreeRave Portfolio v1.0.0\n\nWelcome to the dotUniverse.\nType 'help' to see what you can do here.\n\n[Author]: Kareem (FreeRave)\n[Tools]: 20+ open source projects\n[License]: MIT",
  'todo.md': "[✓] Reach 2k followers\n[✓] Build dotUniverse Ecosystem\n[ ] Finish military service (In Progress...)\n[ ] World Domination\n[ ] Drink more coffee ☕",
  'brain.exe': "Error: Binary file cannot be edited.\nReason: Human consciousness not yet fully digitized.\nTry: 'neofetch' for system specs.",
  '.env': "PORT=3000\nDB_URL=mongodb://localhost:27017/top_secret\nSECRET_KEY=I_LOVE_TERMINALS_123\nAPI_KEY=FreeRave_is_the_best"
};

function addLine(html, cls = '') {
  const s = document.createElement('span');
  s.className = 't-line ' + cls;
  s.innerHTML = html;
  output.appendChild(s);
  output.scrollTop = output.scrollHeight;
}

function addPromptLine(cmd) {
  // Check if command contains a valid path
  const parts = cmd.trim().split(/\s+/);
  const command = parts[0]?.toLowerCase();
  const arg = parts[1] || '';
  let isBold = false;
  
  // Check for cd or ls with path argument
  if ((command === 'cd' || command === 'ls') && arg) {
    const cleanArg = arg.replace(/\/$/, '');
    let targetPath = currentPath;
    
    if (cleanArg === '..') {
      if (currentPath !== '~') {
        const pathParts = currentPath.split('/');
        pathParts.pop();
        targetPath = pathParts.join('/') || '~';
      }
    } else if (cleanArg === '~' || cleanArg === '/') {
      targetPath = '~';
    } else if (cleanArg.startsWith('~/')) {
      targetPath = cleanArg;
    } else if (currentPath === '~') {
      targetPath = `~/${cleanArg}`;
    } else {
      targetPath = `${currentPath}/${cleanArg}`;
    }
    
    // Check if path exists in fileSystem
    if (fileSystem[targetPath]) {
      isBold = true;
    }
  }
  
  if (isBold) {
    addLine(`<span class="t-prompt">FreeRave@kali:${currentPath}$</span> <span class="t-cmd" style="font-weight:bold;">${escHtml(cmd)}</span>`);
  } else {
    addLine(`<span class="t-prompt">FreeRave@kali:${currentPath}$</span> <span class="t-cmd">${escHtml(cmd)}</span>`);
  }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function parseArgs(str) {
  const args = {};
  const re   = /--(\w+)\s+((?:(?!--)\S)+(?:\s+(?!--)\S+)*)/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    args[m[1]] = m[2].trim();
  }
  return args;
}

// ═══════════════════════════════════════
// 🎯 COMMAND-SPECIFIC ARGUMENT SUGGESTIONS
// ═══════════════════════════════════════
const COMMAND_ARGS = {
  nmap: ['localhost', 'kali', 'ip6-localhost', 'ip6-loopback', '127.0.0.1', '192.168.1.1'],
  ping: ['localhost', 'kali', 'ip6-localhost', 'ip6-loopback', 'google.com', 'github.com'],
  curl: ['https://google.com', 'https://github.com', 'https://api.example.com', 'localhost:3000'],
  apt: ['install', 'update', 'upgrade', 'remove', 'search', 'list', 'autoremove', 'clean'],
};

const COMMANDS = {
  help() {
    addLine('  <span class="t-info">📋 Available commands:</span>');
    addLine('');
    addLine('  <span class="t-white">── Contact ──────────────────────────</span>');
    addLine('  <span class="t-label">contact</span>  <span class="t-val">--name <n> --email <e> --msg <message></span>');
    addLine('  <span class="t-label">ask</span>      <span class="t-val"><your question></span>');
    addLine('  <span class="t-label">collab</span>   <span class="t-val">--idea <project idea></span>');
    addLine('');
    addLine('  <span class="t-white">── System ───────────────────────────</span>');
    addLine('  <span class="t-label">whoami</span>   <span class="t-val">// about FreeRave</span>');
    addLine('  <span class="t-label">neofetch</span> <span class="t-val">// system info</span>');
    addLine('  <span class="t-label">ls</span>       <span class="t-val">// list files</span>');
    addLine('  <span class="t-label">cat</span>      <span class="t-val"><file> // read file</span>');
    addLine('  <span class="t-label">nano</span>     <span class="t-val"><file> // text editor (read-only)</span>');
    addLine('  <span class="t-label">date</span>     <span class="t-val">// current date/time</span>');
    addLine('  <span class="t-label">history</span>  <span class="t-val">// command history</span>');
    addLine('  <span class="t-label">clear</span>    <span class="t-val">// clear terminal</span>');
    addLine('');
    addLine('  <span class="t-white">── Fun ──────────────────────────────</span>');
    addLine('  <span class="t-label">fortune</span>  <span class="t-val">// random dev quote</span>');
    addLine('  <span class="t-label">cowsay</span>   <span class="t-val"><message> // ASCII cow</span>');
    addLine('  <span class="t-label">coffee</span>   <span class="t-val">// virtual coffee ☕</span>');
    addLine('  <span class="t-label">weather</span>  <span class="t-val">// dev weather report</span>');
    addLine('  <span class="t-label">matrix</span>   <span class="t-val">// enter the Matrix</span>');
    addLine('  <span class="t-label">hack</span>     <span class="t-val">// hack the mainframe</span>');
    addLine('  <span class="t-label">ping</span>     <span class="t-val"><host> // ping a server</span>');
    addLine('  <span class="t-label">curl</span>     <span class="t-val"><url> // download files (fake)</span>');
    addLine('  <span class="t-label">sudo</span>     <span class="t-val"><cmd> // superuser mode</span>');
    addLine('  <span class="t-label">apt</span>      <span class="t-val">// package manager</span>');
    addLine('  <span class="t-label">calc</span>     <span class="t-val"><expr> // built-in calculator</span>');
    addLine('  <span class="t-label">rm</span>       <span class="t-val">// remove files (dangerous!)</span>');
    addLine('  <span class="t-label">exit</span>     <span class="t-val">// try to leave</span>');
    addLine('');
    addLine('  <span class="t-dim">// type a command and press Enter</span>');
    addLine('');
  },
  whoami() {
    addLine('');
    addLine('  <span class="t-white">Kareem · FreeRave</span>');
    addLine('  <span class="t-info">────────────────────────────────────</span>');
    addLine('  <span class="t-label">role    </span><span class="t-val">Open-Source Developer</span>');
    addLine('  <span class="t-label">tools   </span><span class="t-val">VS Code · Python · Kotlin · CLI</span>');
    addLine('  <span class="t-label">projects</span><span class="t-val">20+ shipped, all MIT licensed</span>');
    addLine('  <span class="t-label">building</span><span class="t-val">DotSuite ecosystem (20+ tools)</span>');
    addLine('  <span class="t-label">email   </span><span class="t-val">kareem209907@gmail.com</span>');
    addLine('  <span class="t-label">github  </span><span class="t-val">github.com/kareem2099</span>');
    addLine('');
  },
  contact(raw) {
    const a = parseArgs(raw);
    const name  = a.name  || '(anonymous)';
    const email = a.email || '';
    const msg   = a.msg   || '';
    if (!msg) {
      addLine('  <span class="t-error">✖ --msg is required</span>');
      addLine('  <span class="t-dim">example: contact --name Ali --email ali@me.com --msg Hello!</span>');
      addLine('');
      return;
    }
    addLine('  <span class="t-info">Composing message...</span>');
    addLine(`  <span class="t-label">from  </span><span class="t-val">${escHtml(name)} ${email ? '&lt;'+escHtml(email)+'&gt;' : ''}</span>`);
    addLine(`  <span class="t-label">msg   </span><span class="t-val">${escHtml(msg)}</span>`);
    addLine('');
    setTimeout(() => {
      const subject = encodeURIComponent(`[FreeRave Contact] from ${name}`);
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n\n-- Transmitted securely from FreeRave's Terminal`);
      window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
      addLine('  <span class="t-success">✓ Opening mail client...</span>');
      addLine('');
      showToast('✓ Opening your mail client!');
    }, 600);
  },
  ask(raw) {
    const q = raw.replace(/^ask\s*/i,'').trim();
    if (!q) {
      addLine('  <span class="t-error">✖ Please provide a question</span>');
      addLine('  <span class="t-dim">example: ask How do you build VS Code extensions?</span>');
      addLine('');
      return;
    }
    addLine('  <span class="t-info">Routing your question to FreeRave...</span>');
    addLine(`  <span class="t-label">question  </span><span class="t-val">${escHtml(q)}</span>`);
    addLine('');
    setTimeout(() => {
      const subject = encodeURIComponent('[AMA] ' + q.substring(0, 60));
      const body    = encodeURIComponent(`AMA Question:\n\n${q}\n\n-- Transmitted securely from FreeRave's Terminal`);
      window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
      addLine('  <span class="t-success">✓ Question sent! Opening mail client...</span>');
      addLine('');
      showToast('Question sent to FreeRave!');
    }, 500);
  },
  collab(raw) {
    const a    = parseArgs(raw);
    const idea = a.idea || '';
    if (!idea) {
      addLine('  <span class="t-error">✖ --idea is required</span>');
      addLine('  <span class="t-dim">example: collab --idea a CLI tool for docker stats</span>');
      addLine('');
      return;
    }
    addLine('  <span class="t-info">Sending collab request...</span>');
    addLine(`  <span class="t-label">idea  </span><span class="t-val">${escHtml(idea)}</span>`);
    addLine('');
    setTimeout(() => {
      const subject = encodeURIComponent('[Collab] ' + idea.substring(0, 60));
      const body    = encodeURIComponent(`Collaboration Idea:\n\n${idea}\n\n-- Transmitted securely from FreeRave's Terminal`);
      window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
      addLine('  <span class="t-success">✓ Opening mail client!</span>');
      addLine('');
      showToast('Collab idea sent!');
    }, 500);
  },
  clear() {
    output.innerHTML = '';
    addLine('<span class="t-info">// terminal cleared — type help to start</span>');
    addLine('');
  },
  // ═══════════════════════════════════════
  // 🎮 CREATIVE COMMANDS
  // ═══════════════════════════════════════
  async sudo(raw) {
    const sub = raw.replace(/^sudo\s*/i, '').trim();
    const subCmd = sub.split(/\s+/)[0]?.toLowerCase();

    if (!sub) {
      addLine('  <span class="t-error">usage: sudo <command></span>');
      addLine('');
    } else if (subCmd === 'apt') {
      // Pass to apt handler - it will handle the sudo check internally
      addLine('  <span class="t-dim">[sudo] password for kareem:</span>');
      addLine('  <span class="t-dim">********</span>');
      addLine('');
      await COMMANDS.apt(raw);
    } else if (subCmd === 'nmap') {
      // Allow sudo nmap to pass through
      await COMMANDS.nmap(raw);
    } else if (sub.toLowerCase().includes('rm')) {
      addLine('  <span class="t-error">This incident will be reported. 👀</span>');
      addLine('');
    } else {
      addLine('  <span class="t-dim">[sudo] password for kareem:</span>');
      addLine('  <span class="t-error">Nice try 😏</span>');
      addLine('');
    }
  },
  hack() {
    addLine('');
    addLine('  <span class="t-success">Initializing hack sequence...</span>');
    const chars = '█▓▒░╗╔╝╚║═01';
    let lines = 0;
    const hackInterval = setInterval(() => {
      let line = '  <span style="color:#39ff14">';
      for (let i = 0; i < 60; i++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      line += '</span>';
      addLine(line);
      lines++;
      if (lines > 15) {
        clearInterval(hackInterval);
        setTimeout(() => {
          addLine('');
          addLine('  <span class="t-success">ACCESS GRANTED ✓</span>');
          addLine('  <span class="t-info">Just kidding, this is a portfolio website 😂</span>');
          addLine('');
        }, 300);
      }
    }, 80);
  },
  coffee() {
    addLine('');
    addLine('  <span class="t-val">       (</span>');
    addLine('  <span class="t-val">         )     (</span>');
    addLine('  <span class="t-val">      ___...(-------)-...___</span>');
    addLine('  <span class="t-val">  .-""   )    (          ""-.</span>');
    addLine('  <span class="t-val">  \'.___/         \\         \\___\'</span>');
    addLine('  <span class="t-val">   \'._              _        _.\'</span>');
    addLine('  <span class="t-val">      \'\'\'---------\'\'\'</span>');
    addLine('');
    addLine('  <span class="t-success">☕ Here\'s your virtual coffee!</span>');
    addLine('  <span class="t-dim">// Best consumed while coding at 3 AM</span>');
    addLine('');
  },
  matrix() {
    addLine('');
    addLine('  <span class="t-success">Entering the Matrix...</span>');
    document.body.style.transition = 'all 0.5s';
    document.body.style.filter = 'hue-rotate(90deg) saturate(2)';
    setTimeout(() => {
      document.body.style.filter = '';
      addLine('  <span class="t-success">Wake up, Neo... 🕶️</span>');
      addLine('');
    }, 3000);
  },
  neofetch() {
    addLine('');
    addLine('  <span class="t-success">        .--.        </span><span class="t-white">kareem@FreeRave</span>');
    addLine('  <span class="t-success">       |o_o |       </span><span class="t-info">──────────────────</span>');
    addLine('  <span class="t-success">       |:_/ |       </span><span class="t-label">OS      </span><span class="t-val">FreeRaveOS 2026</span>');
    addLine('  <span class="t-success">      //   \\ \\      </span><span class="t-label">Host    </span><span class="t-val">dotUniverse.dev</span>');
    addLine('  <span class="t-success">     (|     | )     </span><span class="t-label">Kernel  </span><span class="t-val">6.18-brain.exe</span>');
    addLine('  <span class="t-success">    /\'\\_   _/\'\\     </span><span class="t-label">Uptime  </span><span class="t-val">since 2024</span>');
    addLine('  <span class="t-success">    \\___)=(___/     </span><span class="t-label">Shell   </span><span class="t-val">FreeRave Bash</span>');
    addLine('  <span class="t-success">                    </span><span class="t-label">Memory  </span><span class="t-val">100+ tools installed</span>');
    addLine('  <span class="t-success">                    </span><span class="t-label">CPU     </span><span class="t-val">Brain.exe @ ∞ GHz</span>');
    addLine('');
  },
  cowsay(raw) {
    const msg = raw.replace(/^cowsay\s*/i, '').trim() || 'Moo!';
    const len = msg.length + 2;
    const top = ' ' + '_'.repeat(len);
    const mid = `< ${msg} >`;
    const bot = ' ' + '-'.repeat(len);
    addLine('');
    addLine('  <span class="t-val">' + top + '</span>');
    addLine('  <span class="t-val">' + mid + '</span>');
    addLine('  <span class="t-val">' + bot + '</span>');
    addLine('  <span class="t-val">        \\   ^__^</span>');
    addLine('  <span class="t-val">         \\  (oo)\\_______</span>');
    addLine('  <span class="t-val">            (__)\\       )\\/\\</span>');
    addLine('  <span class="t-val">                ||----w |</span>');
    addLine('  <span class="t-val">                ||     ||</span>');
    addLine('');
  },
  fortune() {
    const quotes = [
      '"Talk is cheap. Show me the code." — Linus Torvalds',
      '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
      '"Simplicity is the soul of efficiency." — Austin Freeman',
      '"Make it work, make it right, make it fast." — Kent Beck',
      '"The best error message is the one that never shows up." — Thomas Fuchs',
      '"It works on my machine ¯\\_(ツ)_/¯" — Every Developer',
      '"sudo make me a sandwich" — xkcd',
      '"There are only 10 types of people: those who understand binary and those who don\'t."',
      '"A good programmer looks both ways before crossing a one-way street."',
      '"To understand recursion, you must first understand recursion."',
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    addLine('');
    addLine('  <span class="t-success">🔮 Your fortune:</span>');
    addLine('  <span class="t-white">  ' + q + '</span>');
    addLine('');
  },
  ping(raw) {
    const target = raw.replace(/^ping\s*/i, '').trim() || 'localhost';
    addLine('');
    addLine('  <span class="t-info">PING ' + escHtml(target) + ' (' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + ') 56(84) bytes of data.</span>');
    let pingCount = 0;
    const pingInterval = setInterval(() => {
      const time = (Math.random() * 50 + 10).toFixed(1);
      addLine('  <span class="t-dim">64 bytes from ' + escHtml(target) + ': icmp_seq=' + (pingCount+1) + ' ttl=64 time=' + time + ' ms</span>');
      pingCount++;
      if (pingCount >= 4) {
        clearInterval(pingInterval);
        addLine('');
        addLine('  <span class="t-info">--- ' + escHtml(target) + ' ping statistics ---</span>');
        addLine('  <span class="t-val">4 packets transmitted, 4 received, 0% packet loss</span>');
        addLine('');
      }
    }, 1000);
  },
  history() {
    addLine('');
    if (history.length === 0) {
      addLine('  <span class="t-dim">No commands in history</span>');
    } else {
      history.slice().reverse().forEach((cmd, i) => {
        addLine('  <span class="t-dim">' + (i + 1).toString().padStart(4) + '  </span><span class="t-val">' + escHtml(cmd) + '</span>');
      });
    }
    addLine('');
  },
  date() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    addLine('');
    addLine('  <span class="t-val">' + now.toLocaleDateString('en-US', options) + '</span>');
    addLine('  <span class="t-dim">// Time is an illusion. Lunchtime doubly so.</span>');
    addLine('');
  },
  weather() {
    addLine('');
    addLine('  <span class="t-val">    \\   /    </span><span class="t-white">Weather in Developer Land</span>');
    addLine('  <span class="t-val">     .-.     </span><span class="t-info">───────────────────────</span>');
    addLine('  <span class="t-val">  ‒ (   ) ‒  </span><span class="t-label">Condition </span><span class="t-val">Always Coding</span>');
    addLine('  <span class="t-val">     `-´     </span><span class="t-label">Temp     </span><span class="t-val">Hot like my code 🔥</span>');
    addLine('  <span class="t-val">    /   \\    </span><span class="t-label">Humidity </span><span class="t-val">100% (sweating deadlines)</span>');
    addLine('  <span class="t-val">            </span><span class="t-label">Wind     </span><span class="t-val">Blowing minds</span>');
    addLine('');
  },
  calc(raw) {
    const expr = raw.replace(/^calc\s*/i, '').trim();
    
    if (!expr) {
      addLine('  <span class="t-error">✖ Please provide an expression</span>');
      addLine('  <span class="t-dim">example: calc 2+2*5</span>');
      addLine('  <span class="t-dim">supports: +, -, *, /, %, **, (), sqrt, pow, sin, cos, tan, log, abs, round, ceil, floor, PI, E</span>');
      addLine('');
      return;
    }

    try {
      // Create a safe math context
      const mathCtx = {
        PI: Math.PI,
        E: Math.E,
        sqrt: Math.sqrt,
        pow: Math.pow,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        abs: Math.abs,
        round: Math.round,
        ceil: Math.ceil,
        floor: Math.floor,
        max: Math.max,
        min: Math.min,
      };

      // Replace common patterns
      let processed = expr
        .replace(/\^/g, '**')  // Support ^ as power
        .replace(/%/g, '/100') // Support % as percentage
        .replace(/pi/gi, 'PI')
        .replace(/\bsqrt\s*\(/gi, 'sqrt(')
        .replace(/\bpow\s*\(/gi, 'pow(')
        .replace(/\bsin\s*\(/gi, 'sin(')
        .replace(/\bcos\s*\(/gi, 'cos(')
        .replace(/\btan\s*\(/gi, 'tan(')
        .replace(/\blog\s*\(/gi, 'log(')
        .replace(/\babs\s*\(/gi, 'abs(')
        .replace(/\bround\s*\(/gi, 'round(')
        .replace(/\bceil\s*\(/gi, 'ceil(')
        .replace(/\bfloor\s*\(/gi, 'floor(');

      // Build function with math context
      const fn = new Function(...Object.keys(mathCtx), `"use strict"; return (${processed});`);
      const result = fn(...Object.values(mathCtx));

      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Invalid result');
      }

      // Format result
      let formatted;
      if (Number.isInteger(result)) {
        formatted = result.toLocaleString();
      } else {
        formatted = result.toPrecision(10).replace(/\.?0+$/, '');
      }

      addLine('');
      addLine(`  <span class="t-label">expr</span>  <span class="t-val">${escHtml(expr)}</span>`);
      addLine(`  <span class="t-label">result</span> <span class="t-success">${formatted}</span>`);
      addLine('');

    } catch (e) {
      addLine('');
      addLine('  <span class="t-error">✖ Invalid expression</span>');
      addLine(`  <span class="t-dim">${escHtml(e.message)}</span>`);
      addLine('  <span class="t-dim">example: calc 2+2*5</span>');
      addLine('  <span class="t-dim">functions: sqrt, pow, sin, cos, tan, log, abs, round, ceil, floor</span>');
      addLine('  <span class="t-dim">constants: PI, E</span>');
      addLine('');
    }
  },
  ls(raw) {
    const args = raw.replace(/^ls\s*/i, '').trim();
    
    // Easter Egg for sensitive files
    if (args.includes('.env')) {
      addLine('');
      addLine('  <span class="t-success">-rw-------  1 root root  42 Mar 30 18:10 </span><span class="t-val">.env</span>');
      addLine('  <span class="t-error">// Nice try! Real devs never expose their .env 😏</span>');
      addLine('');
      return;
    }

    // Determine target path
    let targetPath = currentPath;
    if (args) {
      const cleanArgs = args.replace(/\/$/, '');
      if (cleanArgs === '..') {
        if (currentPath !== '~') {
          const parts = currentPath.split('/');
          parts.pop();
          targetPath = parts.join('/') || '~';
        }
      } else if (cleanArgs === '~' || cleanArgs === '/') {
        targetPath = '~';
      } else if (cleanArgs.startsWith('~/')) {
        targetPath = cleanArgs;
      } else if (currentPath === '~') {
        targetPath = `~/${cleanArgs}`;
      } else {
        targetPath = `${currentPath}/${cleanArgs}`;
      }
    }

    const contents = fileSystem[targetPath] || [];
    addLine('');
    if (contents.length > 0) {
      const out = contents.map(item => {
        // If item ends with / or exists as a path in the system, it's a directory
        const isDir = item.endsWith('/') || fileSystem[`${targetPath}/${item.replace('/','')}`];
        return isDir ? `<span style="color:var(--accent); font-weight:bold;">${item}</span>` : `<span class="t-val">${item}</span>`;
      }).join('&nbsp;&nbsp;&nbsp;&nbsp;');
      addLine(`  ${out}`);
    } else {
      addLine('  <span class="t-dim">total 0</span>');
    }
    addLine('');
  },
  cd(raw) {
    const target = raw.replace(/^cd\s*/i, '').trim();
    
    if (!target || target === '~' || target === '/') {
      currentPath = '~';
    } else if (target === '..') {
      if (currentPath !== '~') {
        const parts = currentPath.split('/');
        parts.pop();
        currentPath = parts.join('/') || '~';
      }
    } else {
      const cleanTarget = target.replace(/\/$/, '');
      const potentialPath = currentPath === '~' ? `~/${cleanTarget}` : `${currentPath}/${cleanTarget}`;
      
      if (fileSystem[potentialPath]) {
        currentPath = potentialPath;
      } else {
        addLine(`  <span class="t-error">cd: ${escHtml(target)}: No such directory</span>`);
      }
    }
    
    const inputPrompt = document.querySelector('.term-input-prompt');
    if (inputPrompt) inputPrompt.innerHTML = `FreeRave@kali:${currentPath}$&nbsp;`;
    addLine('');
  },
  cat(raw) {
    const file = raw.replace(/^cat\s*/i, '').trim();
    if (!file) {
      addLine('  <span class="t-error">cat: missing operand</span>');
      addLine('');
      return;
    }

    // 1. Security: sensitive system files
    if (file === '.env') {
      addLine('  <span class="t-error">Nice try! 😏</span>');
      addLine('  <span class="t-dim">// Real devs never expose their .env</span>');
      addLine('');
      return;
    }

    // 2. Virtual files content
    const virtualFiles = {
      'README.md': [
        '# FreeRave Portfolio v1.0.0',
        'Welcome to the dotUniverse.',
        'Type "help" to see what you can do here.',
        '',
        '20+ tools. All open source.',
        'Built with ☕ and sleep deprivation.'
      ],
      'todo.md': [
        '[✓] Reach 2k followers',
        '[✓] Build dotUniverse Ecosystem',
        '[ ] Finish military service (In Progress...)',
        '[ ] World Domination'
      ],
      'brain.exe': [
        'Error: Cannot display binary file.',
        'Reason: Human consciousness not yet fully digitized.',
        'Try: "neofetch" for system specs.'
      ],
      'april-2026.log': [
        'Log Start: 2026-04-01',
        'Status: Coding at 3 AM...',
        'Challenge: 30 days of shipping.',
        'Progress: All systems operational.'
      ],
      // Tools content (for when user is in ~/tools)
      'DotGhostBoard': [
        '╔══════════════════════════════════════╗',
        '║  DotGhostBoard                       ║',
        '╠══════════════════════════════════════╣',
        '║  Role: Advanced Clipboard Manager    ║',
        '║  Status: Stable ✓                    ║',
        '║  License: MIT                        ║',
        '║  Language: Python (PyQt6)            ║',
        '║  Features:                           ║',
        '║  • AES-256 Encryption                ║',
        '║  • Tag System & Collections          ║',
        '║  • Drag & Drop Support               ║',
        '║  • Thumbnail Previews                ║',
        '║  • Master Password Lock              ║',
        '╚══════════════════════════════════════╝'
      ],
      'dotcommand': [
        '╔══════════════════════════════════════╗',
        '║  dotcommand                          ║',
        '╠══════════════════════════════════════╣',
        '║  Role: CLI Command Manager           ║',
        '║  Status: Shipped ✓                   ║',
        '║  License: MIT                        ║',
        '║  Platform: VS Code Extension         ║',
        '║  Features:                           ║',
        '║  • ML-based Suggestions              ║',
        '║  • Analytics Dashboard               ║',
        '║  • Visual Rule Builder               ║',
        '║  • 180+ Prepared Commands            ║',
        '║  • Package Intelligence              ║',
        '╚══════════════════════════════════════╝'
      ],
      'CodeTune': [
        '╔══════════════════════════════════════╗',
        '║  CodeTune                            ║',
        '╠══════════════════════════════════════╣',
        '║  Role: Islamic Dev Environment       ║',
        '║  Status: Shipped ✓                   ║',
        '║  License: MIT                        ║',
        '║  Platform: VS Code Extension         ║',
        '║  Features:                           ║',
        '║  • Quran Player (15+ Reciters)       ║',
        '║  • Prayer Times Tracking             ║',
        '║  • Smart Focus Mode                  ║',
        '║  • Dhikr Counters                    ║',
        '║  • 500+ Authentic Adhkar             ║',
        '╚══════════════════════════════════════╝'
      ],
      'DotShare': [
        '╔══════════════════════════════════════╗',
        '║  DotShare                            ║',
        '╠══════════════════════════════════════╣',
        '║  Role: Code Journey Sharer           ║',
        '║  Status: Shipped ✓                   ║',
        '║  License: MIT                        ║',
        '║  Platform: VS Code Extension         ║',
        '║  Features:                           ║',
        '║  • 8 Social Platforms                ║',
        '║  • AI Content Creation               ║',
        '║  • Smart Hashtag Engine              ║',
        '║  • Post Scheduling                   ║',
        '║  • Multi-AI Support (Gemini/GPT/...) ║',
        '╚══════════════════════════════════════╝'
      ],
      'DotFetch': [
        '╔══════════════════════════════════════╗',
        '║  DotFetch                            ║',
        '╠══════════════════════════════════════╣',
        '║  Role: HTTP Client                   ║',
        '║  Status: Shipped ✓                   ║',
        '║  License: MIT                        ║',
        '║  Platform: VS Code Extension         ║',
        '║  Features:                           ║',
        '║  • Full HTTP Methods                 ║',
        '║  • .env Variable Support             ║',
        '║  • Collections Management            ║',
        '║  • cURL Import/Export                ║',
        '║  • Environment Tree View             ║',
        '╚══════════════════════════════════════╝'
      ],
      'DotReadme': [
        '╔══════════════════════════════════════╗',
        '║  DotReadme                           ║',
        '╠══════════════════════════════════════╣',
        '║  Role: README Optimizer              ║',
        '║  Status: Shipped ✓                   ║',
        '║  License: MIT                        ║',
        '║  Platform: VS Code Extension         ║',
        '║  Features:                           ║',
        '║  • Real-time Simulator               ║',
        '║  • Quality Audit (A+-F Score)        ║',
        '║  • One-click Path Fixer              ║',
        '║  • Badge Inserter                    ║',
        '║  • AI-powered Enhancement            ║',
        '╚══════════════════════════════════════╝'
      ]
    };

    // 3. Execution
    if (virtualFiles[file]) {
      addLine('');
      virtualFiles[file].forEach(line => {
        addLine('  <span class="t-val">' + escHtml(line) + '</span>');
      });
      addLine('');
    } else {
      // Check if it's a directory
      if (fileSystem[currentPath] && fileSystem[currentPath].some(item => item === file + '/')) {
        addLine(`  <span class="t-error">cat: ${escHtml(file)}: Is a directory</span>`);
      } else {
        addLine(`  <span class="t-error">cat: ${escHtml(file)}: No such file or directory</span>`);
      }
      addLine('');
    }
  },
  nano(raw) {
    const file = raw.replace(/^nano\s*/i, '').trim();
    if (!file) {
      addLine('  <span class="t-error">nano: missing file name</span>');
      addLine('  <span class="t-dim">example: nano README.md</span>');
      addLine('');
      return;
    }

    const editor = document.getElementById('nanoEditor');
    const textArea = document.getElementById('nanoTextArea');
    const fileNameDisplay = document.getElementById('nanoFileName');

    // Load content if file exists, otherwise open empty
    textArea.value = fileData[file] || "";
    fileNameDisplay.textContent = file;
    
    editor.classList.remove('nano-hidden');
    textArea.focus();

    const nanoHandler = (e) => {
      // Exit and Save (Ctrl + X)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        // Save changes to runtime
        fileData[file] = textArea.value;
        
        editor.classList.add('nano-hidden');
        window.removeEventListener('keydown', nanoHandler);
        inputEl.focus();
        
        addLine(`  <span class="t-success">✓ [${file}] saved and closed.</span>`);
        addLine('');
      }
      // Cancel (Ctrl + C) - discard changes
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        editor.classList.add('nano-hidden');
        window.removeEventListener('keydown', nanoHandler);
        inputEl.focus();
        addLine(`  <span class="t-dim">! Changes discarded.</span>`);
        addLine('');
      }
    };

    window.addEventListener('keydown', nanoHandler);
  },
  exit() {
    addLine('');
    addLine('  <span class="t-error">🚪 There is no escape from FreeRave\'s terminal 👀</span>');
    addLine('  <span class="t-dim">// You can check out any time you like, but you can never leave</span>');
    addLine('');
  },
  async apt(raw) {
    const cmd = raw.replace(/^sudo\s*/i, '').replace(/^apt\s*/i, '').trim();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    if (cmd.includes('install girlfriend') || cmd.includes('install boyfriend')) {
      addLine('');
      addLine('  <span class="t-dim">Reading package lists... Done</span>');
      addLine('  <span class="t-dim">Building dependency tree... Done</span>');
      addLine('  <span class="t-error">E: Package \'girlfriend\' has no installation candidate</span>');
      addLine('  <span class="t-dim">E: Try \'apt install self-love\' instead</span>');
      addLine('');
    } 
    else if (cmd.startsWith('install')) {
      const pkg = cmd.replace(/^install\s+/i, '').trim();
      
      if (!pkg) {
        addLine('  <span class="t-error">E: You must give at least one package to install.</span>');
        addLine('');
        return;
      }

      // Check if sudo was used
      if (!raw.toLowerCase().startsWith('sudo')) {
        addLine('');
        addLine('  <span class="t-error">E: Could not open lock file</span>');
        addLine('  <span class="t-error">E: Unable to acquire the dpkg frontend lock, are you root?</span>');
        addLine(`  <span class="t-dim">// Try: sudo apt install ${pkg}</span>`);
        addLine('');
        return;
      }

      // If requesting nmap
      if (pkg.toLowerCase() === 'nmap') {
        if (installedPackages.has('nmap')) {
          addLine('');
          addLine('  <span class="t-info">Reading package lists... Done</span>');
          addLine('  <span class="t-info">Building dependency tree... Done</span>');
          addLine('  <span class="t-val">nmap is already the newest version (7.93-1kali1).</span>');
          addLine('  <span class="t-dim">0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.</span>');
          addLine('');
          return;
        }

        // Fake nmap installation
        addLine('');
        addLine('  <span class="t-info">Reading package lists... Done</span>');
        await sleep(400);
        addLine('  <span class="t-info">Building dependency tree... Done</span>');
        await sleep(300);
        addLine('  <span class="t-info">The following NEW packages will be installed:</span>');
        addLine('  <span class="t-val">  nmap nmap-common</span>');
        addLine('  <span class="t-dim">0 upgraded, 2 newly installed, 0 to remove and 0 not upgraded.</span>');
        addLine('  <span class="t-dim">Need to get 5,912 kB of archives.</span>');
        addLine('  <span class="t-dim">After this operation, 27.2 MB of additional disk space will be used.</span>');
        
        await sleep(800);
        addLine('  <span class="t-info">Get:1 http://http.kali.org/kali kali-rolling/main amd64 nmap-common all 7.93-1kali1 [3,912 kB]</span>');
        await sleep(1000);
        addLine('  <span class="t-info">Get:2 http://http.kali.org/kali kali-rolling/main amd64 nmap amd64 7.93-1kali1 [2,000 kB]</span>');
        await sleep(1200);
        addLine('  <span class="t-dim">Fetched 5,912 kB in 3s (1,970 kB/s)</span>');
        addLine('  <span class="t-dim">Selecting previously unselected package nmap-common.</span>');
        await sleep(300);
        addLine('  <span class="t-dim">(Reading database ... 314159 files and directories currently installed.)</span>');
        addLine('  <span class="t-dim">Preparing to unpack .../nmap-common_7.93-1kali1_all.deb ...</span>');
        addLine('  <span class="t-dim">Unpacking nmap-common (7.93-1kali1) ...</span>');
        await sleep(600);
        addLine('  <span class="t-dim">Selecting previously unselected package nmap.</span>');
        addLine('  <span class="t-dim">Preparing to unpack .../nmap_7.93-1kali1_amd64.deb ...</span>');
        addLine('  <span class="t-dim">Unpacking nmap (7.93-1kali1) ...</span>');
        await sleep(500);
        addLine('  <span class="t-success">Setting up nmap-common (7.93-1kali1) ...</span>');
        addLine('  <span class="t-success">Setting up nmap (7.93-1kali1) ...</span>');
        addLine('  <span class="t-success">Processing triggers for man-db (2.11.2-1) ...</span>');
        addLine('');
        addLine('  <span class="t-success">✓ nmap installed successfully! Type "nmap <target>" to start scanning.</span>');
        addLine('');
        
        // Mark nmap as installed
        installedPackages.add('nmap');
        inputEl.focus();
        output.scrollTop = output.scrollHeight;
        
      } else {
         // Other packages
         addLine('');
         addLine('  <span class="t-info">Reading package lists... Done</span>');
         addLine('  <span class="t-info">Building dependency tree... Done</span>');
         addLine(`  <span class="t-error">E: Unable to locate package ${escHtml(pkg)}</span>`);
         addLine('');
      }
    } else {
      addLine(`  <span class="t-error">apt: invalid operation: ${escHtml(cmd)}</span>`);
      addLine('');
    }
  },
  // 🎮 nmap EASTER EGG - The Final Boss Attack! 🎮
  async nmap(raw) {
    // Check if nmap is installed first
    if (!installedPackages.has('nmap')) {
      addLine(`  <span class="t-error">bash: nmap: command not found</span>`);
      addLine(`  <span class="t-dim">Do you want to install it?</span>`);
      addLine(`  <span class="t-val">sudo apt install nmap</span>`);
      addLine('');
      return;
    }

    // Helper function for delays
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 1. Parse arguments: remove nmap and any flags like -sV, -A, -p
    let target = raw.replace(/^nmap\s*/i, '').trim();
    target = target.replace(/-[a-zA-Z0-9-]+\s*/g, '').trim(); 
    if (!target) target = '127.0.0.1';

    // 2. Realism: if domain, generate fake IP
    const fakeIp = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    const displayTarget = target.match(/[a-zA-Z]/) ? `${target} (${fakeIp})` : target;

    addLine('');
    addLine(`  <span class="t-info">Starting Nmap 7.93 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}</span>`);
    await sleep(600);
    
    addLine(`  <span class="t-val">Nmap scan report for ${escHtml(displayTarget)}</span>`);
    addLine(`  <span class="t-dim">Host is up (0.0${Math.floor(Math.random()*90)+10}s latency).</span>`);
    addLine(`  <span class="t-dim">Not shown: 996 closed tcp ports (reset)</span>`);
    
    await sleep(800);
    addLine(`  <span class="t-info">PORT     STATE SERVICE</span>`);

    // 3. Print normal ports slowly for suspense
    await sleep(400);
    addLine(`  <span class="t-success">22/tcp   open  ssh</span>`);
    await sleep(500);
    addLine(`  <span class="t-success">80/tcp   open  http</span>`);
    await sleep(400);
    addLine(`  <span class="t-success">443/tcp  open  https</span>`);

    // 4. The Twist - Port 666!
    await sleep(1500);
    addLine(`  <span class="t-error" style="font-weight:bold; animation: superGlitch 0.2s infinite;">666/tcp  open  doom</span>`);
    addLine(`  <span class="t-error">⚠ WARNING: CRITICAL VULNERABILITY DETECTED ⚠</span>`);
    addLine(`  <span class="t-success">Initiating The Final Boss Payload... 🎮</span>`);

    await sleep(800);

    // 5. Inject the video
    const vidHtml = `
      <div style="margin: 15px 0 15px 20px;">
        <video src="assets/videos/The_Final_Boss_(Port_666).mp4" autoplay controls style="width: 100%; max-width: 450px; border-radius: 8px; border: 1px solid var(--error); box-shadow: 0 0 15px var(--error);">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    addLine(vidHtml);
    output.scrollTop = output.scrollHeight;

    // 6. Finish scan after video (8 seconds)
    await sleep(8000); 
    addLine(`  <span class="t-info">Nmap done: 1 IP address (1 host up) scanned in 13.37 seconds</span>`);
    addLine(`  <span class="t-dim">// Target successfully compromised 😂🐧</span>`);
    addLine('');
    
    inputEl.focus();
    output.scrollTop = output.scrollHeight;
  },
  // ── 🌐 CURL: FAKE DOWNLOADING ──
  async curl(raw) {
    const args = raw.replace(/^curl\s*/i, '').trim();
    if (!args) {
      addLine('  <span class="t-error">curl: try \'curl --help\' or \'curl --manual\' for more information</span>');
      addLine('');
      return;
    }

    const url = args.split(' ')[0];
    const fileName = url.split('/').pop() || 'downloaded_file.txt';

    addLine(`  <span class="t-info">  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current</span>`);
    addLine(`  <span class="t-info">                                 Dload  Upload   Total   Spent    Left  Speed</span>`);
    
    const progressLine = document.createElement('span');
    progressLine.className = 't-line t-dim';
    output.appendChild(progressLine);
    output.scrollTop = output.scrollHeight;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let progress = 0;
    
    while (progress < 100) {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress > 100) progress = 100;
      progressLine.innerHTML = `  100  1024k  100  1024k    0     0  ${(progress * 12.4).toFixed(0)}k      0 --:--:-- --:--:-- --:--:-- ${(progress * 15).toFixed(0)}k`;
      await sleep(300);
    }
    
    // Register fake file in the system
    if (!fileSystem[currentPath].includes(fileName)) {
      fileSystem[currentPath].push(fileName);
      fileData[fileName] = `\nSource: ${url}\nStatus: Successfully spoofed! 😂\nDon't run unknown scripts!`;
    }
    
    addLine('');
    addLine(`  <span class="t-success">✓ Saved as '${escHtml(fileName)}' in ${currentPath}</span>`);
    addLine('  <span class="t-dim">// Hint: type ' + (currentPath === '~' ? 'ls' : 'ls ..') + ' to see it, or nano to edit it.</span>');
    addLine('');
    inputEl.focus();
  },
  // 💀 rm -rf EASTER EGG 💀
  rm(raw) {
    const args = raw.replace(/^rm\s*/i, '').trim();
    
    if (args === '-rf /' || args === '-rf /*' || args === '-rf */') {
      addLine('  <span class="t-error">rm: it is dangerous to operate recursively on \'/\'</span>');
      addLine('  <span class="t-info">rm: use --no-preserve-root to override this failsafe</span>');
      addLine('');
    } 
    else if (args.includes('--no-preserve-root')) {
      addLine('');
      addLine('  <span class="t-error">⚠ WARNING: destructive command detected</span>');
      addLine('  <span class="t-dim">FreeRave@kali:~$ sudo rm -rf /* --no-preserve-root</span>');
      addLine('');

      const errors = [
        'removing /tools/DotGhostBoard... <span class="t-error">✖ GONE</span>',
        'removing /tools/dotcommand...    <span class="t-error">✖ GONE</span>',
        'removing /tools/CodeTune...      <span class="t-error">✖ GONE</span>',
        'removing /tools/DotShare...      <span class="t-error">✖ GONE</span>',
        'removing /tools/DotFetch...      <span class="t-error">✖ GONE</span>',
        'removing /platforms/dev.to...    <span class="t-error">✖ GONE</span>',
        'removing /platforms/linkedin...  <span class="t-error">✖ GONE</span>',
        'removing /stats/followers...     <span class="t-error">✖ GONE</span>',
        'removing /april-challenge...     <span class="t-error">✖ GONE</span>',
        'removing /brain/FreeRave...        <span class="t-error">✖ GONE</span>',
        '',
        '<span class="t-error">💀 FATAL: filesystem destroyed</span>',
        '<span class="t-error">💀 FATAL: portfolio not found</span>',
        '<span class="t-error">💀 FATAL: career.exe has stopped working</span>',
        '',
        '<span class="t-dim">Segmentation fault (core dumped)</span>',
      ];

      // Step 2: flood terminal with errors one by one
      let i = 0;
      const errorInterval = setInterval(() => {
        if (i < errors.length) {
          addLine('  ' + errors[i]);
          i++;
        } else {
          clearInterval(errorInterval);
          // Step 3: trigger the page destruction
          setTimeout(() => triggerDestruction(), 400);
        }
      }, 80);
    } 
    else if (args) {
      addLine(`  <span class="t-error">rm: cannot remove '${escHtml(args)}': Permission denied</span>`);
      addLine('');
    } 
    else {
      addLine('  <span class="t-error">rm: missing operand</span>');
      addLine('  <span class="t-dim">Try \'rm --help\' for more information.</span>');
      addLine('');
    }
  }
};

/* ══════════════════════════════════════════
   💀 DESTRUCTION ENGINE
   ══════════════════════════════════════════ */
function triggerDestruction() {
  const body = document.body;

  // 1. Red screen flash
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed; inset:0; background:rgba(255,0,0,0.15);
    z-index:99998; pointer-events:none;
    animation: redFlash 0.4s ease;
  `;
  body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);

  // 2. Inject BSOD-style overlay
  const bsod = document.createElement('div');
  bsod.id = 'bsod';
  bsod.innerHTML = `
    <div class="bsod-inner">
      <div class="bsod-emoji">💀</div>
      <div class="bsod-title">DOTTED_UNIVERSE_CRITICAL_FAILURE</div>
      <div class="bsod-code">Error code: 0x000000RM_RF_EXECUTED</div>
      <div class="bsod-desc">
        A fatal exception has occurred at <span>0x00000000</span>.<br>
        Your portfolio has been <span>terminated</span>.<br>
        All your tools are <span>gone</span>. All your followers? <span>gone</span>.<br>
        Your April challenge? <span>lol</span>.
      </div>
      <div class="bsod-progress">
        <div class="bsod-bar-wrap">
          <div class="bsod-bar" id="bsodBar"></div>
        </div>
        <div class="bsod-pct" id="bsodPct">Collecting crash data: 0%</div>
      </div>
      <div class="bsod-hint">
        // Just kidding 😅<br>
        // Press <kbd>Ctrl+Z</kbd> or type <kbd>git restore .</kbd> to undo
      </div>
    </div>
  `;
  body.appendChild(bsod);

  // 3. Destroy cards one by one
  const cards = document.querySelectorAll('.tool-card, .ext-card, .platform-card, .challenge-row');
  cards.forEach((card, idx) => {
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.transform = `translateY(${Math.random() > 0.5 ? '-' : ''}${20 + Math.random()*80}px) rotate(${(Math.random()-0.5)*30}deg)`;
      card.style.opacity = '0';
      card.style.filter = 'blur(4px)';
    }, idx * 30);
  });

  // 4. Glitch the header
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.style.animation = 'superGlitch 0.1s infinite';
    h1.style.color = '#ff0000';
  }

  // 5. Fake progress bar
  let pct = 0;
  const bar = document.getElementById('bsodBar');
  const pctEl = document.getElementById('bsodPct');
  const msgs = [
    'Collecting crash data',
    'Deleting your work',
    'rm -rf /hope',
    'Uninstalling sanity',
    'Formatting career drive',
    'Almost done destroying everything',
    'Regretting life choices',
  ];
  const pctInterval = setInterval(() => {
    pct += Math.random() * 4;
    if (pct >= 100) { pct = 100; clearInterval(pctInterval); scheduleRestore(); }
    if (bar) bar.style.width = pct.toFixed(0) + '%';
    if (pctEl) {
      const msg = msgs[Math.floor((pct/100) * msgs.length)] || msgs[msgs.length-1];
      pctEl.textContent = msg + ': ' + pct.toFixed(0) + '%';
    }
  }, 60);
}

function scheduleRestore() {
  setTimeout(() => {
    const bsod = document.getElementById('bsod');

    if (bsod) {
      bsod.innerHTML = `
        <div class="bsod-inner recovery">
          <div class="bsod-emoji">🔄</div>
          <div class="bsod-title" style="color:var(--accent2)">SYSTEM RESTORED</div>
          <div class="bsod-code" style="color:var(--accent)">git restore . — successfully reverted all changes</div>
          <div class="bsod-desc">
            All <span style="color:var(--accent2)">20+ tools</span> restored.<br>
            Followers? <span style="color:var(--accent2)">back online</span>.<br>
            April challenge? <span style="color:var(--accent2)">still happening</span>.<br>
            Your portfolio? <span style="color:var(--accent2)">indestructible</span>. 😎
          </div>
          <div class="bsod-hint" style="color:var(--accent2)">
            // lesson learned: don't rm -rf things you love<br>
            // closing in 4 seconds...
          </div>
        </div>
      `;
    }

    const cards = document.querySelectorAll('.tool-card, .ext-card, .platform-card, .challenge-row');
    cards.forEach((card, idx) => {
      setTimeout(() => {
        card.style.transition = 'all 0.5s cubic-bezier(0.16,1,.3,1)';
        card.style.transform = '';
        card.style.opacity = '';
        card.style.filter = '';
      }, idx * 20);
    });

    const h1 = document.querySelector('h1');
    if (h1) {
      h1.style.animation = '';
      h1.style.color = '';
    }

    setTimeout(() => {
      if (bsod) {
        bsod.style.transition = 'opacity 0.5s';
        bsod.style.opacity = '0';
        setTimeout(() => bsod.remove(), 500);
      }
    }, 4000);

  }, 2000);
}

/* ── COMMAND RUNNER ── */
async function runCommand(cmdOverride) {
  const raw = (cmdOverride !== undefined ? cmdOverride : inputEl.value).trim();
  if (!raw) return;
  history.unshift(raw);
  histIdx = -1;
  if (!cmdOverride) inputEl.value = '';
  addLine('');
  addPromptLine(raw);
  const cmd = raw.split(/\s+/)[0].toLowerCase();
  if (COMMANDS[cmd]) {
    await COMMANDS[cmd](raw);
  } else {
    addLine(`  <span class="t-error">✖ command not found: ${escHtml(cmd)}</span>`);
    addLine('  <span class="t-dim">type <span class="t-cmd">help</span> for available commands</span>');
    addLine('');
  }
}

function fillCmd(text) {
  inputEl.value = text;
  inputEl.focus();
  const len = inputEl.value.length;
  inputEl.setSelectionRange(len, len);
}

/* ── LIVE SYNTAX HIGHLIGHTING ── */
inputEl.addEventListener('input', () => {
  const value = inputEl.value.trim();
  const parts = value.split(/\s+/);
  const command = parts[0]?.toLowerCase();
  const arg = parts[1] || '';

  let isFound = false;

  // Check if command is cd, ls, or cat with a path argument
  if (['cd', 'ls', 'cat'].includes(command) && arg) {
    const cleanArg = arg.replace(/\/$/, '');
    let targetPath = currentPath;

    // Build target path
    if (cleanArg === '..') {
      isFound = (currentPath !== '~');
    } else if (cleanArg === '~' || cleanArg === '/') {
      isFound = true;
    } else if (cleanArg.startsWith('~/')) {
      targetPath = cleanArg;
      isFound = !!fileSystem[targetPath];
    } else if (currentPath === '~') {
      targetPath = `~/${cleanArg}`;
      isFound = !!fileSystem[targetPath] || (fileSystem[currentPath] && fileSystem[currentPath].some(item => item.replace(/\/$/, '').toLowerCase() === cleanArg.toLowerCase()));
    } else {
      targetPath = `${currentPath}/${cleanArg}`;
      isFound = !!fileSystem[targetPath] || (fileSystem[currentPath] && fileSystem[currentPath].some(item => item.replace(/\/$/, '').toLowerCase() === cleanArg.toLowerCase()));
    }
  }

  // Apply or remove valid-path class
  if (isFound) {
    inputEl.classList.add('valid-path');
  } else {
    inputEl.classList.remove('valid-path');
  }
});

inputEl.addEventListener('keydown', e => {
  // 1. Enter Logic (Clear suggestions so they don't stay on screen)
  if (e.key === 'Enter') { 
    document.querySelectorAll('.t-line.tab-hint').forEach(el => el.remove());
    runCommand(); 
    return; 
  }
  
  // 2. Arrow Logic (History)
  if (e.key === 'ArrowUp') { 
    e.preventDefault(); 
    histIdx = Math.min(histIdx + 1, history.length - 1); 
    inputEl.value = history[histIdx] || ''; 
  }
  if (e.key === 'ArrowDown') { 
    e.preventDefault(); 
    histIdx = Math.max(histIdx - 1, -1); 
    inputEl.value = histIdx >= 0 ? history[histIdx] : ''; 
  }
  
  // 3. The Ultimate Tab Logic
  if (e.key === 'Tab') {
    e.preventDefault();
    const input = inputEl.value;
    
    // Precisely identify the last word
    const lastPart = input.endsWith(' ') ? '' : input.split(/\s+/).pop();
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const isCommand = input.trim() === '' || (!input.includes(' ') && !input.endsWith(' '));

    if (tabIdx === -1 || !input.startsWith(lastTabInput)) {
      lastTabInput = input.substring(0, input.length - lastPart.length);

      let pool = [];
      let searchPrefix = lastPart;
      let pathPrefix = '';

      if (isCommand) {
        pool = Object.keys(COMMANDS).map(c => c + ' ');
      } 
      else if (command === 'sudo') {
        pool = Object.keys(COMMANDS).map(c => c + ' ');
      }
      else if (['cd', 'ls', 'cat', 'nano', 'rm'].includes(command)) {
        let targetDir = currentPath;
        
        if (lastPart.includes('/')) {
          const slashIdx = lastPart.lastIndexOf('/');
          const dirPath = lastPart.substring(0, slashIdx);
          searchPrefix = lastPart.substring(slashIdx + 1);
          pathPrefix = lastPart.substring(0, slashIdx + 1);

          if (dirPath.startsWith('~/') || dirPath === '~') {
            targetDir = dirPath;
          } else if (dirPath !== '') {
            targetDir = currentPath === '~' ? `~/${dirPath}` : `${currentPath}/${dirPath}`;
          }
        }

        if (fileSystem[targetDir]) {
          pool = fileSystem[targetDir].filter(item => {
            const cleanName = item.replace(/\/$/, '');
            const isDir = item.endsWith('/') || fileSystem[`${targetDir}/${cleanName}`];
            
            // Smart filtering based on command type:
            if (command === 'cd') return isDir; // cd for directories only
            if (['cat', 'nano'].includes(command)) return !isDir; // cat/nano for files only
            return true; // ls and rm see everything
            
          }).map(item => {
            const cleanName = item.replace(/\/$/, '');
            const isDir = item.endsWith('/') || fileSystem[`${targetDir}/${cleanName}`];
            return pathPrefix + (isDir ? cleanName + '/' : cleanName + ' ');
          });
        }
      }
      else if (COMMAND_ARGS[command]) {
        // Using your Dictionary
        pool = COMMAND_ARGS[command].map(arg => arg + ' ');
      } 
      else {
        return; // Command has no completion
      }

      tabMatches = pool.filter(item => item.toLowerCase().startsWith((pathPrefix + searchPrefix).toLowerCase()));
      tabIdx = 0;
    } else {
      tabIdx = (tabIdx + 1) % tabMatches.length;
    }

    if (tabMatches.length > 0) {
      const match = tabMatches[tabIdx];
      inputEl.value = lastTabInput + match;
      
      document.querySelectorAll('.t-line.tab-hint').forEach(el => el.remove());

      if (tabMatches.length > 1) {
        const hints = tabMatches.map((m, i) => {
          const clean = m.trim().replace(/\/$/, '');
          const display = clean.startsWith(pathPrefix) ? clean.substring(pathPrefix.length) : clean;
          return i === tabIdx ? `<span class="t-accent2" style="text-decoration:underline;">${display || m}</span>` : `<span>${display || m}</span>`;
        }).join('  ');
        addLine(`  <span class="t-dim">suggestions:</span> ${hints}`, 'tab-hint');
      }

      const event = new Event('input', { bubbles: true });
      inputEl.dispatchEvent(event);
    }
    return;
  }

  // 4. Clean up hints on any other key
  if (e.key !== 'Tab') {
    tabIdx = -1;
    tabMatches = [];
    document.querySelectorAll('.t-line.tab-hint').forEach(el => el.remove());
  }
});

/* ── AMA LOGIC ── */
function setTopic(el, topic) {
  document.querySelectorAll('.ama-topic').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('amaTopic').value = topic;
}

function toggleAnon(cb) {
  const nameField = document.getElementById('amaName');
  nameField.disabled = cb.checked;
  nameField.placeholder = cb.checked ? 'Anonymous' : 'Your name';
  if (cb.checked) nameField.value = '';
}

function populateQ(el) {
  document.getElementById('amaQuestion').value = el.textContent;
}

function sendAMA() {
  const name     = document.getElementById('amaName').value.trim() || 'Anonymous';
  const question = document.getElementById('amaQuestion').value.trim();
  const topic    = document.getElementById('amaTopic').value;
  const anon     = document.getElementById('amaAnon').checked;
  if (!question) {
    showToast('⚠ Please write your question first!', true);
    return;
  }
  const subject = encodeURIComponent(`[AMA · ${topic}] ${question.substring(0,60)}`);
  const body    = encodeURIComponent(`Topic: ${topic}\nFrom: ${anon ? 'Anonymous' : name}\n\nQuestion:\n${question}\n\n-- Sent via dotUniverse AMA`);
  window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
  showToast('✓ Opening your mail client!');
  document.getElementById('amaQuestion').value = '';
}

/* ── TOAST ── */
function showToast(msg, warn = false) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.style.borderLeftColor = warn ? 'var(--coming)' : 'var(--accent2)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}