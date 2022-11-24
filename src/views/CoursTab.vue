<script lang="ts">
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';
    import MainItem from '../components/main/MainItem.vue'

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import swipeDetect from 'swipe-detect';

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
                inLoading: false,
                empty: false,
                error: "",
                showCoursModal: false,
                current: [],
                lastCoursTime: null,
            }
        },
        methods: {
            getCours: function() {
                // set vars
                if(this.cours !== []) {
                    this.inLoading = true;
                }
                else {
                    this.loading = true;
                }

                this.empty = false;
                this.error = "";
                this.hasCours = false;

                // get token
                let token = localStorage.getItem('token')
                
                // get cours url
                let coursURL = API + "/edt" + "?token=" + token + "&from=" + rnString;

                // retreive data from API
                console.log(coursURL)
                axios.get(coursURL)
                    .then(response => {
                        // set loading to false
                        this.loading = false
                        this.inLoading = false
                        this.cours = []

                        // apply data
                        setTimeout(() => {
                            this.cours = response.data.data.timetable

                            // error handling
                            if(response.data.errors || response.message) {
                                refreshToken()
                            }

                            // check if empty
                            if(this.cours.length == 0) {
                                this.empty = true
                            }
                            else {
                                this.hasCours = true

                                // remove duplicates
                                for (let i = 0; i < this.cours.length; i++) {
                                    for (let j = i + 1; j < this.cours.length; j++) {
                                        if (this.cours[i].from == this.cours[j].from) {
                                            this.cours.splice(j, 1)
                                            j--
                                        }
                                    }
                                }
                            }
                        }, 10);
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

                let modal = this.$refs.modal
                swipeDetect(modal, (swipeDirection) => {
                    if(swipeDirection == "down") {
                        this.$vfm.hide("coursModal")
                    }
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

            document.addEventListener('updatedToken', () => {
                this.getCours()
            })

            document.addEventListener('dateChanged', () => {
                this.getCours()
            })

            let swipeUI = this.$refs.swipe
            swipeDetect(swipeUI, (swipeDirection) => {
                if(swipeDirection == "left") {
                    document.dispatchEvent(new CustomEvent('nextDate'));
                }
                else if(swipeDirection == "right") {
                    document.dispatchEvent(new CustomEvent('prevDate'));
                }
            })
        }
    } 
</script>

<template>
    <TabName name="Emploi du temps" calendar logged />
    <div id="content">
        <vue-final-modal v-model="showCoursModal" name="coursModal">
            <template v-slot="{ params }">
                <div class="modal coursModal" ref="modal">
                    <div class="modal-header">
                        <p>{{params.subject}}</p>
                        <small>{{params.teacher}} - {{params.room}}</small>
                    </div>
                    <div class="modal-content">
                        <div class="modal-content-item" v-wave v-on:click="addCurrentToCalendar">
                            <CalendarPlus />
                            <p>Ajouter au calendrier</p>
                        </div>
                    </div>
                </div>
            </template>
        </vue-final-modal>

        <div class="quietLoading" v-if="inLoading">
            <div class="quietLoadingBar"></div>
        </div>

        <LoadingItem v-if="loading" title="Récupération de votre emploi du temps..." subtitle="Veuillez patienter..." />

        <NoItem v-if="empty" title="Pas de cours prévus pour cette journée" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
            <CalendarOff />
        </NoItem>

        <NoItem v-if="error" title="Oups, quelque chose s'est mal passé !" :subtitle="error">
            <ServerCrash />
        </NoItem>

        <div class="swipe" ref="swipe">
            <div class="list">
                <CoursElement v-for="cours in cours" v-on:click="openCoursModal(cours)" :time="cours.from" :name="cours.subject" :room="cours.room" :status="cours.status" :teacher="cours.teacher" :color="cours.color"/>
            </div>
        </div>

        <div v-if="hasCours" class="list group gr2">
            <div class="addToCalendar"><MainItem v-on:click="addDayToCalendar">
                <template #icon>
                    <CalendarPlus />
                </template>
                <template #content>
                    <h3>Ajouter cette journée au calendrier</h3>
                    <p>Ajouter tous les cours du jour dans votre calendrier</p>
                </template>
            </MainItem></div>
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
        opacity: 0;
        animation: gr2 0.2s 0.3s ease-in-out forwards;
    }

    @keyframes gr2 {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0px);
        }
    }

    .swipe {
        overflow-x: scroll !important;
        overflow-y: hidden;
        width: calc(100% + 48px);
        margin-left: -24px;
    }

    .swipe .list {
        padding: 0px 24px;
        width: calc(100% - 47px);
    }

    .swipe .noItem {
        
    }
</style>