// Inject attractive animated background overlay at runtime without touching existing code
(function () {
  const STYLE_ID = 'attractive-bg-style';
  const LAYER_ID = 'attractive-bg-overlay';

  function inject() {
    if (document.getElementById(LAYER_ID)) return; // already present

    // Style block
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        /* Animated gradient + bokeh overlay */
        #${LAYER_ID} {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3; /* over background and bubbles; pointer-events none keeps content interactive */
          overflow: hidden;
          mix-blend-mode: screen;
        }
        #${LAYER_ID} .gradient {
          position: absolute; inset: 0;
          background: conic-gradient(
            from 0deg at 50% 50%,
            rgba(255,123,213,0.12),
            rgba(123,216,255,0.12),
            rgba(170,128,255,0.12),
            rgba(255,205,105,0.12),
            rgba(132,255,180,0.12),
            rgba(255,132,132,0.12),
            rgba(255,123,213,0.12)
          );
          filter: blur(24px) saturate(1.2);
          animation: attractive-bg-hue 20s linear infinite;
        }
        @keyframes attractive-bg-hue { to { transform: rotate(360deg); } }

        #${LAYER_ID} .bokeh {
          position: absolute; inset: -10vmax;
          background:
            radial-gradient(12vmax 12vmax at 20% 30%, rgba(255,123,213,0.08), transparent 60%),
            radial-gradient(14vmax 14vmax at 80% 20%, rgba(123,216,255,0.08), transparent 60%),
            radial-gradient(10vmax 10vmax at 70% 80%, rgba(170,128,255,0.08), transparent 60%),
            radial-gradient(16vmax 16vmax at 15% 75%, rgba(255,205,105,0.08), transparent 60%);
          filter: blur(8px);
          animation: attractive-bg-drift 22s ease-in-out infinite alternate;
        }
        @keyframes attractive-bg-drift {
          from { transform: translate3d(-2vmax, -2vmax, 0) scale(1); }
          to   { transform: translate3d(2vmax, 2vmax, 0) scale(1.05); }
        }

        /* Subtle color boost to your background video without altering existing CSS file */
        .video-bg video {
          filter: brightness(0.45) saturate(1.35) contrast(1.1) hue-rotate(8deg);
        }
      `;
      document.head.appendChild(style);
    }

    // Layer
    const layer = document.createElement('div');
    layer.id = LAYER_ID;
    layer.innerHTML = '<div class="gradient"></div><div class="bokeh"></div>';
    document.body.appendChild(layer);
  }

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  onReady(inject);
})();
