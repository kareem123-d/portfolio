window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  if(loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
      initEmitters();
    }, 800);
  }
});

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if(cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
  });
}

const canvas = document.getElementById('topo-canvas');
const ctx = canvas.getContext('2d');
let points = [];
const spacing = 50;
const mouse = { x: null, y: null, radius: 180 };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
}

function init() {
  points = [];
  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing) {
      points.push({ x, y, originX: x, originY: y });
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.forEach(p => {
    const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
    if (dist < mouse.radius) {
      const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
      const force = (mouse.radius - dist) / mouse.radius;
      p.x -= Math.cos(angle) * force * 5;
      p.y -= Math.sin(angle) * force * 5;
    } else {
      p.x += (p.originX - p.x) * 0.05;
      p.y += (p.originY - p.y) * 0.05;
    }

    ctx.fillStyle = `rgba(99, 102, 241, ${Math.max(0.05, 1 - dist / 600)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('resize', resize);
resize();
animate();

function initEmitters() {
  const emitters = document.querySelectorAll('.holo-emitter');
  emitters.forEach((emitter, index) => {
    emitter.style.opacity = '0';
    emitter.style.transform = 'translateY(50px)';
    setTimeout(() => {
      emitter.style.transition = 'all 0.8s ease';
      emitter.style.opacity = '1';
      emitter.style.transform = 'translateY(0)';
    }, index * 100);
  });
}