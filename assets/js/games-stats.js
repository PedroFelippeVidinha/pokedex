// Sistema de estatísticas dos jogos
const STATS_KEY = 'pokemon_games_stats';

// Carregar estatísticas
function loadStats() {
    const stats = localStorage.getItem(STATS_KEY);
    if (stats) {
        return JSON.parse(stats);
    }
    return {
        totalGamesPlayed: 0,
        totalScore: 0,
        highestStreak: 0,
        gameScores: {
            guess: [],
            types: [],
            memory: [],
            cards: [],
            battle: []
        }
    };
}

// Salvar estatísticas
function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Adicionar pontuação
function addGameScore(gameName, score) {
    const stats = loadStats();
    stats.totalGamesPlayed++;
    stats.totalScore += score;
    
    if (stats.gameScores[gameName]) {
        stats.gameScores[gameName].push(score);
    }
    
    saveStats(stats);
    updateStatsDisplay();
}

// Atualizar sequência
function updateStreak(streak) {
    const stats = loadStats();
    if (streak > stats.highestStreak) {
        stats.highestStreak = streak;
        saveStats(stats);
        updateStatsDisplay();
    }
}

// Atualizar display das estatísticas
function updateStatsDisplay() {
    const stats = loadStats();
    
    const totalGamesElement = document.getElementById('totalGamesPlayed');
    const totalScoreElement = document.getElementById('totalScore');
    const highestStreakElement = document.getElementById('highestStreak');
    
    if (totalGamesElement) {
        totalGamesElement.textContent = stats.totalGamesPlayed;
    }
    
    if (totalScoreElement) {
        totalScoreElement.textContent = stats.totalScore;
    }
    
    if (highestStreakElement) {
        highestStreakElement.textContent = stats.highestStreak;
    }
}

// Resetar estatísticas (se necessário)
function resetStats() {
    if (confirm('Tem certeza que deseja resetar todas as estatísticas?')) {
        localStorage.removeItem(STATS_KEY);
        updateStatsDisplay();
    }
}

// Inicializar display quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateStatsDisplay);
} else {
    updateStatsDisplay();
}
