<script lang="ts">
    import TabName from '../components/main/TabName.vue'
    import MainItem from '../components/main/MainItem.vue'
    import MainCategory from '../components/main/MainCategory.vue'

    import { RefreshCcw, LogOut, Bug } from 'lucide-vue-next';

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
            Bug
        },
        methods: {
            logout() {
                localStorage.removeItem('loginData')
                localStorage.removeItem('token')
                location.reload()
            },
            refresh() {
                refreshToken()
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

        <MainCategory title="Paramètres"/>

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

        <MainItem class="beta">
            <template #icon>
                <Bug />
            </template>
            <template #content>
                <h3>Programme beta</h3>
                <p>Vous utilisez une version expérimentale de Pronote+ (version {{version}})</p>
            </template>
        </MainItem>

    </div>
</template>

<style scoped>
    #profile {
        width: 100%;
        height: 170px !important;
        overflow: hidden;
        position: relative;
        border-radius: 10px;
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
</style>