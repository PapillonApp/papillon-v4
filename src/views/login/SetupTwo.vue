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
                axios.get(`https://api.androne.dev/papillon-v4/redirect.php?url=${encodeURIComponent(url)}`)
                .then(response => {
                    
                    let resp = response.data.url
                    //cas_host = host with subdomain
                    let cas_host = resp.split('/')[2];
                    cas_host = cas_host.split('/')[0] || cas_host;
                    console.log(cas_host);

                    if(cas_host.includes("index-education.net")) {
                        cas_host = "index-education.net";
                    }

                    // more toutatice weird stuff
                    if(cas_host.includes("pronote.toutatice.fr")) {
                        cas_host = "www.toutatice.fr";
                    }

                    console.log(cas_host);
                    
                    
                    let all_cas_same_host = cas_list.filter(cas => cas.url == cas_host);
                    let cas = all_cas_same_host[0];

                    if (all_cas_same_host.length == 0) {
                        Toastify({
                            text: "Impossible de trouver le CAS de l'établissement",
                            className: "notification error",
                            gravity: "bottom",
                        }).showToast();
                    }else if (all_cas_same_host.length == 1) {
                        // only one CAS for this host
                        cas = all_cas_same_host[0].cas;
                    }else if(all_cas_same_host.length > 1) {
                        // multiple CAS for this host
                        // show CAS selection
                        // TODO: ehance this haha
                       let nb_choices = prompt("Il y a plusieurs CAS pour cet établissement, veuillez choisir le bon en entrant le numéro correspondant à votre choix.\n\n" + all_cas_same_host.map((cas, i) => `${i+1} - ${cas.name}`).join("\n"));
                       if (nb_choices == null || nb_choices == "" || all_cas_same_host[nb_choices-1] == null) {
                            Toastify({
                                text: "Vous n'avez pas choisi de CAS",
                                className: "notification error",
                                gravity: "bottom",
                            }).showToast();
                           return;
                       } 
                        cas = all_cas_same_host[parseInt(nb_choices)-1].cas;
                    }
                    // TODO: Vérifier si ca fonctionne pour toutatice
                    if(url == resp && url.includes("index-education.net")) {
                        // car toutatice est chelou
                        this.selectEtab(url.replace("index-education.net", "pronote.toutatice.fr"), name);
                    }
                    else {
                        // save url and cas in local storage
                        localStorage.setItem('etab', etab);
                        localStorage.setItem('cas', cas);
                        localStorage.setItem('name', name);

                        // redirect to next page
                        location.href = '/setup_3';
                    }
                })
                .catch(error => {
                    // toutatice bypass bc of weird API
                    // replace index-education.net with pronote.toutatice.fr
                    console.log(error);

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
            <a class="terms" href="https://pronote.plus/assets/terms_privacy_23112022_rev0.pdf" v-wave>Termes & conditions</a>
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