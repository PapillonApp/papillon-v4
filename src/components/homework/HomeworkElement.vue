<script lang="ts">
    // @ts-nocheck
    import { CheckCheck } from 'lucide-vue-next';

    export default {
        props: ['subject', 'description', 'color', 'id', 'index'],
        components: {
            CheckCheck
        },
        data() {
            return {
                done: false,
                finalDescription: ""
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

            // check if done
            let listDone = localStorage.getItem('doneHw')
            if(listDone != null) {
                let done = JSON.parse(listDone)
                if(done.includes(this.id + rn.toDateString())) {
                    this.$el.classList.add('done')
                    this.done = true
                }
            }

            // add event listener
            document.addEventListener('doneChanged', (e) => {
                if(e.detail.id == this.id) {
                    this.$el.classList.toggle('done')
                    this.done = this.done
                }
            })

            this.finalDescription = this.description
            if(this.description.length > 180) {
                this.finalDescription = this.description.substring(0, 180) + "..."
            }

            // index
            this.$el.style.setProperty('--index', this.index)
        }
    }
</script>

<template>
    <div class="homework" v-wave>
        <div class="hwcolor"></div>
        <div class="hwdata">
            <p>{{subject}} <span class="doneCheck"><CheckCheck/><p>Fait</p></span></p>
            <small>{{finalDescription}}</small>
        </div>
    </div>
</template>

<style scoped>
    .homework {
        width: 100%;
        background: var(--element);
        color: var(--text);
        border-radius: 8px;
        display: flex;

        opacity: 0%;
        animation: TabNameStringUp 0.3s cubic-bezier(0,0,0,1) forwards;
        animation-delay: calc(var(--index) * 0.05s);

        box-shadow: var(--shadow) !important;
    }

    .homework.done {
        background: var(--brand-color-light);
    }

    .homework .doneCheck {
        display: none;
        background: var(--brand-color);
        color: #fff;
        border-radius: 300px;
        align-items: flex-end;
        gap: 3px;
        padding: 0px 5px;
        padding-top: 2px;
        margin-bottom: 2px;
    }

    .homework .doneCheck svg {
        height: 20px;
        transform: translateY(-2px);
    }

    .homework .doneCheck p {
        font-size: 16px;
        line-height: 16px;
        margin-top: -2px;
    }

    .homework.done .doneCheck {
        display: flex;
    }

    .homework * {
        margin: 0;
        padding: 0;
    }

    .hwdata {
        padding: 12px 18px;
        width: 100%;
    }

    .hwcolor {
        width: 6px;
        background: var(--color);
        border-radius: 10px 0px 0px 10px;
    }

    .homework p {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 2px;
        display: flex;
        gap: 5px;
        color: var(--color);
    }

    .homework .doneCheck * {
        color: #fff !important;
    }

    .homework small {
        font-size: 16px;
        font-weight: 400;
    }
</style>