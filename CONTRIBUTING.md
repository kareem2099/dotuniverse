# Contributing to dotUniverse

Thank you for your interest in contributing to the dotUniverse portfolio! This document provides guidelines and information for contributors.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Community](#community)

---

## Code of Conduct

By participating in this project, you agree to uphold the following standards:

- **Be respectful** — Treat everyone with respect. Disagreements are fine, but disrespect is not.
- **Be constructive** — Provide helpful feedback, not just criticism.
- **Be inclusive** — Welcome contributors of all backgrounds and experience levels.
- **Be patient** — Maintainers are volunteers. Responses may take time.
- **Be professional** — Keep discussions focused on the project.

---

## How to Contribute

There are several ways to contribute to dotUniverse:

### 1. Report Bugs

If you find a bug, please [open an issue](https://github.com/kareem2099/dotuniverse/issues) with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### 2. Suggest Features

Have an idea? [Open a feature request](https://github.com/kareem2099/dotuniverse/issues) with:

- A clear description of the feature
- Why it would be useful
- Any mockups or examples

### 3. Improve Documentation

Documentation improvements are always welcome:

- Fix typos or grammar
- Add missing information
- Improve clarity of existing docs
- Translate documentation

### 4. Submit Code

Ready to code? Follow the [Development Setup](#development-setup) and [Submitting Changes](#submitting-changes) guidelines.

---

## Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Git installed on your machine
- A text editor or IDE (VS Code recommended)
- Python 3 (optional, for local server)

### Getting Started

1. **Fork the repository**

Click the "Fork" button on the [GitHub repository page](https://github.com/kareem2099/dotuniverse).

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/dotuniverse.git
cd dotuniverse
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/kareem2099/dotuniverse.git
```

4. **Start a local server**

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve .

# Option 3: Just open index.html
open index.html
```

5. **Visit** `http://localhost:8000` in your browser.

6. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

---

## Project Structure

```
celebrate_march/
├── index.html          # Main HTML — structure and content
├── styles.css          # All CSS — styles and animations
├── script.js           # All JS — terminal, particles, interactions
├── assets/
│   └── videos/
│       └── The_Final_Boss_(Port_666).mp4 # Easter egg video asset
├── README.md           # Project documentation
├── CHANGELOG.md        # Version history and changes
├── CONTRIBUTING.md     # This file
└── LICENSE             # MIT License
```

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure, tool cards, sections, terminal markup |
| `styles.css` | CSS variables, layout, animations, responsive design |
| `script.js` | Terminal logic, particle system, AMA form, Easter eggs |

---

## Coding Standards

### HTML

- Use semantic HTML5 elements (`<header>`, `<section>`, `<footer>`)
- Keep markup clean and properly indented (2 spaces)
- Use descriptive class names following BEM-like conventions
- Include `alt` attributes on images
- Ensure accessibility with proper ARIA labels where needed

### CSS

- Use CSS Custom Properties (variables) defined in `:root`
- Follow the existing naming conventions
- Group related properties together
- Use shorthand properties where appropriate
- Mobile-first responsive design (add media queries as needed)
- Prefer CSS animations over JavaScript when possible

Example:

```css
.element {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 16px;
  transition: border-color 0.2s, transform 0.2s;
}

.element:hover {
  border-color: rgba(0, 229, 255, 0.3);
  transform: translateY(-2px);
}
```

### JavaScript

- Use ES6+ syntax (const/let, arrow functions, template literals)
- Keep functions small and focused
- Use descriptive variable and function names
- Comment complex logic
- Avoid global variables — use IIFEs or modules where appropriate
- Handle edge cases and errors gracefully

Example:

```javascript
function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString();
}
```

### General

- No build tools required — keep it vanilla
- No external dependencies
- Maintain browser compatibility (modern evergreen browsers)
- Test in multiple browsers before submitting
- Keep file sizes reasonable

---

## Submitting Changes

### Workflow

1. **Sync with upstream**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Make your changes**

Edit the relevant files following the coding standards.

3. **Test your changes**

- Open the page in multiple browsers
- Test the interactive terminal
- Check responsive layouts
- Verify animations work correctly
- Test any Easter eggs you modified

4. **Commit your changes**

```bash
git add .
git commit -m "feat: add description of your change"
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

**Examples:**

```
feat(terminal): add new command for file search
fix(css): resolve animation glitch on mobile
docs(readme): update installation instructions
style(html): improve indentation consistency
refactor(js): extract terminal commands into separate object
```

5. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template with:
  - Description of changes
  - Related issue numbers
  - Screenshots (if UI changes)
  - Testing notes

### Pull Request Guidelines

- Keep PRs focused on a single change
- Update documentation if needed
- Update CHANGELOG.md for notable changes
- Ensure no console errors
- Be responsive to review feedback

---

## Reporting Issues

When reporting issues, please include:

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Ubuntu 22.04]
- Screen size: [e.g., 1920x1080]

**Additional context**
Any other relevant information.
```

---

## Feature Requests

When requesting features, please include:

- **Description** — What feature do you want?
- **Use case** — Why would this be useful?
- **Examples** — Any examples or mockups?
- **Priority** — How important is this to you?

---

## Areas for Contribution

Here are some areas where contributions are especially welcome:

### Easy (Good First Issues)

- Fix typos in documentation
- Improve accessibility
- Add missing `alt` attributes
- Improve responsive design on edge cases

### Medium

- Add new terminal commands
- Improve animation performance
- Add more Easter eggs
- Enhance the AMA section

### Advanced

- Add unit tests
- Implement dark/light theme toggle
- Add internationalization (i18n)
- Create a build pipeline
- Add service worker for offline support

---

## Terminal Command Contributions

When adding new terminal commands:

1. Add the command function to the `COMMANDS` object in `script.js`
2. Add the command to the `help()` output
3. Add tab completion support in `COMMAND_ARGS` if needed
4. Update README.md documentation
5. Add to CHANGELOG.md

Example:

```javascript
COMMANDS.mycommand(raw) {
  const arg = raw.replace(/^mycommand\s*/i, '').trim();
  if (!arg) {
    addLine('  <span class="t-error">Usage: mycommand <arg></span>');
    addLine('');
    return;
  }
  addLine(`  <span class="t-success">Result: ${escHtml(arg)}</span>`);
  addLine('');
},
```

---

## CSS Animation Contributions

When adding new animations:

1. Define the animation in `styles.css` using `@keyframes`
2. Use CSS Custom Properties for colors and timing
3. Ensure smooth performance (prefer `transform` and `opacity`)
4. Add appropriate `prefers-reduced-motion` support
5. Test on mobile devices

Example:

```css
@keyframes myAnimation {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.my-element {
  animation: myAnimation 0.4s ease both;
}

@media (prefers-reduced-motion: reduce) {
  .my-element {
    animation: none;
  }
}
```

---

## Community

### Get in Touch

- **Email:** [kareem209907@gmail.com](mailto:kareem209907@gmail.com)
- **GitHub:** [@kareem2099](https://github.com/kareem2099)
- **dev.to:** [@freerave](https://dev.to/freerave)

### Show Your Support

If you find this project useful:

- Star the repository on GitHub
- Share it with your network
- Write about your experience
- Contribute back to the project

---

## License

By contributing to dotUniverse, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

<div align="center">

**Thank you for contributing to dotUniverse!**

Every contribution, no matter how small, makes a difference.

</div>