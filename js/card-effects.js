
const cards = document.querySelectorAll('.card');

// Add mouse tracking effect to each card
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Get card boundaries
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to card (as percentage)
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Update CSS custom properties for gradient position
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });

    // Reset gradient position when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});

// Optional: Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation on scroll
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});