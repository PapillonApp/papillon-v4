<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import NavigationBar from './components/main/NavigationBar.vue'

  // hide tabbar if not logged in
  let authStatus = isAuthenticated
</script>

<template>
  <!-- Affiche la tab sélectionnée -->
  <div id="main">
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
  </RouterView>
  </div>

  <!-- Affiche la barre de navigation -->
  <NavigationBar v-if="authStatus" />
</template>

<style scoped>
  #main {
    overflow: hidden;
    width: 100%;
    height: -webkit-fill-available;
    padding-bottom: 90px;
  }

  #NavigationBar {
    position: fixed;
    bottom: 0;
  }

  #TabName {
    position: fixed;
    top: 0;
  }
</style>