// Tabela completa de efetividades de tipos (baseada em Pokémon oficial)
const typeEffectiveness = {
    normal: {
        super: [],
        notEffective: ['rock', 'steel'],
        noEffect: ['ghost']
    },
    fire: {
        super: ['grass', 'ice', 'bug', 'steel'],
        notEffective: ['fire', 'water', 'rock', 'dragon'],
        noEffect: []
    },
    water: {
        super: ['fire', 'ground', 'rock'],
        notEffective: ['water', 'grass', 'dragon'],
        noEffect: []
    },
    electric: {
        super: ['water', 'flying'],
        notEffective: ['electric', 'grass', 'dragon'],
        noEffect: ['ground']
    },
    grass: {
        super: ['water', 'ground', 'rock'],
        notEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
        noEffect: []
    },
    ice: {
        super: ['grass', 'ground', 'flying', 'dragon'],
        notEffective: ['fire', 'water', 'ice', 'steel'],
        noEffect: []
    },
    fighting: {
        super: ['normal', 'ice', 'rock', 'dark', 'steel'],
        notEffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
        noEffect: ['ghost']
    },
    poison: {
        super: ['grass', 'fairy'],
        notEffective: ['poison', 'ground', 'rock', 'ghost'],
        noEffect: ['steel']
    },
    ground: {
        super: ['fire', 'electric', 'poison', 'rock', 'steel'],
        notEffective: ['grass', 'bug'],
        noEffect: ['flying']
    },
    flying: {
        super: ['grass', 'fighting', 'bug'],
        notEffective: ['electric', 'rock', 'steel'],
        noEffect: []
    },
    psychic: {
        super: ['fighting', 'poison'],
        notEffective: ['psychic', 'steel'],
        noEffect: ['dark']
    },
    bug: {
        super: ['grass', 'psychic', 'dark'],
        notEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
        noEffect: []
    },
    rock: {
        super: ['fire', 'ice', 'flying', 'bug'],
        notEffective: ['fighting', 'ground', 'steel'],
        noEffect: []
    },
    ghost: {
        super: ['psychic', 'ghost'],
        notEffective: ['dark'],
        noEffect: ['normal']
    },
    dragon: {
        super: ['dragon'],
        notEffective: ['steel'],
        noEffect: ['fairy']
    },
    dark: {
        super: ['psychic', 'ghost'],
        notEffective: ['fighting', 'dark', 'fairy'],
        noEffect: []
    },
    steel: {
        super: ['ice', 'rock', 'fairy'],
        notEffective: ['fire', 'water', 'electric', 'steel'],
        noEffect: []
    },
    fairy: {
        super: ['fighting', 'dragon', 'dark'],
        notEffective: ['fire', 'poison', 'steel'],
        noEffect: []
    }
};

// Traduções dos tipos para português
const typeTranslations = {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    grass: 'Planta',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Venenoso',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Metálico',
    fairy: 'Fada'
};

// Ícones representativos para cada tipo
const typeIcons = {
    normal: '⭐',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    ice: '❄️',
    fighting: '👊',
    poison: '☠️',
    ground: '🪨',
    flying: '🕊️',
    psychic: '🔮',
    bug: '🐛',
    rock: '🗿',
    ghost: '👻',
    dragon: '🐉',
    dark: '🌙',
    steel: '⚙️',
    fairy: '✨'
};

// Todos os tipos disponíveis
const allTypes = Object.keys(typeEffectiveness);

// Game State
let gameState = {
    score: 0,
    currentRound: 1,
    maxRounds: 10,
    answered: false,
    currentQuestion: null
};

// DOM Elements
const attackerTypeElement = document.getElementById('attackerType');
const defenderTypeElement = document.getElementById('defenderType');
const optionsContainer = document.getElementById('optionsContainer');
const feedbackMessage = document.getElementById('feedbackMessage');
const nextButton = document.getElementById('nextButton');
const scoreElement = document.getElementById('score');
const currentRoundElement = document.getElementById('currentRound');
const gameArea = document.getElementById('gameArea');
const gameOverArea = document.getElementById('gameOverArea');
const finalScoreElement = document.getElementById('finalScore');

// Initialize game
function initGame() {
    console.log('Inicializando Batalha de Tipos...');
    startNewRound();
}

// Start a new round
function startNewRound() {
    console.log(`Iniciando rodada ${gameState.currentRound}...`);
    gameState.answered = false;
    
    // Generate a new question
    gameState.currentQuestion = generateQuestion();
    
    // Display question
    displayQuestion(gameState.currentQuestion);
    
    // Reset feedback and buttons
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
    nextButton.disabled = true;
    
    // Enable option buttons
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
    
    // Update round counter
    currentRoundElement.textContent = gameState.currentRound;
}

// Generate a random question
function generateQuestion() {
    // Select random attacker type
    const attackerType = allTypes[Math.floor(Math.random() * allTypes.length)];
    
    // Select random defender type
    const defenderType = allTypes[Math.floor(Math.random() * allTypes.length)];
    
    // Calculate effectiveness
    const effectiveness = calculateEffectiveness(attackerType, defenderType);
    
    return {
        attackerType,
        defenderType,
        correctAnswer: effectiveness
    };
}

// Calculate effectiveness of attacker vs defender
function calculateEffectiveness(attacker, defender) {
    const attackerData = typeEffectiveness[attacker];
    
    if (!attackerData) return 'normal';
    
    // Check if it's super effective
    if (attackerData.super.includes(defender)) {
        return 'super';
    }
    
    // Check if it's not effective
    if (attackerData.notEffective.includes(defender)) {
        return 'not';
    }
    
    // Check if it has no effect
    if (attackerData.noEffect && attackerData.noEffect.includes(defender)) {
        return 'not';
    }
    
    // Otherwise it's normal
    return 'normal';
}

// Display question
function displayQuestion(question) {
    // Set type badges with icons
    attackerTypeElement.innerHTML = `
        <span style="font-size: 2rem; margin-right: 0.5rem;">${typeIcons[question.attackerType]}</span>
        <span>${typeTranslations[question.attackerType]}</span>
    `;
    attackerTypeElement.className = `type-badge-large type-${question.attackerType}`;
    
    defenderTypeElement.innerHTML = `
        <span style="font-size: 2rem; margin-right: 0.5rem;">${typeIcons[question.defenderType]}</span>
        <span>${typeTranslations[question.defenderType]}</span>
    `;
    defenderTypeElement.className = `type-badge-large type-${question.defenderType}`;
    
    console.log(`Pergunta: ${question.attackerType} vs ${question.defenderType} = ${question.correctAnswer}`);
}

// Setup event listeners for option buttons
const optionButtons = optionsContainer.querySelectorAll('.option-button');
optionButtons.forEach(button => {
    button.addEventListener('click', () => handleAnswer(button.dataset.answer, button));
});

// Handle answer
function handleAnswer(selectedAnswer, button) {
    if (gameState.answered) return;
    
    gameState.answered = true;
    const isCorrect = selectedAnswer === gameState.currentQuestion.correctAnswer;
    
    // Disable all buttons
    const allButtons = optionsContainer.querySelectorAll('.option-button');
    allButtons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        // Correct answer
        button.classList.add('correct');
        gameState.score++;
        scoreElement.textContent = gameState.score;
        feedbackMessage.textContent = '🎉 Correto! Você é um mestre dos tipos!';
        feedbackMessage.className = 'feedback-message correct';
    } else {
        // Wrong answer
        button.classList.add('wrong');
        
        // Highlight correct answer
        const correctButton = Array.from(allButtons).find(
            btn => btn.dataset.answer === gameState.currentQuestion.correctAnswer
        );
        if (correctButton) {
            correctButton.classList.add('correct');
        }
        
        // Show feedback message
        const correctText = getEffectivenessText(gameState.currentQuestion.correctAnswer);
        feedbackMessage.textContent = `😢 A resposta correta era: ${correctText}`;
        feedbackMessage.className = 'feedback-message wrong';
    }
    
    // Enable next button
    nextButton.disabled = false;
}

// Get effectiveness text in Portuguese
function getEffectivenessText(effectiveness) {
    const texts = {
        super: 'Super Efetivo',
        normal: 'Normal',
        not: 'Não Efetivo'
    };
    return texts[effectiveness] || 'Normal';
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
    updateGameStats('types', gameState.score === gameState.maxRounds, gameState.maxRounds);
    
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

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);
