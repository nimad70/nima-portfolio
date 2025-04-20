// Loader Spinner Fade Out
window.addEventListener('load', function() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'none';
  }
});

// Sticky Navbar Shadow on Scroll
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar') || document.querySelector('nav');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll to Top Button
const scrollBtn = document.getElementById("scrollToTopBtn");
window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    scrollBtn.style.display = "flex";
  } else {
    scrollBtn.style.display = "none";
  }
});
scrollBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Thank You Modal Logic (for Contact page only)
function openModal() {
  const modal = document.getElementById('thankYouModal');
  if (modal) {
    modal.style.display = 'block';
  }
}
function closeModal() {
  const modal = document.getElementById('thankYouModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// OPTIONAL: Close modal when clicking outside of it
window.addEventListener('click', function(event) {
  const modal = document.getElementById('thankYouModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});
