const app = Vue.createApp({
    data() {
        return {
            pokemons: [],
            pokeOffset: 0,
            isBeingRequested: false,
            inputValue: '',
        }
    },
    mounted() {
        this.fetchData();

        window.addEventListener('scroll', () => {
            const {
                scrollTop,
                scrollHeight,
                clientHeight
            } = document.documentElement;
        
            if (scrollTop + clientHeight >= scrollHeight - 100 && !this.isBeingRequested){
                this.addOffset(this.pokeOffset + 20);
                //console.log()
                this.fetchData();
                console.log(this.inputValue)
                }
        }, {
            passive: true
        });
    },
    methods: {
        refreshList(){
            this.pokeOffset = 0;
            this.clearPoke();
            this.fetchData();
        },
        clearPoke() {
            this.pokemons = [];
        },
        fetchData() {
            this.isBeingRequested = true; 
            fetch('https://beta.pokeapi.co/graphql/v1beta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            //body: '{query pokemons: "{ pokemons: pokemon_v2_pokemon { name id } }"}'
            //body: JSON.stringify({query : "{ pokemon_v2_pokemon(limit: 20) { name id height weight pokemon_v2_pokemonspecy { pokemon_v2_pokemoncolor {name}} }}"})
            body: JSON.stringify({query : `{ pokemon_v2_pokemon(limit: 20, offset:${this.pokeOffset}) { pokemon_v2_encounters(distinct_on: location_area_id, limit:5) {pokemon_v2_locationarea{name}} name id height weight pokemon_v2_pokemonspecy { pokemon_v2_pokemoncolor {name}} pokemon_v2_pokemontypes { pokemon_v2_type {name}} }}`})
            })
            .then(r => r.json())
            .then(data => {console.log('data returned:', data)
                this.pokemons =  [...this.pokemons, ...data.data.pokemon_v2_pokemon]
                console.log(this.pokemons)
                this.isBeingRequested = false;
                })
            
        },
        getImage(id){
            return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"+id+".svg"
        },
        search(){
            this.clearPoke();
            console.log("search");
            value = this.inputValue;
            if(/^[0-9]+$/.test(value)) {
                fetch('https://beta.pokeapi.co/graphql/v1beta', {
                    method: 'POST',
                    body: JSON.stringify({query : `{ pokemon_v2_pokemon(where: {id: {_eq: ${value}}}) { pokemon_v2_encounters(distinct_on: location_area_id) {pokemon_v2_locationarea{name}} name id height weight pokemon_v2_pokemonspecy { pokemon_v2_pokemoncolor {name}} pokemon_v2_pokemontypes { pokemon_v2_type {name}} }}`})
                }).then(r => r.json())
                .then(data => {
                    this.pokemons = [...data.data.pokemon_v2_pokemon];
                })
            }
            else
            {
                fetch( 'https://beta.pokeapi.co/graphql/v1beta',{
                    method: 'POST',
                    body: JSON.stringify({query : `{ pokemon_v2_pokemon(where: {name: {_ilike: "${value}%"}}) { pokemon_v2_encounters(distinct_on: location_area_id) {pokemon_v2_locationarea{name}} name id height weight pokemon_v2_pokemonspecy { pokemon_v2_pokemoncolor {name}} pokemon_v2_pokemontypes { pokemon_v2_type {name}} }}`})
                }).then(r => r.json())
                .then(data => {
                    this.pokemons = [...data.data.pokemon_v2_pokemon];
                })
            }
            
        },
        testF() {
            fetch('https://www.lesnumeriques.com', {method:'GET'})
            .then(r => r.json())
            .then(data => console.log('data returned:', data));
        },
        addOffset(index) {
            this.pokeOffset = index
        }
    }
})