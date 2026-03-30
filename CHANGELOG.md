# Changelog

All notable changes to the dotUniverse portfolio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
| 1.0.0 | 2026-03-30 | Initial release with full tool ecosystem, interactive terminal, and all features |