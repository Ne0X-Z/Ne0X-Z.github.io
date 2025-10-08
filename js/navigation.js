
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active nav link highlighting
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');
    });
});

// Highlight active page based on current URL
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();

    if (linkPage === currentPage) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }
});