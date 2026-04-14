import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import MenuView from '@/views/MenuView.vue'
import CardapioView from '@/views/CardapioView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/menu', name: 'menu', component: MenuView },
    { path: '/cardapio', name: 'cardapio', component: CardapioView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/admin', name: 'admin', component: AdminView }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const isAdminAuthenticated = store.getters['adminAuth/isAuthenticated'] as boolean

  if (to.path === '/admin' && !isAdminAuthenticated) {
    return { path: '/login', query: { redirect: '/admin' } }
  }

  if (to.path === '/login' && isAdminAuthenticated) {
    return { path: '/admin' }
  }

  return true
})

export default router
