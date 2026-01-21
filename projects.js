window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
});


const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
  });
}

const canvas = document.getElementById('topo-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let points = [];
  const spacing = 50;
  const mouse = { x: null, y: null, radius: 200 };

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
}

const items = document.querySelectorAll('.lens-card, .deck-card, .event-row');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    
      if (entry.target.classList.contains('deck-card')) {
      
         entry.target.style.transform = ''; 
      } else {
         entry.target.style.transform = 'translateY(0)';
      }
    }
  });
}, { threshold: 0.1 });

items.forEach((item, index) => {
  item.style.opacity = '0';
  if (!item.classList.contains('deck-card')) {
     item.style.transform = 'translateY(30px)';
  }
  item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(item);
});
const certCards=document.querySelectorAll('.deck-card')
const certFocus=document.getElementById('certFocus')
const certImage=document.getElementById('certImage')

certCards.forEach(card=>{
  card.addEventListener('click',()=>{
    const bg=card.querySelector('.deck-img').style.backgroundImage
    const url=bg.slice(5,-2)
    certImage.src=url
    certFocus.classList.add('active')
  })
})

certFocus.addEventListener('click',()=>{
  certFocus.classList.remove('active')
  certImage.src=''
})
