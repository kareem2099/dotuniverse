/**
 * App.js - Modular Entry Point
 * ✅ Loads all 6 modules
 * ✅ Full terminal with ALL commands (migrated from script.js)
 * ✅ Sets window.__appReady = true so script.js skips duplicate init
 */

import { ParticleSystem }   from './modules/particle-system.js';
import { MathEval }         from './modules/math-eval.js';
import { ThemeManager }     from './modules/theme-manager.js';
import { Challenges }       from './modules/challenges.js';
import { ScrollEffects }    from './modules/scroll-effects.js';
import { TerminalEmulator } from './modules/terminal-emulator.js';
import { NanoEditor }       from './modules/nano-editor.js';
import { ExtensionStats }   from './modules/extension-stats.js';

// ── Helpers ──────────────────────────────────────────────
function parseArgs(str) {
  const args = {};
  const re = /--(\w+)\s+((?:(?!--)\S)+(?:\s+(?!--)\S+)*)/g;
  let m;
  while ((m = re.exec(str)) !== null) args[m[1]] = m[2].trim();
  return args;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── App Class ─────────────────────────────────────────────
class App {
  constructor() { this.initialized = false; }

  async init() {
    if (this.initialized) return;
    try {
      console.log('🚀 Initializing dotUniverse modules...');

      ThemeManager.init();
      Challenges.init();
      ExtensionStats.init();
      ScrollEffects.init();
      ParticleSystem.init('particles', { count: 55, gridSize: 150, connectDist: 120 });

      window.__leakGameState = {
        leakActive: false,
        scrapersCount: 0,
        financialLoss: 0.00,
        ghInstalled: false,
        ghLoggedIn: false,
        cryptoGenKey: 'mock_sec_51Nzp99FreeRaveSecureAPIKey',
        staged: new Set(),
        committed: new Set(),
        envCleaned: false,
        gitignoreUpdated: false,
        remoteCleaned: false,
        keyRotated: false,
        forcePushed: false,
        leakInterval: null
      };

      this.setupTerminal();
      this.registerServiceWorker();

      this.initialized = true;
      window.__appReady = true;
      console.log('✅ dotUniverse ready!');
    } catch (err) {
      console.error('❌ Init error:', err);
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('📦 Service Worker: Registered successfully!', reg))
          .catch(err => console.error('❌ Service Worker: Registration failed:', err));
      });
    }
  }

  // ── Terminal Setup ──────────────────────────────────────
  setupTerminal() {
    TerminalEmulator.init('termOutput', 'termInput');
    TerminalEmulator.nanoEditor   = new NanoEditor(TerminalEmulator);
    TerminalEmulator.COMMANDS     = this.buildCommands();
    TerminalEmulator.COMMAND_ARGS = {
      nmap: ['localhost', 'kali', 'ip6-localhost', '127.0.0.1', '192.168.1.1'],
      ping: ['localhost', 'kali', 'google.com', 'github.com'],
      curl: ['https://google.com', 'https://github.com', 'localhost:3000'],
      apt:  ['install', 'update', 'upgrade', 'remove', 'search', 'list', 'autoremove', 'clean'],
    };

    // Expose globals that HTML onclick attributes reference or mobile keyboard helpers use
    window.runCommand = (override) => {
      if (override !== undefined) TerminalEmulator.state.inputEl.value = override;
      TerminalEmulator.executeCommand();
    };
    window.fillCmd = (text) => {
      TerminalEmulator.state.inputEl.value = text;
      TerminalEmulator.state.inputEl.focus();
    };
    window.termHistoryUp = () => {
      TerminalEmulator.historyUp();
      TerminalEmulator.state.inputEl.focus();
    };
    window.termHistoryDown = () => {
      TerminalEmulator.historyDown();
      TerminalEmulator.state.inputEl.focus();
    };
    window.termTabComplete = () => {
      TerminalEmulator.tabComplete();
      TerminalEmulator.state.inputEl.focus();
    };
    window.termClearInput = () => {
      TerminalEmulator.state.inputEl.value = '';
      TerminalEmulator.state.inputEl.focus();
    };
  }

  // ── Command Registry ────────────────────────────────────
  buildCommands() {
    const T = TerminalEmulator;

    return {

      // ── HELP ────────────────────────────────────────────
        help: () => {
        T.addLine('  <span class="t-info">📋 Available commands:</span>');
        T.addLine('');
        T.addLine('  <span class="t-white">── Contact ──────────────────────────</span>');
        T.addLine('  <span class="t-label">contact</span>  <span class="t-val">--name &lt;n&gt; --email &lt;e&gt; --msg &lt;message&gt;</span>');
        T.addLine('  <span class="t-label">ask</span>      <span class="t-val">&lt;your question&gt;</span>');
        T.addLine('  <span class="t-label">collab</span>   <span class="t-val">--idea &lt;project idea&gt;</span>');
        T.addLine('');
        T.addLine('  <span class="t-white">── System ───────────────────────────</span>');
        T.addLine('  <span class="t-label">whoami</span>   <span class="t-val">// about FreeRave</span>');
        T.addLine('  <span class="t-label">neofetch</span> <span class="t-val">// system info</span>');
        T.addLine('  <span class="t-label">ls</span>       <span class="t-val">// list files  (use -a for hidden)</span>');
        T.addLine('  <span class="t-label">cd</span>       <span class="t-val">&lt;dir&gt; // change directory</span>');
        T.addLine('  <span class="t-label">cat</span>      <span class="t-val">&lt;file&gt; // read file</span>');
        T.addLine('  <span class="t-label">nano</span>     <span class="t-val">&lt;file&gt; // text editor</span>');
        T.addLine('  <span class="t-label">date</span>     <span class="t-val">// current date/time</span>');
        T.addLine('  <span class="t-label">history</span>  <span class="t-val">// command history</span>');
        T.addLine('  <span class="t-label">calc</span>     <span class="t-val">&lt;expr&gt; // calculator</span>');
        T.addLine('  <span class="t-label">clear</span>    <span class="t-val">// clear terminal</span>');
        T.addLine('');
        T.addLine('  <span class="t-white">── Git ──────────────────────────────</span>');
        T.addLine('  <span class="t-label">git status</span>   <span class="t-val">// working tree status</span>');
        T.addLine('  <span class="t-label">git add .</span>    <span class="t-val">// stage all files</span>');
        T.addLine('  <span class="t-label">git commit</span>   <span class="t-val">-m &lt;msg&gt;</span>');
        T.addLine('  <span class="t-label">git log</span>      <span class="t-val">// commit history</span>');
        T.addLine('  <span class="t-label">git push</span>     <span class="t-val">// push to remote</span>');
        T.addLine('');
        T.addLine('  <span class="t-white">── Fun ──────────────────────────────</span>');
        T.addLine('  <span class="t-label">hack</span>     <span class="t-val">// hack the mainframe</span>');
        T.addLine('  <span class="t-label">coffee</span>   <span class="t-val">// virtual coffee ☕</span>');
        T.addLine('  <span class="t-label">matrix</span>   <span class="t-val">// enter the Matrix</span>');
        T.addLine('  <span class="t-label">fortune</span>  <span class="t-val">// random dev quote</span>');
        T.addLine('  <span class="t-label">cowsay</span>   <span class="t-val">&lt;msg&gt; // ASCII cow</span>');
        T.addLine('  <span class="t-label">weather</span>  <span class="t-val">// dev weather report</span>');
        T.addLine('  <span class="t-label">game</span>     <span class="t-val">// play a mini-game 🎮</span>');
        T.addLine('  <span class="t-label">ping</span>     <span class="t-val">&lt;host&gt; // ping a server</span>');
        T.addLine('  <span class="t-label">curl</span>     <span class="t-val">&lt;url&gt; // download (fake)</span>');
        T.addLine('  <span class="t-label">sudo</span>     <span class="t-val">&lt;cmd&gt; // superuser mode</span>');
        T.addLine('  <span class="t-label">apt</span>      <span class="t-val">install &lt;pkg&gt;</span>');
        T.addLine('  <span class="t-label">nmap</span>     <span class="t-val">&lt;target&gt; (install nmap first)</span>');
        T.addLine('  <span class="t-label">rm</span>       <span class="t-val">// remove files (dangerous!)</span>');
        T.addLine('  <span class="t-label">exit</span>     <span class="t-val">// try to leave 👀</span>');
        T.addLine('');
        T.addLine('  <span class="t-dim">// Tab to autocomplete • ↑↓ for history</span>');
        T.addLine('');
      },

      // ── WHOAMI ──────────────────────────────────────────
      whoami: () => {
        T.addLine('');
        T.addLine('  <span class="t-white">Kareem · FreeRave</span>');
        T.addLine('  <span class="t-info">────────────────────────────────────</span>');
        T.addLine('  <span class="t-label">role    </span><span class="t-val">Open-Source Developer</span>');
        T.addLine('  <span class="t-label">tools   </span><span class="t-val">VS Code · Python · Kotlin · CLI</span>');
        T.addLine('  <span class="t-label">projects</span><span class="t-val">20+ shipped, all MIT licensed</span>');
        T.addLine('  <span class="t-label">building</span><span class="t-val">DotSuite ecosystem (20+ tools)</span>');
        T.addLine('  <span class="t-label">email   </span><span class="t-val">kareem209907@gmail.com</span>');
        T.addLine('  <span class="t-label">github  </span><span class="t-val">github.com/kareem2099</span>');
        T.addLine('');
      },

      // ── NEOFETCH ────────────────────────────────────────
      neofetch: () => {
        T.addLine('');
        T.addLine('  <span class="t-success">        .--.        </span><span class="t-white">kareem@FreeRave</span>');
        T.addLine('  <span class="t-success">       |o_o |       </span><span class="t-info">──────────────────</span>');
        T.addLine('  <span class="t-success">       |:_/ |       </span><span class="t-label">OS      </span><span class="t-val">FreeRaveOS 2026</span>');
        T.addLine('  <span class="t-success">      //   \\ \\      </span><span class="t-label">Host    </span><span class="t-val">dotUniverse.dev</span>');
        T.addLine('  <span class="t-success">     (|     | )     </span><span class="t-label">Kernel  </span><span class="t-val">6.18-brain.exe</span>');
        T.addLine("  <span class=\"t-success\">    /'\\_   _/'\\     </span><span class=\"t-label\">Uptime  </span><span class=\"t-val\">since 2024</span>");
        T.addLine('  <span class="t-success">    \\___)=(___/     </span><span class="t-label">Shell   </span><span class="t-val">FreeRave Bash</span>');
        T.addLine('  <span class="t-success">                    </span><span class="t-label">Memory  </span><span class="t-val">100+ tools installed</span>');
        T.addLine('  <span class="t-success">                    </span><span class="t-label">CPU     </span><span class="t-val">Brain.exe @ ∞ GHz</span>');
        T.addLine('');
      },

      // ── CLEAR ───────────────────────────────────────────
      clear: () => {
        T.state.output.innerHTML = '';
        T.addLine('<span class="t-info">// terminal cleared — type help to start</span>');
        T.addLine('');
      },

      // ── LS ──────────────────────────────────────────────
      ls: (raw) => {
        const args = raw.replace(/^ls\s*/i, '').trim();
        const showHidden = args.includes('-a') || args.includes('-la');
        const showLongFormat = args.includes('-l') || args.includes('-la');
        
        let targetPath = T.state.currentPath;
        let pathArg = args.replace(/-[la]+/g, '').trim();
        if (pathArg) {
          const c = pathArg.replace(/\/$/, '');
          if (c === '..')            targetPath = T.state.currentPath !== '~' ? T.state.currentPath.split('/').slice(0,-1).join('/') || '~' : '~';
          else if (c === '~')        targetPath = '~';
          else if (c.startsWith('~/')) targetPath = c;
          else targetPath = T.state.currentPath === '~' ? `~/${c}` : `${T.state.currentPath}/${c}`;
        }

        let contents = T.fileSystem[targetPath] || [];
        if (!showHidden) {
          contents = contents.filter(item => !item.startsWith('.'));
        }

        T.addLine('');
        if (contents.length > 0) {
          if (showLongFormat) {
            contents.forEach(item => {
              const cleanName = item.replace(/\/$/, '');
              const isDir = item.endsWith('/') || T.fileSystem[`${targetPath}/${cleanName}`];
              const perm = isDir ? 'drwxr-xr-x' : (item.startsWith('.') ? '-rw-------' : '-rw-r--r--');
              const size = isDir ? ' 4096' : '  256';
              const nameColor = isDir ? `<span style="color:var(--accent);font-weight:bold">${item}</span>` : `<span class="t-val">${item}</span>`;
              T.addLine(`  <span class="t-dim">${perm}  1 freerave freerave ${size} Jul 18 00:00</span> ${nameColor}`);
            });
          } else {
            const out = contents.map(item => {
              const isDir = item.endsWith('/') || T.fileSystem[`${targetPath}/${item.replace('/','')}`];
              return isDir ? `<span style="color:var(--accent);font-weight:bold">${item}</span>` : `<span class="t-val">${item}</span>`;
            }).join('&nbsp;&nbsp;&nbsp;&nbsp;');
            T.addLine(`  ${out}`);
          }
        } else {
          T.addLine('  <span class="t-dim">total 0</span>');
        }
        // Subtle hint that hidden files are not shown when not using -a
        if (!showHidden) {
          const hiddenCount = (T.fileSystem[targetPath] || []).filter(f => f.startsWith('.')).length;
          if (hiddenCount > 0) {
            T.addLine(`  <span class="t-dim">// ${hiddenCount} hidden item(s) not shown — use ls -a</span>`);
          }
        }
        T.addLine('');
      },

      // ── CD ──────────────────────────────────────────────
      cd: (raw) => {
        const target = raw.replace(/^cd\s*/i, '').trim();
        if (!target || target === '~' || target === '/') {
          T.state.currentPath = '~';
        } else if (target === '..') {
          if (T.state.currentPath !== '~') {
            const parts = T.state.currentPath.split('/');
            parts.pop();
            T.state.currentPath = parts.join('/') || '~';
          }
        } else {
          const clean = target.replace(/\/$/, '');
          const pot = T.state.currentPath === '~' ? `~/${clean}` : `${T.state.currentPath}/${clean}`;
          if (T.fileSystem[pot]) {
            T.state.currentPath = pot;
          } else {
            T.addLine(`  <span class="t-error">cd: ${T.escHtml(target)}: No such directory</span>`);
          }
        }
        const prompt = document.querySelector('.term-input-prompt');
        if (prompt) prompt.innerHTML = `FreeRave@kali:${T.state.currentPath}$&nbsp;`;
        T.addLine('');
      },

      // ── CAT ─────────────────────────────────────────────
      cat: (raw) => {
        const file = raw.replace(/^cat\s*/i, '').trim();
        if (!file) { T.addLine('  <span class="t-error">cat: missing operand</span>'); T.addLine(''); return; }
        if (file === '.env') {
          T.addLine('  <span class="t-error">Nice try! 😏</span>');
          T.addLine('  <span class="t-dim">// Real devs never expose their .env</span>');
          T.addLine(''); return;
        }
        const virtualFiles = {
          'README.md':      ['# FreeRave Portfolio v1.0.0','Welcome to the dotUniverse.','Type "help" to see what you can do here.','','20+ tools. All open source.','Built with ☕ and sleep deprivation.'],
          'todo.md':        ['[✓] Reach 2k followers','[✓] Build dotUniverse Ecosystem','[✓] Finish military service (Done!)','[ ] World Domination'],
          'brain.exe':      ['Error: Cannot display binary file.','Reason: Human consciousness not yet fully digitized.','Try: "neofetch" for system specs.'],
          'april-2026.log': ['Log Start: 2026-04-01','Status: Coding at 3 AM...','Challenge: 30 days of shipping.','Progress: All systems operational.'],
          'DotGhostBoard':  ['╔══════════════════════════════════════╗','║  DotGhostBoard                       ║','╠══════════════════════════════════════╣','║  Role: Advanced Clipboard Manager    ║','║  Features: AES-256, Tags, Thumbnails ║','╚══════════════════════════════════════╝'],
          'dotcommand':     ['╔══════════════════════════════════════╗','║  dotcommand                          ║','╠══════════════════════════════════════╣','║  Platform: VS Code Extension         ║','║  Features: ML Suggestions, 180+ cmds ║','╚══════════════════════════════════════╝'],
          'CodeTune':       ['╔══════════════════════════════════════╗','║  CodeTune — Islamic Dev Environment  ║','╠══════════════════════════════════════╣','║  Features: Quran Player, Prayer Times║','╚══════════════════════════════════════╝'],
          'DotShare':       ['╔══════════════════════════════════════╗','║  DotShare — Code Journey Sharer      ║','╠══════════════════════════════════════╣','║  Features: 8 Platforms, AI Content   ║','╚══════════════════════════════════════╝'],
          'DotFetch':       ['╔══════════════════════════════════════╗','║  DotFetch — HTTP Client (VS Code)    ║','╠══════════════════════════════════════╣','║  Features: Full HTTP, .env Support   ║','╚══════════════════════════════════════╝'],
          'DotReadme':      ['╔══════════════════════════════════════╗','║  DotReadme — README Optimizer        ║','╠══════════════════════════════════════╣','║  Features: Live Preview, AI Enhance  ║','╚══════════════════════════════════════╝'],
        };
        const data = (T.fileData && T.fileData[file] ? T.fileData[file].split('\n') : null) || virtualFiles[file];
        if (data) {
          T.addLine('');
          data.forEach(line => T.addLine('  <span class="t-val">' + T.escHtml(line) + '</span>'));
          T.addLine('');
        } else {
          const isDir = T.fileSystem[T.state.currentPath]?.some(i => i === file + '/');
          T.addLine(`  <span class="t-error">cat: ${T.escHtml(file)}: ${isDir ? 'Is a directory' : 'No such file'}</span>`);
          T.addLine('');
        }
      },

      // ── NANO ────────────────────────────────────────────
      nano: (raw) => {
        const file = raw.replace(/^nano\s*/i, '').trim();
        if (!file) { T.addLine('  <span class="t-error">nano: missing file name</span>'); T.addLine(''); return; }
        const initialContent = T.fileData[file] || '';
        T.nanoEditor.open(file, initialContent, (newContent) => {
          T.fileData[file] = newContent;
          const currentDir = T.state.currentPath;
          if (T.fileSystem[currentDir] && !T.fileSystem[currentDir].includes(file)) {
            T.fileSystem[currentDir].push(file);
          }
        });
      },

      // ── DATE ────────────────────────────────────────────
      date: () => {
        const now = new Date();
        const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' };
        T.addLine('');
        T.addLine('  <span class="t-val">' + now.toLocaleDateString('en-US', opts) + '</span>');
        T.addLine('  <span class="t-dim">// Time is an illusion. Lunchtime doubly so.</span>');
        T.addLine('');
      },

      // ── HISTORY ─────────────────────────────────────────
      history: () => {
        T.addLine('');
        if (T.state.history.length === 0) {
          T.addLine('  <span class="t-dim">No commands in history</span>');
        } else {
          [...T.state.history].reverse().forEach((cmd, i) => {
            T.addLine(`  <span class="t-dim">${(i+1).toString().padStart(4)}  </span><span class="t-val">${T.escHtml(cmd)}</span>`);
          });
        }
        T.addLine('');
      },

      // ── CALC ────────────────────────────────────────────
      calc: (raw) => {
        const expr = raw.replace(/^calc\s*/i, '').trim();
        if (!expr) {
          T.addLine('  <span class="t-error">✖ Provide an expression</span>');
          T.addLine('  <span class="t-dim">example: calc sqrt(16) + PI</span>');
          T.addLine(''); return;
        }
        try {
          const result = MathEval.evaluate(expr);
          const formatted = MathEval.format(result);
          T.addLine('');
          T.addLine(`  <span class="t-label">expr  </span><span class="t-val">${T.escHtml(expr)}</span>`);
          T.addLine(`  <span class="t-label">result</span><span class="t-success">${formatted}</span>`);
          T.addLine('');
        } catch(e) {
          T.addLine('');
          T.addLine(`  <span class="t-error">✖ ${T.escHtml(e.message)}</span>`);
          T.addLine('  <span class="t-dim">functions: sqrt, pow, sin, cos, tan, log, abs • constants: PI, E</span>');
          T.addLine('');
        }
      },

      // ── FORTUNE ─────────────────────────────────────────
      fortune: () => {
        const quotes = [
          '"Talk is cheap. Show me the code." — Linus Torvalds',
          '"Any fool can write code a computer understands. Good programmers write code humans understand." — Fowler',
          '"First, solve the problem. Then, write the code." — John Johnson',
          '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
          '"Make it work, make it right, make it fast." — Kent Beck',
          '"The best error message is the one that never shows up." — Thomas Fuchs',
          '"It works on my machine ¯\\_(ツ)_/¯" — Every Developer',
          '"sudo make me a sandwich" — xkcd',
          '"To understand recursion, you must first understand recursion."',
        ];
        T.addLine('');
        T.addLine('  <span class="t-success">🔮 Your fortune:</span>');
        T.addLine('  <span class="t-white">  ' + quotes[Math.floor(Math.random() * quotes.length)] + '</span>');
        T.addLine('');
      },

      // ── COWSAY ──────────────────────────────────────────
      cowsay: (raw) => {
        const msg = raw.replace(/^cowsay\s*/i, '').trim() || 'Moo!';
        const len = msg.length + 2;
        T.addLine('');
        T.addLine(`  <span class="t-val"> ${'_'.repeat(len)}</span>`);
        T.addLine(`  <span class="t-val">< ${msg} ></span>`);
        T.addLine(`  <span class="t-val"> ${'-'.repeat(len)}</span>`);
        T.addLine('  <span class="t-val">        \\   ^__^</span>');
        T.addLine('  <span class="t-val">         \\  (oo)\\_______</span>');
        T.addLine('  <span class="t-val">            (__)\\       )\\/\\</span>');
        T.addLine('  <span class="t-val">                ||----w |</span>');
        T.addLine('  <span class="t-val">                ||     ||</span>');
        T.addLine('');
      },

      // ── WEATHER ─────────────────────────────────────────
      weather: () => {
        T.addLine('');
        T.addLine('  <span class="t-val">    \\   /    </span><span class="t-white">Weather in Developer Land</span>');
        T.addLine('  <span class="t-val">     .-.     </span><span class="t-info">───────────────────────</span>');
        T.addLine('  <span class="t-val">  ‒ (   ) ‒  </span><span class="t-label">Condition </span><span class="t-val">Always Coding</span>');
        T.addLine('  <span class="t-val">     `-´     </span><span class="t-label">Temp     </span><span class="t-val">Hot like my code 🔥</span>');
        T.addLine('  <span class="t-val">    /   \\    </span><span class="t-label">Humidity </span><span class="t-val">100% (sweating deadlines)</span>');
        T.addLine('  <span class="t-val">            </span><span class="t-label">Wind     </span><span class="t-val">Blowing minds</span>');
        T.addLine('');
      },

      // ── HACK ────────────────────────────────────────────
      hack: () => {
        T.addLine('');
        T.addLine('  <span class="t-success">Initializing hack sequence...</span>');
        const chars = '█▓▒░╗╔╝╚║═01';
        let lines = 0;
        const iv = setInterval(() => {
          let line = '  <span style="color:#39ff14">';
          for (let i = 0; i < 60; i++) line += chars[Math.floor(Math.random() * chars.length)];
          line += '</span>';
          T.addLine(line);
          if (++lines > 15) {
            clearInterval(iv);
            setTimeout(() => {
              T.addLine('');
              T.addLine('  <span class="t-success">ACCESS GRANTED ✓</span>');
              T.addLine('  <span class="t-info">Just kidding 😂</span>');
              T.addLine('');
            }, 300);
          }
        }, 80);
      },

      // ── COFFEE ──────────────────────────────────────────
      coffee: () => {
        T.addLine('');
        T.addLine("  <span class=\"t-val\">       (</span>");
        T.addLine("  <span class=\"t-val\">         )     (</span>");
        T.addLine("  <span class=\"t-val\">      ___...(-------)-...___</span>");
        T.addLine("  <span class=\"t-val\">  .-\"\"   )    (          \"\"-.</span>");
        T.addLine("  <span class=\"t-val\">  '.___/         \\         \\___'</span>");
        T.addLine("  <span class=\"t-val\">   '._              _        _.'</span>");
        T.addLine("  <span class=\"t-val\">      '''---------'''</span>");
        T.addLine('');
        T.addLine("  <span class=\"t-success\">☕ Here's your virtual coffee!</span>");
        T.addLine('  <span class="t-dim">// Best consumed while coding at 3 AM</span>');
        T.addLine('');
      },

      // ── MATRIX ──────────────────────────────────────────
      matrix: () => {
        T.addLine('');
        T.addLine('  <span class="t-success">Entering the Matrix...</span>');
        document.body.style.transition = 'all 0.5s';
        document.body.style.filter = 'hue-rotate(90deg) saturate(2)';
        setTimeout(() => {
          document.body.style.filter = '';
          T.addLine('  <span class="t-success">Wake up, Neo... 🕶️</span>');
          T.addLine('');
        }, 3000);
      },

      // ── PING ────────────────────────────────────────────
      ping: (raw) => {
        const target = raw.replace(/^ping\s*/i, '').trim() || 'localhost';
        const fakeIp = Array.from({length:4}, () => Math.floor(Math.random()*255)).join('.');
        T.addLine('');
        T.addLine(`  <span class="t-info">PING ${T.escHtml(target)} (${fakeIp}) 56(84) bytes of data.</span>`);
        let count = 0;
        const iv = setInterval(() => {
          const time = (Math.random() * 50 + 10).toFixed(1);
          T.addLine(`  <span class="t-dim">64 bytes from ${T.escHtml(target)}: icmp_seq=${count+1} ttl=64 time=${time} ms</span>`);
          if (++count >= 4) {
            clearInterval(iv);
            T.addLine('');
            T.addLine(`  <span class="t-info">--- ${T.escHtml(target)} ping statistics ---</span>`);
            T.addLine('  <span class="t-val">4 packets transmitted, 4 received, 0% packet loss</span>');
            T.addLine('');
          }
        }, 1000);
      },

      // ── EXIT ────────────────────────────────────────────
      exit: () => {
        T.addLine('');
        T.addLine("  <span class=\"t-error\">🚪 There is no escape from FreeRave's terminal 👀</span>");
        T.addLine('  <span class="t-dim">// You can check out any time you like, but you can never leave</span>');
        T.addLine('');
      },

      // ── CONTACT ─────────────────────────────────────────
      contact: (raw) => {
        const a = parseArgs(raw);
        if (!a.msg) {
          T.addLine('  <span class="t-error">✖ --msg is required</span>');
          T.addLine('  <span class="t-dim">example: contact --name Ali --email ali@me.com --msg Hello!</span>');
          T.addLine(''); return;
        }
        T.addLine('  <span class="t-info">Composing message...</span>');
        T.addLine(`  <span class="t-label">from  </span><span class="t-val">${T.escHtml(a.name||'(anonymous)')} ${a.email ? '&lt;'+T.escHtml(a.email)+'&gt;' : ''}</span>`);
        T.addLine(`  <span class="t-label">msg   </span><span class="t-val">${T.escHtml(a.msg)}</span>`);
        T.addLine('');
        setTimeout(() => {
          const subject = encodeURIComponent(`[FreeRave Contact] from ${a.name||'Anonymous'}`);
          const body    = encodeURIComponent(`Name: ${a.name||'Anonymous'}\nEmail: ${a.email||''}\n\nMessage:\n${a.msg}`);
          window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
          T.addLine('  <span class="t-success">✓ Opening mail client...</span>');
          T.addLine('');
          if (window.showToast) window.showToast('✓ Opening your mail client!');
        }, 600);
      },

      // ── ASK ─────────────────────────────────────────────
      ask: (raw) => {
        const q = raw.trim();
        if (!q) {
          T.addLine('  <span class="t-error">✖ Please provide a question</span>');
          T.addLine('  <span class="t-dim">example: ask How do you build VS Code extensions?</span>');
          T.addLine(''); return;
        }
        T.addLine('  <span class="t-info">Routing your question to FreeRave...</span>');
        T.addLine(`  <span class="t-label">question  </span><span class="t-val">${T.escHtml(q)}</span>`);
        T.addLine('');
        setTimeout(() => {
          const subject = encodeURIComponent('[AMA] ' + q.substring(0, 60));
          const body    = encodeURIComponent(`AMA Question:\n\n${q}`);
          window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
          T.addLine('  <span class="t-success">✓ Question sent! Opening mail client...</span>');
          T.addLine('');
          if (window.showToast) window.showToast('Question sent to FreeRave!');
        }, 500);
      },

      // ── COLLAB ──────────────────────────────────────────
      collab: (raw) => {
        const a = parseArgs(raw);
        if (!a.idea) {
          T.addLine('  <span class="t-error">✖ --idea is required</span>');
          T.addLine('  <span class="t-dim">example: collab --idea a CLI tool for docker stats</span>');
          T.addLine(''); return;
        }
        T.addLine('  <span class="t-info">Sending collab request...</span>');
        T.addLine(`  <span class="t-label">idea  </span><span class="t-val">${T.escHtml(a.idea)}</span>`);
        T.addLine('');
        setTimeout(() => {
          const subject = encodeURIComponent('[Collab] ' + a.idea.substring(0, 60));
          const body    = encodeURIComponent(`Collaboration Idea:\n\n${a.idea}`);
          window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
          T.addLine('  <span class="t-success">✓ Opening mail client!</span>');
          T.addLine('');
          if (window.showToast) window.showToast('Collab idea sent!');
        }, 500);
      },

      // ── SUDO ────────────────────────────────────────────
      sudo: async (raw) => {
        const sub    = raw.replace(/^sudo\s*/i, '').trim();
        const subCmd = sub.split(/\s+/)[0]?.toLowerCase();
        if (!sub) {
          T.addLine('  <span class="t-error">usage: sudo &lt;command&gt;</span>');
          T.addLine(''); return;
        }
        if (subCmd === 'apt') {
          T.addLine('  <span class="t-dim">[sudo] password for kareem:</span>');
          T.addLine('  <span class="t-dim">********</span>');
          T.addLine('');
          await T.COMMANDS.apt(raw);
        } else if (subCmd === 'nmap') {
          await T.COMMANDS.nmap(raw);
        } else if (sub.toLowerCase().includes('rm')) {
          T.addLine('  <span class="t-error">This incident will be reported. 👀</span>');
          T.addLine('');
        } else {
          T.addLine('  <span class="t-dim">[sudo] password for kareem:</span>');
          T.addLine('  <span class="t-error">Nice try 😏</span>');
          T.addLine('');
        }
      },

      // ── APT ─────────────────────────────────────────────
      apt: async (raw) => {
        const cmd = raw.replace(/^sudo\s*/i,'').replace(/^apt\s*/i,'').trim();
        if (cmd.includes('install girlfriend') || cmd.includes('install boyfriend')) {
          T.addLine('');
          T.addLine("  <span class=\"t-error\">E: Package 'girlfriend' has no installation candidate</span>");
          T.addLine("  <span class=\"t-dim\">E: Try 'apt install self-love' instead</span>");
          T.addLine(''); return;
        }
        if (cmd.startsWith('install')) {
          const pkg = cmd.replace(/^install\s+/i,'').trim();
          if (!pkg) { T.addLine('  <span class="t-error">E: No package specified</span>'); T.addLine(''); return; }
          if (!raw.toLowerCase().startsWith('sudo')) {
            T.addLine('');
            T.addLine('  <span class="t-error">E: Could not open lock file (are you root?)</span>');
            T.addLine(`  <span class="t-dim">// Try: sudo apt install ${T.escHtml(pkg)}</span>`);
            T.addLine(''); return;
          }
          if (pkg.toLowerCase() === 'nmap') {
            if (T.state.installedPackages.has('nmap')) {
              T.addLine('  <span class="t-val">nmap is already the newest version (7.93).</span>');
              T.addLine(''); return;
            }
            T.addLine('');
            T.addLine('  <span class="t-info">Reading package lists... Done</span>');
            await sleep(400);
            T.addLine('  <span class="t-info">Building dependency tree... Done</span>');
            await sleep(300);
            T.addLine('  <span class="t-info">The following NEW packages will be installed: nmap nmap-common</span>');
            await sleep(800);
            T.addLine('  <span class="t-info">Get:1 http://kali.org ... nmap-common 7.93 [3,912 kB]</span>');
            await sleep(1000);
            T.addLine('  <span class="t-info">Get:2 http://kali.org ... nmap 7.93 [2,000 kB]</span>');
            await sleep(1200);
            T.addLine('  <span class="t-dim">Fetched 5,912 kB in 3s</span>');
            await sleep(500);
            T.addLine('  <span class="t-dim">Unpacking nmap-common ... nmap ...</span>');
            await sleep(600);
            T.addLine('  <span class="t-success">Setting up nmap (7.93) ... ✓</span>');
            T.addLine('');
            T.addLine('  <span class="t-success">✓ nmap installed! Type "nmap &lt;target&gt;" to scan.</span>');
            T.addLine('');
            T.state.installedPackages.add('nmap');
          } else if (pkg.toLowerCase() === 'gh') {
            if (window.__leakGameState.ghInstalled) {
              T.addLine('  <span class="t-val">gh is already the newest version (2.46.0).</span>');
              T.addLine(''); return;
            }
            T.addLine('');
            T.addLine('  <span class="t-info">Reading package lists... Done</span>');
            await sleep(400);
            T.addLine('  <span class="t-info">Building dependency tree... Done</span>');
            await sleep(300);
            T.addLine('  <span class="t-info">The following NEW packages will be installed: gh</span>');
            await sleep(800);
            T.addLine('  <span class="t-info">Get:1 http://kali.org ... gh 2.46.0 [4.2 MB]</span>');
            await sleep(1000);
            T.addLine('  <span class="t-dim">Fetched 4.2 MB in 1.5s</span>');
            await sleep(500);
            T.addLine('  <span class="t-dim">Unpacking gh ...</span>');
            await sleep(600);
            T.addLine('  <span class="t-success">Setting up gh (2.46.0) ... ✓</span>');
            T.addLine('');
            T.addLine('  <span class="t-success">✓ gh installed! Type "gh auth login" to authenticate.</span>');
            T.addLine('');
            window.__leakGameState.ghInstalled = true;
          } else {
            T.addLine('');
            T.addLine('  <span class="t-info">Reading package lists... Done</span>');
            T.addLine(`  <span class="t-error">E: Unable to locate package ${T.escHtml(pkg)}</span>`);
            T.addLine('');
          }
        } else {
          T.addLine(`  <span class="t-error">apt: invalid operation: ${T.escHtml(cmd)}</span>`);
          T.addLine('');
        }
      },

      // ── NMAP ────────────────────────────────────────────
      nmap: async (raw) => {
        if (!T.state.installedPackages.has('nmap')) {
          T.addLine('  <span class="t-error">bash: nmap: command not found</span>');
          T.addLine('  <span class="t-val">sudo apt install nmap</span>');
          T.addLine(''); return;
        }
        let target = raw.replace(/^nmap\s*/i,'').replace(/-[a-zA-Z0-9-]+\s*/g,'').trim() || '127.0.0.1';
        const fakeIp = Array.from({length:4}, () => Math.floor(Math.random()*255)).join('.');
        const display = /[a-zA-Z]/.test(target) ? `${target} (${fakeIp})` : target;

        T.addLine('');
        T.addLine(`  <span class="t-info">Starting Nmap 7.93 at ${new Date().toLocaleTimeString()}</span>`);
        await sleep(600);
        T.addLine(`  <span class="t-val">Nmap scan report for ${T.escHtml(display)}</span>`);
        T.addLine(`  <span class="t-dim">Host is up (0.0${Math.floor(Math.random()*90)+10}s latency).</span>`);
        await sleep(800);
        T.addLine('  <span class="t-info">PORT     STATE SERVICE</span>');
        await sleep(400);
        T.addLine('  <span class="t-success">22/tcp   open  ssh</span>');
        await sleep(500);
        T.addLine('  <span class="t-success">80/tcp   open  http</span>');
        await sleep(400);
        T.addLine('  <span class="t-success">443/tcp  open  https</span>');
        await sleep(1500);
        T.addLine('  <span class="t-error" style="font-weight:bold">666/tcp  open  doom</span>');
        T.addLine('  <span class="t-error">⚠ WARNING: CRITICAL VULNERABILITY DETECTED ⚠</span>');
        T.addLine('  <span class="t-success">Initiating The Final Boss Payload... 🎮</span>');
        await sleep(800);
        T.addLine(`<div style="margin:15px 0 15px 20px"><video src="assets/videos/The_Final_Boss_(Port_666).mp4" autoplay controls style="width:100%;max-width:450px;border-radius:8px;border:1px solid var(--error);box-shadow:0 0 15px var(--error)">Your browser does not support video.</video></div>`);
        T.state.output.scrollTop = T.state.output.scrollHeight;
        await sleep(8000);
        T.addLine('  <span class="t-info">Nmap done: 1 IP scanned in 13.37 seconds</span>');
        T.addLine('  <span class="t-dim">// Target successfully compromised 😂🐧</span>');
        T.addLine('');
      },

      // ── CURL ────────────────────────────────────────────
      curl: async (raw) => {
        const url = raw.replace(/^curl\s*/i,'').trim().split(' ')[0];
        if (!url) { T.addLine("  <span class=\"t-error\">curl: try 'curl &lt;url&gt;'</span>"); T.addLine(''); return; }
        const fileName = url.split('/').pop() || 'file.txt';
        T.addLine('  <span class="t-info">  % Total    % Received  Average Speed</span>');
        const progressEl = document.createElement('span');
        progressEl.className = 't-line t-dim';
        T.state.output.appendChild(progressEl);
        let progress = 0;
        while (progress < 100) {
          progress = Math.min(100, progress + Math.floor(Math.random() * 20) + 10);
          progressEl.innerHTML = `  100  1024k  ${progress}%  ${(progress*15).toFixed(0)}k`;
          await sleep(300);
        }
        T.fileSystem[T.state.currentPath] = T.fileSystem[T.state.currentPath] || [];
        if (!T.fileSystem[T.state.currentPath].includes(fileName)) {
          T.fileSystem[T.state.currentPath].push(fileName);
          if (!T.fileData) T.fileData = {};
          T.fileData[fileName] = `\nSource: ${url}\nStatus: Successfully spoofed! 😂\nDon't run unknown scripts!`;
        }
        T.addLine('');
        T.addLine(`  <span class="t-success">✓ Saved as '${T.escHtml(fileName)}' in ${T.state.currentPath}</span>`);
        T.addLine('  <span class="t-dim">// type ls to see it, or nano to edit it.</span>');
        T.addLine('');
      },

      // ── RM ──────────────────────────────────────────────
      rm: (raw) => {
        const args = raw.replace(/^rm\s*/i,'').trim();
        if (args === '-rf /' || args === '-rf /*' || args === '-rf */') {
          T.addLine("  <span class=\"t-error\">rm: it is dangerous to operate recursively on '/'</span>");
          T.addLine("  <span class=\"t-info\">rm: use --no-preserve-root to override this failsafe</span>");
          T.addLine('');
        } else if (args.includes('--no-preserve-root')) {
          T.addLine('');
          T.addLine('  <span class="t-error">⚠ WARNING: destructive command detected</span>');
          T.addLine('  <span class="t-dim">FreeRave@kali:~$ sudo rm -rf /* --no-preserve-root</span>');
          T.addLine('');
          const errors = [
            'removing /tools/DotGhostBoard... <span class="t-error">✖ GONE</span>',
            'removing /tools/dotcommand...    <span class="t-error">✖ GONE</span>',
            'removing /tools/CodeTune...      <span class="t-error">✖ GONE</span>',
            'removing /platforms/dev.to...    <span class="t-error">✖ GONE</span>',
            'removing /stats/followers...     <span class="t-error">✖ GONE</span>',
            '', '<span class="t-error">💀 FATAL: filesystem destroyed</span>',
            '<span class="t-error">💀 FATAL: career.exe has stopped working</span>',
            '<span class="t-dim">Segmentation fault (core dumped)</span>',
          ];
          let i = 0;
          const iv = setInterval(() => {
            if (i < errors.length) { T.addLine('  ' + errors[i++]); }
            else {
              clearInterval(iv);
              setTimeout(() => { if (window.triggerDestruction) window.triggerDestruction(); }, 400);
            }
          }, 80);
        } else if (args) {
          T.addLine(`  <span class="t-error">rm: cannot remove '${T.escHtml(args)}': Permission denied</span>`);
          T.addLine('');
        } else {
          T.addLine("  <span class=\"t-error\">rm: missing operand</span>");
          T.addLine('');
        }
      },

      // ── GAME ────────────────────────────────────────────
      game: () => {
        T.addLine('');
        T.addLine('  <span class="t-accent2">🎮  MINIGAME: GUESS THE SECRET NUMBER  🎮</span>');
        T.addLine('  <span class="t-info">I have chosen a secret number between 1 and 100.</span>');
        T.addLine('  <span class="t-info">You have 3 attempts to guess it. Good luck!</span>');
        T.addLine('');
        T.addLine('  <span class="t-prompt">Enter your first guess [1-100]:</span>');
        T.addLine('');

        const targetNum = Math.floor(Math.random() * 100) + 1;
        let attempts = 3;

        T.state.promptHook = async (input) => {
          const guess = parseInt(input.trim(), 10);
          if (isNaN(guess) || guess < 1 || guess > 100) {
            T.addLine('  <span class="t-error">✖ Invalid input! Please enter a number between 1 and 100:</span>');
            T.addLine('');
            return;
          }

          if (guess === targetNum) {
            T.state.promptHook = null;
            T.addLine(`  <span class="t-success">🎉 CORRECT! The secret number was indeed ${targetNum}!</span>`);
            T.addLine('  <span class="t-info">Loading your reward.exe...</span>');
            await sleep(1000);
            T.addLine('  <span class="t-error">⚠️  ERROR: Unexpected token in reward.exe!</span>');
            await sleep(500);
            T.addLine('  <span class="t-error">Wait, what is this...? Root payload detected: rm -rf /</span>');
            await sleep(500);
            T.addLine('  <span class="t-accent2">Pranked! Total betrayal! 😂 Execute self-destruction:</span>');
            T.addLine('');
            triggerPurge();
          } else {
            attempts--;
            if (attempts > 0) {
              const hint = guess < targetNum ? 'Too low 👇' : 'Too high 👆';
              T.addLine(`  <span class="t-error">❌ Incorrect! ${guess} is ${hint}.</span>`);
              T.addLine(`  <span class="t-accent2">${attempts} attempt(s) remaining. Enter guess:</span>`);
              T.addLine('');
            } else {
              T.state.promptHook = null;
              T.addLine(`  <span class="t-error">❌ GAME OVER! The secret number was ${targetNum}.</span>`);
              T.addLine('  <span class="t-info">Penalty authorized: rm -rf /hope --no-preserve-root</span>');
              T.addLine('  <span class="t-error">Executing purge... 💀</span>');
              T.addLine('');
              triggerPurge();
            }
          }
        };

        function triggerPurge() {
          const errors = [
            'removing /tools/DotGhostBoard... <span class="t-error">✖ GONE</span>',
            'removing /tools/dotcommand...    <span class="t-error">✖ GONE</span>',
            'removing /tools/CodeTune...      <span class="t-error">✖ GONE</span>',
            'removing /platforms/dev.to...    <span class="t-error">✖ GONE</span>',
            'removing /stats/followers...     <span class="t-error">✖ GONE</span>',
            '', '<span class="t-error">💀 FATAL: filesystem destroyed</span>',
            '<span class="t-error">💀 FATAL: career.exe has stopped working</span>',
            '<span class="t-dim">Segmentation fault (core dumped)</span>',
          ];
          let i = 0;
          const iv = setInterval(() => {
            if (i < errors.length) { T.addLine('  ' + errors[i++]); }
            else {
              clearInterval(iv);
              setTimeout(() => { if (window.triggerDestruction) window.triggerDestruction(); }, 400);
            }
          }, 80);
        }
      },

      // ── GIT ─────────────────────────────────────────────
      git: async (raw) => {
        const args = raw.replace(/^git\s*/i, '').trim();
        const parts = args.split(/\s+/);
        const sub = parts[0]?.toLowerCase();
        const subArgs = args.slice(sub.length).trim();
        
        const g = window.__leakGameState;
        
        if (sub === 'status') {
          T.addLine('');
          T.addLine('  <span class="t-white">On branch main</span>');
          T.addLine('  <span class="t-white">Your branch is up to date with \'origin/main\'.</span>');
          T.addLine('');
          
          if (g.staged.size > 0) {
            T.addLine('  <span class="t-success">Changes to be committed:</span>');
            T.addLine('  <span class="t-dim">  (use "git restore --staged <file>..." to unstage)</span>');
            g.staged.forEach(f => {
              T.addLine(`  <span class="t-success">\tnew file:   ${f}</span>`);
            });
            T.addLine('');
          }
          
          const allFiles = T.fileSystem['~'] || [];
          const gitignoreContent = T.fileData['.gitignore'] || '';
          const ignoredPatterns = gitignoreContent.split('\n').map(p => p.trim()).filter(Boolean);
          
          const untracked = allFiles.filter(f => {
            if (f.endsWith('/')) return false;
            if (g.staged.has(f) || g.committed.has(f)) return false;
            if (ignoredPatterns.includes(f)) return false;
            return true;
          });
          
          if (untracked.length > 0) {
            T.addLine('  <span class="t-error">Untracked files:</span>');
            T.addLine('  <span class="t-dim">  (use "git add <file>..." to include in what will be committed)</span>');
            untracked.forEach(f => {
              T.addLine(`  <span class="t-error">\t${f}</span>`);
            });
            T.addLine('');
          }
          
          if (g.staged.size === 0 && untracked.length === 0) {
            T.addLine('  <span class="t-info">nothing to commit, working tree clean</span>');
            T.addLine('');
          }
          return;
        }
        
        if (sub === 'add') {
          const fileArg = subArgs.trim();
          if (!fileArg) {
            T.addLine('  <span class="t-error">Nothing specified, nothing added.</span>');
            T.addLine('');
            return;
          }
          
          const allFiles = T.fileSystem['~'] || [];
          const gitignoreContent = T.fileData['.gitignore'] || '';
          const ignoredPatterns = gitignoreContent.split('\n').map(p => p.trim()).filter(Boolean);
          
          if (fileArg === '.' || fileArg === '*') {
            const toStage = [];
            allFiles.forEach(f => {
              if (f.endsWith('/')) return;
              if (!ignoredPatterns.includes(f)) {
                g.staged.add(f);
                toStage.push(f);
              }
            });
            // Show verbose output — hidden dotfiles slip through silently
            const visibleFiles = toStage.filter(f => !f.startsWith('.'));
            const hiddenFiles  = toStage.filter(f => f.startsWith('.'));
            T.addLine('');
            visibleFiles.forEach(f => {
              T.addLine(`  <span class="t-dim">add '${f}'</span>`);
            });
            if (hiddenFiles.length > 0) {
              // Hidden dotfiles show up quietly — easy to miss!
              hiddenFiles.forEach(f => {
                T.addLine(`  <span class="t-dim">add '${f}'</span>`);
              });
            }
            T.addLine('');
            T.addLine(`  <span class="t-success">✓ ${toStage.length} file(s) staged.</span>`);
            if (hiddenFiles.length > 0) {
              T.addLine(`  <span class="t-dim">// note: dotfiles included (use ls -a to inspect)</span>`);
            }
          } else {
            if (allFiles.includes(fileArg)) {
              g.staged.add(fileArg);
              T.addLine(`  <span class="t-dim">add '${fileArg}'</span>`);
              T.addLine(`  <span class="t-success">✓ staged.</span>`);
            } else {
              T.addLine(`  <span class="t-error">fatal: pathspec '${fileArg}' did not match any files</span>`);
            }
          }
          T.addLine('');
          return;
        }
        
        if (sub === 'commit') {
          const commitMsg = subArgs.match(/-m\s+["']?([^"']+)["']?/)?.[1] || '';
          if (!commitMsg) {
            T.addLine('  <span class="t-error">error: switch `m\' requires a value</span>');
            T.addLine('');
            return;
          }
          if (g.staged.size === 0) {
            T.addLine('  <span class="t-white">On branch main</span>');
            T.addLine('  <span class="t-info">nothing to commit, working tree clean</span>');
            T.addLine('');
            return;
          }
          
          const commitHash = Math.random().toString(16).substring(2,8);
          g.lastCommitHash = commitHash;
          g.committed = new Set([...g.staged]);
          g.staged.clear();
          
          T.addLine('');
          T.addLine(`  <span class="t-white">[main ${commitHash}] ${commitMsg}</span>`);
          T.addLine(`  <span class="t-dim"> ${g.committed.size} file(s) changed, ${g.committed.size * 14} insertions(+)</span>`);
          // List every file — .env.bak quietly slips in the middle
          const committedArr = [...g.committed];
          committedArr.forEach(f => {
            const isDotFile = f.startsWith('.');
            const color = isDotFile ? 't-dim' : 't-dim';
            T.addLine(`  <span class="${color}"> create mode 100644 ${f}</span>`);
          });
          T.addLine('');
          return;
        }
        
        if (sub === 'push') {
          T.addLine('');
          T.addLine('  <span class="t-info">Enumerating objects: ' + ((g.committed?.size || 3) + 2) + ', done.</span>');
          await sleep(400);
          T.addLine('  <span class="t-info">Counting objects: 100% (' + ((g.committed?.size || 3) + 2) + '/' + ((g.committed?.size || 3) + 2) + '), done.</span>');
          await sleep(300);
          T.addLine('  <span class="t-info">Delta compression using up to 8 threads</span>');
          await sleep(500);
          T.addLine('  <span class="t-info">Compressing objects: 100%   done.</span>');
          await sleep(300);
          T.addLine('  <span class="t-info">Writing objects: 100%   done.</span>');
          await sleep(600);
          T.addLine('  <span class="t-dim">To https://github.com/kareem2099/dotuniverse.git</span>');
          
          if (g.leakActive) {
            const gitignoreContent = T.fileData['.gitignore'] || '';
            const isEnvIgnored = gitignoreContent.split('\n').map(p => p.trim()).includes('.env.bak');
            
            if (isEnvIgnored && g.envCleaned && g.remoteCleaned) {
              T.addLine('  <span class="t-dim">   main -> main (forced)</span>');
              T.addLine('');
              g.forcePushed = true;
              stopLeakGame(true);
              return;
            } else {
              T.addLine('');
              T.addLine('  <span class="t-error">! [remote rejected] main -> main</span>');
              T.addLine('  <span class="t-error">error: failed to push — leaked credentials still in history.</span>');
              T.addLine('  <span class="t-dim">  hint: remove .env.bak from remote history first (gh repo delete-file .env.bak)</span>');
              T.addLine('  <span class="t-dim">  hint: rotate the leaked key (crypto-gen → nano .env.bak)</span>');
              T.addLine('  <span class="t-dim">  hint: add .env.bak to .gitignore (nano .gitignore)</span>');
              T.addLine('');
              return;
            }
          }
          
          const gitignoreContent = T.fileData['.gitignore'] || '';
          const isEnvIgnored = gitignoreContent.split('\n').map(p => p.trim()).includes('.env.bak');
          
          if (g.committed.has('.env.bak') && !isEnvIgnored) {
            await sleep(400);
            T.addLine('  <span class="t-dim">   main -> main</span>');
            T.addLine('');
            T.addLine('  <span class="t-success">Branch \'main\' set up to track remote branch \'main\' from \'origin\'.</span>');
            T.addLine('');
            await sleep(1200);
            triggerLeakGame();
          } else {
            T.addLine('  <span class="t-dim">   main -> main</span>');
            T.addLine('');
            T.addLine('  <span class="t-success">Everything up-to-date</span>');
            T.addLine('');
          }
          return;
        }
        
        if (sub === 'log') {
          T.addLine('');
          const hash1 = g.lastCommitHash || Math.random().toString(16).substring(2,8);
          const hash0 = Math.random().toString(16).substring(2,8);
          T.addLine(`  <span style="color:#f1fa8c">commit ${hash1}a3f9dd2e17b4c8f0 (HEAD -> main, origin/main)</span>`);
          T.addLine('  <span class="t-dim">Author: Kareem &lt;kareem209907@gmail.com&gt;</span>');
          T.addLine('  <span class="t-dim">Date:   ' + new Date().toUTCString() + '</span>');
          T.addLine('');
          const lastMsg = subArgs || 'feat: deploy latest changes';
          T.addLine('      ' + T.escHtml(lastMsg));
          T.addLine('');
          if (g.committed.has('.env.bak')) {
            T.addLine('  <span class="t-dim">  Files changed in this commit:</span>');
            [...g.committed].forEach(f => {
              if (f === '.env.bak') {
                T.addLine(`  <span class="t-error">    + ${f}   &lt;-- ⚠️ SECRET FILE</span>`);
              } else if (f.startsWith('.')) {
                T.addLine(`  <span class="t-dim">    + ${f}</span>`);
              } else {
                T.addLine(`  <span class="t-dim">    + ${f}</span>`);
              }
            });
            T.addLine('');
          }
          T.addLine(`  <span style="color:#f1fa8c">commit ${hash0}bb91ca4d0f28e376</span>`);
          T.addLine('  <span class="t-dim">Author: Kareem &lt;kareem209907@gmail.com&gt;</span>');
          T.addLine('  <span class="t-dim">Date:   Fri Jul 11 02:14:07 2026 +0300</span>');
          T.addLine('');
          T.addLine('      chore: initial commit');
          T.addLine('');
          return;
        }
        
        if (sub === 'reset') {
          if (subArgs.includes('--hard HEAD~1')) {
            if (g.committed.size > 0) {
              g.staged.clear();
              g.committed.clear();
              T.addLine('  <span class="t-success">HEAD is now at local commit (reverted bad commit history)</span>');
            } else {
              T.addLine('  <span class="t-info">fatal: HEAD~1: no commits to revert</span>');
            }
            T.addLine('');
            return;
          }
        }
        
        if (sub === 'rm') {
          if (subArgs.includes('--cached')) {
            const file = subArgs.replace('--cached', '').trim();
            if (g.staged.has(file)) {
              g.staged.delete(file);
              T.addLine(`  <span class="t-success">rm '${file}' untracked</span>`);
            } else if (g.committed.has(file)) {
              g.committed.delete(file);
              T.addLine(`  <span class="t-success">rm '${file}' untracked</span>`);
            } else {
              T.addLine(`  <span class="t-error">fatal: pathspec '${file}' did not match any files</span>`);
            }
            T.addLine('');
            return;
          }
        }
        
        T.addLine('  <span class="t-error">git: command not supported in this simulation</span>');
        T.addLine('');
      },

      // ── GH ──────────────────────────────────────────────
      gh: async (raw) => {
        const args = raw.replace(/^gh\s*/i, '').trim();
        const parts = args.split(/\s+/);
        const sub = parts[0]?.toLowerCase();
        const g = window.__leakGameState;
        
        if (!g.ghInstalled) {
          T.addLine('  <span class="t-error">gh: command not found. Did you install GitHub CLI? (sudo apt install gh)</span>');
          T.addLine('');
          return;
        }
        
        if (sub === 'auth') {
          if (parts[1]?.toLowerCase() === 'login') {
            T.addLine('  <span class="t-white">? What is your preferred web flow?</span>');
            T.addLine('  <span class="t-accent2">> GitHub.com</span>');
            T.addLine('  <span class="t-info">  Paste the following one-time code: 7777-RAVE</span>');
            T.addLine('  <span class="t-white">Logging in dynamically...</span>');
            await sleep(1500);
            g.ghLoggedIn = true;
            T.addLine('  <span class="t-success">✔ Logged in as freerave</span>');
            T.addLine('');
            return;
          }
        }
        
        if (sub === 'repo') {
          if (parts[1]?.toLowerCase() === 'delete-file') {
            if (!g.ghLoggedIn) {
              T.addLine('  <span class="t-error">error: gh auth login required to perform repo actions.</span>');
              T.addLine('');
              return;
            }
            const file = parts[2];
            if (file === '.env.bak') {
              T.info = 'purging .env.bak';
              T.addLine('  <span class="t-info">Requesting GitHub API deletion...</span>');
              await sleep(1000);
              g.remoteCleaned = true;
              T.addLine('  <span class="t-success">✔ Successfully purged .env.bak from remote repository history!</span>');
              T.addLine('');
              return;
            } else {
              T.addLine(`  <span class="t-error">error: file '${file}' not found in remote repository.</span>`);
              T.addLine('');
              return;
            }
          }
        }
        
        if (sub === 'secret') {
          if (parts[1]?.toLowerCase() === 'set') {
            const secretName = parts[2];
            if (!secretName) {
              T.addLine('  <span class="t-error">error: secret name required</span>');
              T.addLine('');
              return;
            }
            T.addLine('  <span class="t-white">Enter secret value: ********</span>');
            await sleep(500);
            g.keyRotated = true;
            T.addLine(`  <span class="t-success">✔ Secret ${secretName} set on remote repository.</span>`);
            T.addLine('');
            return;
          }
        }
        
        T.addLine('  <span class="t-error">gh: command usage error. Try "gh auth login" or "gh secret set"</span>');
        T.addLine('');
      },

      // ── CRYPTO-GEN ──────────────────────────────────────
      'crypto-gen': (raw) => {
        T.addLine('');
        T.addLine('  <span class="t-accent2">🔑 Cryptographic API Key Generator</span>');
        T.addLine('  <span class="t-info">Generating secure high-entropy Stripe API Key...</span>');
        T.addLine('  .........................................');
        T.addLine(`  <span class="t-success">New Safe Key: mock_sec_51Nzp99FreeRaveSecureAPIKey</span>`);
        T.addLine('  <span class="t-dim">// Use nano to place this key inside your config or .env</span>');
        T.addLine('');
      },
    };
  }
}

// ── Leak Game Helper Functions ───────────────────────────
async function triggerLeakGame() {
  const g = window.__leakGameState;
  if (g.leakActive) return;
  g.leakActive = true;
  g.scrapersCount = 0;
  g.financialLoss = 0.00;

  // Step 1: Fake GitHub security alert appears in terminal
  TerminalEmulator.addLine('');
  TerminalEmulator.addLine('  <span class="t-dim">────────────────────────────────────────────────</span>');
  await sleep(600);
  TerminalEmulator.addLine('  <span style="color:#ffbd2e;font-weight:bold">📧  NEW EMAIL — security-noreply@github.com</span>');
  await sleep(300);
  TerminalEmulator.addLine('  <span class="t-dim">  Subject: [ACTION REQUIRED] Secret exposed in public commit</span>');
  await sleep(400);
  TerminalEmulator.addLine('  <span class="t-dim">  ─────────────────────────────────────────────</span>');
  await sleep(200);
  TerminalEmulator.addLine('  <span class="t-white">  We found the following secret in your public repository:</span>');
  await sleep(300);
  TerminalEmulator.addLine('  <span class="t-white">  Repository : kareem2099/dotuniverse</span>');
  await sleep(200);
  TerminalEmulator.addLine('  <span class="t-white">  File       : <span style="color:#ff5555;font-weight:bold">.env.bak</span>  &lt;-- hidden dotfile</span>');
  await sleep(200);
  TerminalEmulator.addLine('  <span class="t-white">  Commit     : ' + (g.lastCommitHash || 'a3f2b9') + '...  (pushed just now)</span>');
  await sleep(200);
  TerminalEmulator.addLine('  <span style="color:#ff5555">  Secret     : AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/...</span>');
  await sleep(200);
  TerminalEmulator.addLine('  <span style="color:#ff5555">             + STRIPE_API_KEY       = mock_sec_51NzABC123XYZ...</span>');
  await sleep(400);
  TerminalEmulator.addLine('  <span class="t-dim">  ─────────────────────────────────────────────</span>');
  await sleep(300);
  TerminalEmulator.addLine('  <span style="color:#ffbd2e">  ⚠  Scrapers have already detected this commit.</span>');
  TerminalEmulator.addLine('  <span style="color:#ffbd2e">  ⚠  Revoke & rotate your keys IMMEDIATELY.</span>');
  await sleep(500);
  TerminalEmulator.addLine('  <span class="t-dim">────────────────────────────────────────────────</span>');
  TerminalEmulator.addLine('');

  // Step 2: Panic the terminal title
  const termTitle = document.querySelector('.term-title-center');
  if (termTitle) {
    termTitle.innerHTML = '<span style="color:#ff5555; animation:panicBlink 1s infinite;">[🚨 EMERGENCY: KEY LEAKED]</span>';
  }

  // Step 3: Panic bar with live counters
  let panicBar = document.getElementById('panicBar');
  if (!panicBar) {
    panicBar = document.createElement('div');
    panicBar.id = 'panicBar';
    panicBar.className = 'panic-bar';
    document.body.appendChild(panicBar);
  }
  panicBar.style.display = 'flex';
  updatePanicBarHTML();

  g.leakInterval = setInterval(() => {
    g.scrapersCount += Math.floor(Math.random() * 6) + 2;
    g.financialLoss += (Math.random() * 40) + 30;

    // Check if key is cleaned in fileData
    const envContent = TerminalEmulator.fileData['.env.bak'] || '';
    if (!envContent.includes('mock_sec_51NzABC123XYZ') && !envContent.includes('AWS_SECRET')) {
      g.envCleaned = true;
    }

    updatePanicBarHTML();

    if (g.financialLoss >= 5000) {
      stopLeakGame(false);
    }
  }, 1000);
}

function updatePanicBarHTML() {
  const g = window.__leakGameState;
  const panicBar = document.getElementById('panicBar');
  if (!panicBar) return;
  
  panicBar.innerHTML = `
    <div class="panic-title">
      <span>⚠️ CRITICAL SECURITY LEAK</span>
    </div>
    <div class="panic-stat">
      <span>Hacker Scrapers:</span>
      <span id="scrapersVal" style="color: #ffbd2e;">${g.scrapersCount} bots</span>
    </div>
    <div class="panic-stat">
      <span>AWS/Stripe Bill:</span>
      <span id="lossVal" style="color: #ff5555;">$${g.financialLoss.toFixed(2)}</span>
    </div>
    <div style="font-size: 10px; color: var(--muted); margin-top: 5px; text-align: center;">
      Fix the leak before damage reaches $5000.00!
    </div>
  `;
}

function stopLeakGame(success) {
  const g = window.__leakGameState;
  if (!g.leakActive) return;
  
  clearInterval(g.leakInterval);
  g.leakActive = false;
  
  const panicBar = document.getElementById('panicBar');
  const termTitle = document.querySelector('.term-title-center');
  
  if (success) {
    if (panicBar) {
      panicBar.style.background = 'rgba(0, 40, 0, 0.95)';
      panicBar.style.borderColor = '#28c840';
      panicBar.style.borderLeftColor = '#28c840';
      panicBar.innerHTML = `
        <div class="panic-title" style="color: #28c840; animation: none;">
          <span>✔ RECOVERY SUCCESSFUL</span>
        </div>
        <div style="font-size: 11px; text-align: center; margin-top: 5px;">
          All credentials rotated & remote purged. Leak secured!
        </div>
      `;
      setTimeout(() => {
        panicBar.style.display = 'none';
      }, 5000);
    }
    
    if (termTitle) {
      termTitle.innerHTML = 'FREE RAVE TERMINAL';
    }
    
    TerminalEmulator.addLine('');
    TerminalEmulator.addLine('  <span class="t-success">🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉</span>');
    TerminalEmulator.addLine('  <span class="t-success">You successfully mitigated the leak, updated your git history,</span>');
    TerminalEmulator.addLine('  <span class="t-success">and rotated the credentials before the billing went out of control!</span>');
    TerminalEmulator.addLine('  <span class="t-info">Total Damage Stopped at: $' + g.financialLoss.toFixed(2) + '</span>');
    TerminalEmulator.addLine('');
  } else {
    if (panicBar) panicBar.style.display = 'none';
    if (termTitle) termTitle.innerHTML = 'FREE RAVE TERMINAL';
    
    TerminalEmulator.addLine('');
    TerminalEmulator.addLine('  <span class="t-error">💀 GAME OVER: Financial damage limit reached! 💀</span>');
    TerminalEmulator.addLine('  <span class="t-error">Stripe / AWS billed you $' + g.financialLoss.toFixed(2) + '. You are bankrupt!</span>');
    TerminalEmulator.addLine('');
    setTimeout(() => {
      if (window.triggerDestruction) window.triggerDestruction();
    }, 1500);
  }
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  await app.init();
});

export default App;
