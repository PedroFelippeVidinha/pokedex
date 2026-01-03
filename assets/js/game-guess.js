// Game State
let gameState = {
    availablePokemonIds: [],
    pokemonCache: new Map(), // Cache de Pokémon já carregados
    currentPokemon: null,
    currentOptions: [],
    score: 0,
    currentRound: 1,
    maxRounds: 10,
    answered: false,
    preloadedPokemons: [] // Pool de Pokémon pré-carregados
};

// Lista de IDs de Pokémon - Todas as gerações (1-1025)
// Usando lazy loading: apenas 4 Pokémon são carregados por rodada para manter performance
const POKEMON_POOL = [
    // Geração 1 (Kanto) - 1 a 151
    1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 35, 36, 39, 40, 52, 53, 54, 55, 63, 64, 65, 66, 67, 68, 79, 80, 92, 93, 94, 104, 105, 108, 113, 115, 120, 121, 129, 130, 131, 133, 134, 135, 136, 137, 143, 144, 145, 146, 147, 148, 149, 150, 151,
    // Geração 2 (Johto) - 152 a 251
    152, 153, 154, 155, 156, 157, 158, 159, 160, 172, 173, 175, 176, 179, 180, 181, 183, 184, 185, 194, 195, 196, 197, 199, 201, 206, 208, 213, 214, 223, 224, 225, 228, 229, 231, 232, 235, 241, 243, 244, 245, 249, 250, 251,
    // Geração 3 (Hoenn) - 252 a 386
    252, 253, 254, 255, 256, 257, 258, 259, 260, 280, 281, 282, 302, 303, 304, 305, 306, 309, 310, 318, 319, 320, 321, 333, 334, 335, 336, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 359, 361, 362, 363, 364, 365, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
    // Geração 4 (Sinnoh) - 387 a 493
    387, 388, 389, 390, 391, 392, 393, 394, 395, 399, 400, 403, 404, 405, 417, 418, 419, 425, 426, 427, 428, 443, 444, 445, 446, 447, 448, 461, 470, 471, 472, 473, 474, 475, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
    // Geração 5 (Unova) - 494 a 649
    494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 506, 507, 508, 509, 510, 531, 550, 554, 555, 570, 571, 587, 592, 593, 607, 608, 609, 610, 611, 612, 621, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
    // Geração 6 (Kalos) - 650 a 721
    650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 667, 668, 674, 675, 676, 677, 678, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721,
    // Geração 7 (Alola) - 722 a 809
    722, 723, 724, 725, 726, 727, 728, 729, 730, 741, 742, 743, 744, 745, 746, 747, 748, 755, 756, 757, 758, 766, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
    // Geração 8 (Galar) - 810 a 905
    810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 845, 846, 847, 848, 849, 850, 851, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898,
    // Geração 9 (Paldea) - 906 a 1025
    906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025
];

// DOM Elements
const pokemonImage = document.getElementById('pokemonImage');
const optionsContainer = document.getElementById('optionsContainer');
const feedbackMessage = document.getElementById('feedbackMessage');
const nextButton = document.getElementById('nextButton');
const scoreElement = document.getElementById('score');
const currentRoundElement = document.getElementById('currentRound');
const gameArea = document.getElementById('gameArea');
const gameOverArea = document.getElementById('gameOverArea');
const finalScoreElement = document.getElementById('finalScore');
const loadingIndicator = document.getElementById('loadingIndicator');
const gameContent = document.getElementById('gameContent');

// Initialize game
async function initGame() {
    console.log('Inicializando jogo...');
    try {
        // Embaralhar e usar lista de Pokémon
        gameState.availablePokemonIds = [...POKEMON_POOL].sort(() => Math.random() - 0.5);
        console.log('Pool de Pokémon preparado:', gameState.availablePokemonIds.length);
        
        showLoading(true);
        
        // Pré-carregar um lote inicial de 12 Pokémon para carregamento rápido
        await preloadPokemonBatch(12);
        
        startNewRound();
    } catch (error) {
        console.error('Erro ao inicializar jogo:', error);
        if (feedbackMessage) {
            feedbackMessage.textContent = 'Erro ao iniciar o jogo. Recarregue a página.';
            feedbackMessage.className = 'feedback-message wrong';
        }
        showLoading(false);
    }
}

// Pré-carregar um lote de Pokémon
async function preloadPokemonBatch(count) {
    console.log(`Pré-carregando ${count} Pokémon...`);
    const idsToLoad = gameState.availablePokemonIds.slice(0, count);
    
    const promises = idsToLoad.map(id => loadPokemonData(id));
    const results = await Promise.all(promises);
    
    const validPokemons = results.filter(p => p !== null);
    gameState.preloadedPokemons = validPokemons;
    
    console.log(`${validPokemons.length} Pokémon pré-carregados!`);
}

// Show/hide loading
function showLoading(show) {
    if (loadingIndicator && gameContent) {
        loadingIndicator.style.display = show ? 'block' : 'none';
        gameContent.style.display = show ? 'none' : 'block';
    }
}

// Carregar dados de um Pokémon específico
async function loadPokemonData(pokemonId) {
    // Verificar cache primeiro
    if (gameState.pokemonCache.has(pokemonId)) {
        return gameState.pokemonCache.get(pokemonId);
    }
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Pegar a imagem oficial ou fallback
        const image = data.sprites?.other?.['official-artwork']?.front_default 
                   || data.sprites?.front_default 
                   || '';
        
        const pokemon = {
            id: data.id,
            name: data.name,
            image: image
        };
        
        // Salvar no cache
        gameState.pokemonCache.set(pokemonId, pokemon);
        
        return pokemon;
    } catch (error) {
        console.error(`Erro ao carregar Pokémon ${pokemonId}:`, error);
        return null;
    }
}

// Start a new round
async function startNewRound() {
    console.log(`Iniciando rodada ${gameState.currentRound}...`);
    gameState.answered = false;
    
    try {
        let validPokemons;
        
        // Se temos Pokémon pré-carregados suficientes, usar eles
        if (gameState.preloadedPokemons.length >= 4) {
            // Pegar 4 aleatórios do pool pré-carregado
            const shuffled = [...gameState.preloadedPokemons].sort(() => Math.random() - 0.5);
            validPokemons = shuffled.slice(0, 4);
            
            // Remover os usados do pool
            gameState.preloadedPokemons = gameState.preloadedPokemons.filter(
                p => !validPokemons.some(vp => vp.id === p.id)
            );
            
            console.log('Usando Pokémon pré-carregados (instantâneo!)');
            
            // Pré-carregar mais em background se o pool estiver baixo
            if (gameState.preloadedPokemons.length < 8) {
                preloadPokemonBatch(12).catch(err => console.error('Erro no pré-carregamento:', err));
            }
        } else {
            // Fallback: carregar sob demanda (primeira rodada ou se acabou o pool)
            const selectedIds = getRandomPokemonIds(4);
            console.log('Carregando Pokémon sob demanda:', selectedIds);
            
            const pokemonPromises = selectedIds.map(id => loadPokemonData(id));
            const pokemons = await Promise.all(pokemonPromises);
            
            validPokemons = pokemons.filter(p => p !== null);
        }
        
        console.log('Pokémon válidos carregados:', validPokemons.length);
        
        if (validPokemons.length < 4) {
            console.error('Poucos Pokémon carregados:', validPokemons.length);
            feedbackMessage.textContent = 'Erro ao carregar. Tente novamente.';
            feedbackMessage.className = 'feedback-message wrong';
            showLoading(false);
            return;
        }
        
        // Selecionar um Pokémon aleatório como correto
        const correctIndex = Math.floor(Math.random() * validPokemons.length);
        gameState.currentPokemon = validPokemons[correctIndex];
        
        // Embaralhar as opções antes de exibir
        const shuffledOptions = [...validPokemons].sort(() => Math.random() - 0.5);
        gameState.currentOptions = shuffledOptions;
        
        console.log('Pokémon correto:', gameState.currentPokemon.name);
        
        // Esconder loading
        showLoading(false);
        
        // Update UI
        if (pokemonImage) {
            pokemonImage.src = gameState.currentPokemon.image;
            pokemonImage.classList.remove('revealed');
            pokemonImage.onerror = () => {
                console.error('Erro ao carregar imagem:', gameState.currentPokemon.image);
            };
        }
        
        // Display options (embaralhadas)
        displayOptions(gameState.currentOptions);
        
        // Clear feedback and disable next button
        if (feedbackMessage) {
            feedbackMessage.textContent = '';
        }
        if (nextButton) {
            nextButton.disabled = true;
        }
        
        // Update round counter
        if (currentRoundElement) {
            currentRoundElement.textContent = gameState.currentRound;
        }
        
        console.log('Rodada iniciada com sucesso!');
    } catch (error) {
        console.error('Erro ao iniciar rodada:', error);
        showLoading(false);
        if (feedbackMessage) {
            feedbackMessage.textContent = 'Erro ao carregar. Tente novamente.';
            feedbackMessage.className = 'feedback-message wrong';
        }
    }
}

// Get random pokemon IDs
function getRandomPokemonIds(count) {
    const shuffled = [...gameState.availablePokemonIds].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Display options
function displayOptions(options) {
    optionsContainer.innerHTML = '';
    
    options.forEach(pokemon => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = capitalizeFirstLetter(pokemon.name);
        button.onclick = () => handleAnswer(pokemon, button);
        optionsContainer.appendChild(button);
    });
}

// Handle answer
function handleAnswer(selectedPokemon, button) {
    if (gameState.answered) return;
    
    gameState.answered = true;
    const isCorrect = selectedPokemon.id === gameState.currentPokemon.id;
    
    // Reveal the pokemon
    pokemonImage.classList.add('revealed');
    
    // Disable all buttons
    const allButtons = optionsContainer.querySelectorAll('.option-button');
    allButtons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        // Correct answer
        button.classList.add('correct');
        gameState.score++;
        scoreElement.textContent = gameState.score;
        feedbackMessage.textContent = '🎉 Parabéns! Você acertou!';
        feedbackMessage.className = 'feedback-message correct';
    } else {
        // Wrong answer
        button.classList.add('wrong');
        feedbackMessage.textContent = `😢 Não foi dessa vez! Era ${capitalizeFirstLetter(gameState.currentPokemon.name)}`;
        feedbackMessage.className = 'feedback-message wrong';
        
        // Highlight correct answer
        allButtons.forEach(btn => {
            if (btn.textContent.toLowerCase() === gameState.currentPokemon.name.toLowerCase()) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Enable next button
    nextButton.disabled = false;
}

// Handle next button click
nextButton.addEventListener('click', () => {
    if (gameState.currentRound >= gameState.maxRounds) {
        endGame();
    } else {
        gameState.currentRound++;
        startNewRound();
    }
});

// End game
function endGame() {
    // Hide game area and show game over
    gameArea.style.display = 'none';
    gameOverArea.style.display = 'block';
    
    // Update final score
    finalScoreElement.textContent = `${gameState.score}/${gameState.maxRounds}`;
    
    // Calculate accuracy
    const accuracy = Math.round((gameState.score / gameState.maxRounds) * 100);
    
    // Update statistics
    updateGameStats('guess', gameState.score === gameState.maxRounds, gameState.maxRounds);
    
    // Log to console for debugging
    console.log(`Jogo finalizado! Pontuação: ${gameState.score}/${gameState.maxRounds} (${accuracy}%)`);
}

// Restart game
function restartGame() {
    // Reset game state
    gameState.score = 0;
    gameState.currentRound = 1;
    gameState.answered = false;
    
    // Update UI
    scoreElement.textContent = '0';
    gameArea.style.display = 'block';
    gameOverArea.style.display = 'none';
    
    // Start new round
    startNewRound();
}

// Utility: Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);
