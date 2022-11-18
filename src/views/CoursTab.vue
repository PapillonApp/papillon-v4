<script setup lang="ts">
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';
    import NoItem from '@/components/main/NoItem.vue';
</script>

<template>
    <TabName name="Emploi du temps" calendar logged />
    <div id="content">
        
        <NoItem
            title="Pas de cours prévus pour cette journée"
            subtitle="Utilisez le calendrier pour consulter les jours passés et à venir"
        />

    </div>
</template>

<style scoped>
</style>