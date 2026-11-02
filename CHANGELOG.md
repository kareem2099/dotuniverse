# Changelog

All notable changes to the dotUniverse portfolio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **DotMorph** tool card: radial-menu file converter for Linux (440+ conversions, edge dock, global hotkey, file-manager menus), linking to GitHub and its [dotsuite.dev](https://dotsuite.dev/en/product/dotmorph) page.
- `DotMorph` in the terminal's `~/tools` folder, with a `cat DotMorph` info box.
- DotMorph row in the README's CLI Tools table.

### Changed
- Service worker cache bumped to `dotuniverse-v2` so returning visitors get the updated tool list (the worker is cache-first).
- **Social Stats Refresh**: Updated followers across platforms (dev.to: 4,069, LinkedIn: 772, TikTok: 37, YouTube: 30, Medium: 8, Facebook: 15, Instagram: 7, X: 20, Bluesky: 27), which also moves the Growth Challenge bars. X reached its goal of 20.
- **November 2026 Growth Challenge**: New targets across 9 platforms, ending November 30th (dev.to: 4,069 / 4,250, LinkedIn: 772 / 850, TikTok: 37 / 40, YouTube: 30 / 35, Medium: 8 / 10, Facebook: 15 / 20, Instagram: 7 / 10, X: 20 / 25, Bluesky: 27 / 30). Banner, README and footer labels moved from October to November.
- **dev.to Dashboard Metrics**: Post views to 18,097, published posts to 100, reactions to 99, and comments to 71.
- Service worker cache bumped to `dotuniverse-v3` so returning visitors get the new numbers.
- Service worker now serves pages network-first, with the cache as the offline copy, so the daily stat commits reach returning visitors without a cache bump. CSS and JS stay cache-first.

### Fixed
- Live extension stats were blocked by the Content Security Policy: `connect-src` now allows VS Marketplace and Open VSX.
- Live extension totals are only applied and cached when every store responded, so a failed request can't shrink the displayed total.
- Count-up animation no longer drops the `+` from stats like `20+`, and no longer overwrites a live total that arrives while it runs.
- Particle grid crashed app startup on a 0x0 viewport, which left the terminal and service worker uninitialized.
- `nano-editor.js` and `extension-stats.js` added to the service worker's pre-cache list so the app can start offline.
- **Terminal security**: HTML in terminal input is now escaped everywhere it's echoed (unknown commands, `cowsay`, `nano`, `ls`, `git`, `gh`, Tab hints). Names like `constructor` and `__proto__` no longer resolve to JavaScript built-ins in commands, files or `calc`, in both the main and game terminals.
- `sudo apt install` always failed with "are you root?", which blocked `nmap` and made the leak game unwinnable.
- `sudo rm -rf / --no-preserve-root` now runs the destruction scene, and `sudo` no longer blocks every command containing the letters `rm`.
- `calc` showed wrong results for very large or very small values, and rejected numbers like `.5`.
- Tab completion stayed stuck on its first result after the input changed.
- History skipped the newest command after pressing Up, Down, then Up.
- `cd ~/tools` and combined flags like `ls -al` now work.
- `git status` and the static help text no longer swallow `<file>`-style placeholders, and `git log` shows the last commit message.
- `ask` and `collab` no longer claim a message was sent when they only open the mail client.
- Nano now hides the whole input row while open, and the unused nano markup with its duplicate `nanoTextArea` id is gone from `index.html`.

## [1.2.0] - 2026-09-28

### Added
- **Real-Time Extension Synchronizer (`js/modules/extension-stats.js`)**: Fetches live download counts and latest versions directly from VS Code Marketplace and Eclipse Open VSX public APIs using client-side CORS requests.
- **Smart 24-Hour Client-Side Cache**: Implemented `localStorage` caching with a 24-hour TTL (`24 * 60 * 60 * 1000`) for instantaneous page loads with zero layout shift and minimized API consumption.
- **CLI Sync Automation Script (`scripts/sync-extension-stats.mjs`)**: Node.js script to query official extension stores and automatically update static fallback HTML and `README.md` tables and badges.
- **Daily Automated GitHub Action (`.github/workflows/update-extension-stats.yml`)**: Scheduled workflow running daily at midnight UTC (`0 0 * * *`) to fetch store stats and commit changes automatically.
- **Semantic Data Attributes**: Added `data-ext-name` attributes and unique DOM IDs (`#headerExtDownloads`, `#bannerExtDownloads`) for clean DOM access.

### Changed
- **October 2026 Growth Challenge**: Refreshed targets and follower baselines across 9 platforms (dev.to: 3,986 / 4,200, LinkedIn: 709 / 800, TikTok: 37 / 60, YouTube: 30 / 60, Medium: 6 / 10, Facebook: 15 / 20, Instagram: 7 / 10, X: 18 / 20, Bluesky: 21 / 30).
- **dev.to Dashboard Metrics**: Updated live metrics from dev.to dashboard: post views increased to 15,400, published posts to 93, reactions to 97, and comments to 67.
- **Extension Downloads Total**: Calculated and updated total cross-platform extension downloads to 19,500+ (VS Marketplace + Open VSX).
- **Goal Record Badge State**: Commented out the `15-DAY RECORD` badge on dev.to until the 4,200 October goal is reached.
- **Seasonal Theme & Labels**: Updated banner indicators and footer timestamps from July 2026 to October 2026.

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
| 1.2.0 | 2026-09-28 | October 2026 Growth Challenge update, live dev.to metrics sync, automated VS Code extension stats & version synchronizer with 24-hour cache and GitHub Actions. |
| 1.1.0 | 2026-07-17 | Modular architecture refactor, Spatial Grid particle optimization, calc XSS fix, interactive 'game' command, and 'git reverse' raw HTML recovery failsafe. |
| 1.0.0 | 2026-03-30 | Initial release with full tool ecosystem, interactive terminal, and all features |