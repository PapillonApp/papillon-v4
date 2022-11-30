<script lang="ts">
    // @ts-nocheck
    import TabName from '../components/main/TabName.vue'
    import HomeworkElement from '@/components/homework/HomeworkElement.vue';
    import MainItem from '../components/main/MainItem.vue'

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import swipeDetect from 'swipe-detect';

    import NoItem from '@/components/main/NoItem.vue';
    import { CalendarOff, ServerCrash, CalendarPlus, Link, CheckCheck, ListX } from 'lucide-vue-next';

    import ical from 'ical-generator';

    import axios from 'axios'

    import CoursModal from '../views/cours/CoursModal.vue'
    
    export default {
        name: 'CoursTab',
        components: {
            TabName,
            HomeworkElement,
            NoItem,
            MainItem,
            LoadingItem,
            CoursModal,
            CalendarOff,
            ServerCrash,
            CalendarPlus,
            Link,
            CheckCheck,
            ListX
        },
        data() {
            return {
                homeworks: [],
                hasCours: false,
                loading: true,
                inLoading: false,
                empty: false,
                error: "",
                showHwModal: false,
                current: null,
                currentIsDone: false,
            }
        },
        methods: {
            getHomework: function() {
                // set vars
                if(this.homeworks) {
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
                let schema = `{
                    homeworks(from: "${rnString}") {
                        id
                        description
                        htmlDescription
                        subject
                        color,
                        files {
                            id,
                            url
                        }
                    }
                }`;

                // retreive data from API
                sendQL(schema).then((response) => {
                        // set loading to false
                        this.loading = false
                        this.inLoading = false
                        this.homeworks = []

                        setTimeout(() => {
                            this.homeworks = response.data.homeworks

                            // check if empty
                            if(this.homeworks.length == 0) {
                                this.empty = true
                            }
                            else {
                                this.hasCours = true
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
            openHwModal: function(hw) {
                this.currentIsDone = false
                this.current = hw
                
                this.$vfm.show("hwModal", {
                    description: hw.description,
                    subject: hw.subject,
                    htmlDescription: hw.htmlDescription,
                    files: hw.files,
                    noFiles: hw.files.length == 0,
                    id: hw.id,
                })

                let hwDone = JSON.parse(localStorage.getItem('doneHw')) || []
                // check if hw is already done
                if(hwDone.includes(hw.id + rn.toDateString())) {
                    this.currentIsDone = true
                }

                let modal = this.$refs.modal
                swipeDetect(modal, (swipeDirection) => {
                    if(swipeDirection == "down") {
                        this.$vfm.hide("hwModal")
                    }
                })
            },
            markAsDone: function(id) {
                let hwDone = JSON.parse(localStorage.getItem('doneHw')) || []
                // check if hw is already done
                if(hwDone.includes(id + rn.toDateString())) {
                    // remove hw from done
                    hwDone.splice(hwDone.indexOf(id + rn.toDateString()), 1)
                    localStorage.setItem('doneHw', JSON.stringify(hwDone))
                    this.currentIsDone = false
                }
                else {
                    // add hw to done
                    hwDone.push(id + rn.toDateString())
                    localStorage.setItem('doneHw', JSON.stringify(hwDone))
                    this.currentIsDone = true
                }

                // document event doneChanged
                let event = new CustomEvent('doneChanged', {
                    detail: {
                        id: id
                    }
                })
                document.dispatchEvent(event)
            },
        },
        mounted() {
            this.getHomework()

            document.addEventListener('dateChanged', () => {
                this.getHomework()
            })

            document.addEventListener('updatedToken', () => {
                this.getHomework()
            })

            let swipeUI = this.$refs.swipe
            swipeDetect(swipeUI, (swipeDirection) => {
                if(swipeDirection == "left") {
                    document.dispatchEvent(new CustomEvent('nextDate'));
                }
                else if(swipeDirection == "right") {
                    document.dispatchEvent(new CustomEvent('prevDate'));
                }
            }, 50)
        }
    } 
</script>

<template>
    <TabName name="Travail à faire" calendar logged />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
        <vue-final-modal v-model="showHwModal" name="hwModal">
            <template v-slot="{ params }">
                <div class="modal hwModal" ref="modal">
                    <div class="modal-header">
                        <p>Travail à faire en {{params.subject}}</p>
                        <small>Détail du devoir</small>
                    </div>
                    <div class="modal-content">
                        <div class="modal-content-header">
                            <p>{{params.description}}</p>
                        </div>

                        <a v-for="file in params.files" :href="file.url"><div class="modal-content-item" v-wave>
                            <Link />
                            <p>{{file.url}}</p>
                        </div></a>

                        <div class="modal-content-item" v-wave @click="markAsDone(params.id)">
                            <CheckCheck v-if="!currentIsDone" />
                            <ListX v-if="currentIsDone" />

                            <p v-if="!currentIsDone">Marquer comme fait</p>
                            <p v-if="currentIsDone">Marquer comme non fait</p>
                        </div>
                    </div>
                </div>
            </template>
        </vue-final-modal>

        <div class="swipe" ref="swipe">
            <LoadingItem v-if="loading" title="Récupération de vos devoirs..." subtitle="Veuillez patienter..." />

            <NoItem ref="swipeEmpty" v-if="empty" title="Pas de devoirs enregistrés pour cette journée" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
                <CalendarOff />
            </NoItem>

            <NoItem v-if="error" title="Oups, quelque chose s'est mal passé !" :subtitle="error">
                <ServerCrash />
            </NoItem>

            <div class="list">
                <HomeworkElement v-for="(hw, index) in homeworks" :index="index" :subject="hw.subject" :description="hw.description" :color="hw.color" :id="hw.id" @click="openHwModal(hw)"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    

    .markAsNo {
        background-color: #b90202 !important;
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
</style>