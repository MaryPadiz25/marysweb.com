/* ═══════════════════════════════════════════════
   BUDGET WEBSITE DEVELOPER — main.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('sc', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ── HAMBURGER / MOBILE MENU ── */
const hbg = document.getElementById('hbg');
const mmenu = document.getElementById('mmenu');

function closeMenu() {
  hbg.classList.remove('op');
  hbg.setAttribute('aria-expanded', 'false');
  mmenu.classList.add('cl');
  document.body.style.overflow = '';
  mmenu.addEventListener('animationend', () => {
    mmenu.classList.remove('op', 'cl');
  }, { once: true });
}

function openMenu() {
  hbg.classList.add('op');
  hbg.setAttribute('aria-expanded', 'true');
  mmenu.classList.remove('cl');
  mmenu.classList.add('op');
  document.body.style.overflow = 'hidden';
}

hbg.addEventListener('click', () => {
  const isOpen = mmenu.classList.contains('op');
  isOpen ? closeMenu() : openMenu();
});

// Close menu when a link is clicked
mmenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => closeMenu());
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mmenu.classList.contains('op')) closeMenu();
});

/* ── TYPEWRITER EFFECT ── */
const words = ['Developer.', 'Designer.', 'Creator.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const twEl = document.getElementById('tw');

function typeWriter() {
  if (!twEl) return;
  const currentWord = words[wordIndex];

  if (isDeleting) {
    charIndex--;
    twEl.textContent = currentWord.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeWriter, 340);
      return;
    }
  } else {
    charIndex++;
    twEl.textContent = currentWord.slice(0, charIndex);
    if (charIndex === currentWord.length) {
      setTimeout(() => { isDeleting = true; typeWriter(); }, 1500);
      return;
    }
  }
  setTimeout(typeWriter, isDeleting ? 52 : 108);
}
typeWriter();

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => revealObs.observe(el));

/* ── SKILL BARS ── */
const skillBarsEl = document.getElementById('skill-bars');
if (skillBarsEl) {
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  barObs.observe(skillBarsEl);
}

/* ── LAZY IMAGE LOADING WITH FADE-IN ── */
const lazyObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.onload = () => img.classList.add('loaded');
        // If already cached and complete
        if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
      }
      obs.unobserve(img);
    }
  });
}, { rootMargin: '200px 0px' }); // start loading 200px before viewport

document.querySelectorAll('img[data-src]').forEach(img => lazyObs.observe(img));

// Mark eager images as loaded
document.querySelectorAll('img:not([data-src])').forEach(img => {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
  }
});

/* ── SCROLL TO TOP BUTTON ── */
const stb = document.getElementById('stb');
if (stb) {
  window.addEventListener('scroll', () => {
    stb.classList.toggle('on', window.scrollY > 420);
  }, { passive: true });
  stb.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── CONTACT FORM FEEDBACK ── */
const cform = document.getElementById('cform');
const submitBtn = document.getElementById('submit-btn');

if (cform && submitBtn) {
  cform.addEventListener('submit', () => {
    submitBtn.textContent = '⏳ Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '.7';
  });
}

/* ── ACTIVE NAV LINK HIGHLIGHT (scroll spy) ── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const spyObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObs.observe(s));

/* ── SMOOTH ANCHOR OFFSET for fixed nav ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
