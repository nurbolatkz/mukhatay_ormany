// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// Simple JavaScript for pack selection
document.querySelectorAll('.pack').forEach(pack => {
  pack.addEventListener('click', function() {
    document.querySelectorAll('.pack').forEach(p => p.style.borderColor = 'var(--border)');
    this.style.borderColor = 'var(--accent)';
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
});

// Header scroll effect - simplified for our design
window.addEventListener('scroll', function() {
  // We don't need a header scroll effect in this design
});

console.log('Mukhatay Ormany website loaded with glassmorphism design');

// Form submission handling (if needed in future)
function handleSubmit(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your submission!');
}

// Initialize any components
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mukhatay Ormany website loaded');
    
    // Add any initialization code here
});