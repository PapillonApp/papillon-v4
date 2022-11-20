<script lang="ts">
    import TabName from '/src/components/main/TabName.vue'
    import MainItem from '/src/components/main/MainItem.vue'

    import { ArrowLeft } from 'lucide-vue-next';

    import axios from 'axios'
    import cas_list from '/src/ent_list.json'
    import etab_list from '/src/etab_list.json'

    export default {
        name: 'LoginPage',
        components: {
            TabName,
            MainItem,
            ArrowLeft
        },
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods : {
            login() {
                // collect data
                let loginData = {
                    username: this.username,
                    password: this.password,
                    url: localStorage.getItem('etab'),
                    cas: localStorage.getItem('cas')
                }

                // send login request
                axios.get(constructAuthURL(loginData))
                    .then((response) => {

                        // check if token is valid
                        if(response.data.token != undefined) {
                            // save token
                            localStorage.setItem('token', response.data.token)
                            // save credentials
                            localStorage.setItem('loginData', JSON.stringify(loginData))

                            // redirect to home
                            window.location.href = '/'
                        }
                        else {
                            // get error from dictionnary
                            let error = API_LOGIN_ERRORS[response.data.message]
                            // show error
                            Toastify({
                                text: error.message,
                                className: "notification",
                                gravity: "bottom"
                            }).showToast();
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }
</script>

<template>
    <div id="loginMain">
        <div class="topNav">
            <img src="/full_logo.svg" alt="logo" id="logo">
            <a class="terms" href="https://pronote.plus/assets/terms_privacy_25092022_rev0.pdf" v-wave>Termes & conditions</a>
        </div>

        <h1>Indiquez vos identifiants</h1>
        <p class="desc">Nous avons trouvé votre établissement ! Entrez vos identigiants pour continuer</p>

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

        <div class="login">
            <input v-model="username" v-wave class="input" type="text" placeholder="identifiant" />
            <input v-model="password" v-wave class="input" type="password" placeholder="mot de passe" />
        </div>

        <button v-wave class="loginBtn" v-on:click="login">se connecter</button>
    </div>
</template>

<style scoped>
    .loginBtn {
        margin-top: 10px;
        padding: 13px 22px;
        background: var(--brand-color);
        color: #fff;
        border-radius:300px;
        border: none;
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
</style>