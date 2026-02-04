import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  type RouteRecordRaw,
} from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import BookView from '@/views/BookView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/book', name: 'Book', component: BookView },
]

export function createAppRouter() {
  const history = typeof window === 'undefined' ? createMemoryHistory() : createWebHistory()

  return createRouter({
    history,
    routes,
  })
}
