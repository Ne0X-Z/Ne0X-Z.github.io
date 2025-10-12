
document.addEventListener('DOMContentLoaded', () => {
    const mirrorQuestion = document.getElementById('mirrorQuestion');
    const heroContent = document.getElementById('heroContent');
    const mirrorBtns = document.querySelectorAll('.mirror-btn');
    const canvas = document.getElementById('mirrorCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // Configurar canvas
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Estado global del tema
    let currentTheme = sessionStorage.getItem('selectedTheme') || null;
    let currentColor = 'rgba(0, 217, 255, 0.6)'; // Cyan inicial

    // Partículas para constelaciones
    const particles = [];
    const particleCount = 60;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw(color) {
            ctx.fillStyle = color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Inicializar partículas
    if (canvas) {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Animación principal
    function animate() {
        if (!ctx || !canvas) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Actualizar y dibujar partículas
        particles.forEach((particle, index) => {
            particle.update();

            // Dibujar conexiones
            for (let j = index + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.3;
                    ctx.strokeStyle = currentColor.replace(/[\d.]+\)$/g, `${opacity})`);
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }

            particle.draw(currentColor);
        });

        requestAnimationFrame(animate);
    }

    if (canvas) {
        animate();
    }

    // Redimensionar canvas
    window.addEventListener('resize', () => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });

    // Aplicar tema guardado si existe
    if (currentTheme) {
        applyTheme(currentTheme, false);
    }

    // Manejar selección de tema
    mirrorBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const teamType = this.dataset.type;
            applyTheme(teamType, true);
        });
    });

    function applyTheme(teamType, animate = true) {
        sessionStorage.setItem('selectedTheme', teamType);
        currentTheme = teamType;

        if (teamType === 'red') {
            document.body.classList.add('red-theme');
            document.body.classList.remove('blue-theme');
            currentColor = 'rgba(204, 68, 68, 0.6)';
            updateScrollbarColor('#cc4444', 'rgba(204, 68, 68, 0.3)');
        } else if (teamType === 'blue') {
            document.body.classList.add('blue-theme');
            document.body.classList.remove('red-theme');
            currentColor = 'rgba(68, 136, 204, 0.6)';
            updateScrollbarColor('#4488cc', 'rgba(68, 136, 204, 0.3)');
        }

        document.body.classList.remove('theme-locked');
        document.body.classList.add('theme-selected');

        if (animate && mirrorQuestion) {
            mirrorQuestion.classList.add('hidden');

            setTimeout(() => {
                if (heroContent) heroContent.style.opacity = '1';
            }, 500);

            createExplosionEffect(teamType);
        } else {
            if (mirrorQuestion) {
                mirrorQuestion.style.display = 'none';
            }
            if (heroContent) {
                heroContent.style.opacity = '1';
            }
        }
    }

    function updateScrollbarColor(accentColor, glowColor) {
        let scrollbarStyle = document.getElementById('dynamic-scrollbar-style');

        if (!scrollbarStyle) {
            scrollbarStyle = document.createElement('style');
            scrollbarStyle.id = 'dynamic-scrollbar-style';
            document.head.appendChild(scrollbarStyle);
        }

        scrollbarStyle.textContent = `
            ::-webkit-scrollbar-track {
                border-left-color: ${accentColor} !important;
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, ${accentColor} 0%, transparent 100%) !important;
                border-color: ${accentColor} !important;
                box-shadow: 0 0 10px ${glowColor}, inset 0 0 10px ${glowColor} !important;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: ${accentColor} !important;
                box-shadow: 0 0 15px ${accentColor}, inset 0 0 15px rgba(255, 255, 255, 0.3) !important;
            }

            ::-webkit-scrollbar-thumb:active {
                background: ${accentColor} !important;
                box-shadow: 0 0 20px ${accentColor}, inset 0 0 20px rgba(255, 255, 255, 0.5) !important;
            }

            * {
                scrollbar-color: ${accentColor} var(--bg-secondary) !important;
            }
        `;
    }

    function createExplosionEffect(theme) {
        if (!ctx || !canvas) return;

        const explosionColor = theme === 'red' ? 'rgba(204, 68, 68, 0.8)' : 'rgba(68, 136, 204, 0.8)';
        const explosionParticles = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 40; i++) {
            explosionParticles.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 100
            });
        }

        function animateExplosion() {
            explosionParticles.forEach((p, index) => {
                if (p.life <= 0) {
                    explosionParticles.splice(index, 1);
                    return;
                }

                ctx.fillStyle = explosionColor.replace('0.8', `${p.life / 100}`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                p.life -= 2;
            });

            if (explosionParticles.length > 0) {
                requestAnimationFrame(animateExplosion);
            }
        }

        animateExplosion();
    }

    // Efecto hover en las cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Smooth scroll
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

    // Navegación activa
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Función global para otras páginas
window.applyStoredTheme = function () {
    const storedTheme = sessionStorage.getItem('selectedTheme');
    if (storedTheme) {
        if (storedTheme === 'red') {
            document.body.classList.add('red-theme');
            document.body.classList.remove('blue-theme');
        } else if (storedTheme === 'blue') {
            document.body.classList.add('blue-theme');
            document.body.classList.remove('red-theme');
        }
    }
};

if (!document.getElementById('mirrorQuestion')) {
    window.applyStoredTheme();
}