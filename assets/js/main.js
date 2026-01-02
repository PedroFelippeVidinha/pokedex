const pokemonList = document.getElementById('pokemonList')
const generations = document.getElementById('generations')

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
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}
loadPokemonItens(1)