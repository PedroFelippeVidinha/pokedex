
const pokeApi = {}

function getImage(sprites){
    if(sprites.other?.["official-artwork"]?.front_default) return sprites.other["official-artwork"].front_default

    const sprites_front = Object.keys(sprites.other).filter((other) => sprites.other[other]?.front_default)
    return sprites_front[0]
    
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
