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
      path: '/user/login',
      name: 'Login',
      component:()=>import('../views/user/Login.vue'),
    },
   
  ],
})

export default router
