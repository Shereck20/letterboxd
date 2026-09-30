const API = '/api';
const state = {
  titles: [],
  reviews: [],
  currentUser: JSON.parse(localStorage.getItem('letterboxd_user') || 'null'),
  currentView: 'home',
  selectedRating: 0
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
}

function posterStyle(id) {
  const gradients = [
    'linear-gradient(145deg,#26384a,#8f2d56 55%,#111820)',
    'linear-gradient(145deg,#172b24,#9d6b2f 55%,#111820)',
    'linear-gradient(145deg,#33214b,#d24b35 55%,#111820)',
    'linear-gradient(145deg,#143d4c,#a22e6f 55%,#111820)',
    'linear-gradient(145deg,#3b2020,#b38a35 55%,#111820)',
    'linear-gradient(145deg,#1f2937,#3b82f6 55%,#111820)'
  ];
  return gradients[(Number(id) || 1) % gradients.length];
}

function stars(value = 0) {
  const rounded = Math.round(Number(value));
  return `<span class="rating">${'★'.repeat(Math.min(5, rounded))}${'☆'.repeat(Math.max(0, 5 - rounded))}</span>`;
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.erro || 'Não foi possível concluir a operação.');
  return data;
}

function navigate(view) {
  state.currentView = view;
  $$('.view').forEach(el => el.classList.add('hidden'));
  $(`#${view}View`).classList.remove('hidden');
  $$('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.nav === view));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'films') renderTitles();
  if (view === 'reviews') renderReviews();
}

function updateAuthArea() {
  const area = $('#authArea');
  if (state.currentUser) {
    area.innerHTML = `
      <button id="profileBtn" class="hidden sm:block text-slate-300 hover:text-white">${escapeHtml(state.currentUser.nome)}</button>
      <button id="logoutBtn" class="btn-secondary !py-2 !px-3">Sair</button>`;
    $('#logoutBtn').onclick = () => {
      localStorage.removeItem('letterboxd_user');
      state.currentUser = null;
      updateAuthArea();
      showToast('Você saiu da conta.');
    };
  } else {
    area.innerHTML = `<button id="loginBtn" class="btn-secondary !py-2 !px-3">Entrar</button>`;
    $('#loginBtn').onclick = openLoginModal;
  }
}

function titleCard(title) {
  return `
    <article class="poster-card">
      <button class="poster w-full text-left" data-title-id="${title.id_titulo}" aria-label="Abrir ${escapeHtml(title.nome)}">
        <div class="poster-art" style="background:${posterStyle(title.id_titulo)}">
          <span class="poster-type">${escapeHtml(title.tipo)}</span>
          <span class="poster-title">${escapeHtml(title.nome)}</span>
        </div>
      </button>
      <div class="poster-meta">
        <div class="poster-name" title="${escapeHtml(title.nome)}">${escapeHtml(title.nome)}</div>
        <div class="poster-sub">${escapeHtml(title.genero)} · ${title.ano_lancamento}</div>
      </div>
    </article>`;
}

function bindTitleCards(container) {
  container.querySelectorAll('[data-title-id]').forEach(btn => {
    btn.onclick = () => openTitleModal(btn.dataset.titleId);
  });
}

async function loadTitles() {
  try {
    state.titles = await api('/titulos');
    populateGenres();
    renderHome();
    renderTitles();
  } catch (error) {
    $('#homeGrid').innerHTML = `<div class="empty">Não foi possível carregar o catálogo. Verifique se o backend e o PostgreSQL estão funcionando.</div>`;
  }
}

async function loadReviews() {
  try {
    state.reviews = await api('/avaliacoes');
    renderHomeReviews();
    renderReviews();
  } catch (error) {
    $('#homeReviews').innerHTML = `<div class="empty">Não foi possível carregar as avaliações.</div>`;
  }
}

function renderHome() {
  const grid = $('#homeGrid');
  const titles = state.titles.slice(0, 6);
  grid.innerHTML = titles.length ? titles.map(titleCard).join('') : `<div class="empty">Nenhum título cadastrado.</div>`;
  bindTitleCards(grid);
}

function renderTitles() {
  const search = ($('#titleSearch')?.value || '').trim().toLowerCase();
  const type = $('#typeFilter')?.value || '';
  const genre = $('#genreFilter')?.value || '';
  const filtered = state.titles.filter(title => {
    const matchesSearch = !search || title.nome.toLowerCase().includes(search);
    const matchesType = !type || title.tipo === type;
    const matchesGenre = !genre || title.genero === genre;
    return matchesSearch && matchesType && matchesGenre;
  });
  const grid = $('#filmsGrid');
  grid.innerHTML = filtered.length ? filtered.map(titleCard).join('') : `<div class="empty">Nenhum título encontrado.</div>`;
  bindTitleCards(grid);
}

function populateGenres() {
  const select = $('#genreFilter');
  const genres = [...new Set(state.titles.map(t => t.genero).filter(Boolean))].sort();
  const selected = select.value;
  select.innerHTML = '<option value="">Todos os gêneros</option>' + genres.map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');
  select.value = selected;
}

function renderHomeReviews() {
  const reviews = state.reviews.slice(0, 6);
  $('#homeReviews').innerHTML = reviews.length ? reviews.map(reviewCard).join('') : `<div class="empty">Ainda não há avaliações.</div>`;
}

function reviewCard(review) {
  return `<article class="review-card">
    <div class="flex items-center justify-between gap-3">
      <div><span class="review-user">${escapeHtml(review.usuario)}</span><div class="review-title">avaliou <strong>${escapeHtml(review.titulo)}</strong></div></div>
      <div class="text-right">${stars(review.nota)}<div class="rating-number">${review.nota}/5</div></div>
    </div>
    <p class="review-comment">${escapeHtml(review.comentario || 'Sem comentário.')}</p>
    <div class="text-xs text-slate-500 mt-3">${formatDate(review.data_avaliacao)}</div>
  </article>`;
}

function renderReviews() {
  const list = $('#reviewsList');
  list.innerHTML = state.reviews.length ? state.reviews.map(reviewCard).join('') : `<div class="empty">Ainda não há avaliações.</div>`;
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('pt-BR');
}

async function openTitleModal(id) {
  const title = state.titles.find(t => String(t.id_titulo) === String(id));
  if (!title) return;
  const modal = $('#modal');
  const content = $('#modalContent');
  content.innerHTML = `<button class="close" data-close-modal>×</button><div class="detail"><div class="detail-poster"><div class="poster-art h-full" style="background:${posterStyle(title.id_titulo)}"><span class="poster-type">${escapeHtml(title.tipo)}</span><span class="poster-title">${escapeHtml(title.nome)}</span></div></div><div><p class="eyebrow">${escapeHtml(title.tipo)} · ${title.ano_lancamento}</p><h3>${escapeHtml(title.nome)}</h3><p class="detail-muted">${escapeHtml(title.genero)}</p><div id="titleMedia" class="mt-4">Carregando avaliação...</div><p class="mt-5 text-slate-300 leading-7">${escapeHtml(title.sinopse || 'Sem sinopse cadastrada.')}</p><div class="mt-6 flex gap-3 flex-wrap"><button id="rateTitleBtn" class="btn-primary">Avaliar</button>${state.currentUser ? '' : '<span class="text-sm text-slate-500 self-center">Entre para enviar uma avaliação.</span>'}</div><div class="mt-8"><h4 class="font-black text-lg">Avaliações</h4><div id="titleReviews" class="mt-2">Carregando...</div></div></div></div>`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  $('#rateTitleBtn').onclick = () => openReviewModal(title);
  content.querySelectorAll('[data-close-modal]').forEach(el => el.onclick = closeModal);
  try {
    const [media, reviews] = await Promise.all([api(`/titulos/${id}/media`), api(`/titulos/${id}/avaliacoes`)]);
    $('#titleMedia').innerHTML = `<div class="flex items-center gap-3">${stars(media.media)} <strong class="text-2xl">${media.media}</strong><span class="detail-muted">${media.quantidade_avaliacoes} avaliação(ões)</span></div>`;
    $('#titleReviews').innerHTML = reviews.length ? reviews.map(r => `<div class="review-row"><div class="flex justify-between gap-3"><strong>${escapeHtml(r.usuario)}</strong><span>${stars(r.nota)}</span></div><p class="text-slate-300 mt-2">${escapeHtml(r.comentario || '')}</p><div class="text-xs text-slate-500 mt-2">${formatDate(r.data_avaliacao)}</div></div>`).join('') : '<p class="detail-muted py-4">Ainda não há avaliações para este título.</p>';
  } catch (error) {
    $('#titleMedia').textContent = 'Não foi possível carregar as avaliações.';
  }
}

function closeModal() {
  $('#modal').classList.add('hidden');
  $('#modal').setAttribute('aria-hidden', 'true');
}

function openLoginModal() {
  const content = $('#modalContent');
  content.innerHTML = `<button class="close" data-close-modal>×</button><div class="form"><p class="eyebrow">Letterboxd</p><h3>Entrar</h3><label class="label">E-mail</label><input id="loginEmail" class="input" type="email" placeholder="voce@email.com"><label class="label">Senha</label><input id="loginPassword" class="input" type="password" placeholder="••••••••"><div class="flex gap-3 mt-6"><button id="loginSubmit" class="btn-primary">Entrar</button><button id="registerSwitch" class="btn-secondary">Criar conta</button></div><p id="loginHint" class="text-sm text-slate-500 mt-4">A autenticação usa os usuários cadastrados no PostgreSQL.</p></div>`;
  $('#modal').classList.remove('hidden');
  content.querySelector('[data-close-modal]').onclick = closeModal;
  $('#loginSubmit').onclick = login;
  $('#registerSwitch').onclick = openRegisterModal;
}

function openRegisterModal() {
  const content = $('#modalContent');
  content.innerHTML = `<button class="close" data-close-modal>×</button><div class="form"><p class="eyebrow">Letterboxd</p><h3>Criar conta</h3><label class="label">Nome</label><input id="registerName" class="input" placeholder="Seu nome"><label class="label">E-mail</label><input id="registerEmail" class="input" type="email" placeholder="voce@email.com"><label class="label">Senha</label><input id="registerPassword" class="input" type="password" placeholder="••••••••"><div class="flex gap-3 mt-6"><button id="registerSubmit" class="btn-primary">Cadastrar</button><button id="loginSwitch" class="btn-secondary">Já tenho conta</button></div></div>`;
  $('#modal').classList.remove('hidden');
  content.querySelector('[data-close-modal]').onclick = closeModal;
  $('#registerSubmit').onclick = register;
  $('#loginSwitch').onclick = openLoginModal;
}

async function register() {
  const nome = $('#registerName').value.trim();
  const email = $('#registerEmail').value.trim();
  const senha = $('#registerPassword').value;
  if (!nome || !email || !senha) return showToast('Preencha todos os campos.');
  try {
    const user = await api('/usuarios', { method:'POST', body:JSON.stringify({ nome, email, senha }) });
    state.currentUser = user;
    localStorage.setItem('letterboxd_user', JSON.stringify(user));
    updateAuthArea(); closeModal(); showToast(`Conta criada. Olá, ${user.nome}!`);
  } catch (error) { showToast(error.message); }
}

async function login() {
  const email = $('#loginEmail').value.trim();
  const senha = $('#loginPassword').value;
  if (!email || !senha) return showToast('Informe e-mail e senha.');
  try {
    const user = await api('/login', { method:'POST', body:JSON.stringify({ email, senha }) });
    state.currentUser = user;
    localStorage.setItem('letterboxd_user', JSON.stringify(user));
    updateAuthArea(); closeModal(); showToast(`Bem-vindo, ${user.nome}!`);
  } catch (error) { showToast(error.message); }
}

function openReviewModal(title) {
  if (!state.currentUser) return openLoginModal();
  state.selectedRating = 0;
  const content = $('#modalContent');
  content.innerHTML = `<button class="close" data-close-modal>×</button><div class="form"><p class="eyebrow">Sua opinião</p><h3>Avaliar ${escapeHtml(title.nome)}</h3><label class="label">Nota</label><div id="starPicker" class="star-picker">${[1,2,3,4,5].map(n => `<button class="star-btn" data-rating="${n}">★</button>`).join('')}</div><label class="label">Comentário</label><textarea id="reviewComment" class="textarea" placeholder="Conte o que você achou..."></textarea><button id="submitReview" class="btn-primary mt-5">Publicar avaliação</button></div>`;
  content.querySelector('[data-close-modal]').onclick = closeModal;
  $$('#starPicker .star-btn').forEach(btn => btn.onclick = () => { state.selectedRating = Number(btn.dataset.rating); $$('#starPicker .star-btn').forEach(b => b.classList.toggle('selected', Number(b.dataset.rating) <= state.selectedRating)); });
  $('#submitReview').onclick = () => submitReview(title.id_titulo);
}

async function submitReview(idTitulo) {
  if (!state.selectedRating) return showToast('Escolha uma nota de 1 a 5.');
  const comentario = $('#reviewComment').value.trim();
  try {
    await api('/avaliacoes', { method:'POST', body:JSON.stringify({ nota:state.selectedRating, comentario, id_titulo:idTitulo, id_usuario:state.currentUser.id_usuario }) });
    closeModal(); await loadReviews(); showToast('Avaliação publicada!');
    openTitleModal(idTitulo);
  } catch (error) { showToast(error.message); }
}

async function init() {
  updateAuthArea();
  await Promise.all([loadTitles(), loadReviews()]);
}

$$('[data-nav]').forEach(btn => btn.onclick = () => navigate(btn.dataset.nav));
$('#brandBtn').onclick = () => navigate('home');
$('#heroLogin').onclick = () => state.currentUser ? navigate('films') : openLoginModal();
$('#globalSearch').addEventListener('input', e => {
  $('#titleSearch').value = e.target.value;
  navigate('films');
  renderTitles();
});
$('#titleSearch').addEventListener('input', renderTitles);
$('#typeFilter').addEventListener('change', renderTitles);
$('#genreFilter').addEventListener('change', renderTitles);
$('#modal').addEventListener('click', e => { if (e.target.matches('[data-close-modal]')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

init();
