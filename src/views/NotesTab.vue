<script setup lang="ts">
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';
</script>

<template>
    <TabName name="Résultats" logged />
    <div id="content">
        <NoItem
            title="Pas de notes enregistrées sur cette période"
            subtitle="Pour consulter les autres périodes, utilisez le client Pronote classique."
        />
    </div>
</template>

<style scoped>
</style>