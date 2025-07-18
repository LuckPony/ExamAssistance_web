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
      path: '/planTotal',
      name: 'PlanTotal',
      component:()=>import('../views/plan/planTotal.vue'),
    },
    {
      path: '/planToday',
      name: 'PlanToday',
      component:()=>import('../views/plan/planToday.vue'),
    },
     {
      path: '/myInfo',
      name: 'MyInfo',
      component:()=>import('../views/user/myInfo.vue'),
    },
   
  ],
})

export default router
