export class NanoEditor {
  constructor(terminalInstance) {
    this.T = terminalInstance;
    this.isOpen = false;
  }

  open(fileName, initialContent, onSaveCallback) {
    if (this.isOpen) return;
    this.isOpen = true;

    // Temporarily hide normal terminal input line
    const inputLine = this.T.state.inputEl.closest('.input-line') || this.T.state.inputEl;
    if (inputLine) inputLine.style.display = 'none';

    // Create the full nano editor container
    const container = document.createElement('div');
    container.id = 'nanoEditorContainer';
    container.className = 'nano-editor-container';
    container.style.cssText = `
      background: #000;
      color: #fff;
      font-family: 'Space Mono', monospace;
      padding: 10px;
      border: 1px solid #1a2d45;
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.1);
    `;

    container.innerHTML = `
      <div style="background: #c8d8e8; color: #060a0f; padding: 2px 10px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between;">
        <span>UW-Nano 5.4</span>
        <span>File: ${fileName}</span>
        <span>Modified</span>
      </div>
      <textarea id="nanoTextArea" style="all: revert; width: 100%; height: 180px; background: transparent; color: #39ff14; border: none; font-family: 'Space Mono', monospace; font-size: 14px; outline: none; resize: none; margin-top: 10px; line-height: 1.5; padding: 5px; box-sizing: border-box;"></textarea>
      <div style="background: #0d1520; color: #4a6070; padding: 5px 10px; font-size: 11px; margin-top: 10px; border-top: 1px solid #1a2d45; display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
        <div><span style="color: #00e5ff; font-weight: bold;">^G</span> Get Help</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^O</span> Write Out</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^W</span> Where Is</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^K</span> Cut Text</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^X</span> Exit</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^R</span> Read File</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^\</span> Replace</div>
        <div><span style="color: #00e5ff; font-weight: bold;">^U</span> Paste Text</div>
      </div>
    `;

    this.T.state.output.appendChild(container);
    this.T.state.output.scrollTop = this.T.state.output.scrollHeight;
    
    const textarea = document.getElementById('nanoTextArea');
    textarea.value = initialContent;
    textarea.focus();

    // Keydown listener for saving and exiting
    const handleKeydown = (e) => {
      // Ctrl + O: Write Out (Save)
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        if (onSaveCallback) {
          onSaveCallback(textarea.value);
        }
        this.T.addLine(`  <span class="t-success">[✔] Wrote ${textarea.value.split('\n').length} lines to ${fileName}</span>`);
      }

      // Ctrl + X: Exit
      if (e.ctrlKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        container.remove();
        if (inputLine) inputLine.style.display = 'flex';
        this.T.state.inputEl.focus();
        this.isOpen = false;
        
        // Scroll terminal to bottom
        this.T.state.output.scrollTop = this.T.state.output.scrollHeight;
      }
    };

    textarea.addEventListener('keydown', handleKeydown);
  }
}
