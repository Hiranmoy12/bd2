// Shared background bubbles effect
(function () {
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeBubbles(container, count) {
    const palette = [
      [255, 123, 213], // pink
      [123, 216, 255], // cyan
      [170, 128, 255], // purple
      [255, 205, 105], // gold
      [132, 255, 180], // mint
      [255, 132, 132], // coral
    ];

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      const size = rand(6, 24);
      const left = rand(0, 100);
      const dur = rand(12, 28);
      const drift = rand(-40, 40);

      // Pick a random color from the palette
      const [r, g, b] = palette[Math.floor(rand(0, palette.length))];
      const c1 = `rgba(${r}, ${g}, ${b}, 0.35)`; // core color
      const c2 = `rgba(${r}, ${g}, ${b}, 0.08)`; // outer fade
      const glow = `rgba(${r}, ${g}, ${b}, 0.25)`; // outer glow
      const inner = `rgba(255, 255, 255, 0.15)`; // subtle inner highlight

      span.style.setProperty('--size', `${size}px`);
      span.style.left = `${left}%`;
      span.style.setProperty('--dur', `${dur}s`);
      span.style.setProperty('--drift', `${drift}vw`);
      span.style.animationDelay = `${rand(0, 12)}s`;
      span.style.setProperty('--c1', c1);
      span.style.setProperty('--c2', c2);
      span.style.setProperty('--glow', glow);
      span.style.setProperty('--inner', inner);

      container.appendChild(span);
    }
  }

  const BG_KEY = 'bg_audio_state_v1';

  function initBackgroundMusic() {
    // Reuse if already created on this page
    if (!window.__bgAudio) {
      // Create a DOM audio element with autoplay hints for better mobile behavior
      const audio = document.createElement('audio');
      audio.src = 'assets/khuda_jaane.m4a';
      audio.loop = true;
      audio.volume = 0.3;
      audio.autoplay = true; // hint only; may still be blocked
      audio.preload = 'auto';
      audio.setAttribute('playsinline', ''); // iOS-friendly
      audio.style.display = 'none';
      document.body.appendChild(audio);
      window.__bgAudio = audio;
    }

    const audio = window.__bgAudio;

    // Restore previous playback state (per tab) from sessionStorage
    let restored = null;
    try { restored = JSON.parse(sessionStorage.getItem(BG_KEY) || 'null'); } catch (e) {}

    const applyRestore = () => {
      if (!restored) return;
      if (typeof restored.muted === 'boolean') audio.muted = restored.muted;
      if (typeof restored.volume === 'number') audio.volume = restored.volume;
      if (typeof restored.time === 'number' && isFinite(restored.time)) {
        const seekTo = Math.max(0, Math.min(restored.time, (audio.duration || Infinity) - 0.5));
        if (isFinite(seekTo)) audio.currentTime = seekTo;
      }
    };

    if (audio.readyState >= 1) {
      applyRestore();
    } else {
      audio.addEventListener('loadedmetadata', applyRestore, { once: true });
    }

    // Persist playback state across pages (throttled)
    let __lastSave = 0;
    const save = (force = false) => {
      const now = Date.now();
      if (!force && now - __lastSave < 1000) return;
      __lastSave = now;
      try {
        sessionStorage.setItem(BG_KEY, JSON.stringify({
          time: audio.currentTime || 0,
          paused: audio.paused,
          muted: audio.muted,
          volume: audio.volume,
        }));
      } catch (e) {}
    };

    audio.addEventListener('timeupdate', () => save(false));
    audio.addEventListener('seeked', () => save(true));
    audio.addEventListener('play', () => save(true));
    audio.addEventListener('pause', () => save(true));
    audio.addEventListener('volumechange', () => save(true));
    window.addEventListener('beforeunload', () => save(true));

    // Try autoplay with a resilient strategy across devices
    const addUnlockers = () => {
      const unlock = () => {
        if (audio.muted) audio.muted = false; // unmute on first interaction
        if (audio.paused) audio.play().catch(() => {});
        remove();
      };
      const events = ['pointerdown','pointerup','click','touchstart','touchend','keydown','wheel','scroll'];
      const remove = () => { events.forEach(ev => document.removeEventListener(ev, unlock)); document.removeEventListener('visibilitychange', onVis); };
      const onVis = () => { if (document.visibilityState === 'visible') { audio.play().catch(() => {}); } };
      events.forEach(ev => document.addEventListener(ev, unlock, { once: true, passive: true }));
      document.addEventListener('visibilitychange', onVis);
    };

    const tryPlay = () => {
      // Attempt unmuted first
      audio.muted = false;
      audio.play().then(() => {
        // success
      }).catch(() => {
        // Fallback: try muted autoplay (commonly permitted), then unmute on interaction
        audio.muted = true;
        audio.play().then(() => {
          addUnlockers();
        }).catch(() => {
          // If even muted autoplay is blocked, wait for user input to start
          addUnlockers();
        });
      });
    };

    // Only attempt autoplay if there is no prior state or if it was previously playing
    if (!restored || restored.paused === false) {
      tryPlay();
    }

    // Wire up music controls if present on this page
    const musicToggle = document.getElementById('music-toggle');
    const volumeToggle = document.getElementById('volume-toggle');

    if (musicToggle) {
      const updatePlayIcon = () => {
        musicToggle.textContent = audio.paused ? '▶️' : '⏸️';
      };
      musicToggle.addEventListener('click', () => {
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
      });
      audio.addEventListener('play', updatePlayIcon);
      audio.addEventListener('pause', updatePlayIcon);
      // Initial state
      musicToggle.textContent = audio.paused ? '▶️' : '⏸️';
    }

    if (volumeToggle) {
      volumeToggle.addEventListener('click', () => {
        audio.muted = !audio.muted;
        volumeToggle.textContent = audio.muted ? '🔇' : '🔊';
      });
      // Initial state
      volumeToggle.textContent = audio.muted ? '🔇' : '🔊';
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('bubbles');
    if (el) makeBubbles(el, 50);

    // Initialize background music on every page load
    initBackgroundMusic();
  });
})();
