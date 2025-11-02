import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { authService } from '@api/services/AuthService'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@views/auth/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@views/profile/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:id',
    name: 'KanbanBoard',
    component: () => import('@views/kanban/KanbanBoard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/backlog',
    name: 'Backlog',
    component: () => import('@views/kanban/BacklogView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sprints',
    name: 'Sprints',
    component: () => import('@views/kanban/SprintsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (requiresGuest && isAuthenticated) {
    next({ name: 'Profile' })
  } else {
    next()
  }
})

export default router