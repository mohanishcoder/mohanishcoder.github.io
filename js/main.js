/* ════════════════════════════════════════════
   NEURAL NETWORK CANVAS
════════════════════════════════════════════ */
function initCanvas(canvasId, dotCount = 55, maxDist = 130, opacity = 1) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeDots(n) {
    return Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  resize();
  dots = makeDots(dotCount);
  window.addEventListener('resize', () => { resize(); dots = makeDots(dotCount); }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          const alpha = opacity * 0.25 * (1 - dist / maxDist);
          ctx.strokeStyle = `rgba(65,88,208,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${opacity * 0.6})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ════════════════════════════════════════════
   TYPEWRITER
════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Senior Product Manager',
    'SAFe® Agile Leader',
    'Digital Transformation Expert',
    'ART Program Manager',
    'Strategic Product Thinker',
  ];

  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (deleting) {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci <= 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    } else {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci >= word.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 75);
    }
  }

  setTimeout(tick, 600);
}

/* ════════════════════════════════════════════
   ANIMATED COUNTERS
════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => obs.observe(c));
}

/* ════════════════════════════════════════════
   SKILL BAR ANIMATION
════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width + '%';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════
   MOBILE NAV
════════════════════════════════════════════ */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Navbar scroll state */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* Active nav link highlight */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObs.observe(s));
}

/* ════════════════════════════════════════════
   PROFILE IMAGE FALLBACK
════════════════════════════════════════════ */
function initImgFallback() {
  document.querySelectorAll('.profile-img, .about-profile-img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.cssText = 'background:linear-gradient(135deg,#0D1535,#1a2550);min-height:100%;border-radius:inherit';
      img.removeAttribute('src');
    });
  });
}

/* ════════════════════════════════════════════
   BOOT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTypewriter();
  initCounters();
  initSkillBars();
  initScrollReveal();
  initImgFallback();
  initCanvas('heroCanvas',    55, 130, 1.0);
  initCanvas('contactCanvas', 30, 110, 0.6);
});
