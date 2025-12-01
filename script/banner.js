const slides = document.querySelectorAll('.carousel img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');
let index = 0;
let interval;

// Criar bolinhas dinamicamente
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dots span');

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[i].classList.add('active');
  dots[i].classList.add('active');
  index = i;
}

function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function prevSlideFunc() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

// Auto-play
function startAutoPlay() {
  interval = setInterval(nextSlide, 15000);
}

function stopAutoPlay() {
  clearInterval(interval);
}

// Eventos
next.addEventListener('click', () => {
  stopAutoPlay();
  nextSlide();
  startAutoPlay();
});

prev.addEventListener('click', () => {
  stopAutoPlay();
  prevSlideFunc();
  startAutoPlay();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    stopAutoPlay();
    showSlide(i);
    startAutoPlay();
  });
});
// Iniciar
showSlide(index);
startAutoPlay();


const whatsappBtn = document.querySelector('.whatsapp-btn');
const whatsappChat = document.querySelector('.whatsapp-chat');

whatsappBtn.addEventListener('click', () => {
  whatsappChat.classList.toggle('show');
});