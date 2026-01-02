const pokemonList = document.getElementById('pokemonList')
const generations = document.getElementById('generations')

// Variáveis para sistema de filtros
let allPokemons = []
let activeFilters = {
    search: '',
    types: [],
    weaknesses: [],
    size: null
}

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" 
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadGenerations(){
    fetch(`https://pokeapi.co/api/v2/generation`)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results.map((generation) => {
        generation.id = generation.url.split("/").slice(-2, -1)
        const linkGeneration = document.createElement('a')
        linkGeneration.classList.add('button')
        linkGeneration.text = `${generation.id}ª Geração`
        linkGeneration.addEventListener("click", () => {
            loadPokemonItens(generation.id)
        })
        generations.appendChild(linkGeneration)
    }))
}
loadGenerations()


function loadPokemonItens(generation) {
    pokemonList.innerHTML = ''
    document.getElementById("generation").innerHTML = `${generation}ª`
    pokeApi.getPokemons(generation).then((pokemons = []) => {
        allPokemons = pokemons
        displayPokemons(allPokemons)
    })
}

function displayPokemons(pokemons) {
    const newHtml = pokemons.map(convertPokemonToLi).join('')
    pokemonList.innerHTML = newHtml
}

function filterPokemons() {
    let filtered = [...allPokemons]
    
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
    
    displayPokemons(filtered)
}

// Event Listeners para os filtros
document.getElementById('searchInput').addEventListener('input', (e) => {
    activeFilters.search = e.target.value
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
        size: null
    }
    
    // Limpar input de busca
    document.getElementById('searchInput').value = ''
    
    // Remover classes active dos botões
    document.querySelectorAll('.type-btn, .weakness-btn, .size-btn').forEach(btn => {
        btn.classList.remove('active')
    })
    
    // Mostrar todos os pokémons
    displayPokemons(allPokemons)
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

loadPokemonItens(1)
