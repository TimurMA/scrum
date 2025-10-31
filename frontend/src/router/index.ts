import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/UserProfile.vue')
  },
  {
    path: '/board/:id',
    name: 'KanbanBoard',
    component: () => import('@/views/kanban/KanbanBoard.vue'),
  },
  {
    path: '/backlog',
    name: 'Backlog',
    component: () => import('@/views/kanban/BacklogView.vue')
  },
  {
    path: '/sprints',
    name: 'Sprints',
    component: () => import('@/views/kanban/SprintsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router