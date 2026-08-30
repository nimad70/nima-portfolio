// Loader fade out
window.addEventListener('load', function() {
  document.querySelector('.loader').style.display = 'none';
});

// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.3, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Animate skill bars
const skillSection = document.querySelector('section');
const skillsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.bar-fill').forEach(bar => {
        const width = bar.getAttribute('style').match(/\d+/g)[0];
        bar.style.width = width + '%';
      });
      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

skillsObserver.observe(skillSection);

// Scroll-to-top button logic
const scrollBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    scrollBtn.style.display = "flex";
  } else {
    scrollBtn.style.display = "none";
  }
};

scrollBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
