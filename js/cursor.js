const cursor = document.querySelector('.cursor');
const cursorGlow = document.querySelector('.cursor-glow');

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  cursorGlow.style.left = mouseX + 'px';
  cursorGlow.style.top = mouseY + 'px';
  requestAnimationFrame(animateCursor);
}


if (!document.querySelector('#glitch-animation')) {
  const style = document.createElement('style');
  style.id = 'glitch-animation';
  style.textContent = `
    @keyframes fragmentFade {
      0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
      100% { opacity: 0; transform: translate(var(--tx, 20px), var(--ty, 20px)) rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

animateCursor();

document.querySelectorAll('a, button, .card, .mirror-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});