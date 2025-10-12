const JSON_PATH = 'files/json/lastest.json';


const ICONS = {
    box: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>`,

    info: `<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>`,

    clock: `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`,

    search: `<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>`,

    lock: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>`,

    terminal: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>`
};


function createWriteupCard(writeup) {
    const card = document.createElement('div');
    card.className = 'card';

    const icon = ICONS[writeup.icon] || ICONS.box;

    card.innerHTML = `
    <div class="card-icon">
      <svg viewBox="0 0 24 24">
        ${icon}
      </svg>
    </div>
    <h3>${writeup.title}</h3>
    <p>${writeup.description}</p>
    <div class="card-tags">
      ${writeup.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  `;


    if (writeup.link && writeup.status !== 'coming_soon') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = writeup.link;
        });
    }

    return card;
}


function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'card';

    const icon = ICONS[blog.icon] || ICONS.search;

    card.innerHTML = `
    <div class="card-icon">
      <svg viewBox="0 0 24 24">
        ${icon}
      </svg>
    </div>
    <h3>${blog.title}</h3>
    <p>${blog.description}</p>
    <div class="card-tags">
      ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  `;

    if (blog.link && blog.status !== 'coming_soon') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = blog.link;
        });
    }

    return card;
}

async function loadContent() {
    try {
        const response = await fetch(JSON_PATH);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Renderizar writeups
        const writeupsContainer = document.querySelector('#writeups .grid');
        if (writeupsContainer && data.writeups) {
            writeupsContainer.innerHTML = '';
            data.writeups.forEach(writeup => {
                writeupsContainer.appendChild(createWriteupCard(writeup));
            });
        }

        // Renderizar blogs
        const blogsContainer = document.querySelector('#blog .grid');
        if (blogsContainer && data.blogs) {
            blogsContainer.innerHTML = '';
            data.blogs.forEach(blog => {
                blogsContainer.appendChild(createBlogCard(blog));
            });
        }

    } catch (error) {
        console.error('Error cargando el contenido:', error);

    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}