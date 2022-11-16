<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import NavigationBar from './components/main/NavigationBar.vue'
</script>

<template>
  <!-- Affiche la tab sélectionnée -->
  <div id="main">
    <RouterView />
  </div>
  <NavigationBar />
</template>

<style scoped>
  #main {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  #NavigationBar {

  }
</style>