import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import Landing from '../views/HomeView.vue'
// @ts-ignore
import Dashboard from "../views/LoggedIn.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/landing',
      name: 'landing',
      // @ts-ignore
      // component: () => import('../views/LoggedIn.vue')
      component: Landing
    }
  ]
})

export default router
