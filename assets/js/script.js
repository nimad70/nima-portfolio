// Loader Spinner Fade Out
window.addEventListener('load', function() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'none';
  }
});

// Sticky Navbar Shadow on Scroll
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// DOMContentLoaded for menu toggle and scroll-to-top
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const navLinks = document.getElementById('nav-links');
  const menuToggle = document.getElementById('menu-toggle');

  // Check if the click is outside the menu and toggle button
  if (navLinks.classList.contains('active') &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)) {
    navLinks.classList.remove('active');
  }
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.getElementById('nav-links');
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });
});

  // Scroll to Top Button logic
  const scrollBtn = document.getElementById("scrollToTopBtn");
  if (scrollBtn) {
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
  }

  // Reset Contact Form if exists
  const form = document.getElementById("contactForm");
  if (form) form.reset();
});

// Selector Card functionality (if needed elsewhere)
function showDetails(sectionId) {
  const cards = document.querySelectorAll('.selector-card');
  const sections = document.querySelectorAll('.details-card');

  cards.forEach(card => card.classList.remove('active'));
  sections.forEach(section => section.classList.add('hidden'));

  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.classList.remove('hidden');

  const activeCard = document.querySelector(`[onclick="showDetails('${sectionId}')"]`);
  if (activeCard) activeCard.classList.add('active');
}

// // Thank You Modal Logic (for Contact page only)
// function openModal() {
//   const modal = document.getElementById('thankYouModal');
//   if (modal) {
//     modal.style.display = 'block';
//   }
// }
// function closeModal() {
//   const modal = document.getElementById('thankYouModal');
//   if (modal) {
//     modal.style.display = 'none';
//   }
// }

// // OPTIONAL: Close modal when clicking outside of it
// window.addEventListener('click', function(event) {
//   const modal = document.getElementById('thankYouModal');
//   if (event.target == modal) {
//     modal.style.display = 'none';
//   }
// });
