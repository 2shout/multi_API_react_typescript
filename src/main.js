console.log("Multi-Page App loaded successfully!");

// Простая анимация для карточек на главной странице
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".feature-card");

  cards.forEach((card, index) => {
    card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
  });
});
