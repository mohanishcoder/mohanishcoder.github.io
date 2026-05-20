/* ─── Mobile nav toggle ─── */
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

/* ─── Navbar background on scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Active nav link on scroll (IntersectionObserver) ─── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* ─── Profile image fallback ─── */
const profileImg = document.querySelector('.profile-img');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    profileImg.style.background = 'linear-gradient(135deg, #0D1535 0%, #1a2550 100%)';
    profileImg.style.minHeight  = '100%';
    profileImg.removeAttribute('src');

    const initials = document.createElement('div');
    initials.textContent = 'MS';
    initials.style.cssText = [
      'position:absolute', 'inset:0', 'display:flex',
      'align-items:center', 'justify-content:center',
      'font-family:"Playfair Display",serif',
      'font-size:5rem', 'font-weight:900', 'color:#E8582A',
      'border-radius:inherit', 'z-index:2',
    ].join(';');

    profileImg.parentElement.style.position = 'relative';
    profileImg.parentElement.appendChild(initials);
  });
}
