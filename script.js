/**
 * script.js — Legacy Helpers (runs AFTER app.js modules via defer)
 *
 * Contains ONLY things that can't go in ES6 modules:
 *   ✅ Cursor glow trail
 *   ✅ BSOD destruction engine (rm easter egg)
 *   ✅ AMA form logic (called by HTML onclick)
 *   ✅ Toast notifications
 *
 * Everything else (particles, scroll, challenges, terminal, timestamp)
 * is now handled by js/app.js + js/modules/*.js
 */

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

/* ══════════════════════════════════════════
   💀 BSOD DESTRUCTION ENGINE
   Called by: window.triggerDestruction() from rm command in app.js
   ══════════════════════════════════════════ */
function triggerDestruction() {
  const body = document.body;

  // 1. Red flash
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed; inset:0; background:rgba(255,0,0,0.15);
    z-index:99998; pointer-events:none;
    animation: redFlash 0.4s ease;
  `;
  body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);

  // 2. BSOD overlay
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
        // System crashed. Please wait...
      </div>
    </div>
  `;
  body.appendChild(bsod);

  // 3. Destroy cards
  const cards = document.querySelectorAll('.tool-card, .ext-card, .platform-card, .challenge-row');
  cards.forEach((card, idx) => {
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.transform = `translateY(${Math.random() > 0.5 ? '-' : ''}${20 + Math.random()*80}px) rotate(${(Math.random()-0.5)*30}deg)`;
      card.style.opacity = '0';
      card.style.filter = 'blur(4px)';
    }, idx * 30);
  });

  // 4. Glitch header
  const h1 = document.querySelector('h1');
  if (h1) { h1.style.animation = 'superGlitch 0.1s infinite'; h1.style.color = '#ff0000'; }

  // 5. Fake progress
  let pct = 0;
  const bar = document.getElementById('bsodBar');
  const pctEl = document.getElementById('bsodPct');
  const msgs = ['Collecting crash data','Deleting your work','rm -rf /hope','Uninstalling sanity','Formatting career drive','Almost done destroying everything','Regretting life choices'];
  const pctInterval = setInterval(() => {
    pct += Math.random() * 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(pctInterval);
      setTimeout(() => {
        if (bsod) bsod.remove();
        showBlankScreen();
      }, 1000);
    }
    if (bar) bar.style.width = pct.toFixed(0) + '%';
    if (pctEl) pctEl.textContent = (msgs[Math.floor((pct/100) * msgs.length)] || msgs[msgs.length-1]) + ': ' + pct.toFixed(0) + '%';
  }, 60);
}

function showBlankScreen() {
  const blank = document.createElement('div');
  blank.id = 'blankScreen';
  blank.style.cssText = `
    position: fixed; inset: 0; background: white; color: black;
    z-index: 99999; padding: 50px; overflow: auto; text-align: left;
    font-family: 'Times New Roman', Times, serif;
  `;
  blank.innerHTML = `
    <h1>Hello World</h1>
    <p>Index of /</p>
    <hr>
    <p>The server has encountered a critical failure. All active resources have been unlinked.</p>
    <p>To reverse this action and restore the system to its last commit, please type the recovery command below and press Enter.</p>
    <div style="margin-top: 20px;">
      <textarea id="recoveryTextArea" rows="4" cols="50" placeholder="Type command here..." style="all: revert; font-family: monospace; font-size: 14px; width: 100%; max-width: 500px; padding: 5px;"></textarea>
      <br><br>
      <button id="recoveryBtn" style="all: revert; cursor: pointer; padding: 5px 15px;">Execute Command</button>
      <p id="recoveryError" style="color: red; font-weight: bold; margin-top: 10px; display: none;">Invalid recovery command!</p>
    </div>
  `;
  document.body.appendChild(blank);

  const ta = document.getElementById('recoveryTextArea');
  const btn = document.getElementById('recoveryBtn');
  const err = document.getElementById('recoveryError');

  ta.focus();

  const handleRecovery = () => {
    const val = ta.value.trim().toLowerCase();
    if (val === 'git reverse') {
      blank.remove();
      runSystemRestoredProgress();
    } else {
      err.style.display = 'block';
      ta.value = '';
      ta.focus();
    }
  };

  btn.addEventListener('click', handleRecovery);
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRecovery();
    }
  });
}

function runSystemRestoredProgress() {
  const restoreScreen = document.createElement('div');
  restoreScreen.id = 'restoreScreen';
  restoreScreen.style.cssText = `
    position: fixed; inset: 0; background: #0c0f12; color: #a2a8b3;
    z-index: 99999; display: flex; align-items: center; justify-content: center;
    font-family: monospace;
  `;
  restoreScreen.innerHTML = `
    <div class="bsod-inner recovery" style="width: 90%; max-width: 600px; text-align: center; font-family: monospace;">
      <div class="bsod-emoji" style="font-size: 50px; margin-bottom: 15px;">🔄</div>
      <div class="bsod-title" style="color:var(--accent2); font-size: 24px; font-weight: bold; margin-bottom: 10px;">RESTORING ENVIRONMENT</div>
      <div class="bsod-code" style="color:var(--accent); font-size: 14px; margin-bottom: 15px;">git restore . — pulling state from last commit</div>
      <div class="bsod-desc" style="font-size: 14px; margin-bottom: 20px;">
        Checking files and resetting visual layout...
      </div>
      <div class="bsod-progress" style="width: 100%; max-width: 400px; margin: 0 auto;">
        <div class="bsod-bar-wrap" style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.2);">
          <div class="bsod-bar" id="restoreBar" style="width: 0%; height: 100%; background: var(--accent2); transition: width 0.1s;"></div>
        </div>
        <div class="bsod-pct" id="restorePct" style="font-size: 14px;">Restoring: 0%</div>
      </div>
    </div>
  `;
  document.body.appendChild(restoreScreen);

  let pct = 0;
  const bar = document.getElementById('restoreBar');
  const pctEl = document.getElementById('restorePct');
  const msgs = [
    'Checking git repository status',
    'Reverting changes in index.html',
    'Restoring particle system core',
    'Re-initializing terminal modules',
    'Rebuilding layout components',
    'Finalizing environment restoration'
  ];

  const pctInterval = setInterval(() => {
    pct += Math.random() * 5 + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(pctInterval);
      
      // Final restore screen layout
      restoreScreen.innerHTML = `
        <div class="bsod-inner recovery" style="width: 90%; max-width: 600px; text-align: center; font-family: monospace;">
          <div class="bsod-emoji" style="font-size: 50px; margin-bottom: 15px;">🔄</div>
          <div class="bsod-title" style="color:var(--accent2); font-size: 24px; font-weight: bold; margin-bottom: 10px;">SYSTEM RESTORED</div>
          <div class="bsod-code" style="color:var(--accent); font-size: 14px; margin-bottom: 15px;">git restore . — successfully reverted all changes</div>
          <div class="bsod-desc" style="font-size: 14px; line-height: 1.6;">
            All <span style="color:var(--accent2)">20+ tools</span> restored.<br>
            Followers? <span style="color:var(--accent2)">back online</span>.<br>
            April challenge? <span style="color:var(--accent2)">still happening</span>.<br>
            Your portfolio? <span style="color:var(--accent2)">indestructible</span>. 😎
          </div>
          <div class="bsod-hint" style="color:var(--accent2); margin-top: 20px; font-size: 12px;">
            // lesson learned: don't rm -rf things you love<br>
            // closing in 4 seconds...
          </div>
        </div>
      `;

      // Restore cards
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
      if (h1) { h1.style.animation = ''; h1.style.color = ''; }

      setTimeout(() => {
        restoreScreen.style.transition = 'opacity 0.5s';
        restoreScreen.style.opacity = '0';
        setTimeout(() => restoreScreen.remove(), 500);
      }, 4000);
    }

    if (bar) bar.style.width = pct.toFixed(0) + '%';
    if (pctEl) pctEl.textContent = (msgs[Math.floor((pct/100) * msgs.length)] || msgs[msgs.length-1]) + ': ' + pct.toFixed(0) + '%';
  }, 60);
}

/* ── AMA LOGIC (called from HTML onclick) ── */
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
  if (!question) { showToast('⚠ Please write your question first!', true); return; }
  const subject = encodeURIComponent(`[AMA · ${topic}] ${question.substring(0,60)}`);
  const body    = encodeURIComponent(`Topic: ${topic}\nFrom: ${anon ? 'Anonymous' : name}\n\nQuestion:\n${question}\n\n-- Sent via dotUniverse AMA`);
  window.location.href = `mailto:kareem209907@gmail.com?subject=${subject}&body=${body}`;
  showToast('✓ Opening your mail client!');
  document.getElementById('amaQuestion').value = '';
}

/* ── TOAST ── */
function showToast(msg, warn = false) {
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toastMsg').textContent = msg;
  t.style.borderLeftColor = warn ? 'var(--coming)' : 'var(--accent2)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// Explicitly attach to window for access from modular code or event listeners
window.setTopic = setTopic;
window.toggleAnon = toggleAnon;
window.populateQ = populateQ;
window.sendAMA = sendAMA;
window.showToast = showToast;
window.triggerDestruction = triggerDestruction;

/* ── EVENT BINDINGS FOR CSP COMPLIANCE ── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Quick Terminal Commands (Event Delegation)
  const quickCmdsContainer = document.querySelector('.quick-cmds');
  if (quickCmdsContainer) {
    quickCmdsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.qcmd');
      if (btn) {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd && typeof window.fillCmd === 'function') {
          window.fillCmd(cmd);
        }
      }
    });
  }

  // 2. Terminal Run Button
  const runBtn = document.querySelector('.term-run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (typeof window.runCommand === 'function') {
        window.runCommand();
      }
    });
  }

  // 3. AMA Topics (Event Delegation)
  const amaTopicsContainer = document.querySelector('.ama-topics');
  if (amaTopicsContainer) {
    amaTopicsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.ama-topic');
      if (btn) {
        const topic = btn.getAttribute('data-topic');
        if (topic && typeof window.setTopic === 'function') {
          window.setTopic(btn, topic);
        }
      }
    });
  }

  // 4. AMA Anonymous Toggle
  const amaAnon = document.getElementById('amaAnon');
  if (amaAnon) {
    amaAnon.addEventListener('change', (e) => {
      if (typeof window.toggleAnon === 'function') {
        window.toggleAnon(e.target);
      }
    });
  }

  // 5. AMA Submit Button
  const btnAma = document.querySelector('.btn-ama');
  if (btnAma) {
    btnAma.addEventListener('click', () => {
      if (typeof window.sendAMA === 'function') {
        window.sendAMA();
      }
    });
  }

  // 6. AMA Example Questions (Event Delegation)
  const qListContainer = document.querySelector('.q-list');
  if (qListContainer) {
    qListContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.q-item');
      if (item) {
        if (typeof window.populateQ === 'function') {
          window.populateQ(item);
        }
      }
    });
  }

  // 7. Mobile Keyboard Helpers
  const mkhUp = document.getElementById('mkhUp');
  if (mkhUp) {
    mkhUp.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.termHistoryUp === 'function') window.termHistoryUp();
    });
  }
  const mkhDown = document.getElementById('mkhDown');
  if (mkhDown) {
    mkhDown.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.termHistoryDown === 'function') window.termHistoryDown();
    });
  }
  const mkhTab = document.getElementById('mkhTab');
  if (mkhTab) {
    mkhTab.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.termTabComplete === 'function') window.termTabComplete();
    });
  }
  const mkhClear = document.getElementById('mkhClear');
  if (mkhClear) {
    mkhClear.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.termClearInput === 'function') window.termClearInput();
    });
  }
});