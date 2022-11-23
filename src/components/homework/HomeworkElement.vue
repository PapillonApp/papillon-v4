<script lang="ts">
    export default {
        props: ['subject', 'description', 'color'],
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
        }
    }
</script>

<template>
    <div class="homework" v-wave>
        <div class="hwcolor"></div>
        <div class="hwdata">
            <p>{{subject}}</p>
            <small>{{description}}</small>
        </div>
    </div>
</template>

<style scoped>
    .homework {
        width: calc(100% - 18px * 2);
        background: var(--element);
        color: var(--text);
        border-radius: 8px;
        padding: 14px 18px;
    }

    .homework * {
        margin: 0;
        padding: 0;
    }

    .homework p {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 2px;
    }

    .homework small {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
    }
</style>