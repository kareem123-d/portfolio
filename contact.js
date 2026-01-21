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
  const mouse = { x: null, y: null, radius: 250 };

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

const form = document.querySelector('.holo-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const btnText = btn.querySelector('.btn-text');
        const btnIcon = btn.querySelector('i');
        const originalText = btnText.innerText;
        const originalIconClass = btnIcon.className;

        btnText.innerText = "TRANSMITTING...";
        btnIcon.className = "fas fa-spinner fa-spin";
        btn.style.background = "#4f46e5";

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                btnText.innerText = "SUCCESSFULLY SENT";
                btnIcon.className = "fas fa-check";
                btn.style.background = "#22c55e";
                form.reset();
            } else {
                btnText.innerText = "ERROR";
                btnIcon.className = "fas fa-times";
                btn.style.background = "#ef4444";
                console.log(result); 
            }

        } catch (error) {
            console.log(error);
            btnText.innerText = "FAILED";
            btnIcon.className = "fas fa-exclamation-triangle";
            btn.style.background = "#ef4444";
        }

        setTimeout(() => {
            btnText.innerText = originalText;
            btnIcon.className = originalIconClass;
            btn.style.background = "#6366f1";
        }, 4000);
    });
}