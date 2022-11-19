<script setup lang="ts">
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';

    import { Newspaper } from 'lucide-vue-next'
</script>

<template>
    <TabName name="Actualités" logged />
    <div id="content">
        <NoItem title="Pas encore d'actualités dans cet établissement" subtitle="Pour consulter vos messages, utilisez le client Pronote classique.">
            <Newspaper />
        </NoItem>
    </div>
</template>

<style scoped>
</style>