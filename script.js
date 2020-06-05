$(document).ready(function() {
    // Función que recibe url para llamado ajax y función para respuesta
    function consult(url, successCallback) {
        fetch(url)
            .then(function(response) {
                return response.json()
            })
            .then(successCallback)

        // .catch(show_error)
    }


    // Función que muestra errores
    function show_error(error) {
        console.log("Algo salió mal:" + error)
    }
    // Función que crea lista de pokemones
    function pokedexInit(response) {
        next = response.next
        results = response.results
        results.forEach(function(pokemon) {
            // se llama la función que arma los cards
            card(pokemon.name, pokemon.url)
        })
    }
    // Función para botón next
    $('#more').bind('click', function() {
            consult(next, pokedexInit)
        })
        // Función para imagen
    function image_pokemon(img, data) {
        img.src = data.sprites["front_default"]
        img.className = "card-img-top"
        img.style.width = "11rem"
        img.style.marginLeft = "50px"
        img.style.marginRight = "auto"
    }

    function data_pokemon(data, name) {
        var types = [],
            abilities = [],
            moves = []

        data.types.forEach(elem => types.push((elem.type.name)))
        types = types.join(", ")
            // console.log(types)

        data.abilities.forEach(elem => abilities.push((elem.ability.name)))
        abilities = abilities.join(", ")
            // console.log(abilities)

        moves = (data.moves.slice(0, 5).map(x => x.move.name))
            // console.log(moves)

        consult(data.types[0].type.url, function(data) {
            modal(name, types, abilities, moves, data)
        })

    }
    // Función para ver daños
    function data_damage(data) {
        var damages = []
        data.damage_relations.forEach(elem => damages.push((elem.name)))
        damages = damages.join(", ")
    }
    // Función que crea el Card
    function card(name, url) {
        var div1 = document.createElement('div'),
            div2 = document.createElement('div'),
            img = document.createElement('img'),
            h5 = document.createElement('h5'),
            p = document.createElement('p')
        button = document.createElement('button')



        div1.className = 'card text-center'
        div1.style.width = '18rem'
        img.className = 'card-img-top'
        div2.className = 'card-body'
        h5.className = 'card-title'
        p.className = 'card-text'
            // button.className = 'btn btn-primary'
            // button.dataToggle = 'modal'
            // button.type = 'button'
            // button.dataTarget = '#exampleModal'
            // button.dataName = name
            // button.appendChild(document.createTextNode('¡Quiero saber más de este pokémon!'))
        p.appendChild(document.createTextNode(''))
        h5.appendChild(document.createTextNode(name))


        consult(url, (data) => image_pokemon(img, data))
        button.id = `${name}1`
        button.dataset.target = "#exampleModal"
        button.className = "btn btn-sm btn-primary"
        button.appendChild(document.createTextNode("Quiero saber más de este Pokemón!"))

        div2.appendChild(h5)
        div2.appendChild(p)
        div2.appendChild(button)
        button.addEventListener('click', () => {
            consult(url, (data) => {
                data_pokemon(data, name)
            })
        })

        div1.appendChild(img)
        div1.appendChild(div2)
            // button.dataset.toggle = '#exampleModal'
        $('#uno').append(div1)
            // se agrega función al botón para que gatille una nueva consulta ajax

        // button.addEventListener('click', function () {
        //     consult(url, pokemonData)
        // })




    }
    // Función que recibe la data del Pokemón
    function pokemonData(response) {
        // console.log(response)
        modal(response)
    }
    // Función que activa la modal con info del pokemón
    function modal(name, types, abilities, moves, data) {
        var string = `
                            <div class="modal fade" id="${name}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">${name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <b>Tipo</b>
                            <br>
                                ${types}
                                <br>
                                    <br>
                                        <b>Habilidades</b>
                                        <br>
                                            ${abilities}
                                            <br>
                                                <br>
                                                    <b>Movimientos</b>
                                                    <br>
                                                        ${moves}
                                                        <br>
                                                            <br>
                                                                <b>Generación</b>
                                                                <br>
                                                                    ${data.generation.name}
                                                                    <br>

                                    </div>
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">cerrar</button>
                                                                    <button type="button" id="${name}2" class="btn btn-danger" onclick="data_damage()">Ver relaciones de daño</button>
                                                            
                                                                </div>
                                </div>
                            </div>
                        </div>`


        $('body').append(string)
        $(`#${name}`).modal()

    }
    consult('https://pokeapi.co/api/v2/pokemon/', pokedexInit)
})