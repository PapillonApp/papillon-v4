<script lang="ts">
    import { CheckCheck } from 'lucide-vue-next';

    export default {
        props: ['subject', 'description', 'color', 'id'],
        components: {
            CheckCheck
        },
        data() {
            return {
                done: false
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
                if(done.includes(this.id)) {
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
        }
    }
</script>

<template>
    <div class="homework" v-wave>
        <div class="hwcolor"></div>
        <div class="hwdata">
            <p>{{subject}} <span class="doneCheck"><CheckCheck/><p>Fait</p></span></p>
            <small>{{description}}</small>
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
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 2px;
        display: flex;
        gap: 5px;
    }

    .homework small {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
    }
</style>