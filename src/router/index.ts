import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/',
      name: 'cours',
      component: () => import('../views/CoursTab.vue')
    },
    {
      path: '/devoirs',
      name: 'devoirs',
      component: () => import('../views/DevoirsTab.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesTab.vue')
    },
    {
      path: '/actus',
      name: 'actus',
      component: () => import('../views/ActusTab.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'login'
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  }
})

export default router