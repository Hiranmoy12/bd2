// Countdown to next October 13
(function () {
  function nextTarget() {
    const now = new Date();
    const year = (now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() > 13))
      ? now.getFullYear() + 1
      : now.getFullYear();
    // Months are 0-indexed: October is 9
    return new Date(year, 9, 13, 0, 0, 0, 0);
  }

  function pad(n) { return n.toString().padStart(2, '0'); }

  let target;
  let timer;
  let countdown, finished, days, hours, minutes, seconds;

  function update() {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      clearInterval(timer);
      if (countdown) countdown.setAttribute('class', 'countdown hidden');
      if (finished) finished.setAttribute('class', 'finished');
      return;
    }

    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    if (days) days.textContent = d;
    if (hours) hours.textContent = pad(h);
    if (minutes) minutes.textContent = pad(m);
    if (seconds) seconds.textContent = pad(sec);
  }

  window.addEventListener('DOMContentLoaded', () => {
    countdown = document.getElementById('countdown');
    finished = document.getElementById('finished');
    days = document.getElementById('days');
    hours = document.getElementById('hours');
    minutes = document.getElementById('minutes');
    seconds = document.getElementById('seconds');

    // 30-second countdown target
    target = new Date(Date.now() + 30 * 1000);
    update();
    timer = setInterval(update, 1000);
  });
})();
