const gameState = {
    playerPokemon: null,
    opponentPokemon: null,
    playerHp: 100,
    opponentHp: 100,
    playerMaxHp: 100,
    opponentMaxHp: 100,
    healsRemaining: 3,
    isDefending: false,
    battleEnded: false,
    allPokemon: []
};

const TYPE_COLORS = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
};

async function init() {
    await loadAllPokemon();
    setupEventListeners();
}

async function loadAllPokemon() {
    const container = document.getElementById('pokemonSelection');
    container.innerHTML = '';
    
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
        const data = await response.json();
        
        let loaded = 0;
        const batchSize = 50;
        
        for (let i = 0; i < data.results.length; i += batchSize) {
            const batch = data.results.slice(i, i + batchSize);
            await Promise.all(batch.map(async (pokemon) => {
                const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
                try {
                    const pokemonData = await fetch(pokemon.url).then(res => res.json());
                    const pokemonInfo = {
                        id: pokemonId,
                        name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1).replace(/-/g, ' '),
                        type: pokemonData.types[0].type.name
                    };
                    gameState.allPokemon.push(pokemonInfo);
                    const option = document.createElement('div');
                    option.className = 'pokemon-option';
                    option.dataset.pokemonId = pokemonId;
                    const img = document.createElement('img');
                    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                    img.alt = pokemonInfo.name;
                    const name = document.createElement('div');
                    name.className = 'name';
                    name.textContent = pokemonInfo.name;
                    name.style.color = TYPE_COLORS[pokemonInfo.type] || '#333';
                    option.appendChild(img);
                    option.appendChild(name);
                    option.addEventListener('click', () => selectPokemon(pokemonInfo, option));
                    container.appendChild(option);
                } catch (error) {
                    console.warn(`Erro ao carregar ${pokemon.name}:`, error);
                }
                loaded++;
            }));
        }
    } catch (error) {
        console.error('Erro ao carregar pokémons:', error);
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:#e74c3c;">❌ Erro ao carregar Pokémons. <button onclick="location.reload()" style="padding:0.5rem 1rem;margin-left:1rem;border:none;background:#667eea;color:white;border-radius:0.5rem;cursor:pointer;">Recarregar</button></p>';
    }
}

function selectPokemon(pokemon, element) {
    document.querySelectorAll('.pokemon-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    gameState.playerPokemon = pokemon;
    const startBtn = document.getElementById('startBattleBtn');
    startBtn.disabled = false;
    startBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setupEventListeners() {
    document.getElementById('startBattleBtn').addEventListener('click', startBattle);
    document.getElementById('attackBtn').addEventListener('click', () => playerAction('attack'));
    document.getElementById('specialAttackBtn').addEventListener('click', () => playerAction('special'));
    document.getElementById('defendBtn').addEventListener('click', () => playerAction('defend'));
    document.getElementById('healBtn').addEventListener('click', () => playerAction('heal'));
}

function startBattle() {
    if (!gameState.playerPokemon) return;
    const availableOpponents = gameState.allPokemon.filter(p => p.id !== gameState.playerPokemon.id);
    gameState.opponentPokemon = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    gameState.playerHp = 100;
    gameState.opponentHp = 100;
    gameState.healsRemaining = 3;
    gameState.battleEnded = false;
    gameState.isDefending = false;
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('battleScreen').classList.add('active');
    document.getElementById('playerImage').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${gameState.playerPokemon.id}.png`;
    document.getElementById('playerName').textContent = gameState.playerPokemon.name;
    document.getElementById('playerType').textContent = gameState.playerPokemon.type.toUpperCase();
    document.getElementById('playerType').style.color = TYPE_COLORS[gameState.playerPokemon.type];
    document.getElementById('opponentImage').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${gameState.opponentPokemon.id}.png`;
    document.getElementById('opponentName').textContent = gameState.opponentPokemon.name;
    document.getElementById('opponentType').textContent = gameState.opponentPokemon.type.toUpperCase();
    document.getElementById('opponentType').style.color = TYPE_COLORS[gameState.opponentPokemon.type];
    updateUI();
    addLog(`Batalha iniciada! ${gameState.playerPokemon.name} vs ${gameState.opponentPokemon.name}!`);
}

function playerAction(action) {
    if (gameState.battleEnded) return;
    disableActions();
    switch(action) {
        case 'attack':
            const damage = Math.floor(Math.random() * 15) + 10;
            const actualDamage = gameState.isDefending ? Math.floor(damage * 0.5) : damage;
            gameState.opponentHp = Math.max(0, gameState.opponentHp - actualDamage);
            addLog(`${gameState.playerPokemon.name} atacou! Causou ${actualDamage} de dano!`, 'damage');
            gameState.isDefending = false;
            break;
        case 'special':
            const specialDamage = Math.floor(Math.random() * 20) + 20;
            const actualSpecialDamage = gameState.isDefending ? Math.floor(specialDamage * 0.5) : specialDamage;
            gameState.opponentHp = Math.max(0, gameState.opponentHp - actualSpecialDamage);
            addLog(`${gameState.playerPokemon.name} usou Ataque Especial! Causou ${actualSpecialDamage} de dano!`, 'damage');
            gameState.isDefending = false;
            break;
        case 'defend':
            gameState.isDefending = true;
            addLog(`${gameState.playerPokemon.name} está se defendendo!`);
            break;
        case 'heal':
            if (gameState.healsRemaining > 0) {
                const healAmount = 30;
                const oldHp = gameState.playerHp;
                gameState.playerHp = Math.min(100, gameState.playerHp + healAmount);
                const actualHeal = gameState.playerHp - oldHp;
                gameState.healsRemaining--;
                addLog(`${gameState.playerPokemon.name} se curou! Recuperou ${actualHeal} HP! (${gameState.healsRemaining} curas restantes)`, 'heal');
                document.getElementById('healBtn').textContent = `💊 Curar (${gameState.healsRemaining}x)`;
                if (gameState.healsRemaining === 0) document.getElementById('healBtn').disabled = true;
                gameState.isDefending = false;
            }
            break;
    }
    updateUI();
    if (gameState.opponentHp <= 0) {
        endBattle(true);
        return;
    }
    setTimeout(() => {
        opponentTurn();
        updateUI();
        if (gameState.playerHp <= 0) {
            endBattle(false);
            return;
        }
        enableActions();
    }, 1500);
}

function opponentTurn() {
    if (gameState.battleEnded) return;
    const action = Math.random();
    if (action < 0.6) {
        const damage = Math.floor(Math.random() * 15) + 10;
        const actualDamage = gameState.isDefending ? Math.floor(damage * 0.5) : damage;
        gameState.playerHp = Math.max(0, gameState.playerHp - actualDamage);
        addLog(`${gameState.opponentPokemon.name} atacou! Causou ${actualDamage} de dano!`, 'damage');
    } else if (action < 0.9) {
        const damage = Math.floor(Math.random() * 20) + 20;
        const actualDamage = gameState.isDefending ? Math.floor(damage * 0.5) : damage;
        gameState.playerHp = Math.max(0, gameState.playerHp - actualDamage);
        addLog(`${gameState.opponentPokemon.name} usou Ataque Especial! Causou ${actualDamage} de dano!`, 'damage');
    } else {
        addLog(`${gameState.opponentPokemon.name} está se defendendo!`);
    }
    gameState.isDefending = false;
}

function updateUI() {
    const playerHpPercent = (gameState.playerHp / gameState.playerMaxHp) * 100;
    const playerHpBar = document.getElementById('playerHpBar');
    playerHpBar.style.width = playerHpPercent + '%';
    document.getElementById('playerHpText').textContent = `${gameState.playerHp}/${gameState.playerMaxHp}`;
    if (playerHpPercent <= 20) playerHpBar.className = 'hp-bar critical';
    else if (playerHpPercent <= 50) playerHpBar.className = 'hp-bar low';
    else playerHpBar.className = 'hp-bar';
    
    const opponentHpPercent = (gameState.opponentHp / gameState.opponentMaxHp) * 100;
    const opponentHpBar = document.getElementById('opponentHpBar');
    opponentHpBar.style.width = opponentHpPercent + '%';
    document.getElementById('opponentHpText').textContent = `${gameState.opponentHp}/${gameState.opponentMaxHp}`;
    if (opponentHpPercent <= 20) opponentHpBar.className = 'hp-bar critical';
    else if (opponentHpPercent <= 50) opponentHpBar.className = 'hp-bar low';
    else opponentHpBar.className = 'hp-bar';
}

function addLog(message, type = '') {
    const log = document.getElementById('battleLog');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    log.insertBefore(entry, log.firstChild);
}

function disableActions() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        if (btn.id !== 'healBtn' || gameState.healsRemaining > 0) btn.disabled = true;
    });
}

function enableActions() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        if (btn.id !== 'healBtn' || gameState.healsRemaining > 0) btn.disabled = false;
    });
}

function launchConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    
    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function endBattle(playerWon) {
    gameState.battleEnded = true;
    disableActions();
    const resultDiv = document.getElementById('battleResult');
    const resultIcon = document.getElementById('resultIcon');
    const resultText = document.getElementById('resultText');
    if (playerWon) {
        resultDiv.className = 'battle-result victory show';
        resultIcon.textContent = '🎉';
        resultText.textContent = 'Vitória!';
        addLog(`${gameState.playerPokemon.name} venceu a batalha!`, 'heal');
        launchConfetti();
    } else {
        resultDiv.className = 'battle-result defeat show';
        resultIcon.textContent = '😢';
        resultText.textContent = 'Derrota...';
        addLog(`${gameState.opponentPokemon.name} venceu a batalha!`, 'damage');
    }
}

window.addEventListener('DOMContentLoaded', init);
