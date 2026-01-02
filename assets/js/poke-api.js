
const pokeApi = {}

// Tabela de fraquezas por tipo
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

function getImage(sprites){
    if(sprites.other?.["official-artwork"]?.front_default) return sprites.other["official-artwork"].front_default

    const sprites_front = Object.keys(sprites.other).filter((other) => sprites.other[other]?.front_default)
    return sprites_front[0]
    
}

function getWeaknesses(types) {
    const weaknessSet = new Set()
    types.forEach(type => {
        const weaknesses = typeWeaknesses[type] || []
        weaknesses.forEach(weakness => weaknessSet.add(weakness))
    })
    return Array.from(weaknessSet)
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = getImage(pokeDetail.sprites)
    
    // Novos dados
    pokemon.abilities = pokeDetail.abilities.map(ability => ability.ability.name)
    pokemon.height = pokeDetail.height // em decímetros
    pokemon.weight = pokeDetail.weight // em hectogramas
    pokemon.weaknesses = getWeaknesses(types)
    
    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    const url = pokemon.url.replace("-species", "")
    
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (generation = 1) => {
    const url = `https://pokeapi.co/api/v2/generation/${generation}/`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.pokemon_species)
        .then((pokemons) => pokemons.sort((a, b)=>{
            const id_a = a.url.split("/").slice(-2, -1)
            const id_b = b.url.split("/").slice(-2, -1)
            return id_a - id_b
        }).map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

// Buscar dados detalhados de um Pokémon específico
pokeApi.getPokemonFullDetails = (pokemonId) => {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
    
    return Promise.all([
        fetch(pokemonUrl).then(res => res.json()),
        fetch(speciesUrl).then(res => res.json())
    ]).then(([pokemonData, speciesData]) => {
        return {
            pokemon: pokemonData,
            species: speciesData
        }
    })
}

// Buscar cadeia de evolução
pokeApi.getEvolutionChain = async (evolutionChainUrl) => {
    const chainData = await fetch(evolutionChainUrl).then(res => res.json())
    const evolutions = []
    
    function extractEvolutions(chain) {
        const speciesUrl = chain.species.url
        const id = speciesUrl.split('/').slice(-2, -1)[0]
        
        evolutions.push({
            id: parseInt(id),
            name: chain.species.name
        })
        
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(evolution => {
                extractEvolutions(evolution)
            })
        }
    }
    
    extractEvolutions(chainData.chain)
    
    // Buscar tipo de cada evolução
    const evolutionsWithTypes = await Promise.all(
        evolutions.map(async (evo) => {
            try {
                const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo.id}/`).then(res => res.json())
                const types = pokemonData.types.map(t => t.type.name)
                return {
                    ...evo,
                    type: types[0],
                    types: types
                }
            } catch (error) {
                return {
                    ...evo,
                    type: 'normal',
                    types: ['normal']
                }
            }
        })
    )
    
    return evolutionsWithTypes
}
