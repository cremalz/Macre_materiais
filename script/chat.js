
const whatsappBtn = document.querySelector('.whatsapp-btn');
const whatsappChat = document.querySelector('.whatsapp-chat');

whatsappBtn.addEventListener('click', () => {
  whatsappChat.classList.toggle('show');
});