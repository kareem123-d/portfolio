const roles = ["Shaik.Kareem", "Full Stack Developer", "UI / UX Designer"];
const typingSpan = document.querySelector(".typing-text");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!isDeleting) {
    typingSpan.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      setTimeout(() => isDeleting = true, 1500);
    }
  } else {
    typingSpan.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 60 : 100);
}

document.addEventListener("DOMContentLoaded", typeLoop);

window.addEventListener("scroll", () => {
  const progress = document.querySelector(".scroll-indicator");
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.style.width = (winScroll / height) * 100 + "%";
});

window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  if(loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }, 800);
  }
});

const canvas = document.getElementById('topo-canvas');
const ctx = canvas.getContext('2d');
let points = [];
const spacing = 45;
const mouse = { x: null, y: null, radius: 150 };

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

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  const card = document.querySelector(".glass-card");
  if(card) {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const time = Date.now() * 0.001;

  points.forEach(p => {
    const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
    const wave = Math.sin(p.originX * 0.01 + time) * 8;
    
    if (dist < mouse.radius) {
      const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
      const force = (mouse.radius - dist) / mouse.radius;
      p.x -= Math.cos(angle) * force * 5;
      p.y -= Math.sin(angle) * force * 5;
    } else {
      p.x += (p.originX - p.x) * 0.05;
      p.y += (p.originY - p.y + wave) * 0.05;
    }

    ctx.fillStyle = `rgba(99, 102, 241, ${Math.max(0.1, 1 - dist / 600)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();

const tooltip = document.getElementById('tooltip');
const interactiveElements = document.querySelectorAll('.nav-link, .social-icon, .btn-primary, .btn-ghost');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', (e) => {
    let text = "";
    
    if (el.classList.contains('facebook')) text = "Follow on Facebook";
    else if (el.classList.contains('instagram')) text = "Check my Instagram";
    else if (el.classList.contains('github')) text = "View my Code";
    else if (el.classList.contains('linkedin')) text = "Connect on LinkedIn";
    else if (el.classList.contains('hackerrank')) text = "Competitive Coding";
    else if (el.getAttribute('href')?.startsWith('#')) text = `Go to ${el.textContent}`;
    else text = el.textContent || "Click to View";

    tooltip.textContent = text;
    tooltip.classList.add('visible');
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if(cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    if(cursorOutline) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
  });

  el.addEventListener('mousemove', (e) => {
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = e.clientY + 'px';
  });

  el.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if(cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    if(cursorOutline) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
    }
  });
});

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if(cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });
}