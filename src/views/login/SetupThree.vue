<script>
    // @ts-nocheck
    import TabName from '/src/components/main/TabName.vue'
    import MainItem from '/src/components/main/MainItem.vue'

    import { ArrowLeft, Info } from 'lucide-vue-next';

    import axios from 'axios'
    import cas_list from '/src/ent_list.json'
    import etab_list from '/src/etab_list.json'

    export default {
        name: 'LoginPage',
        components: {
            TabName,
            MainItem,
            ArrowLeft,
            Info
        },
        data() {
            return {
                username: '',
                password: '',
                url: localStorage.getItem('etab'),
                cas: localStorage.getItem('cas'),
                name: localStorage.getItem('name'),
                inLoading: false,

                casName: cas_list.filter(casList => casList.py == localStorage.getItem('cas'))[0].name,
                educonnect: cas_list.filter(casList => casList.py == localStorage.getItem('cas'))[0].educonnect
            }
        },
        methods : {
            login() {
                
                if (this.username == '' || this.password == '') {
                    Toastify({
                        text: "Merci de remplir tous les champs.",
                        className: "notification error",
                        gravity: "top",
                        position: "center",
                    }).showToast();
                    return
                }

                this.inLoading = true;

                // collect data
                let loginData = {
                    username: this.username,
                    password: this.password,
                    url: this.url,
                    cas: this.cas
                }

                // send login request
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("url", loginData.url);
                urlencoded.append("ent", loginData.cas);
                urlencoded.append("username", loginData.username);
                urlencoded.append("password", loginData.password);

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
                };

                fetch(API + "/generatetoken", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.inLoading = false;
                    if(result.token != false) {
                        // save credentials
                        localStorage.setItem('loginData', JSON.stringify(loginData))
                        localStorage.setItem('token', result.token)

                        // redirect to home
                        location.href = '/';
                    } else {
                        if(result.error.split('(')[0] == "HTTPSConnectionPool") {
                            Toastify({
                                text: "L'établissement suivant n'existe pas sur cet ENT.",
                                className: "notification error",
                                gravity: "top",
                                position: "center",
                            }).showToast();
                        }
                        else if (result.error == "('Decryption failed while trying to un pad. (probably bad decryption key/iv)', 'exception happened during login -> probably bad username/password')" || result.error.includes("probably wrong login information")) {
                            Toastify({
                                text: "Identifiants incorrects ou ENT non supporté.",
                                className: "notification error",
                                gravity: "top",
                                position: "center",
                            }).showToast();
                        }
                        else {
                            Toastify({
                                text: "Une erreur est survenue. Veuillez réessayer.",
                                className: "notification error",
                                gravity: "top",
                                position: "center",
                            }).showToast();
                        }
                    }
                })
            }
        }
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

        <h1>Indiquez vos identifiants</h1>
        <p class="desc ae">Nous avons trouvé votre établissement ! Vous êtes au {{name}} et vous utilisez l'ENT {{casName}}</p>

        <div class="list group">
            <RouterLink to="/setup_2"><MainItem>
                <template #icon>
                    <ArrowLeft />
                </template>
                <template #content>
                    <h3>Revenir en arrière</h3>
                    <p>Retourner à la page précédente</p>
                </template>
            </MainItem></RouterLink>
        </div>
        
        <div class="list group educonnect" v-if="educonnect">
            <MainItem class="educonnect">
                <template #icon>
                    <Info />
                </template>
                <template #content>
                    <h3>Connexion avec ÉduConnect</h3>
                    <p style="color: var(--text);">Veuillez utiliser vos identifiants ÉduConnect pour vous connecter avec cet ENT</p>
                </template>
            </MainItem>
        </div>

        <div class="login">
            <input v-model="username" v-wave class="input" type="text" placeholder="Identifiant" />
            <input v-model="password" v-wave class="input" type="password" placeholder="Mot de passe" />
        </div>

        <button v-wave class="loginBtn" v-on:click="login">Se connecter</button>
    </div>
</template>

<style scoped>
    .educonnect {
        background-color: rgba(71, 145, 255, 0.1);
        color: #4791FF !important;
    }

    .group.educonnect {
        margin-top: 10px;
    }

    .loginBtn {
        margin-top: 10px;
        padding: 13px 22px;
        background: none;
        color: #fff;
        border: 1px solid #fff !important;
        border-radius:300px;;
        font-size: 17px;
        font-weight: 600;
        padding-bottom: 10px;
    }

    .login {
        margin-top: 32px;
    }

    .login * {
        margin: 0;
        padding: 0;
    }

    .input {
        width: calc(100% - 17px * 2);
        height: 40px;
        border: none;
        padding: 5px 17px;
        font-size: 16px;
        margin-bottom: 10px;

        background: var(--element);
        border-bottom: 1px solid var(--border);
        border-radius: 5px 5px 0px 0px;

        color: var(--text) !important;

        font-size: 18px;
        font-weight: 600;
        line-height: 18px;
        letter-spacing: 0.005em;
        text-align: left; 

        text-transform: none;
    }

    .input:focus {
        outline: none;
    }

    .ae {
        text-transform: none;
    }
</style>