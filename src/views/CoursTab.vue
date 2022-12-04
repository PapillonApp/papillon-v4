<script>
    // @ts-nocheck
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';
    import MainItem from '../components/main/MainItem.vue'

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import swipeDetect from 'swipe-detect';

    import NoItem from '@/components/main/NoItem.vue';
    import { CalendarOff, ServerCrash, CalendarPlus, AlertTriangle, Info, Clock } from 'lucide-vue-next';

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
            CalendarPlus,
            Info,
            AlertTriangle,
            Clock
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
                initiatedSwipe : false,
                initiatedSwipeLeft : false,
            }
        },
        methods: {
            getCours: function() {
                // set vars
                if(this.cours) {
                    this.inLoading = true;
                }
                else { 
                    this.loading = true;
                }

                // get token
                let token = localStorage.getItem('token')
                
                // get cours url
                let schema = `{
                    timetable(from: "${rnString}") {
                        id
                        subject,
                        status,
                        teacher,
                        room,
                        from,
                        to,
                        color,
                        isCancelled
                    }
                }`;

                // retreive data from API
                sendQL(schema).then((response) => {
                        // reset vars
                        this.empty = false;
                        this.error = "";
                        this.hasCours = false;
                        this.loading = false
                        this.inLoading = false
                        this.cours = []

                        // apply data
                        setTimeout(() => {
                            this.cours = response.data.timetable

                            // check if empty
                            if(this.cours.length == 0) {
                                this.empty = true
                            }
                            else {
                                this.hasCours = true
                                this.initiatedSwipe = false;
                                this.initiatedSwipeLeft = false;

                                // remove duplicates
                                for (let i = 0; i < this.cours.length; i++) {
                                    for (let j = i + 1; j < this.cours.length; j++) {
                                        if (this.cours[i].from == this.cours[j].from) {
                                            if(this.cours[i].isCancelled == false) {
                                                this.cours.splice(j, 1)
                                            j--
                                            }
                                        }
                                    }
                                }
                            }
                        }, 10);
                    })
            },
            openCoursModal: function(cours) {
                this.current = cours

                // cancelled
                let cancelled = false
                if(cours.status == "Cours annulé" || cours.status == "Prof. absent" || cours.status == "Classe absente" || cours.status == "Prof./pers. absent" || cours.status == "Conseil de classe" || cours.status == "Reporté" || cours.status == "Sortie pédagogique") {
                    cancelled = true
                }

                // get time
                let fromTime = new Date(cours.from)
                fromTime.setHours(fromTime.getHours() - 1)
                let toTime = new Date(cours.to)
                toTime.setHours(toTime.getHours() - 1)

                this.$vfm.show("coursModal", {
                    subject: cours.subject,
                    teacher: cours.teacher,
                    room: cours.room,
                    from: fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    to: toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    color: cours.color,
                    hasStatus: cours.status != null,
                    isCancelled: cours.isCancelled || cancelled,
                    status: cours.status
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
                    this.initiatedSwipe = true;
                }
                else if(swipeDirection == "right") {
                    document.dispatchEvent(new CustomEvent('prevDate'));
                    this.initiatedSwipeLeft = true;
                }
            }, 50)
        }
    } 
</script>

<template>
    <TabName name="Emploi du temps" calendar logged />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
        <vue-final-modal v-model="showCoursModal" name="coursModal">
            <template v-slot="{ params }">
                <div class="modal coursModal" ref="modal">
                    <div class="modal-header">
                        <p>{{params.subject}}</p>
                        <small>{{params.teacher}} - {{params.room}}</small>
                    </div>
                    <div class="modal-content">
                        <div class="modal-content-item" v-if="!params.isCancelled" v-wave>
                            <Clock />
                            <p>De {{ params.from }} à {{ params.to }}</p>
                        </div>
                        <div class="modal-content-item" :class="{ red: params.isCancelled, ok: !params.isCancelled }" v-if="params.hasStatus" v-wave>
                            <Info v-if="!params.isCancelled" />
                            <AlertTriangle v-else />
                            <p v-if="!params.isCancelled">Ce cours a été modifié ({{ params.status }})</p>
                            <p v-else>Ce cours n'est pas maintenu</p>
                        </div>
                        <div class="modal-content-item" v-wave v-on:click="addCurrentToCalendar">
                            <CalendarPlus />
                            <p>Ajouter au calendrier</p>
                        </div>
                    </div>
                </div>
            </template>
        </vue-final-modal>

        <div class="swipe" ref="swipe">
            <LoadingItem v-if="loading" title="Récupération de votre emploi du temps..." subtitle="Veuillez patienter..." />

            <NoItem ref="swipeEmpty" v-if="empty" title="Pas de cours prévus pour cette journée" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
                <CalendarOff />
            </NoItem>

            <NoItem v-if="error" title="Oups, quelque chose s'est mal passé !" :subtitle="error">
                <ServerCrash />
            </NoItem>

            <div class="list">
                <CoursElement v-for="(cours, index) in cours" v-on:click="openCoursModal(cours)" :index="index" :time="cours.from" :name="cours.subject" :room="cours.room" :status="cours.status" :teacher="cours.teacher" :color="cours.color"/>
            </div>

            <div v-if="hasCours" class="list gr2">
                <div class="addToCalendar"><MainItem v-on:click="addDayToCalendar" class="light">
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

    .modal-content-item.ok {
        color: #4791FF !important;
    }
    .modal-content-item.ok p {
            color: #4791FF !important;
    }

    .modal-content-item.red {
        color: #F13232 !important;
    }
    .modal-content-item.red p {
        color: #F13232 !important;
    }

    .categoryTitle.next {
        margin-top: 0px;
    }

    .gr2 {
        margin-top: 10px !important;
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
</style>