<script lang="ts">
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import NoItem from '@/components/main/NoItem.vue';
    import { CalendarOff, ServerCrash } from 'lucide-vue-next';

    import axios from 'axios'

    import CoursModal from '../views/cours/CoursModal.vue'
    
    export default {
        name: 'CoursTab',
        components: {
            TabName,
            CoursElement,
            NoItem,
            LoadingItem,
            CoursModal,
            CalendarOff,
            ServerCrash
        },
        data() {
            return {
                cours: [],
                loading: true,
                empty: false,
                error: "",
                showCoursModal: false
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

                        // error handling
                        if(response.data.errors) {
                            refreshToken()
                        }

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
            },
            openCoursModal: function(cours) {
                this.$vfm.show("coursModal", {
                    subject: cours.subject,
                    teacher: cours.teacher,
                    room: cours.room,
                    from: new Date(cours.from).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    to: new Date(cours.to).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    color: cours.color
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
        <vue-final-modal v-model="showCoursModal" name="coursModal">
            <template v-slot="{ params }">
                <div class="modal coursModal">
                    <div class="modal-header">
                        <p>{{params.subject}}</p>
                        <small>{{params.teacher}} - {{params.room}}</small>
                    </div>
                    <div class="modal-content">
                        <p class="categoryTitle">Détail des horaires</p>
                        <p>Commence le <B>{{params.from}}</B></p>
                        <p>Se termine le <B>{{params.to}}</B></p>
                    </div>
                </div>
            </template>
        </vue-final-modal>

        <LoadingItem v-if="loading" title="Récupération de votre emploi du temps..." subtitle="Veuillez patienter..." />
        
        <NoItem v-if="empty" title="Pas de cours prévus pour cette journée" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
            <CalendarOff />
        </NoItem>

        <NoItem v-if="error" title="Oups, quelque chose s'est mal passé !" :subtitle="error">
            <ServerCrash />
        </NoItem>

        <div class="list">
            <CoursElement v-for="cours in cours" v-on:click="openCoursModal(cours)" :time="cours.from" :name="cours.subject" :room="cours.room" :status="cours.status" :teacher="cours.teacher" :color="cours.color"/>
        </div>
    </div>
</template>

<style scoped>
    .modal-header small {
        text-transform: none;
    }

    hr {
        margin: 20px 0px;
        opacity: 0.2;
    }

    .modal-content .categoryTitle {
        font-size: 16px;
        font-weight: 400;
        opacity: 0.5;
        padding-bottom: 5px !important;
        border-bottom: 1px solid var(--border);
        margin-bottom: 12px;
    }
</style>