<script setup>
    /* icons (from https://lucide.dev/) */
    import { CalendarRange, BookOpenCheck, LineChart, Newspaper, Scroll, MessageSquare } from 'lucide-vue-next';
</script>

<template>
    <div id="NavigationBar">
        <RouterLink to="/cours" v-wave>
            <CalendarRange />
            <p>Cours</p>
        </RouterLink>
        <RouterLink to="/devoirs" v-wave>
            <BookOpenCheck />
            <p>Devoirs</p>
        </RouterLink>
        <RouterLink to="/notes" v-wave>
            <LineChart />
            <p>Notes</p>
        </RouterLink>
        <RouterLink to="/actus" v-wave>
            <Newspaper />
            <p>Actus</p>
        </RouterLink>
    </div>
</template>

<style scoped>
    #NavigationBar {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: calc(100% - 12px * 2);
        background-color: var(--background);
        padding: 3px 12px;

        border-top: 1px solid var(--border-light);

        padding-bottom: calc(3px + env(safe-area-inset-bottom));

        position: fixed;
        bottom: 0 !important;
    }

    #NavigationBar * {
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: inherit;
    }

    /* Bouton de tab */
    #NavigationBar a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 60px;

        padding-bottom: 1px;

        color: var(--text);
        opacity: 42%;

        border-radius: 8px;
    }

    /* Texte du bouton */
    #NavigationBar p {
        font-size: 15px;
        line-height: 15px;
        letter-spacing: -0.02em;
        text-align: center;
        margin-top: 5px;

        font-weight: 600;

        opacity: 0%;
        margin-bottom: -17px;

        transition: margin-bottom 0.2s, opacity 0.1s;
    }

    #NavigationBar a.router-link-active {
        color: var(--brand-color);
        opacity: 100%;
        font-weight: 600;
        transform: translateY(0px);
    }

    #NavigationBar a.router-link-active p {
        opacity: 100%;
        margin-bottom: 0px;
    }
</style>