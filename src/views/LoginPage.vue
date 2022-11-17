<script setup lang="ts">
    import TabName from '../components/main/TabName.vue'
</script>

<template>
    <TabName name="bienvenue dans Pronote+" />
    <div id="content">
        <h1>connectez-vous à Pronote ou à un ENT</h1>
        <h4>utilisez vos identifiants Pronote ou ceux de votre ENT/EduConnect pour vous connecter.</h4>
    </div>
</template>

<style scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    h1 {
        color: var(--brand-color);
        font-weight: 600;
        font-size: 36px;
        line-height: 90%;
        text-transform: none;
        margin-top: 8px;
    }

    h4 {
        color: var(--text);
        opacity: 50%;
        font-weight: 400;
        font-size: 20px;
        line-height: 90%;
        text-transform: none;
        margin-top: 10px;
    }
</style>