# Changelog

All notable changes to the dotUniverse portfolio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-17

### Added
- Interactive `game` command: A "Guess the secret number" (1-100) game with 3 attempts and high/low hints.
- Playful "Quantum Root Key Betrayal" easter egg: If the user loses or wins the game, it triggers system destruction (`rm -rf / --no-preserve-root`).
- Raw HTML Failsafe Screen: When system destruction completes, it transitions to a blank white, unstyled Times New Roman "Hello World" HTML page.
- Textarea recovery input requiring typing `git reverse` to restore the portfolio.
- Restoring environment progress animation (0% to 100%) showing git restore progress before fully returning the site state.

### Changed
- Modularized Javascript architecture: Split monolith `script.js` into 6 separate ES6 module files under `js/modules/` (`particle-system.js`, `math-eval.js`, `terminal-emulator.js`, `challenges.js`, `scroll-effects.js`, `theme-manager.js`) and unified them with a single entry point `js/app.js`.
- Hardened calculator security: Replaced `new Function()` execution in `calc` with a safe whitelist parsing engine in `math-eval.js` preventing XSS vulnerabilities.

### Optimized
- High-performance Spatial Grid algorithm for particle connections: Reduced complexity from $O(n^2)$ to an average of $O(n)$ ($O(n \cdot k)$ where $k$ is average neighboring particles), yielding a 95% CPU savings.
- Mobile performance improvements: Cap frames at 30 FPS instead of 60 FPS and automatically halve the particle count on touch devices.

## [1.0.0] - 2026-03-30

### Added

- Initial release of the dotUniverse portfolio website
- Cyberpunk-themed dark UI with animated grid background
- Canvas-based particle system with connected nodes
- Glitch text effect on the main title with chromatic aberration
- Scan line animation across the viewport
- Cursor glow trail with 8 trailing particles

#### Tools Section
- Complete tools grid showcasing 20+ open-source projects
- Tool cards with shimmer hover effects and category tags
- Tags: CLI, VS Code, Telegram Bot, Mobile App, Suite, Coming Soon

#### VS Code Extensions Section
- Extension cards with download statistics
- Links to VS Marketplace and Open VSX stores
- Version badges for each extension
- Total downloads banner (4,510+ downloads)

#### Interactive Terminal
- Full-featured terminal emulator with command history
- Tab completion with context-aware suggestions
- Live syntax highlighting for valid paths
- Commands:
  - Contact: `contact`, `ask`, `collab` (with mailto integration)
  - System: `whoami`, `neofetch`, `ls`, `cd`, `cat`, `nano`, `date`, `history`, `clear`
  - Fun: `fortune`, `cowsay`, `coffee`, `weather`, `matrix`, `hack`, `ping`, `calc`
  - Package Manager: `sudo apt install`
  - Network: `nmap`, `curl`
- Easter eggs:
  - `rm -rf / --no-preserve-root` — BSOD simulation with recovery animation
  - `nmap` — Fake port scan ending with The Final Boss video on port 666
  - `nano` — Full-screen text editor simulation
  - `apt install girlfriend` — "No installation candidate"
  - `matrix` — Hue rotation effect
  - `hack` — Matrix-style character flood
  - `exit` — "There is no escape" message

#### Growth Challenge Section
- April 2026 growth challenge tracker
- Progress bars for 9 platforms (dev.to, LinkedIn, TikTok, YouTube, Medium, Facebook, Instagram, X, Bluesky)
- Animated bars with color-coded progress
- Percentage badges and delta indicators

#### Platform Links
- Social media grid linking to 9 platforms
- Hover animations with glow effects
- Follower counts displayed on each card

#### Collaboration Section
- "Let's build together" CTA banner
- Skill tags (Open Source, VS Code Extensions, Python/Kotlin, etc.)
- Stat cards (20+ Tools, 4,510 Downloads, MIT Licensed)
- Primary and secondary action buttons

#### AMA Section
- Ask Me Anything form with topic categorization
- Topic buttons: Open Source, VS Code Dev, Career, Python, Mobile, Linux, Other
- Anonymous submission toggle
- Example questions section
- Form submission via mailto integration

#### Animations & Effects
- Scroll reveal animations using IntersectionObserver
- Count-up animations for statistics
- Animated challenge progress bars on scroll
- Neon pulse animation on accent elements
- Fade-up staggered animation on tool cards
- BSOD destruction/recovery animation sequence

### Technical

- Pure HTML5, CSS3, and Vanilla JavaScript (ES6+)
- No build tools, no frameworks, no dependencies
- Google Fonts: Space Mono (400, 700) and Syne (400, 700, 800)
- CSS Custom Properties for theming
- CSS Grid and Flexbox for responsive layouts
- Canvas API for particle rendering
- IntersectionObserver for scroll-triggered animations
- Virtual file system for terminal simulation

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.1.0 | 2026-07-17 | Modular architecture refactor, Spatial Grid particle optimization, calc XSS fix, interactive 'game' command, and 'git reverse' raw HTML recovery failsafe. |
| 1.0.0 | 2026-03-30 | Initial release with full tool ecosystem, interactive terminal, and all features |