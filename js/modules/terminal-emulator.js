/**
 * Terminal Emulator - Full terminal with commands
 * Extracted terminal-emulator.js from script.js
 */
export const TerminalEmulator = {
  // Will be populated with all COMMANDS from script.js
  COMMANDS: {},
  COMMAND_ARGS: {},
  
  state: {
    output: null,
    inputEl: null,
    history: [],
    histIdx: -1,
    currentPath: '~',
    installedPackages: new Set(),
    tabMatches: [],
    tabIdx: -1,
    lastTabInput: '',
    promptHook: null,
  },

  fileSystem: {
    '~': ['tools/', 'platforms/', 'challenges/', 'README.md', 'brain.exe', '.env', 'todo.md'],
    '~/tools': ['DotGhostBoard', 'dotcommand', 'CodeTune', 'DotShare', 'DotFetch', 'DotReadme'],
    '~/platforms': ['dev.to', 'linkedin', 'github', 'tiktok'],
    '~/challenges': ['april-2026.log']
  },

  fileData: {
    'README.md': "# FreeRave Portfolio v1.0.0\n\nWelcome to the dotUniverse.\nType 'help' to see what you can do here.\n\n[Author]: Kareem (FreeRave)\n[Tools]: 20+ open source projects\n[License]: MIT",
    'todo.md': "[✓] Reach 2.5k followers (Record: 15 days!)\n[✓] Build dotUniverse Ecosystem\n[✓] Finish military service (Done!)\n[ ] World Domination\n[ ] Drink more coffee ☕",
    'brain.exe': "Error: Binary file cannot be edited.\nReason: Human consciousness not yet fully digitized.\nTry: 'neofetch' for system specs.",
    '.env': "PORT=3000\nDB_URL=mongodb://localhost:27017/top_secret\nSECRET_KEY=I_LOVE_TERMINALS_123\nAPI_KEY=FreeRave_is_the_best"
  },

  init(outputId, inputId) {
    this.state.output = document.getElementById(outputId);
    this.state.inputEl = document.getElementById(inputId);
    
    if(!this.state.output || !this.state.inputEl) {
      console.error('Terminal: Missing output or input elements');
      return;
    }

    this.setupEventListeners();
    this.addLine('<span class="t-info">// type help to start</span>');
    this.addLine('');
  },

  addLine(html, cls = '') {
    const s = document.createElement('span');
    s.className = 't-line ' + cls;
    s.innerHTML = html;
    this.state.output.appendChild(s);
    this.state.output.scrollTop = this.state.output.scrollHeight;
  },

  escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  setupEventListeners() {
    this.state.inputEl.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') {
        this.executeCommand();
      } else if(e.key === 'ArrowUp') {
        e.preventDefault();
        this.historyUp();
      } else if(e.key === 'ArrowDown') {
        e.preventDefault();
        this.historyDown();
      } else if(e.key === 'Tab') {
        e.preventDefault();
        this.tabComplete();
      }
    });
  },

  async executeCommand() {
    const cmd = this.state.inputEl.value.trim();
    this.state.inputEl.value = '';

    if(!cmd) return;

    this.addPromptLine(cmd);
    this.state.history.push(cmd);
    this.state.histIdx = this.state.history.length;

    if(this.state.promptHook) {
      await this.state.promptHook(cmd);
      return;
    }

    const parts = cmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = cmd.slice(command.length).trim();

    if(this.COMMANDS[command]) {
      await this.COMMANDS[command].call(this, args);
    } else {
      this.addLine(`  <span class="t-error">Error: ${command}: command not found</span>`);
      this.addLine('');
    }
  },

  addPromptLine(cmd) {
    this.addLine(`<span class="t-prompt">FreeRave@kali:${this.state.currentPath}$</span> <span class="t-cmd">${this.escHtml(cmd)}</span>`);
  },

  historyUp() {
    if(this.state.histIdx > 0) {
      this.state.histIdx--;
      this.state.inputEl.value = this.state.history[this.state.histIdx];
    }
  },

  historyDown() {
    if(this.state.histIdx < this.state.history.length - 1) {
      this.state.histIdx++;
      this.state.inputEl.value = this.state.history[this.state.histIdx];
    } else {
      this.state.inputEl.value = '';
    }
  },

  tabComplete() {
    const input = this.state.inputEl.value;
    const lastPart = input.endsWith(' ') ? '' : input.split(/\s+/).pop();
    const parts = input.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';
    const isCommand = !input.includes(' ') && !input.endsWith(' ');

    if(this.state.tabIdx === -1 || !input.startsWith(this.state.lastTabInput)) {
      this.state.lastTabInput = input.substring(0, input.length - lastPart.length);

      let pool = [];
      let searchPrefix = lastPart;
      let pathPrefix = '';

      if(isCommand || command === '') {
        pool = Object.keys(this.COMMANDS).map(c => c + ' ');
      } else if(command === 'sudo') {
        pool = Object.keys(this.COMMANDS).map(c => c + ' ');
      } else if(['cd', 'ls', 'cat', 'nano', 'rm'].includes(command)) {
        let targetDir = this.state.currentPath;

        if(lastPart.includes('/')) {
          const slashIdx = lastPart.lastIndexOf('/');
          const dirPath = lastPart.substring(0, slashIdx);
          searchPrefix = lastPart.substring(slashIdx + 1);
          pathPrefix = lastPart.substring(0, slashIdx + 1);

          if(dirPath.startsWith('~/') || dirPath === '~') {
            targetDir = dirPath;
          } else if(dirPath !== '') {
            targetDir = this.state.currentPath === '~' ? `~/${dirPath}` : `${this.state.currentPath}/${dirPath}`;
          }
        }

        if(this.fileSystem[targetDir]) {
          pool = this.fileSystem[targetDir].filter(item => {
            const cleanName = item.replace(/\/$/, '');
            const isDir = item.endsWith('/') || this.fileSystem[`${targetDir}/${cleanName}`];
            if(command === 'cd') return isDir;
            if(['cat', 'nano'].includes(command)) return !isDir;
            return true;
          }).map(item => {
            const cleanName = item.replace(/\/$/, '');
            const isDir = item.endsWith('/') || this.fileSystem[`${targetDir}/${cleanName}`];
            return pathPrefix + (isDir ? cleanName + '/' : cleanName + ' ');
          });
        }
      } else if(this.COMMAND_ARGS[command]) {
        pool = this.COMMAND_ARGS[command].map(a => a + ' ');
      } else {
        return;
      }

      this.state.tabMatches = pool.filter(item =>
        item.toLowerCase().startsWith((pathPrefix + searchPrefix).toLowerCase())
      );
      this.state.tabIdx = 0;
    } else {
      this.state.tabIdx = (this.state.tabIdx + 1) % this.state.tabMatches.length;
    }

    if(this.state.tabMatches.length > 0) {
      const match = this.state.tabMatches[this.state.tabIdx];
      this.state.inputEl.value = this.state.lastTabInput + match;

      // Clear old hints
      document.querySelectorAll('.t-line.tab-hint').forEach(el => el.remove());

      // Show multi-match hints
      if(this.state.tabMatches.length > 1) {
        const hints = this.state.tabMatches.map((m, i) => {
          const clean = m.trim().replace(/\/$/, '');
          const display = clean.startsWith(lastPart) ? clean.substring(lastPart.length) : clean;
          return i === this.state.tabIdx
            ? `<span class="t-accent2" style="text-decoration:underline">${clean || m}</span>`
            : `<span>${clean || m}</span>`;
        }).join('  ');
        this.addLine(`  <span class="t-dim">suggestions:</span> ${hints}`, 'tab-hint');
      }
    }
  }
};
