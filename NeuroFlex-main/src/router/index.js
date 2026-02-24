import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { title: '认知训练游戏平台' }
  },
  {
    path: '/schulte',
    name: 'Schulte',
    component: () => import('@/pages/games/Schulte.vue'),
    meta: { title: '舒尔特方格训练' }
  },
  {
    path: '/stroop',
    name: 'Stroop',
    component: () => import('@/pages/games/Stroop.vue'),
    meta: { title: 'Stroop 训练' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '认知训练游戏平台'
  next()
})

export default router
