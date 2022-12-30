<script>
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';
    import MainItem from '../components/main/MainItem.vue';

    import { Scroll, Link, CalendarOff } from 'lucide-vue-next'

    import swipeDetect from 'swipe-detect';

    export default {
        name: 'ContentTab',
        components: {
            TabName,
            NoItem,
            Scroll,
            MainItem,
            CalendarOff,
            Link
        },
        data() {
            return {
                content: [],
                hasContent: false,
                loading: true,
                inLoading: false,
                empty: false,
                error: "",
                studentAverage: "0",
                classAverage: "0",
                showActuModal: false,
                current: []
            }
        },
        methods: {
            getContent: function() {
                // set vars
                if(this.content) {
                    this.inLoading = true;
                }
                else { 
                    this.loading = true;
                }

                // get token
                let token = localStorage.getItem('token')
                
                // get marks url
                let schema = `
                    {
                        contents(from: "${rnString}") {
                            id,
                            subject,
                            description,
                            color,
                            teachers,
                            files {
                                id,
                                url
                            }
                        }
                    }
                `;

                // get marks
                sendQL(schema).then((response) => {
                    this.content = response.data.contents;
                    
                    this.inLoading = false;
                    this.hasContent = true;

                    // make teachers array a string
                    this.content.forEach((item) => {
                        item.teachers = item.teachers.join(', ');
                    })

                    // add small 120 char description
                    this.content.forEach((item) => {
                        item.smallDescription = item.description.substring(0, 120) + '...';
                    })

                    if(this.content.length == 0) {
                        this.empty = true;
                    }
                    else {
                        this.empty = false;
                    }
                });
            },
            openContentModal: function(content) {
                this.current = content
                
                this.$vfm.show("actuModal", {
                    description: content.description,
                    title: content.subject.name,
                    author: content.teachers,
                    files: content.files,
                })

                let modal = this.$refs.modal
                swipeDetect(modal, (swipeDirection) => {
                    if(swipeDirection == "down") {
                        this.$vfm.hide("hwModal")
                    }
                })
            }
        },
        mounted() {
            this.getContent();

            document.addEventListener('updatedToken', () => {
                this.getContent()
            })
            document.addEventListener('dateChanged', () => {
                this.getContent()
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
    <TabName name="Contenu des cours" calendar logged />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
        <vue-final-modal v-model="showActuModal" name="actuModal">
            <template v-slot="{ params }">
                <div class="modal hwModal" ref="modal">
                    <div class="modal-header">
                        <p>Contenu du cours de {{params.title}}</p>
                        <small>avec {{params.author}}</small>
                    </div>
                    <div class="modal-content">
                        <div class="modal-content-header">
                            <div class="htmlContent" v-html="params.description">
                                
                            </div>
                        </div>

                        <a v-for="file in params.files" :href="file.url"><div class="modal-content-item" v-wave>
                            <Link />
                            <p>{{file.url}}</p>
                        </div></a>
                    </div>
                </div>
            </template>
        </vue-final-modal>

        <div class="swipe" ref="swipe">
            <NoItem ref="swipeEmpty" v-if="empty" title="Pas de contenus enregistrés ce jour là" subtitle="Utilisez le calendrier pour consulter les jours passés et à venir">
                <Scroll />
            </NoItem>

            <div class="list group">
                <MainItem v-for="(contentItem, index) in content" @click="openContentModal(contentItem)">
                    <template #icon>
                        <Scroll />
                    </template>
                    <template #content>
                        <h3>{{contentItem.subject.name}}</h3>
                        <p>{{contentItem.smallDescription}}</p>
                    </template>
                </MainItem>
            </div>
        </div>
    </div>
</template>

<style scoped>
    
</style>