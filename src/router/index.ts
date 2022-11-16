import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'cours',
      component: () => import('../views/CoursTab.vue')
    }
  ]
})

export default router
