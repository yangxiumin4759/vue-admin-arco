import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 10,
  },
  children: [
    {
      path: 'admin',
      name: 'AdminManagement',
      component: () => import('@/views/system/admin/index.vue'),
      meta: {
        locale: 'menu.system.admin',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'role',
      name: 'RoleManagement',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'permission',
      name: 'PermissionManagement',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        locale: 'menu.system.permission',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'menu',
      name: 'MenuManagement',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: 'menu.system.menu',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
}

export default SYSTEM