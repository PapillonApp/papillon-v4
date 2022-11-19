<script lang="ts">
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import NoItem from '@/components/main/NoItem.vue';
    import { CalendarOff, ServerCrash } from 'lucide-vue-next';

    import axios from 'axios'
    
    export default {
        name: 'CoursTab',
        components: {
            TabName,
            CoursElement,
            NoItem,
            LoadingItem,
            CalendarOff,
            ServerCrash
        },
        data() {
            return {
                cours: [],
                loading: true,
                empty: false,
                error: ""
            }
        },
        methods: {
            getCours: function() {
                // set vars
                this.loading = true;
                this.empty = false;
                this.error = "";
                this.cours = [];

                // get token
                let token = localStorage.getItem('token')
                
                // get cours url
                let coursURL = API + "/edt" + "?token=" + token + "&from=" + rnString;

                // retreive data from API
                axios.get(coursURL)
                    .then(response => {
                        // set loading to false
                        this.loading = false

                        // apply data
                        this.cours = response.data.data.timetable

                        // check if empty
                        if(this.cours.length == 0) {
                            this.empty = true
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.error = error;
                        this.loading = false;
                        this.empty = false;
                    })
            }
        },
        mounted() {
            this.getCours()

            document.addEventListener('dateChanged', () => {
                this.getCours()
            })
        }
    } 
</script>

<template>
    <TabName name="Emploi du temps" calendar logged />
    <div id="content">

        <LoadingItem v-if="loading" title="Récupération de votre emploi du temps..." subtitle="Veuillez patienter..." />
        
        <NoItem v-if="empty" title="Pas de cours prévus pour cette journée" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
            <CalendarOff />
        </NoItem>

        <NoItem v-if="error" title="Oups, quelque chose s'est mal passé !" :subtitle="error">
            <ServerCrash />
        </NoItem>

        <div class="list">
            <CoursElement v-for="cours in cours" :time="cours.from" :name="cours.subject" :room="cours.room" :teacher="cours.teacher" :color="cours.color"/>
        </div>

    </div>
</template>

<style scoped>
</style>