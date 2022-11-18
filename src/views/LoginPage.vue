<script lang="ts">
    import TabName from '/src/components/main/TabName.vue'
    import axios from 'axios'

    export default {
        name: 'LoginPage',
        components: {
            TabName
        },
        methods: {
            login: function(event) {
                // collect data
                let loginData = {
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value,
                    url: document.getElementById('url').value,
                    cas: document.getElementById('cas').value
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
                document.getElementById('username').value = loginData.username
                document.getElementById('password').value = loginData.password
                document.getElementById('url').value = loginData.url
                document.getElementById('cas').value = loginData.cas
                
                // auto login
                this.login()
                Toastify({
                    text: "Reconnexion...",
                    className: "notification",
                    gravity: "bottom"
                }).showToast();
            }
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
            <input id="username" v-wave class="input" type="text" placeholder="identifiant" />
            <input id="password" v-wave class="input" type="password" placeholder="mot de passe" />

            <input id="url" v-wave class="input" type="url" placeholder="URL Pronote" />
            <select id="cas" v-wave class="select" placeholder="votre ENT">
                <option value="none">Aucun ENT</option>
                <option value="toutatice">Toutatice</option>
            </select>
        </div>

        <button v-wave class="loginBtn" v-on:click="login">se connecter</button>
    </div>
</template>

<style scoped>
    .loginBtn {
        margin-top: 20px;
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
        padding: 22px 17px !important;
        font-size: 16px !important;
        width: 100%;
        height: 45px;
        background: var(--background);
        border: 1px solid var(--border);
        color: var(--text) !important;
        border-radius: 5px;
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