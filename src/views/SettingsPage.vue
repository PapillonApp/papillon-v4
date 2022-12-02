<script lang="ts">
    // @ts-nocheck
    import TabName from '../components/main/TabName.vue'
    import MainItem from '../components/main/MainItem.vue'
    import MainCategory from '../components/main/MainCategory.vue'

    import { RefreshCcw, LogOut, Bug, Trash2, Cake, Delete } from 'lucide-vue-next';

    let userData = JSON.parse(localStorage.getItem('userData'))

    let avatar = userData.avatar;
    let name = userData.name;
    let establishment = userData.establishment.name;
    let className = userData.studentClass.name;

    let firstName = name.split(' ').pop();

    export default {
        components: {
            TabName,
            MainItem,
            MainCategory,
            RefreshCcw,
            LogOut,
            Bug,
            Trash2,
            Cake,
            Delete
        },
        methods: {
            logout() {
                localStorage.removeItem('loginData')
                localStorage.removeItem('token')
                location.reload()
            },
            refresh() {
                refreshToken()
            },
            emptyCache() {
                emptyCache()
            },
            showAbout() {
                // redirect to "/about"
                this.$router.push({ name: 'about' })
            },
            retrospective() {
                // redirect to "/about"
                this.$router.push({ name: 'recap' })
            },
            resetsettings() {
                localStorage.removeItem('brandColor')
                localStorage.removeItem('fontFamily')
                localStorage.removeItem('textTransform')
                localStorage.removeItem('sur20')
                location.reload()
            }
        },
        data() {
            return {
                avatar,
                firstName,
                establishment,
                className,
                version : APP_VERSION
            }
        },
        mounted() {
            document.addEventListener('userDataUpdated', () => {
                let userData = JSON.parse(localStorage.getItem('userData'))

                this.avatar = userData.avatar;
                this.firstName = userData.name.split(' ').pop();
                this.establishment = userData.establishment.name;
                this.className = userData.studentClass.name;
            })

            // get --brand-color
            let brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim()

            // set it as value for input
            document.querySelector('#brand-color').value = brandColor

            // listen for changes
            document.querySelector('#brand-color').addEventListener('input', (e) => {
                // set it as value for --brand-color
                document.documentElement.style.setProperty('--brand-color', e.target.value)

                // save it in localStorage
                localStorage.setItem('brandColor', e.target.value)
            })

            // get --font-family
            let fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim().replace(/"/g, '')
            
            // set it as value for input
            document.querySelector('#brandFont').value = fontFamily

            // listen for changes
            document.querySelector('#brandFont').addEventListener('input', (e) => {
                // set it as value for --font-family
                document.documentElement.style.setProperty('--font-family', `"${e.target.value}"`)

                // save it in localStorage
                localStorage.setItem('fontFamily', e.target.value)
            })

            // get text transform
            let textTransform = getComputedStyle(document.documentElement).getPropertyValue('--text-transform').trim()

            if(textTransform == "lowercase") {
                document.querySelector('#lowercaseText').checked = true
            }

            // listen for changes
            document.querySelector('#lowercaseText').addEventListener('change', (e) => {
                if(e.target.checked) {
                    document.documentElement.style.setProperty('--text-transform', "lowercase")

                    // save it in localStorage
                    localStorage.setItem('textTransform', "lowercase")
                } else {
                    document.documentElement.style.setProperty('--text-transform', "none")

                    // save it in localStorage
                    localStorage.setItem('textTransform', "none")
                }
            })

            // listen for changes on sur20
            document.querySelector('#sur20').addEventListener('change', (e) => {
                if(e.target.checked) {
                    // save it in localStorage
                    localStorage.setItem('sur20', "true")
                } else {
                    // save it in localStorage
                    localStorage.setItem('sur20', "false")
                }
            })
        }
    }
</script>

<template>
    <TabName name="Mon compte" logged />
    <div id="content">
        
        <div id="profile">
            <img :src="avatar" class="avatarBackground" />
            <div class="profileData" v-wave>
                <img :src="avatar" class="avatar" />
                <h3>Bonjour, {{firstName}} !</h3>
                <p>Vous êtes en classe de {{className}} à {{establishment}}</p>
            </div>
        </div>

        <MainCategory title="Autres fonctionnalités"/>

        <div class="retrospective" v-wave v-on:click="retrospective">
            <img src="/retrospective.svg" />
        </div>

        <MainCategory title="paramètres"/>

        <div class="setting">
            <div class="settingName">
                <h3>Couleur de l'interface</h3>
                <p class="settingDescription">Choisissez la couleur de l'interface de Pronote+</p>
            </div>
            <div class="settingValue">
                <input type="color" id="brand-color" />
            </div>
        </div>

        <div class="setting">
            <div class="settingName">
                <h3>Police de l'interface</h3>
                <p class="settingDescription">Choisissez la police d'écriture de l'interface de Pronote+</p>
            </div>
            <div class="settingValue">
                <select id="brandFont">
                    <option value="Papillon">Papillon (Défaut)</option>
                    <option value="system-ui">Système</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lora">Lora</option>
                    <option value="Barlow">Barlow</option>
                    <option value="Indie Flower">Indie Flower</option>
                    <option value="Exo 2">Exo 2</option>
                    <option value="IBM Plex Mono">IBM Plex Mono</option>
                </select>
            </div>
        </div>

        <div class="setting">
            <div class="settingName">
                <h3>Utiliser des textes minuscules par défaut</h3>
                <p class="settingDescription">Si vous préférez voir les textes de base, cochez cette case</p>
            </div>
            <div class="settingValue">
                <input type="checkbox" checked id="lowercaseText" />
            </div>
        </div>

        <MainCategory title="Tweaks"/>

        <div class="setting">
            <div class="settingName">
                <h3>Mettre automatiquement les notes sur 20 (nécéssite un redémarrage)</h3>
                <p class="settingDescription">Remplace les notes par leur calcul sur une base de 20 points.</p>
            </div>
            <div class="settingValue">
                <input type="checkbox" id="sur20" />
            </div>
        </div>

        <MainCategory title="options avancées"/>

        <!-- reset token -->
        <MainItem v-on:click="refresh">
            <template #icon>
                <RefreshCcw />
            </template>
            <template #content>
                <h3>Rafraîchir le token</h3>
                <p>Actualiser les données téléchargées depuis l'instance Pronote</p>
            </template>
        </MainItem>

        <MainItem v-on:click="resetsettings">
            <template #icon>
                <Delete />
            </template>
            <template #content>
                <h3>Réinitialiser les paramètres</h3>
                <p>Rétablit les paramètres par défaut sans se déconnecter</p>
            </template>
        </MainItem>

        <!-- logout -->
        <MainItem v-on:click="logout">
            <template #icon>
                <LogOut />
            </template>
            <template #content>
                <h3>Se déconnecter</h3>
                <p>Supprimer les données d'identification et de connexion</p>
            </template>
        </MainItem>

        <!-- empty cache -->
        <MainItem v-on:click="emptyCache">
            <template #icon>
                <Trash2 />
            </template>
            <template #content>
                <h3>Vider le cache</h3>
                <p>Oublier les cours et pages pré-enregistrées</p>
            </template>
        </MainItem>

        <MainItem class="beta" v-on:click="showAbout">
            <template #icon>
                <Bug />
            </template>
            <template #content>
                <h3>A propos de Pronote+</h3>
                <p>Vous utilisez une version expérimentale de Pronote+ (version {{version}})</p>
            </template>
        </MainItem>

    </div>
</template>

<style scoped>
    #profile {
        width: 100%;
        height: 170px !important;
        overflow: visible;
        position: relative;
        border-radius: 10px;

        color: #fff;
        box-shadow: var(--shadow) !important;
    }

    .avatarBackground {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }

    .profileData {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #00000055;

        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }

    .profileData * {
        margin: 0;
        padding: 0;
    }

    .profileData .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }

    .profileData h3 {
        font-size: 24px;
        line-height: 24px;
        color: #FFFFFF;
        margin-top: 12px;
        text-transform: none;
    }

    .profileData p {
        font-size: 17px;
        line-height: 17px;
        color: #FFFFFF;
        margin-top: 5px;
        text-align: center;
        font-weight: 400;
        opacity: 50%;
        text-transform: none;
    }

    .beta {
        background: #ecb500;
        color: #000 !important;
    }

    .retrospective {
        margin-top: 10px;
        color: #fff;

        border-radius: 10px;
        overflow: hidden;

        background: linear-gradient(
            -45deg,
            #202cd0,
            #007c76,
            #ff4605,
            #f8a42f,
            #d3312e,
            #ea0000,
            #50010a
        );
        background-size: 400% 400%;
        animation: backgroundChange1 10s ease infinite;

        box-shadow: var(--shadow) !important;
    }

    @keyframes backgroundChange1 {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

    .retrospective img {
        width: 100%;
    }

    .setting {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0px;
    }

    .setting * {
        margin: 0;
        padding: 0;
    }

    .settingName {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 5px;
    }

    .settingName h3 {
        font-size: 17px;
        line-height: 17px;
        color: var(--text);
        margin-top: 12px;
        text-transform: none;
    }

    .settingName p {
        font-size: 16px;
        line-height: 16px;
        color: var(--text);
        font-weight: 400;
        opacity: 50%;
        text-transform: none;
    }

    .setting select {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        border: none;
        padding: 0 10px;
        font-size: 16px;
        color: var(--text);
        background: var(--background);
        box-shadow: var(--shadow);
        min-width: 35vw;
        text-transform: none;
    }

    .setting select:focus {
        outline: none;
    }
</style>