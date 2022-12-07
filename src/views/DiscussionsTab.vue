<script>
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';
    import MainItem from '../components/main/MainItem.vue';

    import { Newspaper, Link, MessageSquare, MessageCircle } from 'lucide-vue-next'

    import swipeDetect from 'swipe-detect';

    export default {
        name: 'ActusTab',
        components: {
            TabName,
            NoItem,
            Newspaper,
            MainItem,
            Link,
            MessageSquare,
            MessageCircle
        },
        data() {
            return {
                discussions: [],
                hasDiscussions: false,
                loading: true,
                inLoading: false,
                empty: false,
                error: ""
            }
        },
        methods: {
            getDiscussions: function() {
                // set vars
                if(this.discussions) {
                    this.inLoading = true;
                }
                else { 
                    this.loading = true;
                }

                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };

                let token = localStorage.getItem('token')

                fetch(API + `/discussions?token=${token}`, requestOptions)
                .then(response => response.json())
                .then(result => {

                    this.discussions = result;
                    this.inLoading = false;

                    // sort by date
                    this.discussions.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    });

                    localStorage.setItem('discussions', JSON.stringify(this.discussions));
                    console.log(this.discussions);
                });
            },
            openChat: function(id) {
                this.$router.push({ name: 'conversation', params: { id: id } });
            }
        },
        created() {
            this.getDiscussions();

            document.addEventListener('updatedToken', () => {
                this.getDiscussions()
            })
        }
    }
</script>

<template>
    <TabName name="Discussions" logged />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
        <div class="list group">
            <MainItem v-for="conversation in discussions" @click="openChat(conversation.id)">
                <template #icon>
                    <MessageSquare />
                </template>
                <template #content>
                    <h3>{{conversation.subject}}</h3>
                    <p>{{ (conversation.messages[conversation.messages.length - 1].content).substring(0, 96) }}...</p>
                </template>
            </MainItem>
        </div>
    </div>
</template>

<style scoped>
    
</style>