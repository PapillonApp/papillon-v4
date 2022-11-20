<script lang="ts">
    import TabName from '/src/components/main/TabName.vue'
    import axios from 'axios'
    import cas_list from '/src/ent_list.json'
    import etab_list from '/src/etab_list.json'
    export default {
        name: 'LoginPage',
        components: {
            TabName
        },
        data() {
            return {
                cas_list: cas_list,
                etab_list: etab_list,
                cas : 'undefined',
                username: '',
                password: '',
                ent: 'undefined',
                ent_custom: '',
            }
        },
        methods: {
            login: function(event) {

                if (this.cas == 'undefined' || this.ent == 'undefined') {
                    Toastify({
                        text: "Merci de choisir un " + (this.cas == 'undefined' ? this.ent == 'undefined' ? "établissement et un ENT" : "ENT" : "établissement"),
                        className: "notification",
                        gravity: "bottom",
                        backgroundColor: "red",
                    }).showToast();
                    return
                }

                // collect data
                let loginData = {
                    username: this.username,
                    password: this.password,
                    url: this.ent == "custom" ? this.ent_custom : this.ent,
                    cas: this.cas
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
        },
        mounted() {
            // check if saved credentials
            if(localStorage.getItem('loginData') != null) {
                // get saved credentials
                let loginData = JSON.parse(localStorage.getItem('loginData'))

                // fill inputs
                this.username = loginData.username
                this.password = loginData.password
                this.ent = loginData.url
                this.cas = loginData.cas
                
                // auto login
                this.login()
                Toastify({
                    text: "Reconnexion...",
                    className: "notification",
                    gravity: "bottom"
                }).showToast();
            }

            // get ent list
        }
    }
</script>

<template>
    <TabName name="bienvenue dans Pronote+" />
    <div id="content">
        <h1>connectez-vous à Pronote ou à un ENT</h1>
        <h4>utilisez vos identifiants Pronote ou ceux de votre ENT/EduConnect pour vous connecter.</h4>
        <div id="ents">
            <div class="ent-list"></div>
        </div>

        <div class="login">
            <input v-model="username" v-wave class="input" type="text" placeholder="identifiant" />
            <input v-model="password" v-wave class="input" type="password" placeholder="mot de passe" />

            <select v-model="ent" v-wave class="select">
                <option value="undefined" disabled>Choisissez votre établissement</option>
                <option value="custom">url pronote personnalisée</option>
                <option v-for="ent in etab_list" :value="ent.url" v-bind:key="ent.url">{{ ent.name }}</option>
            </select>

            <input v-model="ent_custom" v-wave class="input" type="text" placeholder="URL pronote personnalisée" v-if="ent == 'custom'"  />
            
            <select v-model="cas" v-wave class="select">
                <option value="undefined" selected="true" disabled hidden>choisissez votre ENT</option>
                <option value="none">Aucun</option>
                <option v-for="ent in cas_list" :value="ent.cas" v-bind:key="ent.cas">{{ ent.name }}</option>
            </select>
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

    .input {
        width: 100%;
        height: 40px;
        border: none;
        padding: 22px 17px;
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
    }

    .input:focus {
        outline: none;
    }

    select {
        padding: 11px 17px !important;
        font-size: 16px !important;
        width: 100%;
        height: 50px;
        background: var(--background);
        border: 1px solid var(--border);
        color: var(--text) !important;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    select option {
        color: var(--text) !important;
        padding-left: 20px;
    }

    select:focus {
        outline: none;
    }

    .login {
        margin-top: 32px;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    h1 {
        color: var(--brand-color);
        font-weight: 600;
        font-size: 36px;
        line-height: 90%;
        text-transform: none;
        margin-top: 8px;
    }

    h4 {
        color: var(--text);
        opacity: 50%;
        font-weight: 400;
        font-size: 20px;
        line-height: 90%;
        text-transform: none;
        margin-top: 10px;
    }

    #ents {
        margin-top: 10px;
        overflow: hidden;
    }

    .ent-list {
        height: 24px;
        width: 1104px;
        background: url('../../public/ent-list.png');
        background-size: 100%;
        animation: ent-list 7s linear infinite;
    }

    @media screen and (prefers-color-scheme: light) {
        .ent-list {
            background: url('../../public/ent-list-dark.png');
            background-size: 100%;

        }
    }

    @keyframes ent-list {
        0% {
            opacity: 0;
            transform: translateX(0);
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateX(-500px);
        }
    }
</style>