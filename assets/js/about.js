document.addEventListener("DOMContentLoaded", function() {
  const selectorCards = document.querySelectorAll('.selector-card');
  const detailsCards = document.querySelectorAll('.details-card');

  selectorCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = card.getAttribute('data-target');

      // Remove active class from all cards
      selectorCards.forEach(c => c.classList.remove('active'));

      // Add active to the clicked one
      card.classList.add('active');

      showDetail(target);
    });
  });

  document.addEventListener('click', function() {
    detailsCards.forEach(detail => {
      detail.classList.add('fade-out');
      setTimeout(() => {
        detail.classList.add('hidden');
        detail.classList.remove('fade-out');
      }, 300);
    });

    // Remove active highlight
    selectorCards.forEach(c => c.classList.remove('active'));
  });

  function showDetail(sectionId) {
    detailsCards.forEach(detail => detail.classList.add('hidden'));
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.classList.remove('hidden');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
