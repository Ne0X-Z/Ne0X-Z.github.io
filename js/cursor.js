
const cursor = document.querySelector('.cursor');
const cursorGlow = document.querySelector('.cursor-glow');


let mouseX = 0;
let mouseY = 0;


const trailPositions = [];
const maxTrailLength = 15;


document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;


    trailPositions.push({
        x: mouseX,
        y: mouseY,
        timestamp: Date.now()
    });


    if (trailPositions.length > maxTrailLength) {
        trailPositions.shift();
    }
});

// Animación del cursor principal
function animateCursor() {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';

    requestAnimationFrame(animateCursor);
}

// Dibujar el trail (estela de círculos)
function drawTrail() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9996';
    canvas.style.mixBlendMode = 'screen';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now();
        const fadeTime = 500; // Tiempo en ms para que desaparezca el trail

        // Obtener color del acento actual (LEER EN CADA FRAME)
        const accentColor = getComputedStyle(document.body)
            .getPropertyValue('--accent').trim();

        // Convertir hex a RGB
        const rgb = hexToRgb(accentColor);

        // Dibujar círculos de la estela (de atrás hacia adelante)
        trailPositions.forEach((pos, index) => {
            const age = now - pos.timestamp;
            if (age > fadeTime) return;

            const progress = index / trailPositions.length;
            const opacity = (1 - (age / fadeTime)) * (0.3 + progress * 0.5);
            const size = 12 * (0.5 + progress * 0.5); // Tamaño del cursor

            // Dibujar solo el borde del círculo
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Glow sutil alrededor
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size + 3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Limpiar posiciones antiguas
        while (trailPositions.length > 0 && now - trailPositions[0].timestamp > fadeTime) {
            trailPositions.shift();
        }

        requestAnimationFrame(render);
    }

    render();
}

// Función auxiliar para convertir hex a RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 217, b: 255 }; // Fallback al cyan
}

// Efecto de onda al hacer click
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid var(--accent)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9995';
    ripple.style.mixBlendMode = 'screen';
    ripple.style.animation = 'ripple 0.6s ease-out';

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// Agregar animación de ripple al CSS si no existe
if (!document.querySelector('#ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
    @keyframes ripple {
      0% {
        width: 10px;
        height: 10px;
        opacity: 1;
      }
      100% {
        width: 80px;
        height: 80px;
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);
}


animateCursor();
drawTrail();


const interactiveElements = document.querySelectorAll('a, button, .card, .mirror-btn');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.borderWidth = '3px';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderWidth = '2px';
    });
});