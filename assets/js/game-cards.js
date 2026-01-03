// TCGdex API Configuration
const TCGDEX_API_BASE = 'https://api.tcgdex.net/v2/en';

// Game State
let gameState = {
    currentPage: 1,
    itemsPerPage: 50,
    totalPages: 1,
    totalCardsEstimate: 0,
    searchQuery: '',
    categoryFilter: '',
    typeFilter: '',
    rarityFilter: '',
    allCards: [],
    loading: false
};

let searchDebounceTimer = null;
let searchInput, categoryFilter, typeFilter, rarityFilter, searchBtn, cardsContainer, loadingArea, noResults;
let pagination, prevBtn, nextBtn, currentPageEl, totalPagesEl;
let cardModal, closeModal, modalContent;

const TYPE_TRANSLATIONS = {
    'Colorless': 'Normal',
    'Fire': 'Fogo',
    'Water': 'Água',
    'Lightning': 'Elétrico',
    'Grass': 'Planta',
    'Psychic': 'Psíquico',
    'Fighting': 'Lutador',
    'Darkness': 'Sombrio',
    'Metal': 'Metálico',
    'Dragon': 'Dragão',
    'Fairy': 'Fada'
};

async function initGame() {
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    typeFilter = document.getElementById('typeFilter');
    rarityFilter = document.getElementById('rarityFilter');
    searchBtn = document.getElementById('searchBtn');
    cardsContainer = document.getElementById('cardsContainer');
    loadingArea = document.getElementById('loadingArea');
    noResults = document.getElementById('noResults');
    pagination = document.getElementById('pagination');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    currentPageEl = document.getElementById('currentPage');
    totalPagesEl = document.getElementById('totalPages');
    cardModal = document.getElementById('cardModal');
    closeModal = document.getElementById('closeModal');
    modalContent = document.getElementById('modalContent');
    
    searchBtn.addEventListener('click', handleSearch);
    
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(handleSearch, 500);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchDebounceTimer);
            handleSearch();
        }
    });
    
    categoryFilter.addEventListener('change', handleSearch);
    typeFilter.addEventListener('change', handleSearch);
    rarityFilter.addEventListener('change', handleSearch);
    
    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));
    
    closeModal.addEventListener('click', closeCardModal);
    cardModal.addEventListener('click', (e) => {
        if (e.target === cardModal) closeCardModal();
    });
    
    await loadCards();
}

async function loadCards() {
    if (gameState.loading) return;
    
    showLoading(true);
    gameState.loading = true;
    
    try {
        let url = `${TCGDEX_API_BASE}/cards`;
        const params = [];
        
        params.push(`pagination:page=${gameState.currentPage}`);
        params.push(`pagination:itemsPerPage=${gameState.itemsPerPage}`);
        
        if (gameState.searchQuery) {
            params.push(`name=${encodeURIComponent(gameState.searchQuery)}`);
        }
        
        if (gameState.categoryFilter) {
            params.push(`category=${encodeURIComponent(gameState.categoryFilter)}`);
        }
        
        if (gameState.typeFilter) {
            params.push(`types=${encodeURIComponent(gameState.typeFilter)}`);
        }
        
        if (gameState.rarityFilter) {
            params.push(`rarity=${encodeURIComponent(gameState.rarityFilter)}`);
        }
        
        params.push('sort:field=releaseDate');
        params.push('sort:order=DESC');
        
        const fullUrl = `${url}?${params.join('&')}`;
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const cards = await response.json();
        
        // Calculate total pages based on results and filters
        if (gameState.currentPage === 1) {
            // Recalculate total when starting from page 1 (new search/filter)
            if (cards.length === gameState.itemsPerPage) {
                // If full page, check if filters are applied
                const hasFilters = gameState.searchQuery || gameState.categoryFilter || gameState.typeFilter || gameState.rarityFilter;
                if (hasFilters) {
                    // With filters, estimate conservatively (could be 10-100 pages)
                    gameState.totalPages = 50;
                } else {
                    // Without filters, all cards (~20k cards = 400 pages)
                    gameState.totalPages = 400;
                }
            } else {
                // Less than full page = this is the only page
                gameState.totalPages = 1;
            }
        }
        
        // Update total if we reach the actual end
        if (cards.length < gameState.itemsPerPage) {
            gameState.totalPages = gameState.currentPage;
        }
        
        displayCards(cards);
        updatePagination();
        
        showLoading(false);
        gameState.loading = false;
        
    } catch (error) {
        console.error('Erro ao carregar cartas:', error);
        showError();
        gameState.loading = false;
    }
}

function displayCards(cards) {
    cardsContainer.innerHTML = '';
    
    // Filter out cards without images
    const validCards = cards.filter(card => card.image);
    
    if (validCards.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    validCards.forEach(card => {
        const cardElement = createCardElement(card);
        cardsContainer.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const li = document.createElement('li');
    li.className = 'pokemon-card loaded';
    
    const link = document.createElement('a');
    link.href = '#';
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openCardModal(card);
    });
    
    const cardImg = document.createElement('div');
    cardImg.className = 'card-img';
    
    const img = document.createElement('img');
    img.src = `${card.image}/high.webp`;
    img.alt = card.name || 'Carta Pokémon';
    img.loading = 'lazy';
    
    img.onerror = function() {
        this.onerror = null;
        this.src = `${card.image}/high.png`;
    };
    
    cardImg.appendChild(img);
    
    const cardName = document.createElement('div');
    cardName.className = 'card-name';
    
    const series = document.createElement('h5');
    series.className = 'series';
    series.textContent = card.name || 'Carta Desconhecida';
    
    const numberInSet = document.createElement('span');
    numberInSet.className = 'number-in-set';
    const em = document.createElement('em');
    em.textContent = card.localId || card.id || '';
    numberInSet.appendChild(em);
    
    const notch = document.createElement('span');
    notch.className = 'notch-bottom-center-small';
    
    cardName.appendChild(series);
    cardName.appendChild(numberInSet);
    cardName.appendChild(notch);
    
    link.appendChild(cardImg);
    link.appendChild(cardName);
    li.appendChild(link);
    
    return li;
}

async function openCardModal(cardBrief) {
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <p style="color: #2c3e50;">Carregando detalhes...</p>
        </div>
    `;
    cardModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    try {
        const response = await fetch(`${TCGDEX_API_BASE}/cards/${cardBrief.id}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes da carta');
        }
        
        const card = await response.json();
        
        const typesText = card.types ? card.types.map(t => TYPE_TRANSLATIONS[t] || t).join(' · ') : '';
        const hp = card.hp ? `<span style="color: #e74c3c; font-weight: 700;">HP ${card.hp}</span>` : '';
        const cardImageUrl = card.image ? `${card.image}/high.webp` : '';
        
        modalContent.innerHTML = `
            <div style="max-width: 700px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 2rem; border-radius: 1rem; margin-bottom: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
                    <img src="${cardImageUrl}" alt="${card.name}" style="width: 100%; height: auto; max-height: 600px; object-fit: contain;" onerror="this.onerror=null; this.src='${card.image}/high.png';">
                </div>
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h2 style="margin: 0; color: #2c3e50; font-size: 2rem;">${card.name}</h2>
                        ${hp}
                    </div>
                    <p style="color: #6c757d; font-size: 1rem; font-style: italic; margin: 0.5rem 0;">
                        ${card.localId ? `Nº ${card.localId}` : ''} ${card.rarity ? `· ${card.rarity}` : ''}
                    </p>
                    ${typesText ? `<p style="color: #2c3e50; font-weight: 600; margin: 1rem 0;">Tipo: ${typesText}</p>` : ''}
                    ${card.description ? `<p style="color: #555; font-style: italic; margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">${card.description}</p>` : ''}
                    ${card.set ? `
                        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #e9ecef;">
                            <p style="color: #7f8c8d; font-size: 0.9rem; margin: 0.25rem 0;"><strong>Coleção:</strong> ${card.set.name || ''}</p>
                            ${card.illustrator ? `<p style="color: #7f8c8d; font-size: 0.9rem; margin: 0.25rem 0;"><strong>Ilustrador:</strong> ${card.illustrator}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #e74c3c; margin-bottom: 1rem;">❌ Erro</h3>
                <p style="color: #666;">Não foi possível carregar os detalhes da carta.</p>
            </div>
        `;
    }
}

function closeCardModal() {
    cardModal.classList.remove('show');
    document.body.style.overflow = '';
}

function handleSearch() {
    gameState.searchQuery = searchInput.value.trim();
    gameState.categoryFilter = categoryFilter.value;
    gameState.typeFilter = typeFilter.value;
    gameState.rarityFilter = rarityFilter.value;
    gameState.currentPage = 1;
    gameState.totalPages = 1; // Reset total to recalculate
    loadCards();
}

function changePage(direction) {
    const newPage = gameState.currentPage + direction;
    if (newPage >= 1 && newPage <= gameState.totalPages) {
        gameState.currentPage = newPage;
        loadCards();
    }
}

function updatePagination() {
    if (!pagination) return;
    
    currentPageEl.textContent = gameState.currentPage;
    totalPagesEl.textContent = gameState.totalPages > 0 ? gameState.totalPages : '...';
    
    prevBtn.disabled = gameState.currentPage <= 1;
    nextBtn.disabled = gameState.currentPage >= gameState.totalPages;
    
    pagination.style.display = 'flex';
}

function showLoading(show) {
    if (!loadingArea || !cardsContainer) return;
    loadingArea.style.display = show ? 'block' : 'none';
    cardsContainer.style.display = show ? 'none' : 'grid';
}

function showNoResults() {
    if (!noResults || !cardsContainer) return;
    
    const noResultsTitle = document.getElementById('noResultsTitle');
    const noResultsText = document.getElementById('noResultsText');
    
    noResultsTitle.textContent = '😢 Nenhuma carta encontrada';
    noResultsText.textContent = 'Tente buscar por outro termo ou filtro';
    
    noResults.style.display = 'block';
    cardsContainer.style.display = 'none';
    pagination.style.display = 'none';
}

function hideNoResults() {
    if (!noResults || !cardsContainer) return;
    noResults.style.display = 'none';
    cardsContainer.style.display = 'grid';
}

function showError() {
    showLoading(false);
    cardsContainer.style.display = 'grid';
    cardsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; background: rgba(255,255,255,0.95); padding: 3rem; border-radius: 1rem; margin: 2rem; box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
            <h3 style="color: #f44336; margin-bottom: 1rem;">❌ Erro ao carregar cartas</h3>
            <p style="color: #666; margin-bottom: 2rem;">Não foi possível conectar à API TCGdex.</p>
            <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: #e74c3c; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 600;">
                🔄 Tentar Novamente
            </button>
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', initGame);
