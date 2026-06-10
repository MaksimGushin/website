// ── NAV: появление фона при скролле + активный пункт ──
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Подсветка активного раздела в меню
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ── BURGER меню (мобайл) ──
const burger = document.querySelector('.nav-burger');
const navLinksEl = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navLinksEl.style.display = open ? 'flex' : 'none';
  navLinksEl.style.flexDirection = 'column';
  navLinksEl.style.position = 'absolute';
  navLinksEl.style.top = '100%';
  navLinksEl.style.left = '0';
  navLinksEl.style.right = '0';
  navLinksEl.style.background = 'rgba(10,10,10,.98)';
  navLinksEl.style.padding = '24px';
  navLinksEl.style.gap = '20px';
  navLinksEl.style.zIndex = '200';
});

// ── SCROLL REVEAL ──
const animatedItems = document.querySelectorAll('.animate');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('show');
        // Запустить счётчик если это stat
        const numEl = entry.target.querySelector('.stat-number[data-target]');
        if (numEl) animateCounter(numEl);
      }, index * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
animatedItems.forEach(item => observer.observe(item));

// ── АНИМАЦИЯ СЧЁТЧИКОВ ──
function animateCounter(el) {
  const rawTarget = el.dataset.target;
  const suffix = rawTarget.replace(/[\d]/g, '');   // '+', 'к', '%' и т.д.
  const target = parseInt(rawTarget);
  const duration = 1600;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  requestAnimationFrame(function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  });
}

// Привязать data-target к числам из текста
document.querySelectorAll('.stat-number').forEach(el => {
  const raw = el.textContent.trim();
  const num = parseInt(raw);
  if (!isNaN(num)) {
    const suffix = raw.replace(/[\d]/g, '');
    el.dataset.target = num + suffix;
    el.textContent = '0' + suffix;
  }
});




const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!heroContent) return;
  const y = window.scrollY;
  heroContent.style.transform = `translateY(${y * 0.25}px)`;
}, { passive: true });



// ── PHOTO STRIP SLIDER ──
(function () {
  const strip = document.getElementById('photoStrip');
  const dotsContainer = document.getElementById('stripDots');
  const btnPrev = document.querySelector('.strip-btn-prev');
  const btnNext = document.querySelector('.strip-btn-next');
  if (!strip) return;

  const items = strip.querySelectorAll('.strip-item');
  const count = items.length;

  // Создаём точки
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'strip-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Фото ' + (i + 1));
    dot.addEventListener('click', () => scrollToItem(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.strip-dot');

  function getItemWidth() {
    return items[0].offsetWidth + parseInt(getComputedStyle(strip).gap || 6);
  }

  function scrollToItem(index) {
    strip.scrollTo({ left: index * getItemWidth(), behavior: 'smooth' });
  }

  function updateState() {
    const scrollLeft = strip.scrollLeft;
    const w = getItemWidth();
    const active = Math.round(scrollLeft / w);
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
    btnPrev.classList.toggle('disabled', scrollLeft <= 4);
    btnNext.classList.toggle('disabled', scrollLeft >= strip.scrollWidth - strip.clientWidth - 4);
  }

  btnPrev.addEventListener('click', () => {
    strip.scrollBy({ left: -getItemWidth(), behavior: 'smooth' });
  });
  btnNext.addEventListener('click', () => {
    strip.scrollBy({ left: getItemWidth(), behavior: 'smooth' });
  });

  strip.addEventListener('scroll', updateState, { passive: true });
  updateState();

  // Drag-to-scroll (мышь)
  let isDown = false, startX, scrollStart;
  strip.addEventListener('mousedown', e => {
    isDown = true;
    strip.classList.add('dragging');
    startX = e.pageX;
    scrollStart = strip.scrollLeft;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    strip.classList.remove('dragging');
  });
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    strip.scrollLeft = scrollStart - (e.pageX - startX);
  });
})();
