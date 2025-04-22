// ========================================
//  Configurações da API – ATUALIZADO
// ========================================
const API_ENDPOINTS = {
    posts: 'https://back-spider.vercel.app/publicacoes/listarPublicacoes',
    like: (postId) =>
      `https://back-spider.vercel.app/publicacoes/likePublicacao/${postId}`,
  };
  
  // ========================================
  //  Estado da aplicação
  // ========================================
  const appState = {
    posts: [],
    currentUser: { id: 1 }, // Usuário fictício (substitua quando tiver autenticação)
  };
  
  // ========================================
  //  NOVA VERSÃO  🔥  toggleLikeOnAPI
  //  – loga a resposta e devolve a mensagem
  // ========================================
  async function toggleLikeOnAPI(postId) {
    try {
      const response = await fetch(API_ENDPOINTS.like(postId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUser: appState.currentUser.id, // ⇐ verifique o field esperado pela API
        }),
      });
  
      // Lê o corpo para depuração (pode vir JSON ou texto)
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
  
      console.log('Resposta da API:', response.status, data);
  
      if (!response.ok) {
        // mostra a mensagem da API, se existir
        const msg =
          (typeof data === 'object' && data?.message) || data || 'Erro desconhecido';
        throw new Error(msg);
      }
  
      return data; // sucesso
    } catch (error) {
      console.error('Erro ao atualizar like:', error);
      throw error;
    }
  }
  
  // ========================================
  //  Inicialização
  // ========================================
  async function initApp() {
    try {
      showLoading(true);
      const postsData = await fetchPosts();
      appState.posts = processPostsData(postsData);
      renderPosts();
      setupEventListeners(); // adiciona listeners globais (delegação)
    } catch (error) {
      showError('Erro ao carregar posts: ' + error.message);
    } finally {
      showLoading(false);
    }
  }
  
  // ========================================
  //  Listeners (delegação)
  // ========================================
  function setupEventListeners() {
    document.addEventListener('click', async (e) => {
      // ------- LIKE -------
      if (e.target.closest('.like-button')) {
        const button = e.target.closest('.like-button');
        const postId = parseInt(button.closest('.post').dataset.postId);
        const post = appState.posts.find((p) => p.id === postId);
  
        // Salva estado anterior
        const prev = { liked: post.isLiked, count: post.likes.count };
  
        // Atualização otimista
        post.isLiked = !post.isLiked;
        post.likes.count += post.isLiked ? 1 : -1;
        updateLikeUI(button, post);
  
        try {
          await toggleLikeOnAPI(postId);
          // Atualiza lista de usuários local
          if (post.isLiked) post.likes.users.push(appState.currentUser.id);
          else post.likes.users = post.likes.users.filter((id) => id !== appState.currentUser.id);
        } catch (err) {
          // Reverte em caso de falha
          post.isLiked = prev.liked;
          post.likes.count = prev.count;
          updateLikeUI(button, post);
          showError('Não foi possível atualizar o like. Detalhe: ' + err.message);
        }
      }
  
      // ------- SAVE -------
      if (e.target.closest('.save-button')) {
        const button = e.target.closest('.save-button');
        const postId = parseInt(button.closest('.post').dataset.postId);
        const post = appState.posts.find((p) => p.id === postId);
  
        post.isSaved = !post.isSaved;
        const icon = button.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        button.classList.toggle('saved');
      }
  
      // ------- COMMENT -------
      if (e.target.classList.contains('comment-submit')) {
        const input = e.target.previousElementSibling;
        const text = input.value.trim();
        if (!text) return;
  
        const postId = parseInt(input.closest('.post').dataset.postId);
        const post = appState.posts.find((p) => p.id === postId);
  
        post.comments.unshift({
          id: Date.now(),
          userId: appState.currentUser.id,
          text,
          username: `user_${appState.currentUser.id}`,
        });
  
        input.value = '';
        e.target.disabled = true;
        renderPosts();
      }
    });
  
    // Habilita / desabilita botão de comentar
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('comment-input')) {
        e.target.nextElementSibling.disabled = !e.target.value.trim();
      }
    });
  
    // Submit pelo Enter
    document.addEventListener('keypress', (e) => {
      if (
        e.target.classList.contains('comment-input') &&
        e.key === 'Enter' &&
        e.target.value.trim()
      ) {
        e.preventDefault();
        e.target.nextElementSibling.click();
      }
    });
  }
  
  // ========================================
  //  Helpers de UI
  // ========================================
  function updateLikeUI(button, post) {
    const icon = button.querySelector('i');
    button.classList.toggle('liked', post.isLiked);
    icon.classList.toggle('far', !post.isLiked);
    icon.classList.toggle('fas', post.isLiked);
    button
      .closest('.post')
      .querySelector('.post-likes').textContent = `${formatNumber(post.likes.count)} curtidas`;
  }
  
  // ========================================
  //  Fetch posts + processamento
  // ========================================
  async function fetchPosts() {
    const response = await fetch(API_ENDPOINTS.posts);
    if (!response.ok) throw new Error('Falha ao carregar posts');
    return await response.json();
  }
  
  function processPostsData(postsData) {
    return postsData.map((post) => ({
      id: post.id,
      userId: post.idUsuario,
      username: `user_${post.idUsuario}`,
      userAvatar: `https://randomuser.me/api/portraits/${
        post.idUsuario % 2 === 0 ? 'women' : 'men'
      }/${post.idUsuario % 50}.jpg`,
      description: post.descricao,
      image: post.imagem,
      location: post.local,
      publishDate: post.dataPublicacao,
      likes: {
        count: post.curtidas?.length || 0,
        users: post.curtidas?.map((l) => l.idUsuario) || [],
      },
      comments:
        post.comentarios?.map((c) => ({
          id: c.id,
          userId: c.idUsuario,
          text: c.descricao,
          username: `user_${c.idUsuario}`,
        })) || [],
      timeAgo: formatTimeAgo(post.dataPublicacao),
      isLiked: post.curtidas?.some((l) => l.idUsuario === appState.currentUser.id) || false,
      isSaved: false,
    }));
  }
  
  // ========================================
  //  Utilidades
  // ========================================
  function formatTimeAgo(dateString) {
    const now = new Date();
    const pubDate = new Date(dateString.split('/').reverse().join('-'));
    const diffH = Math.floor((now - pubDate) / (1000 * 60 * 60));
    if (diffH < 24) return `HÁ ${diffH} HORAS`;
    const diffD = Math.floor(diffH / 24);
    return `HÁ ${diffD} DIAS`;
  }
  
  function formatNumber(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n;
  }
  
  function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) loader.style.display = show ? 'block' : 'none';
  }
  
  function showError(msg) {
    console.error(msg);
    alert(msg);
  }
  
  // ========================================
  //  Render de posts
  // ========================================
  function renderPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = appState.posts
      .map(
        (post) => `
      <div class="post" data-post-id="${post.id}">
        <div class="post-header">
          <div class="post-avatar">
            <img src="${post.userAvatar}" alt="${post.username}">
          </div>
          <div class="post-user-info">
            <span class="post-username">${post.username}</span>
            ${
              post.location
                ? `<span class="post-location">${post.location}</span>`
                : ''
            }
          </div>
          <button class="post-more" aria-label="Mais opções">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
  
        <div class="post-content">
          ${
            post.image
              ? `<div class="post-image-container">
                   <img src="${post.image}" alt="Post" class="post-image" loading="lazy">
                 </div>`
              : ''
          }
          <p class="post-text">${post.description}</p>
        </div>
  
        <div class="post-actions">
          <button class="like-button ${post.isLiked ? 'liked' : ''}" aria-label="Curtir publicação">
            <i class="${post.isLiked ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <button class="comment-button" aria-label="Comentar">
            <i class="far fa-comment"></i>
          </button>
          <button class="share-button" aria-label="Compartilhar">
            <i class="far fa-paper-plane"></i>
          </button>
          <button class="save-button ${post.isSaved ? 'saved' : ''}" aria-label="Salvar">
            <i class="${post.isSaved ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
        </div>
  
        <div class="post-stats">
          <div class="post-likes">${formatNumber(post.likes.count)} curtidas</div>
          ${
            post.comments.length > 0
              ? `<div class="post-comments-preview">
                   <span class="comment-username">${post.comments[0].username}</span>
                   <span class="comment-text">${post.comments[0].text}</span>
                 </div>`
              : ''
          }
          ${
            post.comments.length > 1
              ? `<div class="post-view-comments">
                   Ver todos os ${post.comments.length} comentários
                 </div>`
              : ''
          }
        </div>
  
        <div class="post-time">${post.timeAgo}</div>
  
        <div class="post-add-comment">
          <input type="text" placeholder="Adicione um comentário..." class="comment-input">
          <button class="comment-submit" disabled>Publicar</button>
        </div>
      </div>
    `
      )
      .join('');
  }
  
  // ========================================
  //  Bootstrap
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  
    // Estilos injetados
    const style = document.createElement('style');
    style.textContent = `
      .post { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; padding: 12px; background: #fff; }
      .post-image { width: 100%; max-height: 600px; object-fit: cover; border-radius: 4px; }
      .post-image-container { margin: 12px -12px; }
      .liked i { color: #ed4956; }
      .saved i { color: #262626; }
      .post-actions button { margin-right: 15px; font-size: 24px; background: none; border: none; cursor: pointer; }
      .comment-input { flex: 1; border: none; outline: none; }
      .comment-submit { color: #0095f6; font-weight: bold; background: none; border: none; cursor: pointer; }
      .comment-submit:disabled { opacity: 0.5; cursor: default; }
    `;
    document.head.appendChild(style);
  });
  