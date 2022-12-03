import { createRouter, createWebHistory } from 'vue-router'
import {useModalRouter} from 'jenesius-vue-modal'

let allRoutes = []

let mainTabs = [
  { 
    path: '/',
    redirect: '/cours'
  },
  {
    path: '/cours',
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
    path: '/content',
    name: 'content',
    component: () => import('../views/ContentTab.vue')
  },
  {
    path: '/actus',
    name: 'actus',
    component: () => import('../views/ActusTab.vue')
  }
]

let otherTabs = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsPage.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutTab.vue')
  },
  {
    path: '/recap',
    name: 'recap',
    component: () => import('../views/extras/RecapExtra.vue')
  }
]

let loginTabs = [
  {
    path: '/setup_1',
    name: 'setup_one',
    component: () => import('../views/login/SetupOne.vue')
  },
  {
    path: '/setup_2',
    name: 'setup_two',
    component: () => import('../views/login/SetupTwo.vue')
  },
  {
    path: '/setup_3',
    name: 'setup_three',
    component: () => import('../views/login/SetupThree.vue')
  },
  { 
    path: '/setup',
    redirect: '/setup_1'
  }
]

allRoutes = allRoutes.concat(mainTabs, otherTabs, loginTabs)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes
})

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'login' &&
    to.name !== "setup_one" &&
    to.name !== "setup_two" &&
    to.name !== "setup_three"
  ) {
    // redirect the user to the login page
    return { name: 'setup_one' }
  }
})

export default router