<script setup lang="ts">
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';

    import { BookOpenCheck } from 'lucide-vue-next'
</script>

<template>
    <TabName name="Travail à faire" calendar logged />
    <div id="content">
        <NoItem title="Pas de travail à faire enregistré pour ce jour là" subtitle="Vous pouvez consulter vos devoirs à venir et passés avec le calendrier">
            <BookOpenCheck />
        </NoItem>
    </div>
</template>

<style scoped>
</style>