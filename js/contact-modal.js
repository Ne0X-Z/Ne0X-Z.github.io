document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.getElementById('closeModal');
    const overlay = modal.querySelector('.modal-overlay');

    // Open modal when clicking contact link
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // PGP card copy functionality
    const pgpCard = document.querySelector('.pgp-card');
    const notification = document.getElementById('notification');
    const notificationText = document.querySelector('.notification-text');

    function showNotification(message, isError = false) {
        notificationText.textContent = message;

        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    if (pgpCard) {
        pgpCard.addEventListener('click', async function (e) {
            e.preventDefault();

            try {
                const response = await fetch('../files/pgp-key.txt');

                if (!response.ok) {
                    throw new Error('No se pudo cargar la clave PGP');
                }

                const pgpPublicKey = await response.text();

                await navigator.clipboard.writeText(pgpPublicKey);

                showNotification('Clave PGP copiada al portapapeles');

            } catch (err) {
                showNotification('Error al copiar la clave', true);
                console.error('Error loading PGP key:', err);
            }
        });
    }
});