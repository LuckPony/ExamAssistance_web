import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component:()=>import('../views/user/Login.vue'),
    },
    {
      path: '/plan',
      name: 'Plan',
      component:()=>import('../views/plan/Plan.vue'),
    },
    {
      path: '/reflection',
      name: 'Reflection',
      component:()=>import('../views/plan/planTotal.vue'),
    },
   
  ],
})

export default router
