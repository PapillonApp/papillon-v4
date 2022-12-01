<script lang="ts">
    export default {
        name: 'NotesSubject',
        props: {
            name: {
                type: String,
                required: true
            },
            average : {
                type: Number || String,
                required: false
            },
            color: {
                type: String,
                required: false
            },
            index: {
                type: Number,
                required: false,
                default: 0
            }
        },
        mounted() {
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

            // index
            this.$el.style.setProperty('--index', this.index)
        }
    }
</script>

<template>
    <div class="notes_subject">
        <div class="subject_name">
            <div class="name">{{name}}</div>
            <div class="average" v-if="average">
                <p>{{average}}</p>
                <span>/20</span>
            </div>
        </div>
        <div class="subject_marks">
            <slot name="grades"></slot>
        </div>
    </div>
</template>

<style>
    .notes_subject {
        margin-bottom: 10px;

        opacity: 0%;
        animation: TabNameStringUp 0.3s cubic-bezier(0,0,0,1) forwards;
        animation-delay: calc(var(--index) * 0.05s);
    }

    .subject_name {
        display: flex;
        align-items: center;

        border-bottom: 1px solid var(--color);
    }

    .subject_name * {
        margin: 0;
    }

    .subject_name .name {
        color: var(--color);
        font-size: 20px;
        font-weight: 600;
    }

    .subject_name .average {
        margin-left: auto;
        padding: 10px 0px;
        display: flex;
        align-items: flex-end;
    }

    .subject_name .average p {
        font-size: 20px;
        font-weight: 500;
        color: var(--text);
    }

    .subject_name .average span {
        font-size: 14px;
        color: var(--text);
        opacity: 50%;
    }

    .subject_marks {
        display: flex;
        gap: 12px;
        overflow-x: scroll;
        width: calc(100%);
        margin-left: -24px;
        padding: 12px 24px;
    }

    .notes_subject.averageFinal {
        margin-bottom: 0;
    }

    .averageFinal .subject_name {
        border-bottom: 1px solid var(--border);
    }

    .averageFinal .subject_marks {
        display: none;
    }

    .averageFinal .name {
        font-size: 16px !important;
        color: var(--text) !important;
    }

    .averageFinal .average p {
        font-size: 16px !important;
    }

    .myAverage .average * {
        font-weight: 700 !important;
    }
</style>