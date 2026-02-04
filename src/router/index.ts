import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BookView from '@/views/BookView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/book',
    name: 'Book',
    component: BookView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
