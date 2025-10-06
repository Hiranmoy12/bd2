# Tanisha Birthday Site

A simple two-page site for a special birthday:
- Page 1: Countdown to October 13. When it hits 0, shows “HAPPY BIRTHDAY” and a “Click Next” button.
- Page 2: A heartfelt message rendered in a robotic/monospace typewriter style.

Background
- Both pages share a flowing bubbles background effect. If you add a background video at assets/bubbles.mp4, it will play behind the bubbles; otherwise the animated bubbles run on their own.

How to run locally
- You can open index.html directly in a browser. For best results (and to avoid any browser file restrictions), serve the folder via a simple HTTP server.
  - PowerShell (Python):
    python -m http.server 8000
    # then open: http://localhost:8000/
  - Node (if installed):
    npx serve -p 8000

Add your background video (optional)
- Place your video at: assets/bubbles.mp4
- Recommended: a subtle, looping, abstract “bubble flow” or underwater particles style. Keep it short and optimized for web.

Project structure
- index.html           # Countdown page
- message.html         # Message page
- css/styles.css       # Shared styles and background effects
- js/countdown.js      # Countdown logic
- js/message.js        # Typewriter effect for the message
- js/common.js         # Shared bubble generation logic
- assets/bubbles.mp4   # (Optional) your background video
