// Matrix Effect
const canvas = document.querySelector('.matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);
const brightness = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        // Efecto de parpadeo aleatorio en cascada
        if (Math.random() > 0.98) {
            brightness[i] = Math.random() * 0.5 + 0.5; // Entre 0.5 y 1
        } else {
            brightness[i] = Math.max(0.3, brightness[i] - 0.03); // Fade suave
        }

        // Color cyan con opacidad variable
        const alpha = brightness[i];
        ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`;

        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Typing Effect for Command Line
const commandLine = document.querySelector('.command-line');
let isTyping = false;

commandLine.addEventListener('mouseenter', () => {
    if (!isTyping) {
        isTyping = true;
        setTimeout(() => {
            commandLine.innerHTML += '<br><span style="color: #ff0000;">[ALERT] Intrusion detected!</span>';
        }, 1000);
    }
});