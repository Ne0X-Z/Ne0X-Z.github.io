
const canvas = document.getElementById('mirrorCanvas');
const ctx = canvas.getContext('2d');
const mirrorQuestion = document.getElementById('mirrorQuestion');
const heroContent = document.getElementById('heroContent');
const heroSection = document.querySelector('.hero');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let theme = 'neutral';
let particles = [];

class MirrorParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        let color;
        if (theme === 'red') {
            color = `rgba(255, 0, 0, 0.6)`;
        } else if (theme === 'blue') {
            color = `rgba(0, 0, 255, 0.6)`;
        } else {
            color = `rgba(100, 100, 100, 0.4)`;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Conexiones
        particles.forEach(other => {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = color.replace('0.6', '0.2');
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        });
    }
}

// Inicializar partículas
for (let i = 0; i < 80; i++) {
    particles.push(new MirrorParticle());
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();


document.querySelectorAll('.mirror-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        theme = type;

        heroSection.classList.add(`${type}-theme`);
        mirrorQuestion.classList.add('hidden');

        setTimeout(() => {
            heroContent.style.opacity = '1';
        }, 800);
    });
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});