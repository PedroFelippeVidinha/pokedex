const pokemonList = document.getElementById('pokemonList')
const generations = document.getElementById('generations')

// Mapa de tradução de tipos
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
}

// Função para traduzir habilidades
function translateAbility(ability) {
    const abilityTranslations = {
        'adaptability': 'Adaptabilidade',
        'aftermath': 'Rescaldo',
        'air-lock': 'Trava-Ar',
        'analytic': 'Analítico',
        'anger-point': 'Ponto de Raiva',
        'anger-shell': 'Casca de Raiva',
        'anticipation': 'Antecipação',
        'arena-trap': 'Armadilha de Arena',
        'armor-tail': 'Cauda Blindada',
        'aroma-veil': 'Véu de Aroma',
        'as-one': 'Como Um',
        'aura-break': 'Quebra de Aura',
        'bad-dreams': 'Pesadelos',
        'ball-fetch': 'Buscar Bola',
        'battery': 'Bateria',
        'battle-armor': 'Armadura de Batalha',
        'battle-bond': 'Laço de Batalha',
        'beads-of-ruin': 'Contas da Ruína',
        'beast-boost': 'Força Bestial',
        'berserk': 'Berserk',
        'big-pecks': 'Peitão',
        'blaze': 'Chama',
        'bulletproof': 'À Prova de Bala',
        'cheek-pouch': 'Bolsa da Bochecha',
        'chilling-neigh': 'Relincho Gelado',
        'chlorophyll': 'Clorofila',
        'clear-body': 'Corpo Limpo',
        'cloud-nine': 'Nuvem Nove',
        'color-change': 'Mudança de Cor',
        'comatose': 'Comatoso',
        'commander': 'Comandante',
        'competitive': 'Competitivo',
        'compound-eyes': 'Olhos Compostos',
        'contrary': 'Contrário',
        'corrosion': 'Corrosão',
        'costar': 'Costar',
        'cotton-down': 'Algodão Flutuante',
        'cud-chew': 'Ruminar',
        'curious-medicine': 'Remédio Curioso',
        'cursed-body': 'Corpo Amaldiçoado',
        'cute-charm': 'Charme Fofo',
        'damp': 'Úmido',
        'dancer': 'Dançarino',
        'dark-aura': 'Aura Sombria',
        'dauntless-shield': 'Escudo Destemido',
        'dazzling': 'Deslumbrante',
        'defeatist': 'Derrotista',
        'defiant': 'Desafiador',
        'delta-stream': 'Corrente Delta',
        'desolate-land': 'Terra Desolada',
        'disguise': 'Disfarce',
        'download': 'Download',
        'dragons-maw': 'Mandíbula do Dragão',
        'drizzle': 'Garoa',
        'drought': 'Seca',
        'dry-skin': 'Pele Seca',
        'early-bird': 'Madrugador',
        'earth-eater': 'Comedor de Terra',
        'effect-spore': 'Esporo de Efeito',
        'electric-surge': 'Onda Elétrica',
        'electromorphosis': 'Eletromorfose',
        'emergency-exit': 'Saída de Emergência',
        'fairy-aura': 'Aura de Fada',
        'filter': 'Filtro',
        'flame-body': 'Corpo em Chamas',
        'flare-boost': 'Impulso de Chama',
        'flash-fire': 'Chama Reluzente',
        'flower-gift': 'Presente de Flor',
        'flower-veil': 'Véu de Flor',
        'fluffy': 'Fofinho',
        'forecast': 'Previsão',
        'forewarn': 'Pressagiar',
        'friend-guard': 'Guarda Amiga',
        'frisk': 'Revistar',
        'full-metal-body': 'Corpo de Metal Total',
        'fur-coat': 'Casaco de Pele',
        'gale-wings': 'Asas de Vendaval',
        'galvanize': 'Galvanizar',
        'gluttony': 'Glutonaria',
        'good-as-gold': 'Bom Como Ouro',
        'gooey': 'Pegajoso',
        'gorilla-tactics': 'Táticas de Gorila',
        'grass-pelt': 'Pelagem de Grama',
        'grassy-surge': 'Onda de Grama',
        'grim-neigh': 'Relincho Sombrio',
        'guard-dog': 'Cão de Guarda',
        'gulp-missile': 'Míssil Engolidor',
        'guts': 'Coragem',
        'hadron-engine': 'Motor Hádron',
        'harvest': 'Colheita',
        'healer': 'Curador',
        'heatproof': 'À Prova de Calor',
        'heavy-metal': 'Metal Pesado',
        'honey-gather': 'Coletar Mel',
        'hospitality': 'Hospitalidade',
        'huge-power': 'Poder Enorme',
        'hunger-switch': 'Mudança de Fome',
        'hustle': 'Agitação',
        'hydration': 'Hidratação',
        'hyper-cutter': 'Hiper Cortador',
        'ice-body': 'Corpo de Gelo',
        'ice-face': 'Face de Gelo',
        'ice-scales': 'Escamas de Gelo',
        'illuminate': 'Iluminar',
        'illusion': 'Ilusão',
        'immunity': 'Imunidade',
        'imposter': 'Impostor',
        'infiltrator': 'Infiltrador',
        'innards-out': 'Tripas pra Fora',
        'inner-focus': 'Foco Interno',
        'insomnia': 'Insônia',
        'intimidate': 'Intimidação',
        'intrepid-sword': 'Espada Intrépida',
        'iron-barbs': 'Farpas de Ferro',
        'iron-fist': 'Punho de Ferro',
        'justified': 'Justificado',
        'keen-eye': 'Olhar Afiado',
        'klutz': 'Desajeitado',
        'leaf-guard': 'Guarda Folha',
        'levitate': 'Levitar',
        'libero': 'Líbero',
        'light-metal': 'Metal Leve',
        'lightning-rod': 'Para-raios',
        'limber': 'Flexível',
        'lingering-aroma': 'Aroma Persistente',
        'liquid-ooze': 'Lodo Líquido',
        'liquid-voice': 'Voz Líquida',
        'long-reach': 'Alcance Longo',
        'magic-bounce': 'Rebote Mágico',
        'magic-guard': 'Guarda Mágica',
        'magician': 'Mágico',
        'magma-armor': 'Armadura de Magma',
        'magnet-pull': 'Magnetismo',
        'marvel-scale': 'Escama Maravilha',
        'mega-launcher': 'Mega Lançador',
        'merciless': 'Impiedoso',
        'mimicry': 'Mimetismo',
        'minus': 'Menos',
        'mirror-armor': 'Armadura Espelhada',
        'misty-surge': 'Onda de Névoa',
        'mold-breaker': 'Quebra Molde',
        'moody': 'Temperamental',
        'motor-drive': 'Motor Elétrico',
        'moxie': 'Audacía',
        'multiscale': 'Multiescala',
        'multitype': 'Multitipo',
        'mummy': 'Múmia',
        'mycelium-might': 'Força do Micélio',
        'natural-cure': 'Cura Natural',
        'neuroforce': 'Neuroforça',
        'neutralizing-gas': 'Gás Neutralizante',
        'no-guard': 'Sem Guarda',
        'normalize': 'Normalizar',
        'oblivious': 'Desatento',
        'opportunist': 'Oportunista',
        'orichalcum-pulse': 'Pulso de Oricalco',
        'overcoat': 'Sobretudo',
        'overgrow': 'Supercrescimento',
        'own-tempo': 'Ritmo Próprio',
        'parental-bond': 'Laço Parental',
        'parkour': 'Parkour',
        'pastel-veil': 'Véu Pastel',
        'perish-body': 'Corpo Perecível',
        'pickpocket': 'Batedor de Carteira',
        'pickup': 'Coletar',
        'pixilate': 'Pixilizar',
        'plus': 'Mais',
        'poison-heal': 'Cura Venenosa',
        'poison-point': 'Ponto Venenoso',
        'poison-puppeteer': 'Titereiro Venenoso',
        'poison-touch': 'Toque Venenoso',
        'power-construct': 'Construir Poder',
        'power-of-alchemy': 'Poder da Alquimia',
        'power-spot': 'Ponto de Poder',
        'prankster': 'Brincalhão',
        'pressure': 'Pressão',
        'primordial-sea': 'Mar Primordial',
        'prism-armor': 'Armadura de Prisma',
        'propeller-tail': 'Cauda de Hélice',
        'protean': 'Proteáno',
        'protosynthesis': 'Protosíntese',
        'psychic-surge': 'Onda Psíquica',
        'punk-rock': 'Punk Rock',
        'pure-power': 'Poder Puro',
        'purifying-salt': 'Sal Purificador',
        'quark-drive': 'Impulso Quark',
        'queenly-majesty': 'Majestade Real',
        'quick-draw': 'Saque Rápido',
        'quick-feet': 'Pés Rápidos',
        'rain-dish': 'Coletor de Chuva',
        'rattled': 'Abalado',
        'receiver': 'Receptor',
        'reckless': 'Imprudente',
        'refrigerate': 'Refrigerar',
        'regenerator': 'Regenerador',
        'ripen': 'Amadurecer',
        'rivalry': 'Rivalidade',
        'rks-system': 'Sistema RKS',
        'rock-head': 'Cabeça de Pedra',
        'rocky-payload': 'Carga Rochosa',
        'rough-skin': 'Pele Áspera',
        'run-away': 'Fuga',
        'sand-force': 'Força de Areia',
        'sand-rush': 'Areia Veloz',
        'sand-spit': 'Cuspir Areia',
        'sand-stream': 'Fluxo de Areia',
        'sand-veil': 'Véu de Areia',
        'sap-sipper': 'Sugador de Seiva',
        'schooling': 'Cardume',
        'scrappy': 'Valente',
        'screen-cleaner': 'Limpador de Tela',
        'seed-sower': 'Semeador',
        'serene-grace': 'Graça Serena',
        'shadow-shield': 'Escudo Sombrio',
        'shadow-tag': 'Etiqueta Sombria',
        'sharpness': 'Afiação',
        'shed-skin': 'Trocar de Pele',
        'sheer-force': 'Força Pura',
        'shell-armor': 'Armadura de Concha',
        'shield-dust': 'Pó Escudo',
        'shields-down': 'Escudos Baixos',
        'simple': 'Simples',
        'skill-link': 'Ligação de Habilidade',
        'slow-start': 'Início Lento',
        'slush-rush': 'Corrida na Lama',
        'sniper': 'Atirador',
        'snow-cloak': 'Manto de Neve',
        'snow-warning': 'Aviso de Neve',
        'solar-power': 'Poder Solar',
        'solid-rock': 'Rocha Sólida',
        'soul-heart': 'Coração da Alma',
        'soundproof': 'À Prova de Som',
        'speed-boost': 'Aceleração',
        'stakeout': 'Vigilância',
        'stall': 'Retardar',
        'stalwart': 'Inabalável',
        'stamina': 'Stamina',
        'stance-change': 'Mudança de Postura',
        'static': 'Estático',
        'steadfast': 'Firme',
        'steam-engine': 'Motor a Vapor',
        'steelworker': 'Trabalhador de Aço',
        'steely-spirit': 'Espírito de Aço',
        'stench': 'Fedor',
        'sticky-hold': 'Aderência',
        'storm-drain': 'Ralo de Tempestade',
        'strong-jaw': 'Mandíbula Forte',
        'sturdy': 'Resistente',
        'suction-cups': 'Ventosas',
        'super-luck': 'Super Sorte',
        'supersweet-syrup': 'Xarope Super Doce',
        'supreme-overlord': 'Senhor Supremo',
        'surge-surfer': 'Surfista de Onda',
        'swarm': 'Enxame',
        'sweet-veil': 'Véu Doce',
        'swift-swim': 'Nado Rápido',
        'sword-of-ruin': 'Espada da Ruína',
        'symbiosis': 'Simbiose',
        'synchronize': 'Sincronizar',
        'tablets-of-ruin': 'Tábuas da Ruína',
        'tangled-feet': 'Pés Emarançados',
        'tangling-hair': 'Cabelo Emarançado',
        'technician': 'Técnico',
        'telepathy': 'Telepatia',
        'tera-shell': 'Casca Tera',
        'tera-shift': 'Mudança Tera',
        'teraform-zero': 'Terraformação Zero',
        'teravolt': 'Teravolt',
        'thermal-exchange': 'Troca Térmica',
        'thick-fat': 'Gordura Grossa',
        'tinted-lens': 'Lente Colorida',
        'torrent': 'Torrente',
        'tough-claws': 'Garras Resistentes',
        'toxic-boost': 'Impulso Tóxico',
        'toxic-chain': 'Corrente Tóxica',
        'toxic-debris': 'Detritos Tóxicos',
        'trace': 'Rastrear',
        'transistor': 'Transistor',
        'triage': 'Triagem',
        'truant': 'Faltoso',
        'turboblaze': 'Turbochama',
        'unaware': 'Desavisado',
        'unburden': 'Desencargo',
        'unnerve': 'Nervosismo',
        'unseen-fist': 'Punho Invisível',
        'vessel-of-ruin': 'Vaso da Ruína',
        'victory-star': 'Estrela da Vitória',
        'vigor': 'Vigor',
        'vital-spirit': 'Espírito Vital',
        'volt-absorb': 'Absorver Volt',
        'wandering-spirit': 'Espírito Errante',
        'water-absorb': 'Absorver Água',
        'water-bubble': 'Bolha de Água',
        'water-compaction': 'Compactação de Água',
        'water-veil': 'Véu de Água',
        'weak-armor': 'Armadura Frágil',
        'well-baked-body': 'Corpo Bem Assado',
        'white-smoke': 'Fumaça Branca',
        'wimp-out': 'Covarde',
        'wind-power': 'Poder do Vento',
        'wind-rider': 'Cavaleiro do Vento',
        'wonder-guard': 'Guarda Maravilha',
        'wonder-skin': 'Pele Maravilha',
        'zen-mode': 'Modo Zen',
        'zero-to-hero': 'Zero ao Herói'
    }
    
    // Se a habilidade tiver tradução, usa. Senão, formata o nome em inglês
    return abilityTranslations[ability] || ability.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Variáveis para sistema de filtros
let allPokemons = []
let allAbilities = new Set()
let activeFilters = {
    search: '',
    types: [],
    weaknesses: [],
    generations: [],
    ability: '',
    size: null,
    weight: null
}

function convertPokemonToLi(pokemon) {
    const formattedNumber = String(pokemon.number).padStart(4, '0')
    return `
        <li class="pokemon ${pokemon.type}" onclick="openPokemonModal(${pokemon.number})">
            <div class="pokemon-image">
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            
            <div class="pokemon-info">
                <p class="pokemon-id">
                    <span class="number-prefix">Nº&nbsp;</span>${formattedNumber}
                </p>
                <h5 class="pokemon-name">${pokemon.name}</h5>
                
                <div class="abilities">
                    ${pokemon.types.map((type) => `<span class="pill ${type}">${typeTranslations[type] || type}</span>`).join('')}
                </div>
            </div>
        </li>
    `
}

function loadAllGenerations() {
    fetch(`https://pokeapi.co/api/v2/generation`)
    .then((response) => response.json())
    .then((jsonBody) => {
        const generationPromises = jsonBody.results.map((generation) => {
            generation.id = parseInt(generation.url.split("/").slice(-2, -1))
            
            // Criar botão de geração na barra superior (mantido do código original)
            const linkGeneration = document.createElement('a')
            linkGeneration.classList.add('button')
            linkGeneration.text = `${generation.id}ª Geração`
            linkGeneration.addEventListener("click", () => {
                filterByGeneration(generation.id)
            })
            generations.appendChild(linkGeneration)
            
            // Criar botão de geração nos filtros avançados
            const filterGenBtn = document.createElement('button')
            filterGenBtn.classList.add('gen-btn')
            filterGenBtn.textContent = `Gen ${generation.id}`
            filterGenBtn.dataset.generation = generation.id
            filterGenBtn.addEventListener('click', () => {
                filterGenBtn.classList.toggle('active')
                
                if (activeFilters.generations.includes(generation.id)) {
                    activeFilters.generations = activeFilters.generations.filter(g => g !== generation.id)
                } else {
                    activeFilters.generations.push(generation.id)
                }
                
                filterPokemons()
            })
            document.getElementById('filterGenerations').appendChild(filterGenBtn)
            
            // Carregar pokémons de cada geração
            return pokeApi.getPokemons(generation.id)
        })
        
        // Aguardar todas as gerações carregarem
        Promise.all(generationPromises).then((generationPokemons) => {
            allPokemons = generationPokemons.flat()
            
            // Coletar todas as habilidades únicas
            allPokemons.forEach(pokemon => {
                pokemon.abilities.forEach(ability => allAbilities.add(ability))
            })
            
            // Popular o select de habilidades
            populateAbilitySelect()
            
            // Exibir apenas geração 1 inicialmente
            activeFilters.generations = [1]
            document.querySelector('.gen-btn[data-generation="1"]').classList.add('active')
            filterPokemons()
        })
    })
}

function populateAbilitySelect() {
    const abilitySelect = document.getElementById('abilityFilter')
    const sortedAbilities = Array.from(allAbilities).sort()
    
    sortedAbilities.forEach(ability => {
        const option = document.createElement('option')
        option.value = ability
        option.textContent = translateAbility(ability)
        abilitySelect.appendChild(option)
    })
}

function filterByGeneration(genId) {
    // Quando clica nos botões de geração da barra superior
    activeFilters.generations = [genId]
    
    // Atualizar estado visual dos botões de filtro
    document.querySelectorAll('.gen-btn').forEach(btn => {
        btn.classList.remove('active')
        if (parseInt(btn.dataset.generation) === genId) {
            btn.classList.add('active')
        }
    })
    
    // Atualizar texto da geração com formato correto
    const genSubtitle = document.querySelector('.generation-subtitle')
    genSubtitle.innerHTML = `Você está visualizando os pokémons da <b id="generation">${genId}ª</b> Geração`
    
    // Limpar outros filtros
    activeFilters.search = ''
    activeFilters.types = []
    activeFilters.weaknesses = []
    activeFilters.ability = ''
    activeFilters.size = null
    activeFilters.weight = null
    
    document.getElementById('searchInput').value = ''
    document.querySelectorAll('.type-btn, .weakness-btn, .size-btn, .weight-btn').forEach(btn => {
        btn.classList.remove('active')
    })
    document.getElementById('abilityFilter').value = ''
    
    filterPokemons()
}

function displayPokemons(pokemons) {
    if (pokemons.length === 0) {
        pokemonList.innerHTML = '<li style="list-style: none; text-align: center; padding: 2rem; color: #666; width: 100%;">Nenhum Pokémon encontrado com esses filtros.</li>'
        return
    }
    
    const newHtml = pokemons.map(convertPokemonToLi).join('')
    pokemonList.innerHTML = newHtml
    
    // Atualizar lista de IDs para navegação do modal
    updatePokemonIds(pokemons)
}

function filterPokemons() {
    let filtered = [...allPokemons]
    
    // Filtro de geração
    if (activeFilters.generations.length > 0) {
        filtered = filtered.filter(pokemon => {
            // Determinar a geração baseado no número do pokémon
            const number = pokemon.number
            if (number <= 151) return activeFilters.generations.includes(1)
            if (number <= 251) return activeFilters.generations.includes(2)
            if (number <= 386) return activeFilters.generations.includes(3)
            if (number <= 493) return activeFilters.generations.includes(4)
            if (number <= 649) return activeFilters.generations.includes(5)
            if (number <= 721) return activeFilters.generations.includes(6)
            if (number <= 809) return activeFilters.generations.includes(7)
            if (number <= 905) return activeFilters.generations.includes(8)
            return activeFilters.generations.includes(9)
        })
    }
    
    // Filtro de busca por nome ou número
    if (activeFilters.search) {
        const searchTerm = activeFilters.search.toLowerCase()
        filtered = filtered.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) || 
            pokemon.number.toString().includes(searchTerm)
        )
    }
    
    // Filtro por tipos
    if (activeFilters.types.length > 0) {
        filtered = filtered.filter(pokemon => 
            activeFilters.types.some(type => pokemon.types.includes(type))
        )
    }
    
    // Filtro por fraquezas
    if (activeFilters.weaknesses.length > 0) {
        filtered = filtered.filter(pokemon => 
            activeFilters.weaknesses.some(weakness => pokemon.weaknesses.includes(weakness))
        )
    }
    
    // Filtro por habilidade
    if (activeFilters.ability) {
        filtered = filtered.filter(pokemon => 
            pokemon.abilities.includes(activeFilters.ability)
        )
    }
    
    // Filtro por tamanho (altura em decímetros)
    if (activeFilters.size) {
        filtered = filtered.filter(pokemon => {
            const heightInMeters = pokemon.height / 10
            if (activeFilters.size === 'small') return heightInMeters < 1
            if (activeFilters.size === 'medium') return heightInMeters >= 1 && heightInMeters <= 2
            if (activeFilters.size === 'large') return heightInMeters > 2
            return true
        })
    }
    
    // Filtro por peso (peso em hectogramas, 1 hectograma = 0.1kg)
    if (activeFilters.weight) {
        filtered = filtered.filter(pokemon => {
            const weightInKg = pokemon.weight / 10
            if (activeFilters.weight === 'light') return weightInKg < 50
            if (activeFilters.weight === 'medium') return weightInKg >= 50 && weightInKg <= 100
            if (activeFilters.weight === 'heavy') return weightInKg > 100
            return true
        })
    }
    
    displayPokemons(filtered)
}

// Event Listeners para os filtros
document.getElementById('searchInput').addEventListener('input', (e) => {
    activeFilters.search = e.target.value
    
    // Se houver busca, remover filtro de geração para buscar em todas
    if (activeFilters.search.length > 0) {
        activeFilters.generations = []
        document.querySelectorAll('.gen-btn').forEach(btn => btn.classList.remove('active'))
        
        // Atualizar todo o texto do parágrafo
        const genSubtitle = document.querySelector('.generation-subtitle')
        genSubtitle.innerHTML = 'Você está visualizando os pokémons dentre todas as Gerações'
    } else {
        // Se limpar busca, voltar para geração 1
        activeFilters.generations = [1]
        document.querySelector('.gen-btn[data-generation="1"]').classList.add('active')
        
        // Restaurar formato original
        const genSubtitle = document.querySelector('.generation-subtitle')
        genSubtitle.innerHTML = 'Você está visualizando os pokémons da <b id="generation">1ª</b> Geração'
    }
    
    filterPokemons()
})

document.getElementById('searchBtn').addEventListener('click', () => {
    filterPokemons()
})

document.getElementById('toggleFilters').addEventListener('click', () => {
    const advancedFilters = document.getElementById('advancedFilters')
    if (advancedFilters.style.display === 'none') {
        advancedFilters.style.display = 'block'
    } else {
        advancedFilters.style.display = 'none'
    }
})

document.getElementById('resetFilters').addEventListener('click', () => {
    // Limpar filtros ativos
    activeFilters = {
        search: '',
        types: [],
        weaknesses: [],
        generations: [1],
        ability: '',
        size: null,
        weight: null
    }
    
    // Limpar input de busca
    document.getElementById('searchInput').value = ''
    
    // Remover classes active dos botões
    document.querySelectorAll('.type-btn, .weakness-btn, .size-btn, .weight-btn').forEach(btn => {
        btn.classList.remove('active')
    })
    
    // Resetar gerações para mostrar apenas geração 1
    document.querySelectorAll('.gen-btn').forEach(btn => {
        btn.classList.remove('active')
        if (btn.dataset.generation === '1') {
            btn.classList.add('active')
        }
    })
    
    // Resetar select de habilidade
    document.getElementById('abilityFilter').value = ''
    
    // Atualizar texto da geração com formato correto
    const genSubtitle = document.querySelector('.generation-subtitle')
    genSubtitle.innerHTML = 'Você está visualizando os pokémons da <b id="generation">1ª</b> Geração'
    
    // Mostrar pokémons da geração 1
    filterPokemons()
})

// Filtros de tipo
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type
        btn.classList.toggle('active')
        
        if (activeFilters.types.includes(type)) {
            activeFilters.types = activeFilters.types.filter(t => t !== type)
        } else {
            activeFilters.types.push(type)
        }
        
        filterPokemons()
    })
})

// Filtros de fraqueza
document.querySelectorAll('.weakness-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const weakness = btn.dataset.weakness
        btn.classList.toggle('active')
        
        if (activeFilters.weaknesses.includes(weakness)) {
            activeFilters.weaknesses = activeFilters.weaknesses.filter(w => w !== weakness)
        } else {
            activeFilters.weaknesses.push(weakness)
        }
        
        filterPokemons()
    })
})

// Filtro de habilidade
document.getElementById('abilityFilter').addEventListener('change', (e) => {
    activeFilters.ability = e.target.value
    filterPokemons()
})

// Filtros de tamanho
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const size = btn.dataset.size
        
        // Remove active de todos os botões de tamanho
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'))
        
        // Se clicar no mesmo, desativa
        if (activeFilters.size === size) {
            activeFilters.size = null
        } else {
            activeFilters.size = size
            btn.classList.add('active')
        }
        
        filterPokemons()
    })
})

// Filtros de peso
document.querySelectorAll('.weight-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const weight = btn.dataset.weight
        
        // Remove active de todos os botões de peso
        document.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'))
        
        // Se clicar no mesmo, desativa
        if (activeFilters.weight === weight) {
            activeFilters.weight = null
        } else {
            activeFilters.weight = weight
            btn.classList.add('active')
        }
        
        filterPokemons()
    })
})

// Inicializar carregando todas as gerações
loadAllGenerations()
