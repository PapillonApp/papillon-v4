<script>
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';
    import MainItem from '../components/main/MainItem.vue';

    import { Newspaper, Link } from 'lucide-vue-next'

    import swipeDetect from 'swipe-detect';

    export default {
        name: 'ActusTab',
        components: {
            TabName,
            NoItem,
            Newspaper,
            MainItem,
            Link
        },
        data() {
            return {
                actus: [],
                hasActus: false,
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
            getNews: function() {
                // set vars
                if(this.actus) {
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
                        infos {
                            id,
                            date,
                            title,
                            author,
                            content,
                            htmlContent,
                            files {
                                id,
                                url
                            }
                        }
                    }
                `;

                // get marks
                sendQL(schema).then((response) => {
                    this.actus = response.data.infos;
                    this.inLoading = false;

                    // sort by date
                    this.actus.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    });

                    this.hasActus = true;
                    
                    // replace title by "No title" if empty
                    this.actus.forEach((item) => {
                        if(item.title == null) {
                            item.title = "Sans titre";
                        }
                    });
                });
            },
            openActuModal: function(actu) {
                this.current = actu
                
                this.$vfm.show("actuModal", {
                    description: actu.content,
                    htmlDescription: actu.htmlContent,
                    title: actu.title,
                    author: actu.author,
                    files: actu.files,
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
            this.getNews();
        }
    }
</script>

<template>
    <TabName name="Actualités" logged />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
        <vue-final-modal v-model="showActuModal" name="actuModal">
            <template v-slot="{ params }">
                <div class="modal hwModal" ref="modal">
                    <div class="modal-header">
                        <p>{{params.title}}</p>
                        <small>de {{params.author}}</small>
                    </div>
                    <div class="modal-content">
                        <div class="modal-content-header">
                            <div class="htmlContent" v-html="params.htmlDescription">

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

        <NoItem v-if="(actus.length == 0)" title="Pas encore d'actualités dans cet établissement" subtitle="Pour consulter vos messages, utilisez le client Pronote classique.">
            <Newspaper />
        </NoItem>

        <div class="list group">
            <MainItem v-for="(news, index) in actus" @click="openActuModal(news)">
                <template #icon>
                    <Newspaper />
                </template>
                <template #content>
                    <h3>{{news.title}}</h3>
                    <p>de {{news.author}}</p>
                </template>
            </MainItem>
        </div>
    </div>
</template>

<style scoped>
    .modal-content-header p {
        line-height: 22px;
        text-transform: none;
    }
</style>