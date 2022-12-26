<script>
    // @ts-nocheck
    import TabName from '/src/components/main/TabName.vue'
    import MainItem from '/src/components/main/MainItem.vue'

    import { ArrowLeft, Locate, TextCursorInput } from 'lucide-vue-next';

    import cas_list from '/src/ent_list.json'

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
                etabs: [],
                inLoading: false,
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
                        gravity: "top",
                        position: "center",
                    }).showToast();
                }
            },
            async askPostal() {
                // demande le code postal
                const postal = prompt("Entrez votre code postal");

                // commence le chargement
                this.inLoading = true;

                try {
                  const response = await fetch('https://api.androne.dev/papillon-v4/cors.php?url=https%3A%2F%2Fpositionstack.com%2Fgeo_api.php%3Fquery%3Dfrance%2B' + postal);
                  const data = await response.json();
                  
                  // obtient la localisation depuis l'API (html encoded)
                  const location = JSON.parse(decodeHtml(data.content)).data[0];
  
                  await this.searchEtabs({
                    coords: {
                      latitude: location.latitude,
                      longitude: location.longitude
                    }
                  });
                }
                catch (error) {
                  // affiche un message d'erreur
                  console.error(error);

                  Toastify({
                        text: "Une erreur est survenue lors de la recherche avec votre code postal",
                        gravity: "top",
                        position: "center",
                        className: "notification error",
                    }).showToast();
                }
                finally {
                  this.inLoading = false;
                }
            },
            /** @param {{ coords: { latitude: number, longitude: number } }} position */
            async searchEtabs(position) {
              const body = new URLSearchParams();
              body.set("data", JSON.stringify({
                nomFonction: "geoLoc",
                lat: position.coords.latitude.toString(),
                long: position.coords.longitude.toString()
              }));

              const headers = new Headers();
              headers.set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

              try {
                this.inLoading = true;

                const response = await fetch('https://www.index-education.com/swie/geoloc.php', {
                  method: "POST",
                  headers,
                  body
                });
                
                let data = await response.json();
                data = Array.isArray(data) ? data : [];

                this.etabs = data;
              }
              catch (error) {
                console.error(error);
              }
              finally {
                this.inLoading = false;
              }
            },
            decodeHtml(text) {
                var txt = document.createElement("textarea");
                txt.innerHTML = text;
                return txt.value;
            },
            async selectEtab(url, name) {
                if (url == "" || url == null) {
                    Toastify({
                        text: "Impossible d'utiliser la détection automatique",
                        gravity: "top",
                        position: "center",
                        className: "notification error",
                    }).showToast();

                    return;
                }

                if (!url.includes("eleve.html")) {
                    if (url.includes("/pronote/")|| url.includes("/ProNote/")) {
                        url = url + "eleve.html";
                    } else {
                        url = url + "/" + "eleve.html";
                    }
                }

                try {
                    // démarre le chargement
                    this.inLoading = true;

                    if (url.includes("/ProNote/")) {
                        url = url.replace("index-education.net", "pronote.toutatice.fr");
                    }

                    const response = await fetch(`https://api.androne.dev/papillon-v4/redirect.php?url=${encodeURIComponent(url)}`);
                    const data = await response.json();

                    let resp = data.url
                    let etab = url;

                    //cas_host = host with subdomain
                    let cas_host = resp.split('/')[2];
                    cas_host = cas_host.split('/')[0] || cas_host;

                    if(cas_host.includes("index-education.net")) {
                        cas_host = "index-education.net";
                    }

                    if (cas_host.includes("pronote.toutatice.fr")) {
                        cas_host = "www.toutatice.fr";
                    }

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
                        cas = all_cas_same_host[0].py;
                    }else if(all_cas_same_host.length > 1) {
                        // multiple CAS for this host
                        // show CAS selection
                        // TODO: ehance this haha
                       let nb_choices = prompt("Il y a plusieurs CAS pour cet établissement, veuillez choisir le bon en entrant le numéro correspondant à votre choix.\n\n" + all_cas_same_host.map((cas, i) => `${i+1} - ${cas.name}`).join("\n"));
                       if (nb_choices == null || nb_choices == "" || all_cas_same_host[nb_choices-1] == null) {
                            Toastify({
                                text: "Vous n'avez pas choisi de CAS",
                                className: "notification error",
                                gravity: "top",
                                position: "center",
                            }).showToast();
                           return;
                       } 
                        cas = all_cas_same_host[parseInt(nb_choices)-1].py;
                    }
                    // put etab to lowercase
                    etab = etab.toLowerCase();

                    // save url and cas in local storage
                    localStorage.setItem('etab', etab);
                    localStorage.setItem('cas', cas);
                    localStorage.setItem('name', name);

                    // redirect to next page
                    window.location.href = '/setup_3';
                }
                catch (error) {
                    // toutatice bypass bc of weird API
                    // replace index-education.net with pronote.toutatice.fr
                    console.error(error);

                    // affiche un message d'erreur
                    if (url.includes("pronote.toutatice.fr") || !url.includes("index-education.net")) {
                        Toastify({
                            text: "Impossible de déterminer l'établissement",
                            className: "notification error",
                            gravity: "top",
                            position: "center",
                        }).showToast();
                    }
                }
                finally {
                    this.inLoading = false;
                }
            }
        },
    }
</script>

<template>
    <div id="loginMain">
        <div class="quietLoading" v-if="inLoading">
            <div class="quietLoadingBar"></div>
        </div>
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
