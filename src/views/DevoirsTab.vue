<script lang="ts">
    import TabName from '../components/main/TabName.vue'
    import HomeworkElement from '@/components/homework/HomeworkElement.vue';
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
            HomeworkElement,
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
                if(this.homeworks !== []) {
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
                let coursURL = API + "/hw" + "?token=" + token + "&from=" + rnString;

                // retreive data from API
                axios.get(coursURL)
                    .then(response => {
                        // set loading to false
                        this.loading = false
                        this.inLoading = false
                        this.homeworks = []

                        setTimeout(() => {
                            this.homeworks = response.data.data.homeworks
                        

                            // error handling
                            if(response.data.errors) {
                                refreshToken()
                            }

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
                if(hwDone.includes(id)) {
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
                if(hwDone.includes(id)) {
                    // remove hw from done
                    hwDone.splice(hwDone.indexOf(id), 1)
                    localStorage.setItem('doneHw', JSON.stringify(hwDone))
                    this.currentIsDone = false
                }
                else {
                    // add hw to done
                    hwDone.push(id)
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
    <TabName name="Travail à faire" calendar logged />
    <div id="content">
        <vue-final-modal v-model="showHwModal" name="hwModal">
            <template v-slot="{ params }">
                <div class="modal hwModal" ref="modal">
                    <div class="modal-header">
                        <p>Travail à faire en {{params.subject}}</p>
                        <small>Détail du devoir</small>
                    </div>
                    <div class="modal-content">
                        <p class="categoryTitle next">Description</p>
                        <p>{{params.description}}</p>

                        <p class="categoryTitle">Fichiers</p>
                        <div class="files">
                            <div class="file" v-wave v-for="file in params.files" :key="file.id">
                                <a :href="file.url" target="_blank">{{file.name}}</a>
                            </div>
                        </div>
                        <p v-if="params.noFiles">Aucun fichier</p>

                        <p class="categoryTitle">Gestion du travail</p>

                        <button v-if="!currentIsDone" v-wave @click="markAsDone(params.id)">Marquer comme fait</button>
                        <button v-if="currentIsDone" class="markAsNo" v-wave @click="markAsDone(params.id)">Marquer comme non fait</button>
                    </div>
                </div>
            </template>
        </vue-final-modal>
    
        <div class="quietLoading" v-if="inLoading">
            <div class="quietLoadingBar"></div>
        </div>

        <LoadingItem v-if="loading" title="Récupération de vos devoirs..." subtitle="Veuillez patienter..." />

        <NoItem v-if="empty" title="Pas de devoirs enregistrés pour cette journée" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
            <CalendarOff />
        </NoItem>

        <NoItem v-if="error" title="Oups, quelque chose s'est mal passé !" :subtitle="error">
            <ServerCrash />
        </NoItem>

        <div class="swipe" ref="swipe">
            <div class="list">
                <HomeworkElement v-for="hw in homeworks" :subject="hw.subject" :description="hw.description" :color="hw.color" :id="hw.id" @click="openHwModal(hw)"/>
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

    .markAsNo {
        background-color: #b90202 !important;
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

    .file {
        width: calc(100% - 18px * 2);
        background: var(--element);
        color: var(--text);
        border-radius: 8px;
        padding: 14px 18px;
    }
</style>