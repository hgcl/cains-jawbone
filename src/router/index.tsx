import { createWebHistory, createRouter } from 'vue-router'
import Home from '@/views/Home.vue'
import Book from '@/views/Book.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/book',
    name: 'Book',
    component: Book,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
