// Pool de Pokémon populares para o jogo (seleção de Pokémon icônicos)
const MEMORY_POKEMON_POOL = [
    1, 4, 7, 25, 39, 52, 54, 63, 92, 94, 104, 113, 129, 131, 133, 143, 147, 150, 151,
    152, 155, 158, 172, 175, 196, 197, 225, 243, 244, 249, 250,
    252, 255, 258, 280, 302, 303, 333, 359, 380, 381, 384,
    390, 393, 417, 447, 448, 470, 471, 475, 479, 483, 484,
    495, 498, 501, 570, 592, 633, 643, 644,
    650, 653, 656, 700, 702, 716, 717,
    722, 725, 728, 741, 778, 785, 791, 792,
    810, 813, 816, 845, 877, 888, 889
];

// Game State
let gameState = {
    difficulty: 'easy',
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: 0,
    timerInterval: null,
    isProcessing: false,
    totalPairs: 6
};

// Difficulty settings
const difficultySettings = {
    easy: { pairs: 6, gridClass: 'easy' },      // 3x4 = 12 cards
    medium: { pairs: 8, gridClass: 'medium' },  // 4x4 = 16 cards
    hard: { pairs: 18, gridClass: 'hard' }      // 6x6 = 36 cards
};

// DOM Elements
const memoryGrid = document.getElementById('memoryGrid');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const pairsElement = document.getElementById('pairs');
const totalPairsElement = document.getElementById('totalPairs');
const gameArea = document.getElementById('gameArea');
const gameOverArea = document.getElementById('gameOverArea');
const finalTimeElement = document.getElementById('finalTime');
const finalMovesElement = document.getElementById('finalMoves');
const newGameBtn = document.getElementById('newGameBtn');

// Difficulty buttons
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Set difficulty and restart
        gameState.difficulty = btn.dataset.difficulty;
        initGame();
    });
});

// New game button
newGameBtn.addEventListener('click', () => initGame());

// Initialize game
function initGame() {
    console.log('Inicializando Jogo da Memória...');
    
    // Reset game state
    gameState.moves = 0;
    gameState.matchedPairs = 0;
    gameState.flippedCards = [];
    gameState.isProcessing = false;
    gameState.timer = 0;
    
    // Stop previous timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Get difficulty settings
    const settings = difficultySettings[gameState.difficulty];
    gameState.totalPairs = settings.pairs;
    
    // Update UI
    movesElement.textContent = '0';
    pairsElement.textContent = '0';
    totalPairsElement.textContent = settings.pairs;
    timerElement.textContent = '0:00';
    memoryGrid.className = `memory-grid ${settings.gridClass}`;
    gameOverArea.classList.remove('show');
    
    // Generate cards
    generateCards(settings.pairs);
    
    // Start timer
    startTimer();
}

// Generate cards
function generateCards(pairs) {
    // Select random Pokémon
    const shuffledPool = [...MEMORY_POKEMON_POOL].sort(() => Math.random() - 0.5);
    const selectedPokemon = shuffledPool.slice(0, pairs);
    
    // Create pairs
    const cardPairs = [...selectedPokemon, ...selectedPokemon];
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    // Store cards data
    gameState.cards = shuffledCards.map((pokemonId, index) => ({
        id: index,
        pokemonId: pokemonId,
        isFlipped: false,
        isMatched: false
    }));
    
    // Render cards
    renderCards();
}

// Render cards
function renderCards() {
    memoryGrid.innerHTML = '';
    
    gameState.cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        memoryGrid.appendChild(cardElement);
    });
}

// Create card element
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'memory-card';
    cardDiv.dataset.index = index;
    
    // Front face (hidden)
    const frontFace = document.createElement('div');
    frontFace.className = 'card-face card-front';
    frontFace.innerHTML = '?';
    
    // Back face (Pokémon image)
    const backFace = document.createElement('div');
    backFace.className = 'card-face card-back';
    backFace.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.pokemonId}.png" 
             alt="Pokemon ${card.pokemonId}"
             loading="lazy">
    `;
    
    cardDiv.appendChild(frontFace);
    cardDiv.appendChild(backFace);
    
    // Add click handler
    cardDiv.addEventListener('click', () => handleCardClick(index));
    
    return cardDiv;
}

// Handle card click
function handleCardClick(index) {
    // Prevent actions if processing or card already flipped/matched
    if (gameState.isProcessing) return;
    
    const card = gameState.cards[index];
    if (card.isFlipped || card.isMatched) return;
    
    // Flip card
    flipCard(index, true);
    gameState.flippedCards.push(index);
    
    // Check if two cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        movesElement.textContent = gameState.moves;
        gameState.isProcessing = true;
        
        setTimeout(() => checkMatch(), 800);
    }
}

// Flip card
function flipCard(index, flip) {
    const card = gameState.cards[index];
    const cardElement = memoryGrid.children[index];
    
    if (flip) {
        card.isFlipped = true;
        cardElement.classList.add('flipped');
    } else {
        card.isFlipped = false;
        cardElement.classList.remove('flipped');
    }
}

// Check if cards match
function checkMatch() {
    const [index1, index2] = gameState.flippedCards;
    const card1 = gameState.cards[index1];
    const card2 = gameState.cards[index2];
    
    if (card1.pokemonId === card2.pokemonId) {
        // Match found!
        card1.isMatched = true;
        card2.isMatched = true;
        
        memoryGrid.children[index1].classList.add('matched');
        memoryGrid.children[index2].classList.add('matched');
        
        gameState.matchedPairs++;
        pairsElement.textContent = gameState.matchedPairs;
        
        // Check if game is complete
        if (gameState.matchedPairs === gameState.totalPairs) {
            setTimeout(() => endGame(), 500);
        }
    } else {
        // No match, flip back
        setTimeout(() => {
            flipCard(index1, false);
            flipCard(index2, false);
        }, 400);
    }
    
    // Reset flipped cards
    gameState.flippedCards = [];
    gameState.isProcessing = false;
}

// Start timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateTimerDisplay();
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// End game
function endGame() {
    // Stop timer
    clearInterval(gameState.timerInterval);
    
    // Update final stats
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    finalTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    finalMovesElement.textContent = gameState.moves;
    
    // Calculate performance (lower is better)
    const optimalMoves = gameState.totalPairs; // Optimal would be totalPairs moves
    const efficiency = Math.max(0, Math.min(100, Math.round((optimalMoves / gameState.moves) * 100)));
    
    // Update statistics
    const won = efficiency >= 50; // Consider "won" if efficiency >= 50%
    updateGameStats('memory', won, 1);
    
    // Show game over screen
    gameOverArea.classList.add('show');
    
    console.log(`Jogo finalizado! Tempo: ${gameState.timer}s, Movimentos: ${gameState.moves}, Eficiência: ${efficiency}%`);
}

// Restart game
function restartGame() {
    gameOverArea.classList.remove('show');
    initGame();
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada, iniciando jogo...');
    initGame();
});
