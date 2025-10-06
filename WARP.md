# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- A minimal, static two-page site for a birthday:
  - index.html: countdown to October 13. When it reaches 0, shows “HAPPY BIRTHDAY” and a Next button.
  - message.html: a heartfelt message rendered with a typewriter effect.
- A shared background layer displays animated bubbles; if assets/bubbles.mp4 is present, a dimmed, looped video plays behind them.

Common commands
- Serve locally (PowerShell + Python)
  ```powershell path=null start=null
  python -m http.server 8000
  # then open: http://localhost:8000/
  ```
- Serve locally (Node, if installed)
  ```powershell path=null start=null
  npx serve -p 8000
  ```
- Notes
  - There is no build, lint, or test pipeline configured in this repo.

High-level architecture
- Pages
  - index.html: Declares the background layers (video, bubbles) and a main container with the countdown UI and a “finished” section revealed at zero.
  - message.html: Shares the same background; renders the message inside a <pre> with a typewriter effect and replay/back controls.
- Styling (css/styles.css)
  - Global theme variables and a dark radial background.
  - .video-bg: fixed, full-viewport background with object-fit: cover and a subtle filter for contrast.
  - .bubbles: fixed overlay generating floating bubble spans; animation can be disabled via prefers-reduced-motion.
  - .container/.title: centered layout; typography uses clamp() for fluid sizing.
  - Countdown grid: responsive grid with breakpoints (4 columns → 2 columns → 1 column) and fluid number sizes.
- Scripts
  - js/common.js: On DOMContentLoaded, creates N bubbles with randomized size, duration, and drift; purely visual.
  - js/countdown.js: Computes the next Oct 13 (midnight) and updates the countdown once per second. When time ≤ 0, hides the countdown and shows the “finished” section.
  - js/message.js: Plays the message via a simple typewriter loop with slight random delay jitter; includes a Replay button handler.
- Assets
  - assets/bubbles.mp4 is optional. If present, <video id="bg-video" autoplay muted loop playsinline> provides a dynamic backdrop.

Key implementation notes
- Accessibility: countdown container uses aria-live="polite" and aria-atomic="true"; the message container also uses aria-live; decorative bubbles are aria-hidden.
- Responsiveness: CSS uses clamp() for scalable text, responsive grid breakpoints for the countdown, and dvh-based layout for tall mobile viewports.
- Reduced motion: prefers-reduced-motion disables bubble animations and keeps the experience readable.
