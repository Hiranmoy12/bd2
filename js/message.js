// Typewriter effect for the robotic-style message
(function () {
  const text = `Hey , babygirl 🤗.. HAPPY BIRTHDAY TO YOU 🥰..  Today is your birthday and I wish you will enjoy your great day with your family and friends..
This year was my especial year of my life .... We met this year , came closer and then into lovers... 
I wish we could be together like this the follwoing year too..
Time flies away fast I know , I won't..🥺
Your trust and loyalty is all I need in my life..🙂
I dont know what wil come in future but I can be sure if we stay like this in present future will always be beautiful for us..
We argue , fix problems and be together 💑... IF anythings comes into your mind please talk with be of any problems...

That's all I need to say HAPPY BIRTHDAY TANISHA ... STAY SAFE AND BE HAPPY!!😉`;

  let currentTypewriterTimeout = null;
  
  function typewriter(el, str, speed = 28) {
    // Clear any existing typewriter animation
    if (currentTypewriterTimeout) {
      clearTimeout(currentTypewriterTimeout);
    }
    
    let i = 0;
    el.textContent = '';
    
    function step() {
      if (i < str.length) {
        el.textContent += str.charAt(i);
        i++;
        const jitter = Math.random() * 30; // robotic irregularity
        currentTypewriterTimeout = setTimeout(step, speed + jitter);
      } else {
        currentTypewriterTimeout = null;
      }
    }
    step();
  }

  window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('message');
    if (!el) return;

    // Start the typewriter for the message
    typewriter(el, text, 24);

    // Replay button restarts the typewriter; background music is handled globally in common.js
    const replay = document.getElementById('replay');
    if (replay) {
      replay.addEventListener('click', () => {
        typewriter(el, text, 24);
        // If background audio exists and is paused, attempt to resume
        if (window.__bgAudio && window.__bgAudio.paused) {
          window.__bgAudio.play().catch(() => {});
        }
      });
    }
  });
})();
