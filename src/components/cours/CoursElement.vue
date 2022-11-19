<script lang="ts">
    export default {
        props: {
            time: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            room: {
                type: String,
                required: true
            },
            teacher: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                timeString: "",
                waitTime : ""
            }
        },
        methods: {
            getWait(time) {
                let wait = time.getTime() - new Date().getTime()
                let waitMinutes = Math.floor(wait / 60000)

                let waitString = "dans " + waitMinutes + " min"

                if (waitMinutes < 5) {
                    waitString = "maintenant"
                }

                if (waitMinutes < 0) {
                    waitString = "terminé"
                }

                if (waitMinutes > 60) {
                    waitString = "dans " + Math.floor(waitMinutes / 60) + " h"
                }

                if (Math.floor(waitMinutes / 60) > 24) {
                    waitString = "dans " + Math.floor(waitMinutes / 1440) + " jour(s)"
                }

                return waitString;
            }
        },
        mounted() {
            // time
            let time = new Date(this.time)
            
            // correct timezone
            time.setHours(time.getHours() - 1)

            // timestamp to time
            this.timeString = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

            // wait
            this.waitTime = this.getWait(time)

            // color
            let color = this.color
            if(this.color == undefined) {
                color = '#00B562'
            }

            let finalColor = nearestColor(color).hex

            if (finalColor == "#898989") {
                finalColor = baseColors.random().hex
            }

            this.$el.style.setProperty('--color', finalColor)
        }
    };
 
</script>

<template>
    <div class="cours" v-wave>
        <div class="cours-color"></div>
        <div class="cours-data">
            <small>{{timeString}} - {{waitTime}}</small>
            <h3>{{name}}</h3>
            <p>{{room}} - {{teacher}}</p>
        </div>
    </div>
</template>

<style scoped>
    .cours {
        width: 100%;
        flex: none;
        order: 0;
        flex-grow: 0;

        background: var(--element);
        color: var(--text);

        border-radius: 10px;

        display: flex;
        overflow: hidden;

        opacity: 0%;
        animation: TabNameStringUp 0.2s cubic-bezier(0,0,0,1) forwards;
    }

    .cours * {
        margin: 0;
        padding: 0;
    }

    .cours-color {
        width: 6px;
        background: var(--color);
        border-radius: 10px 0px 0px 10px;
    }

    .cours-data {
        padding: 11px;
        padding-left: 17px;
    }

    .cours-data small {
        opacity: 0.3;
        font-size: 15px;
        line-height: 15px;
        letter-spacing: 0.005em;
        text-align: left;
        margin-bottom: 5px;
    }

    .cours-data h3 {
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.005em;
        text-align: left;
        color: var(--color);
        margin-bottom: 15px;
    }

    .cours-data p {
        font-size: 15px;
        line-height: 15px;
        letter-spacing: 0.005em;
        text-align: left;
        opacity: 0.5;
        text-transform: none;
    }
</style>