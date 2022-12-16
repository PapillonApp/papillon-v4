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
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }


  #main {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden !important;
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