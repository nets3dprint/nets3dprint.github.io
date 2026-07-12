/* ==========================================================================
   NETS3D — script.js (Versão Comercial Corrigida e Otimizada)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     📌 CONFIGURAÇÕES DO WHATSAPP
     ------------------------------------------------------------------ */
  const WHATSAPP_NUMBER = '5519982944476';
  const WHATSAPP_MESSAGE = 'Olá! Acessei o site da Nets3D e gostaria de solicitar um orçamento para uma peça.';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  document.querySelectorAll('[data-whatsapp-link]').forEach(el => {
    el.setAttribute('href', WHATSAPP_LINK);
  });

  /* ------------------------------------------------------------------
     SLIDESHOW AUTOMÁTICO 1: HERO CONTAINER (TOPO DA PÁGINA)
     ------------------------------------------------------------------ */
  const heroSlides = document.querySelectorAll('.hero-carousel-slide');
  const heroDotsNav = document.getElementById('heroCarouselDots');
  let heroCurrent = 0;
  const HERO_TIME = 3500; // Troca automaticamente a cada 3.5 segundos

  if (heroSlides.length > 0 && heroDotsNav) {
    heroSlides.forEach((_, idx) => {
      const dot = document.createElement('span');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => changeHeroSlide(idx));
      heroDotsNav.appendChild(dot);
    });

    const dots = heroDotsNav.querySelectorAll('span');

    function changeHeroSlide(idx) {
      heroSlides[heroCurrent].classList.remove('active');
      dots[heroCurrent].classList.remove('active');
      heroCurrent = idx;
      heroSlides[heroCurrent].classList.add('active');
      dots[heroCurrent].classList.add('active');
    }

    setInterval(() => {
      let nextIdx = (heroCurrent + 1) % heroSlides.length;
      changeHeroSlide(nextIdx);
    }, HERO_TIME);
  }

  /* ------------------------------------------------------------------
     SLIDESHOW AUTOMÁTICO 2: GALERIA CASOS REAIS (FUNDO DA PÁGINA)
     ------------------------------------------------------------------ */
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    const slidesWrap = document.getElementById('slides');
    const slides = Array.from(slidesWrap.children);
    const dotsWrap = document.getElementById('slideDots');
    const btnPrev = document.getElementById('slidePrev');
    const btnNext = document.getElementById('slideNext');

    let current = 0;
    const AUTOPLAY_MS = 4000;
    let mainTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      render();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startTimer() {
      stopTimer();
      mainTimer = setInterval(next, AUTOPLAY_MS);
    }

    function stopTimer() {
      if (mainTimer) clearInterval(mainTimer);
    }

    btnNext.addEventListener('click', () => { next(); startTimer(); });
    btnPrev.addEventListener('click', () => { prev(); startTimer(); });

    slideshow.addEventListener('mouseenter', stopTimer);
    slideshow.addEventListener('mouseleave', startTimer);

    render();
    startTimer();
  }

  /* ------------------------------------------------------------------
     INTERAÇÕES DE LAYOUT & COMPONENTES GLOBAIS
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('is-open'));
    });
  }

  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  const qrEl = document.getElementById('qrcode');
  if (qrEl && typeof QRCode !== 'undefined') {
    new QRCode(qrEl, {
      text: WHATSAPP_LINK,
      width: 152,
      height: 152,
      colorDark: '#0d0e10',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  const anoEl = document.getElementById('anoAtual');
  if (anoEl) anoEl.textContent = new Date().getFullYear();
});