<script>
    // @ts-nocheck
    export default {
        props: {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            room: {
                type: String,
                required: false,
                default: "Pas de salle"
            },
            teacher: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: false
            },
            closest: {
                type: Boolean,
                required: false,
                default: false
            },
            index: {
                type: Number,
                required: false,
                default: 0
            }
        },
        data() {
            return {
                timeString: "",
                waitTime : "",
                cancelled: false,
                hasStatus: Boolean(this.status)
            }
        },
        methods: {
            getWait(begin, end) {
                let wait = begin.getTime() - new Date().getTime()
                let waitMinutes = Math.floor(wait / 60000)

                let courseLenght = end.getTime() - begin.getTime()
                let courseLenghtMinutes = Math.floor(courseLenght / 60000)

                let waitString = "dans " + waitMinutes + " min"

                if (waitMinutes < 2) {
                    waitString = "maintenant"
                }

                // Affiche "en cours" si le cours a commencé et qu'il n'est pas fini
                // Si le cours est fini, affiche "terminé" (en fonction de courseLenghtMinutes)
                if (waitMinutes < -2) {
                    waitString = 'en cours'
                    if (waitMinutes < -courseLenghtMinutes) {
                        waitString = 'terminé'
                    }
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
            let begin = new Date(this.from)
            let end = new Date(this.to)

            // timestamp to time
            this.timeString = begin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

            // wait
            this.waitTime = this.getWait(begin, end)
            setInterval(() => {
                this.waitTime = this.getWait(begin, end)
            }, 1000)

            // color
            let color = this.color
            if(this.color == undefined) {
                color = '#00B562'
            }

            let finalColor = nearestColor(color).hex

            if (finalColor == "#898989") {
                finalColor = baseColors.random().hex
            }

            // punishment
            if (this.name.includes("Retenue")) {
                finalColor = '#ff5050'
            }

            this.$el.style.setProperty('--color', finalColor)

            // index
            this.$el.style.setProperty('--index', this.index)

            // cancelled
            if(this.status == "Cours annulé" || this.status == "Prof. absent" || this.status == "Classe absente" || this.status == "Prof./pers. absent" || this.status == "Conseil de classe" || this.status == "Reporté" || this.status == "Sortie pédagogique") {
                this.cancelled = true
                this.hasStatus = false

                // add class to this.$el
                this.$el.classList.add('cancelled')
            }

            // closest
            setInterval(() => {
                if(this.closest) {
                    this.$el.classList.add('closest')
                }
                else {
                    this.$el.classList.remove('closest')
                }
            }, 10);
        }
    };
 
</script>

<template>
    <div class="cours">
        <div class="cours-color"></div>
        <div class="cours-data">
            <small>
                {{timeString}} - {{waitTime}}
                <span v-if="hasStatus" class="status">{{status}}</span>
                <span v-if="cancelled" class="status cancelled">{{status}}</span>
            </small>
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
        box-shadow: var(--shadow);
    }

    .cours.cancelled {
        opacity: 0.5 !important;
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
        color: var(--text-light);
        font-size: 15px;
        line-height: 15px;
        letter-spacing: 0.005em;
        text-align: left;
    }

    .status {
        font-size: 14px;
        font-weight: 500;
        background: var(--border-light);
        color: var(--text-light);
        border: none;
        padding: 2px 5px;
        border-radius: 300px;
        transform: translateY(-2px);
    }

    .cancelled .status {
        background: none;
        color: var(--color);
        border: 1px solid var(--color);
    }

    .cancelled {
        --color: #d61717 !important;
    }

    .cours-data h3 {
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.005em;
        text-align: left;
        color: var(--color);
        margin-bottom: 15px;
        margin-top: 3px !important;
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