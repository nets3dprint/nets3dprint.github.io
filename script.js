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
     HERO — SPOTLIGHT (segue o mouse)
     ------------------------------------------------------------------ */
  const spotlight = document.getElementById('heroSpotlight');
  const heroSection = document.getElementById('hero-section');
  if (spotlight && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      spotlight.style.left = (e.clientX - rect.left) + 'px';
      spotlight.style.top  = (e.clientY - rect.top)  + 'px';
    });
    heroSection.addEventListener('mouseleave', () => {
      // Retorna pro centro suavemente
      spotlight.style.left = '50%';
      spotlight.style.top  = '50%';
    });
  }

  /* ------------------------------------------------------------------
     HERO — TYPEWRITER (título)
     ------------------------------------------------------------------ */
  const typewriterEl = document.getElementById('heroTypewriter');
  if (typewriterEl) {
    // 📌 Frases do typewriter — edite aqui para personalizar:
    const phrases = [
      'objeto real.',
      'miniatura única.',
      'peça sob medida.',
      'presente perfeito.',
      'protótipo funcional.',
      'brinde inesquecível.',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const TYPE_SPEED = 65, DELETE_SPEED = 35, PAUSE_FULL = 2200, PAUSE_EMPTY = 400;

    function typeStep() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        typewriterEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeStep, PAUSE_FULL);
          return;
        }
      } else {
        typewriterEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeStep, PAUSE_EMPTY);
          return;
        }
      }
      setTimeout(typeStep, deleting ? DELETE_SPEED : TYPE_SPEED);
    }
    setTimeout(typeStep, 600);
  }

  /* ------------------------------------------------------------------
     HERO — SHOWCASE (auto-apresentação de trabalhos)
     ------------------------------------------------------------------ */
  const showcaseWrap = document.querySelector('.showcase-cards-wrap');
  const progressWrap = document.getElementById('showcaseProgress');
  if (showcaseWrap && progressWrap) {
    // 📌 Lista de trabalhos do showcase — edite título, desc, tag e img (caminhos em pictures/)
    const works = [
      { title: 'Miniatura de RPG', desc: 'Personagem pintado à mão com riqueza de detalhes.', tag: 'MINIATURAS', img: 'pictures/foto1.jpg' },
      { title: 'Vaso Decorativo', desc: 'Design geométrico Voronoi em PLA branco fosco.', tag: 'DECORAÇÃO', img: 'pictures/foto2.jpg' },
      { title: 'Protótipo Mecânico', desc: 'Conjunto de engrenagens para validação de projeto.', tag: 'PROTÓTIPOS', img: 'pictures/foto3.jpg' },
      { title: 'Peça de Reposição', desc: 'Componente recriado para eletrodoméstico descontinuado.', tag: 'REPOSIÇÃO', img: 'pictures/foto4.jpg' },
      { title: 'Presente Personalizado', desc: 'Plaquinha com nome em filamento rose gold.', tag: 'PRESENTES', img: 'pictures/foto5.jpg' },
    ];

    const SHOWCASE_INTERVAL = 3800; // ms entre trocas
    let showcaseCurrent = 0;
    let showcaseTimer = null;
    const showcaseFills = [];

    // Cria os cards e barras de progresso
    works.forEach((w, i) => {
      // Card
      const card = document.createElement('div');
      card.className = 'showcase-card' + (i === 0 ? ' is-active' : '');

      // Imagem
      const img = document.createElement('img');
      img.src = w.img;
      img.alt = w.title;
      img.className = 'showcase-card-img';
      img.loading = 'lazy';
      img.onerror = function() {
        // Placeholder se imagem não existir
        const ph = document.createElement('div');
        ph.className = 'showcase-card-img-placeholder';
        ph.textContent = '3D';
        card.replaceChild(ph, this);
      };

      const info = document.createElement('div');
      info.className = 'showcase-card-info';
      info.innerHTML = `
        <p class="showcase-card-title">${w.title}</p>
        <p class="showcase-card-desc">${w.desc}</p>
        <span class="showcase-card-tag">${w.tag}</span>
      `;

      card.appendChild(img);
      card.appendChild(info);
      showcaseWrap.appendChild(card);

      // Barra de progresso
      const bar = document.createElement('div');
      bar.className = 'showcase-bar';
      const fill = document.createElement('div');
      fill.className = 'showcase-bar-fill';
      bar.appendChild(fill);
      progressWrap.appendChild(bar);
      showcaseFills.push(fill);
    });

    const showcaseCards = Array.from(showcaseWrap.children);

    function showcaseGoTo(idx) {
      // Reseta todos
      showcaseCards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
      showcaseFills.forEach((f, i) => {
        f.style.transition = 'none';
        f.style.width = i < idx ? '100%' : '0%';
      });
      // Anima a barra atual
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          showcaseFills[idx].style.transition = `width ${SHOWCASE_INTERVAL}ms linear`;
          showcaseFills[idx].style.width = '100%';
        });
      });
    }

    function showcaseNext() {
      showcaseCurrent = (showcaseCurrent + 1) % works.length;
      showcaseGoTo(showcaseCurrent);
    }

    function startShowcase() {
      showcaseTimer = setInterval(showcaseNext, SHOWCASE_INTERVAL);
    }

    showcaseGoTo(0);
    startShowcase();
  }

  /* ------------------------------------------------------------------
     SPLINE — esconde o loader quando o iframe carrega
     ------------------------------------------------------------------ */
  const splineIframe = document.getElementById('splineRobot');
  const splineLoader = document.getElementById('splineLoader');
  if (splineIframe && splineLoader) {
    splineIframe.addEventListener('load', () => {
      splineLoader.classList.add('is-loaded');
    });
    // Fallback: esconde o loader após 8s mesmo que o evento não dispare
    setTimeout(() => splineLoader.classList.add('is-loaded'), 8000);
  }


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
