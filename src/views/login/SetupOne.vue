<script>
    // @ts-nocheck
    import TabName from '/src/components/main/TabName.vue'
    import MainItem from '/src/components/main/MainItem.vue'

    import { MapPin, Link, Bug } from 'lucide-vue-next';

    import axios from 'axios'
    import cas_list from '/src/ent_list.json'
    import etab_list from '/src/etab_list.json'

    export default {
        name: 'LoginPage',
        components: {
            TabName,
            MainItem,
            MapPin,
            Link
        },
        data() {
            return {
                
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

        <h1>Bienvenue dans Pronote+ 👋</h1>
        <p class="desc">Sélectionnez une méthode de connexion à votre compte Pronote.</p>

        <MainItem style="background-color: crimson; margin-bottom: 20px;">
            <template #icon>
                <Bug />
            </template>
            <template #content>
                <h3>Fin de support</h3>
                <p>Pronote+ v4 arrive à son terme de support. Nous vous conseillons de passer à Papillon v5 dès que possible afin de profiter de la meilleure interface pour Pronote.</p>
            </template>
        </MainItem>

        <div class="list group">
            <RouterLink to="/setup_2"><MainItem>
                <template #icon>
                    <MapPin />
                </template>
                <template #content>
                    <h3>Trouver mon établissement</h3>
                    <p>Trouvez simplement votre établissement avec la géolocalisation</p>
                </template>
            </MainItem></RouterLink>
            <RouterLink to="/login"><MainItem>
                <template #icon>
                    <Link />
                </template>
                <template #content>
                    <h3>Se connecter avec une URL</h3>
                    <p>Utilisez le lien de votre instance Pronote (utilisateurs avancés)</p>
                </template>
            </MainItem></RouterLink>
        </div>
    </div>
</template>

<style scoped>
    
</style>