// scripts/banner.js
(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(carousel.querySelectorAll('.carousel__img'));
  const btnPrev = carousel.querySelector('.carousel__btn--prev');
  const btnNext = carousel.querySelector('.carousel__btn--next');
  const pagination = carousel.querySelector('.carousel__pagination');

  let index = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let slideWidth = carousel.clientWidth;
  const threshold = 60; // px para mudar de slide

  // ---------- helpers ----------
  function updateSize() {
    slideWidth = carousel.clientWidth;
    prevTranslate = -index * slideWidth;
    setTransition(true);
    setTranslate(prevTranslate);
    updateButtons();
    highlightBullet();
  }

  function setTranslate(x) {
    track.style.transform = `translateX(${x}px)`;
  }

  function setTransition(enable) {
    track.style.transition = enable ? 'transform 300ms ease' : 'none';
  }

  function goToSlide(i) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    prevTranslate = -index * slideWidth;
    setTransition(true);
    setTranslate(prevTranslate);
    updateButtons();
    highlightBullet();
  }

  function nextSlide() { goToSlide(index + 1); }
  function prevSlide() { goToSlide(index - 1); }

  function updateButtons() {
    if (!btnPrev || !btnNext) return;
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
    btnPrev.style.opacity = btnPrev.disabled ? '0.55' : '1';
    btnNext.style.opacity = btnNext.disabled ? '0.55' : '1';
  }

  // ---------- pagination (bullets) ----------
  function createPagination() {
    if (!pagination) return;
    pagination.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'carousel__bullet';
      btn.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        goToSlide(i);
      });
      pagination.appendChild(btn);
    });
    highlightBullet();
  }

  function highlightBullet() {
    if (!pagination) return;
    const bullets = Array.from(pagination.children);
    bullets.forEach(b => b.removeAttribute('aria-current'));
    const current = pagination.children[index];
    if (current) current.setAttribute('aria-current', 'true');
  }

  // ---------- pointer handlers (touch + mouse) ----------
  function pointerDown(clientX) {
    isDragging = true;
    startX = clientX;
    setTransition(false);
  }

  function pointerMove(clientX) {
    if (!isDragging) return;
    const diff = clientX - startX;
    currentTranslate = prevTranslate + diff;
    setTranslate(currentTranslate);
  }

  function pointerUp() {
    if (!isDragging) return;
    isDragging = false;
    const moved = currentTranslate - prevTranslate;

    if (moved < -threshold && index < slides.length - 1) index++;
    if (moved > threshold && index > 0) index--;

    prevTranslate = -index * slideWidth;
    setTransition(true);
    setTranslate(prevTranslate);
    updateButtons();
    highlightBullet();
  }

  // touch events
  track.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return;
    pointerDown(e.touches[0].clientX);
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) return;
    pointerMove(e.touches[0].clientX);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    pointerUp();
  });

  track.addEventListener('touchcancel', () => {
    pointerUp();
  });

  // mouse events
  track.addEventListener('mousedown', (e) => {
    e.preventDefault();
    pointerDown(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    pointerMove(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    pointerUp();
  });

  // botões prev/next
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNext) btnNext.addEventListener('click', nextSlide);

  // keyboard support (opcional)
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // tratar resize
  window.addEventListener('resize', () => {
    window.requestAnimationFrame(updateSize);
  });

  // impedir clique arrastando (evita selecionar imagens)
  slides.forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // inicialização
  createPagination();
  updateSize();
})();
