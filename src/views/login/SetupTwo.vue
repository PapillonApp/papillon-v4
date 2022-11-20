<script lang="ts">
    import TabName from '/src/components/main/TabName.vue'
    import MainItem from '/src/components/main/MainItem.vue'

    import { ArrowLeft, Locate, TextCursorInput } from 'lucide-vue-next';

    import axios from 'axios'
    import cas_list from '/src/ent_list.json'
    import etab_list from '/src/etab_list.json'

    export default {
        name: 'LoginPage',
        components: {
            TabName,
            MainItem,
            ArrowLeft,
            Locate,
            TextCursorInput
        },
        data() {
            return {
                etabs: []
            }
        },
        methods: {
            askLocation() {
                if (navigator.geolocation) {
                    // obtenir la position de l'utilisateur
                    navigator.geolocation.getCurrentPosition(this.searchEtabs);
                } else {
                    // afficher un message d'erreur
                    Toastify({
                        text: "La géolocalisation n'est pas supportée par votre navigateur",
                        className: "notification error",
                        gravity: "bottom",
                    }).showToast();
                }
            },
            askPostal() {
                // demande le code postal
                let postal = prompt("Entrez votre code postal");

                // obtient la localisation depuis l'API (html encoded)
                axios.get('https://api.allorigins.win/get?url=https%3A%2F%2Fpositionstack.com%2Fgeo_api.php%3Fquery%3Dfrance%2B' + postal)
                    .then(response => {
                        // affiche la localisation
                        let resp = JSON.parse(response.data.contents).data[0];
                        let latitude = resp.latitude;
                        let longitude = resp.longitude;

                        let location = {
                            coords: {
                                latitude: latitude,
                                longitude: longitude
                            }
                        }

                        this.searchEtabs(location);
                    })
                    .catch(error => {
                        // affiche un message d'erreur
                        console.error(error);
                    })
            },
            searchEtabs(position) {
                /* JQuery puisque Axios à la flemme visiblement */
                $.ajax('https://www.index-education.com/swie/geoloc.php', {
                    crossDomain: true,
                    data: {
                    data: JSON.stringify({
                        "nomFonction": "geoLoc",
                        "lat": position.coords.latitude,
                        "long": position.coords.longitude,
                    })
                    },
                    method: "POST"})
                    .done((data) => {
                        this.etabs = data;
                    })
            },
            decodeHtml(text) {
                var txt = document.createElement("textarea");
                txt.innerHTML = text;
                return txt.value;
            },
            selectEtab(url, name) {
                let etab = url;
                if(url == "" || url == null) {
                    Toastify({
                        text: "Impossible d'utiliser la détection automatique",
                        className: "notification error",
                        gravity: "bottom",
                    }).showToast();
                }

                // get etab final url
                axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.redirect-checker.net/?url='+url+'&timeout=5&maxhops=10&meta-refresh=1&format=json')}`)
                .then(response => {
                    let resp = JSON.parse(response.data.contents);
                    let last = resp.data[resp.data.length-1];
                    let cas_host = last.request.info.idn.host;

                    if(cas_host.includes("index-education.net")) {
                        cas_host = "index-education.net";
                    }

                    console.log(cas_host);
                    
                    let cas = cas_list.find(e => e.url === cas_host).cas

                    console.log(cas);

                    // save url and cas in local storage
                    localStorage.setItem('etab', etab);
                    localStorage.setItem('cas', cas);
                    localStorage.setItem('name', name);

                    // redirect to next page
                    location.href = '/setup_3';
                })
                .catch(error => {
                    // toutatice bypass bc of weird API
                    // replace index-education.net with pronote.toutatice.fr
                    console.log(error);
                    
                    if(url.includes("index-education.net")) {
                        this.selectEtab(url.replace("index-education.net", "pronote.toutatice.fr"), name);
                    }

                    // affiche un message d'erreur
                    if(url.includes("pronote.toutatice.fr") || !url.includes("index-education.net")) {
                        Toastify({
                            text: "Impossible de déterminer l'établissement",
                            className: "notification",
                            gravity: "bottom"
                        }).showToast();
                    }
                })
            }
        },
    }
</script>

<template>
    <div id="loginMain">
        <div class="topNav">
            <img src="/full_logo.svg" alt="logo" id="logo">
            <a class="terms" href="https://pronote.plus/assets/terms_privacy_25092022_rev0.pdf" v-wave>Termes & conditions</a>
        </div>

        <h1>Trouver mon établissement 🧐</h1>
        <p class="desc">Sélectionnez votre établissement parmi la liste.</p>

        <div class="list group">
            <RouterLink to="/setup_1"><MainItem>
                <template #icon>
                    <ArrowLeft />
                </template>
                <template #content>
                    <h3>Revenir en arrière</h3>
                    <p>Retourner à la page précédente</p>
                </template>
            </MainItem></RouterLink>
            <MainItem v-on:click="askLocation">
                <template #icon>
                    <Locate />
                </template>
                <template #content>
                    <h3>Utiliser la géolocalisation</h3>
                    <p>Trouver votre établissement avec votre position</p>
                </template>
            </MainItem>
            <MainItem v-on:click="askPostal">
                <template #icon>
                    <TextCursorInput />
                </template>
                <template #content>
                    <h3>Entrer mon code postal</h3>
                    <p>Utilisez votre code postal pour trouver votre établissement</p>
                </template>
            </MainItem>
        </div>

        <div class="list group" id="etabs">
            <MainItem v-for="etab in etabs" @click="selectEtab(etab.url, etab.nomEtab)">
                <template #icon>
                    <Locate />
                </template>
                <template #content>
                    <h3>{{decodeHtml(etab.nomEtab)}}</h3>
                    <p>{{decodeHtml(etab.url)}}</p>
                </template>
            </MainItem>
        </div>
    </div>
</template>

<style scoped>
    #etabs {
        margin-top: 24px;
        margin-bottom: calc(env(safe-area-inset-bottom) + 20px) !important;
    }
</style>