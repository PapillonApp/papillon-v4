<script lang="ts">
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';
    import MainItem from '../components/main/MainItem.vue'

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import NoItem from '@/components/main/NoItem.vue';
    import { CalendarOff, ServerCrash, CalendarPlus } from 'lucide-vue-next';

    import ical from 'ical-generator';

    import axios from 'axios'

    import CoursModal from '../views/cours/CoursModal.vue'
    
    export default {
        name: 'CoursTab',
        components: {
            TabName,
            CoursElement,
            NoItem,
            MainItem,
            LoadingItem,
            CoursModal,
            CalendarOff,
            ServerCrash,
            CalendarPlus
        },
        data() {
            return {
                cours: [],
                hasCours: false,
                loading: true,
                empty: false,
                error: "",
                showCoursModal: false,
                current: []
            }
        },
        methods: {
            getCours: function() {
                // set vars
                this.loading = true;
                this.empty = false;
                this.error = "";
                this.cours = [];
                this.hasCours = false;

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
                        else {
                            this.hasCours = true
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
                this.current = cours
                this.$vfm.show("coursModal", {
                    subject: cours.subject,
                    teacher: cours.teacher,
                    room: cours.room,
                    from: new Date(cours.from).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    to: new Date(cours.to).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    color: cours.color,
                    status: cours.status || "Se déroule normalement"
                })
            },
            addCurrentToCalendar: function() {
                const calendar = ical({name: 'Mon cours de ' + this.current.subject + ' avec ' + this.current.teacher});

                let from = new Date(this.current.from)
                let to = new Date(this.current.to)

                // timzeone fix
                from.setHours(from.getHours() - 1)
                to.setHours(to.getHours() - 1)

                calendar.createEvent({
                    start: from,
                    end: to,
                    summary: this.current.subject,
                    description: 'Cours de ' + this.current.subject + ' avec ' + this.current.teacher + ' dans la salle ' + this.current.room,
                    location: this.current.room
                });

                // download calendar
                let calendarString = calendar.toString()
                
                // download ical file
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(calendarString));
                element.setAttribute('download', 'cours.ics');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            },
            addDayToCalendar: function() {
                const calendar = ical({name: 'Ma journée du ' + new Date(this.current.from).toLocaleDateString('fr-FR') + ' sur Pronote+'});

                // add each cours to calendar
                this.cours.forEach(cours => {
                    let from = new Date(cours.from)
                    let to = new Date(cours.to)

                    // timezone fix
                    from.setHours(from.getHours() - 1)
                    to.setHours(to.getHours() - 1)

                    if(cours.isCancelled == false) {
                        calendar.createEvent({
                            start: from,
                            end: to,
                            summary: cours.subject,
                            description: 'Cours de ' + cours.subject + ' avec ' + cours.teacher + ' dans la salle ' + cours.room,
                            location: cours.room
                        });
                    }
                });

                // download calendar
                let calendarString = calendar.toString()

                // download ical file
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(calendarString));
                element.setAttribute('download', 'cours.ics');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
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
                        <p class="categoryTitle next">Détail des horaires</p>
                        <p>Commence le <B>{{params.from}}</B></p>
                        <p>Se termine le <B>{{params.to}}</B></p>

                        <p class="categoryTitle">Statut du cours</p>
                        <p>{{params.status}}</p>

                        <p class="categoryTitle">Ajouter au calendrier</p>
                        <button v-wave v-on:click="addCurrentToCalendar">Ajouter au calendrier</button>
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

        <div v-if="hasCours" class="list group gr2">
            <MainItem v-on:click="addDayToCalendar">
                <template #icon>
                    <CalendarPlus />
                </template>
                <template #content>
                    <h3>Ajouter cette journée au calendrier</h3>
                    <p>Ajouter tous les cours du jour dans votre calendrier</p>
                </template>
            </MainItem>
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
        margin-top: 24px;
    }

    .categoryTitle.next {
        margin-top: 0px;
    }

    .gr2 {
        margin-top: 20px;
    }
</style>