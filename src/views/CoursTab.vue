<script setup lang="ts">
    import TabName from '../components/main/TabName.vue'
    import CoursElement from '@/components/cours/CoursElement.vue';
</script>

<template>
    <TabName name="Emploi du temps" calendar logged />
    <div id="content">
        
        <div class="list">
            <CoursElement time="12:00" wait="dans 5 min" name="sciences économiques et sociales" room="salle A210" teacher="M. Durand" color="#5340ED"/>
        </div>

    </div>
</template>

<style scoped>
</style>