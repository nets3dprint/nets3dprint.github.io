/* ==========================================================================
   NETS3D — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     📌 WHATSAPP — para trocar o número, mexa só nesta linha:
     ------------------------------------------------------------------ */
  const WHATSAPP_NUMBER = '5519982944476'; // 55 (Brasil) + 19 (DDD) + número
  const WHATSAPP_MESSAGE = 'Olá! Vim pelo site e quero fazer um orçamento';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  document.querySelectorAll('[data-whatsapp-link]').forEach(el => {
    el.setAttribute('href', WHATSAPP_LINK);
  });

  /* ------------------------------------------------------------------
     MENU MOBILE
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // fecha o menu ao clicar em um link (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // fecha o menu ao clicar fora dele (mobile)
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  /* ------------------------------------------------------------------
     HEADER — leve sombra/opacidade extra ao rolar a página
     ------------------------------------------------------------------ */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     REVEAL ON SCROLL (fade + sobe levemente ao entrar na tela)
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     SLIDESHOW DA GALERIA
     ------------------------------------------------------------------ */
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    const slidesWrap = document.getElementById('slides');
    const slides = Array.from(slidesWrap.children);
    const dotsWrap = document.getElementById('slideDots');
    const btnPrev = document.getElementById('slidePrev');
    const btnNext = document.getElementById('slideNext');

    let current = slides.findIndex(s => s.classList.contains('is-active'));
    if (current < 0) current = 0;
    let timer = null;
    let isHovered = false; // flag: impede reiniciar o autoplay se o mouse ainda está sobre o slideshow
    const AUTOPLAY_MS = 4500; // troca a cada 4.5s — pode ajustar aqui

    // gera os indicadores (dots) dinamicamente
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir para o trabalho ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function goTo(index, userTriggered) {
      current = (index + slides.length) % slides.length;
      render();
      // Só reinicia o timer se o mouse não estiver sobre o slideshow
      if (userTriggered && !isHovered) restart();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      stop();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restart() { start(); }

    btnNext.addEventListener('click', () => goTo(current + 1, true));
    btnPrev.addEventListener('click', () => goTo(current - 1, true));

    // pausa ao passar o mouse ou focar com teclado
    slideshow.addEventListener('mouseenter', () => { isHovered = true; stop(); });
    slideshow.addEventListener('mouseleave', () => { isHovered = false; start(); });
    slideshow.addEventListener('focusin', stop);
    slideshow.addEventListener('focusout', start);

    // navegação por teclado quando o carrossel está em foco
    slideshow.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(current + 1, true);
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
    });

    // swipe no celular
    let touchStartX = 0;
    slidesWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    slidesWrap.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
      start();
    }, { passive: true });

    render();
    start();
  }

  /* ------------------------------------------------------------------
     QR CODE — aponta para o mesmo link do WhatsApp
     (biblioteca qrcodejs carregada por CDN no index.html)
     ------------------------------------------------------------------ */
  const qrEl = document.getElementById('qrcode');
  if (qrEl && typeof QRCode !== 'undefined') {
    // fundo branco / módulos escuros: garante boa leitura por qualquer leitor de QR
    new QRCode(qrEl, {
      text: WHATSAPP_LINK,
      width: 168,
      height: 168,
      colorDark: '#0d0e10',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  /* ------------------------------------------------------------------
     ANO ATUAL NO RODAPÉ
     ------------------------------------------------------------------ */
  const anoEl = document.getElementById('anoAtual');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

});
