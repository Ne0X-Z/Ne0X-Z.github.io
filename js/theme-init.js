// theme-init.js - Aplicar tema guardado en todas las páginas
// Incluir este script en TODAS las páginas del sitio (about.html, etc.)

(function () {
    // Función para actualizar color del scrollbar dinámicamente
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

    // Aplicar tema inmediatamente para evitar flash
    const storedTheme = sessionStorage.getItem('selectedTheme');

    if (storedTheme) {
        if (storedTheme === 'red') {
            document.documentElement.classList.add('red-theme');
            document.body.classList.add('red-theme');
            updateScrollbarColor('#cc4444', 'rgba(204, 68, 68, 0.3)');
        } else if (storedTheme === 'blue') {
            document.documentElement.classList.add('blue-theme');
            document.body.classList.add('blue-theme');
            updateScrollbarColor('#4488cc', 'rgba(68, 136, 204, 0.3)');
        }
    } else {
        // Tema por defecto (cyan)
        updateScrollbarColor('#00d9ff', 'rgba(0, 217, 255, 0.3)');
    }

    // Función para redirigir si no hay tema seleccionado (opcional)
    window.requireThemeSelection = function () {
        if (!sessionStorage.getItem('selectedTheme')) {
            // Redirigir al index si no hay tema seleccionado
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    };


    window.switchTheme = function (theme) {
        sessionStorage.setItem('selectedTheme', theme);

        document.body.classList.remove('red-theme', 'blue-theme');

        if (theme === 'red') {
            document.body.classList.add('red-theme');
            updateScrollbarColor('#cc4444', 'rgba(204, 68, 68, 0.3)');
        } else if (theme === 'blue') {
            document.body.classList.add('blue-theme');
            updateScrollbarColor('#4488cc', 'rgba(68, 136, 204, 0.3)');
        }
    };


    window.resetTheme = function () {
        sessionStorage.removeItem('selectedTheme');
        document.body.classList.remove('red-theme', 'blue-theme');
        updateScrollbarColor('#00d9ff', 'rgba(0, 217, 255, 0.3)');
        window.location.href = 'index.html';
    };
})();