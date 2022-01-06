app.component('pokemon-card', {
    props: {
        id: Number,
        name: String,
        weight: Number,
        height: Number,
        color: String,
        types: Array,
        locations: Array
    },
    data() {
        return {
            picture: null,
            divIsShow: false,
        }
    },
    template:
        /*html*/
        `
        <div class="pokemon_card" :class='"type-"+types[0].pokemon_v2_type.name'  v-on:click="switchDiv" >
            <div class="first_infos">
                <div class="info_div">
                    <h2 class="poke_name" :style="{color: getColor}">{{name}}</h2>
                    <div class="label_div">
                        <p class="white_p">#{{id}}</p>
                    </div>
                    <div class="label_div" v-for="type in types">
                        <p class="white_p">{{type.pokemon_v2_type.name}}</p>
                    </div>
                    
                    
                    
                </div>

            
                <div class="img_div">
                    <img class="card_img" :alt="name" :src="picture" :style="{outlineColor: getColor}">
                </div>
            </div>
            <div class="more_infos" v-show="divIsShow" >
            <hr/>
                <h2 class="poke_name" :style="{color: getColor}">infos complémentaires </h2>
                <div class="label_div">
                Weight : {{weight}}
                </div>
                <div class="label_div">
                Height : {{height}}
                </div>
                <div class="label_div">
                <p class="white_p">Zones de capture : {{locations.length}} </p>
                </div>
                <div class="label_div" v-for="location in locations">
                    <p class="white_p">{{location.pokemon_v2_locationarea.name}}</p>
                </div>
            </div>

        </div>
        `,
    async mounted() {
        let picture = "./assets/images/image_not_found.jpg"
        let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/" + this.id + ".svg"

        const response = await fetch(imgUrl).catch(() => this.picture = picture)
        if (response.status >= 200 && response.status <= 209) {
            this.picture = imgUrl
        }
        else
            this.picture = picture

    },
    methods: {
        switchDiv() {
            console.log("switch")
            this.divIsShow = ! this.divIsShow
        }
    },
    computed: {
        getColor() {
            if (this.color === "white")
                return 'gray'
            else if (this.color === "yellow")
                return 'darkgoldenrod'

            return this.color
        }
    }

})