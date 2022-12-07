<script>
    import TabName from '../../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';
    import MainItem from '../../components/main/MainItem.vue';

    import { Newspaper, Link, MessageSquare, MessageCircle } from 'lucide-vue-next'

    import swipeDetect from 'swipe-detect';

    export default {
        name: 'ActusTab',
        props: {
            id: {
                type: String,
                required: true
            }
        },
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
                conversation: [],
                hasDiscussions: false,
                loading: true,
                inLoading: false,
                empty: false,
                title: "Conversation",
                error: ""
            }
        },
        methods: {
            getDiscussion: function() {
                let discussions = localStorage.getItem('discussions');
                this.conversation = JSON.parse(discussions).find(discussion => discussion.id == this.id);

                // replace links with <a> tags in each message
                this.conversation.messages.forEach(message => {
                    message.content = message.content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="link" target="_blank">$1</a>');
                });

                // if author of message is "Moi" then add "me" class
                this.conversation.messages.forEach(message => {
                    if(message.author == "Moi") {
                        message.me = true;
                    }
                    else {
                        message.me = false;
                    }
                });

                this.title = this.conversation.subject;
            }
        },
        updated() {
            this.getDiscussion();
            // crée une boucle infinie
        },
        mounted() {
            this.getDiscussion();
        }
    }
</script>

<template>
    <TabName :name="title" logged back />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
            <div id="messagesList">
                <div v-for="message in conversation.messages">

                    <div class="message" v-if="!message.me">
                        <p class="author">{{message.author}}</p>
                        <div class="content" v-html="message.content"></div>
                    </div>

                    <div class="message isMe" v-if="message.me">
                        <p class="author">{{message.author}}</p>
                        <div class="content" v-html="message.content"></div>
                    </div>

                </div>
            </div>
    
            <div id="messageForm">
                <input type="text" disabled placeholder="Vous ne pouvez pas répondre ici." />
            </div>
    </div>
</template>

<style scoped>
    .message {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 20px;
    }

    .message * {
        margin: 0;
        padding: 0;
    }

    .message .author {
        font-size: 14px;
        color: var(--text);
        opacity: 50%;
    }

    .message .content {
        font-size: 16px;
        background: var(--brand-color);
        color: #fff;
        padding: 10px 15px;
        border-radius: 10px;
        border-top-left-radius: 3px;
        width: 80%;
        font-weight: 500;
        word-break: break-word;
    }

    .message.isMe {
        align-items: flex-end;
    }

    .message.isMe .content {
        border-top-left-radius: 10px;
        border-top-right-radius: 3px;
        background: var(--element);
    }

    #content {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 0;
        height: calc(100% - 115px - env(safe-area-inset-bottom) + 26px);
    }

    #messagesList {
        width: calc(100% - 20px * 2);
        height: 100%;
        overflow-y: scroll;
        padding: 10px 20px;
        padding-top: 70px;
    }

    #messageForm {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 0px;

        display: none;
    }

    #messageForm input {
        width: calc(100vw - (20px * 2));
        position: absolute;
        bottom: 0;

        border-radius: 0px;
        background-color: var(--element);
        font-size: 16px;
        padding: 12px 20px;
        border: 1px solid var(--border);
    }
</style>