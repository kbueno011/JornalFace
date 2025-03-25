
// Dados da aplicação
const appData = {
    stories: [
        { id: 1, username: "Vítor", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, username: "Michael", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { id: 3, username: "Michel", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { id: 4, username: "Ana", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { id: 5, username: "Julia", avatar: "https://randomuser.me/api/portraits/women/2.jpg" }
    ],
    
    posts: [
        {
            id: 1,
            username: "Vítor de Jesus",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            content: "<span class='highlight'>Este comprador</span>",
            likes: 1234,
            comments: 45,
            time: "HÁ 2 HORAS"
        },
        {
            id: 2,
            username: "Michael B. Jordan",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            content: "Jornada",
            likes: 8921,
            comments: 112,
            time: "HÁ 5 HORAS"
        },
        {
            id: 3,
            username: "Michel Jardim",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            content: "Neste dia quase teniaí existente!",
            likes: 567,
            comments: 23,
            time: "HÁ 1 DIA"
        },
        {
            id: 4,
            username: "Vítor de Jesus",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            content: "<span class='highlight'>Servei jovial</span>",
            likes: 890,
            comments: 34,
            time: "HÁ 1 DIA"
        },
        {
            id: 5,
            username: "O Soleir",
            avatar: "https://randomuser.me/api/portraits/men/33.jpg",
            content: "O Soleir é uma rede social que, embora não seja tão popular quanto gigantes como Instagram ou Facebook, é um exemplo de pleiteforma que se gostaria de outros aplicativos de compartilhamento de ideia e vídeos, com foco na criação e compartilhamento de conteúdo visual. Embora o nome ajudar não seja importante recomendá-lo glaciamente, ele pode ser referir a sedes sociais menores ou novas aplicativas com a mesma conexão.",
            likes: 2345,
            comments: 78,
            time: "HÁ 3 DIAS"
        }
    ],
    
    suggestions: [
        { id: 1, username: "amiga_artista", avatar: "https://randomuser.me/api/portraits/women/3.jpg", status: "Segue você" },
        { id: 2, username: "fotografo_pro", avatar: "https://randomuser.me/api/portraits/men/4.jpg", status: "Novo no Instagram" },
        { id: 3, username: "chef_de_cozinha", avatar: "https://randomuser.me/api/portraits/women/4.jpg", status: "Segue você" },
        { id: 4, username: "viajante_mundo", avatar: "https://randomuser.me/api/portraits/men/5.jpg", status: "Novo no Instagram" },
        { id: 5, username: "designer_graf", avatar: "https://randomuser.me/api/portraits/women/5.jpg", status: "Segue você" }
    ]
};

// Função para carregar stories
function loadStories() {
    const storiesContainer = document.getElementById('storiesContainer');
    storiesContainer.innerHTML = '';
    
    appData.stories.forEach(story => {
        const storyElement = document.createElement('div');
        storyElement.className = 'story';
        storyElement.innerHTML = `
            <div class="story-avatar">
                <div class="story-avatar-inner">
                    <img src="${story.avatar}" alt="${story.username}">
                </div>
            </div>
            <span class="story-username">${story.username}</span>
        `;
        storiesContainer.appendChild(storyElement);
    });
}

// Função para carregar posts
function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    
    appData.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">
                    <img src="${post.avatar}" alt="${post.username}">
                </div>
                <div class="post-username">${post.username}</div>
                <div class="post-more">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="post-content">
                <p class="post-text">${post.content}</p>
            </div>
            <div class="post-actions">
                <i class="far fa-heart"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
                <i class="far fa-bookmark save"></i>
            </div>
            <div class="post-likes">${formatNumber(post.likes)} curtidas</div>
            <div class="post-comments">Ver todos os ${post.comments} comentários</div>
            <div class="post-time">${post.time}</div>
            <div class="post-add-comment">
                <input type="text" placeholder="Adicione um comentário...">
                <button>Publicar</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Função para carregar sugestões
function loadSuggestions() {
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.innerHTML = '';
    
    appData.suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion';
        suggestionElement.innerHTML = `
            <div class="suggestion-avatar">
                <img src="${suggestion.avatar}" alt="${suggestion.username}">
            </div>
            <div class="suggestion-info">
                <div class="suggestion-username">${suggestion.username}</div>
                <div class="suggestion-status">${suggestion.status}</div>
            </div>
            <button class="follow-button">Seguir</button>
        `;
        suggestionsContainer.appendChild(suggestionElement);
    });
}

// Função para formatar números (1.000 → 1K)
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Função para adicionar eventos
function addEventListeners() {
    // Curtir posts
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-heart')) {
            e.target.classList.toggle('far');
            e.target.classList.toggle('fas');
            e.target.style.color = e.target.classList.contains('fas') ? '#ed4956' : '';
        }
        
        // Salvar posts
        if (e.target.classList.contains('save')) {
            e.target.classList.toggle('far');
            e.target.classList.toggle('fas');
        }
        
        // Seguir usuários
        if (e.target.classList.contains('follow-button')) {
            e.target.textContent = e.target.textContent === 'Seguir' ? 'Seguindo' : 'Seguir';
        }
    });
    
    // Adicionar comentário
    document.addEventListener('keypress', function(e) {
        if (e.target.tagName === 'INPUT' && e.target.parentElement.classList.contains('post-add-comment') && e.key === 'Enter') {
            const button = e.target.nextElementSibling;
            button.click();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' && e.target.parentElement.classList.contains('post-add-comment')) {
            const input = e.target.previousElementSibling;
            if (input.value.trim() !== '') {
                // Aqui você poderia adicionar o comentário ao post
                input.value = '';
            }
        }
    });
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    loadStories();
    loadPosts();
    loadSuggestions();
    addEventListeners();
});
