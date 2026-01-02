// Variáveis globais para controle do modal
let currentPokemonId = null
let allPokemonIds = []

// Traduções de estatísticas
const statTranslations = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defesa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defesa Especial',
    'speed': 'Velocidade'
}

// Traduções de categorias (espanhol -> português)
const categoryTranslations = {
    'Pokémon Semilla': 'Pokémon Semente',
    'Pokémon Lagartija': 'Pokémon Lagarto',
    'Pokémon Llama': 'Pokémon Chama',
    'Pokémon Tortuguita': 'Pokémon Tartaruga Minúscula',
    'Pokémon Tortuga': 'Pokémon Tartaruga',
    'Pokémon Caparazón': 'Pokémon Concha',
    'Pokémon Ratón': 'Pokémon Rato',
    'Pokémon Venopúa': 'Pokémon Espinho Venenoso',
    'Pokémon Venenoaguja': 'Pokémon Agulha Venenosa',
    'Pokémon Perforador': 'Pokémon Perfurador',
    'Pokémon Taladro': 'Pokémon Broca',
    'Pokémon Hada': 'Pokémon Fada',
    'Pokémon Zorro': 'Pokémon Raposa',
    'Pokémon Globo': 'Pokémon Balão',
    'Pokémon Murciélago': 'Pokémon Morcego',
    'Pokémon Hierbajos': 'Pokémon Erva Daninha',
    'Pokémon Flor': 'Pokémon Flor',
    'Pokémon Hongo': 'Pokémon Cogumelo',
    'Pokémon Insecto': 'Pokémon Inseto',
    'Pokémon Gusano': 'Pokémon Larva',
    'Pokémon Capullo': 'Pokémon Casulo',
    'Pokémon Mariposa': 'Pokémon Borboleta',
    'Pokémon Abeja': 'Pokémon Abelha',
    'Pokémon Pájaro': 'Pokémon Pássaro',
    'Pokémon Pajarito': 'Pokémon Passarinho',
    'Pokémon Ave': 'Pokémon Ave',
    'Pokémon Serpiente': 'Pokémon Serpente',
    'Pokémon Cobra': 'Pokémon Cobra',
    'Pokémon Eléctrico': 'Pokémon Elétrico',
    'Pokémon Pícaro': 'Pokémon Travesso',
    'Pokémon Bola': 'Pokémon Bola',
    'Pokémon Huevo': 'Pokémon Ovo',
    'Pokémon Coco': 'Pokémon Côco',
    'Pokémon Solitario': 'Pokémon Solitário',
    'Pokémon Guardahuesos': 'Pokémon Guardião de Ossos',
    'Pokémon Patada': 'Pokémon Chute',
    'Pokémon Puñetazo': 'Pokémon Soco',
    'Pokémon Lametazo': 'Pokémon Lambida',
    'Pokémon Gas Venenoso': 'Pokémon Gás Venenoso',
    'Pokémon Roca': 'Pokémon Pedra',
    'Pokémon Megaton': 'Pokémon Megaton',
    'Pokémon Fuego': 'Pokémon Fogo',
    'Pokémon Río': 'Pokémon Rio',
    'Pokémon Marisco': 'Pokémon Marisco',
    'Pokémon Bivalvo': 'Pokémon Bivalve',
    'Pokémon Gas': 'Pokémon Gás',
    'Pokémon Sombra': 'Pokémon Sombra',
    'Pokémon Hipnosis': 'Pokémon Hipnose',
    'Pokémon Cangrejo': 'Pokémon Caranguejo',
    'Pokémon Tenaza': 'Pokémon Pinça',
    'Pokémon Bola Eléctrica': 'Pokémon Bola Elétrica',
    'Pokémon Bomba': 'Pokémon Bomba',
    'Pokémon Hueso': 'Pokémon Osso',
    'Pokémon Luchador': 'Pokémon Lutador',
    'Pokémon Flexible': 'Pokémon Flexível',
    'Pokémon Enredadera': 'Pokémon Trepadeira',
    'Pokémon Pisotón': 'Pokémon Pisão',
    'Pokémon Pez': 'Pokémon Peixe',
    'Pokémon Dragón': 'Pokémon Dragão',
    'Pokémon Atrocidad': 'Pokémon Atrocidade',
    'Pokémon Evolución': 'Pokémon Evolução',
    'Pokémon Genético': 'Pokémon Genético',
    'Pokémon Hoja': 'Pokémon Folha',
    'Pokémon Hierba': 'Pokémon Grama',
    'Pokémon Cocodrilo': 'Pokémon Crocodilo',
    'Pokémon Volcán': 'Pokémon Vulcão',
    'Pokémon Mandíbula': 'Pokémon Mandíbula',
    'Pokémon Agua': 'Pokémon Água',
    'Pokémon Sol': 'Pokémon Sol',
    'Pokémon Luna': 'Pokémon Lua',
    'Pokémon Aura': 'Pokémon Aura',
    'Pokémon Ondas': 'Pokémon Ondas',
    'Pokémon Ninja': 'Pokémon Ninja',
    'Pokémon Escorpión': 'Pokémon Escorpião',
    'Pokémon Ogro': 'Pokémon Ogro',
    'Pokémon Pulido': 'Pokémon Polido',
    'Pokémon Brújula': 'Pokémon Bússola',
    'Pokémon Estelar': 'Pokémon Estelar',
    'Pokémon Temporal': 'Pokémon Temporal',
    'Pokémon Espacial': 'Pokémon Espacial',
    'Pokémon Renegado': 'Pokémon Renegado',
    'Pokémon Disciplina': 'Pokémon Disciplina',
    'Pokémon Gratitud': 'Pokémon Gratidão',
    'Pokémon Arcoíris': 'Pokémon Arco-íris',
    'Pokémon Sumergirse': 'Pokémon Mergulho'
}

// Função para traduzir categoria
function translateCategory(category) {
    return categoryTranslations[category] || category
}

// Abrir modal com um Pokémon específico
function openPokemonModal(pokemonId) {
    currentPokemonId = pokemonId
    const modal = document.getElementById('pokemonModal')
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    
    renderPokemonDetail(pokemonId)
    updateNavigationButtons()
}

// Fechar modal
function closePokemonModal() {
    const modal = document.getElementById('pokemonModal')
    modal.style.display = 'none'
    document.body.style.overflow = 'auto'
    currentPokemonId = null
}

// Navegar entre Pokémon (anterior/próximo)
function navigatePokemon(direction) {
    const currentIndex = allPokemonIds.indexOf(currentPokemonId)
    let newIndex
    
    if (direction === 'prev') {
        newIndex = currentIndex - 1
    } else {
        newIndex = currentIndex + 1
    }
    
    if (newIndex >= 0 && newIndex < allPokemonIds.length) {
        currentPokemonId = allPokemonIds[newIndex]
        renderPokemonDetail(currentPokemonId)
        updateNavigationButtons()
    }
}

// Atualizar estado dos botões de navegação
function updateNavigationButtons() {
    const currentIndex = allPokemonIds.indexOf(currentPokemonId)
    const prevBtn = document.getElementById('prevPokemon')
    const nextBtn = document.getElementById('nextPokemon')
    
    prevBtn.disabled = currentIndex === 0
    nextBtn.disabled = currentIndex === allPokemonIds.length - 1
}

// Renderizar detalhes do Pokémon
async function renderPokemonDetail(pokemonId) {
    const modalContent = document.getElementById('modalContent')
    modalContent.innerHTML = '<div class="loading">Carregando...</div>'
    
    try {
        const { pokemon, species } = await pokeApi.getPokemonFullDetails(pokemonId)
        
        // Obter cadeia de evolução
        const evolutionChainUrl = species.evolution_chain.url
        const evolutions = await pokeApi.getEvolutionChain(evolutionChainUrl)
        
        // Pegar descrição em português (tentar várias entradas se necessário)
        let description = 'Descrição não disponível.'
        
        // Tentar encontrar descrição em português
        const ptTexts = species.flavor_text_entries.filter(
            entry => entry.language.name === 'es' || entry.language.name === 'pt-BR'
        )
        
        if (ptTexts.length > 0) {
            // Usar a primeira entrada encontrada
            description = ptTexts[0].flavor_text
                .replace(/\f/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/\r/g, ' ')
                .trim()
        }
        
        // Pegar categoria (genus) em português/espanhol e traduzir
        let category = 'Desconhecido'
        const genusES = species.genera.find(entry => entry.language.name === 'es')
        const genusPT = species.genera.find(entry => entry.language.name === 'pt-BR')
        
        if (genusPT) {
            category = translateCategory(genusPT.genus)
        } else if (genusES) {
            category = translateCategory(genusES.genus)
        }
        
        // Informações de sexo
        const genderRate = species.gender_rate
        let genderInfo = ''
        if (genderRate === -1) {
            genderInfo = 'Sem sexo'
        } else {
            genderInfo = '<i class="gender-icon male">♂</i> <i class="gender-icon female">♀</i>'
        }
        
        // Tipos
        const types = pokemon.types.map(t => t.type.name)
        const mainType = types[0]
        
        // Construir HTML
        const html = `
            <div class="detail-hero type-${mainType}">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
                <div class="detail-number">#${String(pokemon.id).padStart(3, '0')}</div>
                <h2 class="detail-name">${pokemon.name}</h2>
                <div class="detail-types">
                    ${types.map(type => `
                        <span class="detail-type-pill type-${type}">${typeTranslations[type] || type}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <div class="detail-description">${description}</div>
            </div>
            
            <div class="detail-section">
                <h3>Dados da Pokédex</h3>
                <div class="detail-info-columns">
                    <div class="detail-info-column">
                        <div class="detail-info-item">
                            <span class="detail-info-label">Altura</span>
                            <span class="detail-info-value">${(pokemon.height / 10).toFixed(1)} m</span>
                        </div>
                        <div class="detail-info-item">
                            <span class="detail-info-label">Peso</span>
                            <span class="detail-info-value">${(pokemon.weight / 10).toFixed(1)} kg</span>
                        </div>
                        <div class="detail-info-item">
                            <span class="detail-info-label">Sexo</span>
                            <span class="detail-info-value">${genderInfo}</span>
                        </div>
                    </div>
                    <div class="detail-info-column">
                        <div class="detail-info-item">
                            <span class="detail-info-label">Categoria</span>
                            <span class="detail-info-value">${category}</span>
                        </div>
                        <div class="detail-info-item">
                            <span class="detail-info-label">Habilidades</span>
                            <div class="abilities-list">
                                ${pokemon.abilities.map(a => `
                                    <span class="ability-badge">${translateAbility(a.ability.name)}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Estatísticas</h3>
                <div class="stats-container">
                    ${pokemon.stats.map(stat => {
                        const statName = statTranslations[stat.stat.name] || stat.stat.name
                        const value = stat.base_stat
                        const percentage = (value / 255) * 100
                        
                        let level = 'low'
                        if (value > 100) level = 'very-high'
                        else if (value > 70) level = 'high'
                        else if (value > 40) level = 'medium'
                        
                        return `
                            <div class="stat-row">
                                <span class="stat-name">${statName}</span>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" data-value="${level}" style="width: ${percentage}%"></div>
                                </div>
                                <span class="stat-value">${value}</span>
                            </div>
                        `
                    }).join('')}
                    <div class="stat-total">
                        <span>Total</span>
                        <span>${pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Fraquezas</h3>
                <div class="weaknesses-grid">
                    ${getWeaknesses(types).map(weakness => `
                        <span class="weakness-badge type-${weakness}">${typeTranslations[weakness] || weakness}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Evoluções</h3>
                <div class="evolution-chain">
                    ${evolutions.map((evo, index) => `
                        ${index > 0 ? '<span class="evolution-arrow">→</span>' : ''}
                        <div class="evolution-item type-${evo.type}" onclick="openPokemonModal(${evo.id})">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png" alt="${evo.name}">
                            <span class="evolution-name">${evo.name}</span>
                            <span class="evolution-number">Nº&nbsp;${String(evo.id).padStart(4, '0')}</span>
                            <div class="evolution-types">
                                ${evo.types.map(type => `
                                    <span class="evolution-type-badge type-${type}">${typeTranslations[type] || type}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
        
        modalContent.innerHTML = html
        
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error)
        modalContent.innerHTML = '<div class="loading">Erro ao carregar dados do Pokémon.</div>'
    }
}

// Função auxiliar para calcular fraquezas (importada do poke-api.js)
function getWeaknesses(types) {
    const typeWeaknesses = {
        normal: ['fighting'],
        fire: ['water', 'ground', 'rock'],
        water: ['electric', 'grass'],
        electric: ['ground'],
        grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
        ice: ['fire', 'fighting', 'rock', 'steel'],
        fighting: ['flying', 'psychic', 'fairy'],
        poison: ['ground', 'psychic'],
        ground: ['water', 'grass', 'ice'],
        flying: ['electric', 'ice', 'rock'],
        psychic: ['bug', 'ghost', 'dark'],
        bug: ['fire', 'flying', 'rock'],
        rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
        ghost: ['ghost', 'dark'],
        dragon: ['ice', 'dragon', 'fairy'],
        dark: ['fighting', 'bug', 'fairy'],
        steel: ['fire', 'fighting', 'ground'],
        fairy: ['poison', 'steel']
    }
    
    const weaknessSet = new Set()
    types.forEach(type => {
        const weaknesses = typeWeaknesses[type] || []
        weaknesses.forEach(weakness => weaknessSet.add(weakness))
    })
    return Array.from(weaknessSet)
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botão fechar
    document.getElementById('closeModal').addEventListener('click', closePokemonModal)
    
    // Navegação
    document.getElementById('prevPokemon').addEventListener('click', () => navigatePokemon('prev'))
    document.getElementById('nextPokemon').addEventListener('click', () => navigatePokemon('next'))
    
    // Fechar ao clicar fora do modal
    document.getElementById('pokemonModal').addEventListener('click', (e) => {
        if (e.target.id === 'pokemonModal') {
            closePokemonModal()
        }
    })
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentPokemonId !== null) {
            closePokemonModal()
        }
    })
})

// Atualizar lista de IDs quando os Pokémon são carregados
function updatePokemonIds(pokemons) {
    allPokemonIds = pokemons.map(p => p.number)
}
