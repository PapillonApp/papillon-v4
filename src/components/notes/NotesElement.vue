<script>
    export default {
        name: 'NotesSubject',
        props: {
            subject: {
                type: String,
                required: false
            },
            description : {
                type: String,
                required: false
            },
            mark: {
                type: Number || String,
                required: false
            },
            scale: {
                type: Number || String,
                required: true
            },
            average: {
                type: Number || String,
                required: false
            },
            min: {
                type: Number || String,
                required: false
            },
            max: {
                type: Number || String,
                required: false
            },
            coeff: {
                type: Number || String,
                required: false
            },
            index: {
                type: Number,
                required: false,
                default: 0
            },
        },
        data() {
            return {
                finalDescription: "",
                finalMark: 0,
                finalAverage: 0,
                finalMin: 0,
                finalMax: 0,
                mark20: 0,
                finalScale: 0,
                sur20: localStorage.getItem('sur20') == 'true',
            }
        },
        mounted() {
            this.mark20 = ((this.mark / this.scale) * 20).toFixed(1)
            if (this.mark != "Abs") {
                this.finalMark = (parseFloat(this.mark).toFixed(2)).toString()
            } else {
                this.finalMark = "Abs"
            }

            if(this.sur20) {
                this.finalMark = this.mark20
                // change params scale
                this.finalScale = 20
            }
            else {
                this.finalScale = this.scale
            }

            /* this.finalAverage = (((parseInt)(this.average) / this.scale) * 20).toFixed(2).toString()
            this.finalMin = (((parseInt)(this.min) / this.scale) * 20).toFixed(2).toString()
            this.finalMax = (((parseInt)(this.max) / this.scale) * 20).toFixed(2).toString() */

            this.finalAverage = parseFloat(this.average).toFixed(2).toString()
            this.finalMin = parseFloat(this.min).toFixed(2).toString()
            this.finalMax = parseFloat(this.max).toFixed(2).toString()

            this.finalDescription = this.description || "Sans description"

            // index
            this.$el.style.setProperty('--index', this.index)
        }
    }
</script>

<template>
    <div class="mark" v-wave>
        <div class="markData">
            <div class="markName">
                <p>{{finalDescription}}</p>
                <span>coeff : {{coeff}} <a class="mark20" v-if="(scale !== 20 && sur20 == false)"> | {{mark20}}/20</a> <a class="mark20" v-if="(scale !== 20 && sur20 == true)"> | {{mark}}/{{scale}}</a></span>
            </div>
            <div class="markValue">
                <p>{{finalMark}}</p>
                <span>/{{finalScale}}</span>
            </div>
        </div>
        <div class="markAverages">
            <div class="markAverage">
                <div class="averageMark">
                    <p>{{finalMin}}</p>
                    <span>/20</span>
                </div>
                <p class="name">Min.</p>
            </div>
            <div class="markAverage averageClass">
                <div class="averageMark">
                    <p>{{finalAverage}}</p>
                    <span>/20</span>
                </div>
                <p class="name">Moy.</p>
            </div>
            <div class="markAverage">
                <div class="averageMark">
                    <p>{{finalMax}}</p>
                    <span>/20</span>
                </div>
                <p class="name">Max.</p>
            </div>
        </div>
    </div>
</template>

<style>
    .mark {
        background: var(--element);
        width: fit-content;
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        border-radius: 10px;

        opacity: 0%;
        animation: TabNameStringForwards 0.3s cubic-bezier(0,0,0,1) forwards;
        animation-delay: calc(var(--index) * 0.01s);

        box-shadow: var(--shadow) !important;
    }

    .mark * {
        margin: 0;
    }

    .markName {
        margin-bottom: 5px;
    }

    .markName p {
        font-size: 16px;
        line-height: 16px;
        font-weight: 600;
        opacity: 50%;
        
        width: 153px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
    }

    .markName span {
        font-size: 13px;
        line-height: 13px;
        opacity: 50%;
    }

    .markValue {
        display: flex;
        align-items: center;
    }

    .markValue p {
        font-size: 22px;
        font-weight: 600;
        color: var(--color);
    }

    .markValue span {
        font-size: 14px;
        font-weight: 500;
        opacity: 50%;
        margin-top: 5px;
    }

    .markAverages {
        margin-top: 5px;
        padding-top: 10px;
        border-top: 1px solid var(--border);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .markAverage {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .averageMark {
        display: flex;
        align-items: center;
    }

    .averageMark p {
        font-size: 16px;
        font-weight: 500;
    }

    .averageMark span {
        font-size: 14px;
        font-weight: 500;
        opacity: 50%;
        margin-top: 5px;
        display: none;
    }

    .markAverage .name {
        font-size: 14px;
        font-weight: 500;
        opacity: 50%;
    }

    .averageClass {
        /* color: var(--color); */
    }

    .averageClass .averageMark p {
        font-weight: 600;
    }

    .mark20 {
        opacity: 50%;
    }
</style>