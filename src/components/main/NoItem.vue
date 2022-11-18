<script lang="ts">
    import { CalendarOff } from 'lucide-vue-next';

    export default {
        components: {
            CalendarOff
        },
        props: ['title', 'subtitle']
    }
</script>

<template>
    <div class="noItem">
        <CalendarOff />
        <h3>{{title}}</h3>
        <p>{{subtitle}}</p>
    </div>
</template>

<style scoped>
    .noItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 40vh;
        text-align: center;
        margin: 30px;
        color: var(--text)
    }

    .noItem * {
        margin: 0;
        padding: 0;
    }

    .noItem svg {
        width: 32px;
        height: 32px;
        margin-bottom: 18px;
    }

    .noItem h3 {
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 10px;
    }

    .noItem p {
        font-size: 18px;
        line-height: 18px;
        color: var(--text-light);
        opacity: 50%;
    }
</style>