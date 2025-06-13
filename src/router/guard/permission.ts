import NProgress from 'nprogress' // progress bar
import type { Router, RouteRecordNormalized } from 'vue-router'

import usePermission from '@/hooks/permission'
import { useAppStore, useUserStore } from '@/store'
import { NOT_FOUND, WHITE_LIST } from '../constants'
import { getDynamicRoutes } from '@/api/menu'

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const Permission = usePermission()
    const permissionsAllow = Permission.accessRouter(to)
    
    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // Handle routing configuration from the server

      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      // Refine the permission logic from the server's menu configuration as needed
      if (!appStore.appAsyncMenus.length && !WHITE_LIST.find((el) => el.name === to.name)) {
        await appStore.fetchServerMenuConfig()
        
        // 获取动态路由并注册
        try {
          const { data: routes } = await getDynamicRoutes()
          
          // 动态注册路由
          const registerRoutes = (routeList: any[], parentRoute?: any) => {
            routeList.forEach(route => {
              if (route.component && route.path) {
                const routeConfig: any = {
                  path: route.path,
                  name: route.name,
                  component: () => import(`@${route.component}`),
                  meta: route.meta || {}
                }
                
                if (parentRoute) {
                  // 如果有父路由，添加到父路由的children中
                  if (!parentRoute.children) {
                    parentRoute.children = []
                  }
                  parentRoute.children.push(routeConfig)
                } else {
                  // 顶级路由需要包装在默认布局中
                  const layoutRoute = {
                    path: route.path,
                    name: `${route.name}Layout`,
                    component: () => import('@/layout/default-layout.vue'),
                    meta: route.meta || {},
                    children: [
                      {
                        path: '',
                        name: route.name,
                        component: () => import(`@${route.component}`),
                        meta: route.meta || {}
                      }
                    ]
                  }
                  router.addRoute(layoutRoute)
                }
                
                // 递归注册子路由
                if (route.children && route.children.length > 0) {
                  registerRoutes(route.children, routeConfig)
                }
              }
            })
          }
          
          registerRoutes(routes)
          
          // 如果当前路由不存在，重新导航
          if (!router.hasRoute(to.name as string)) {
            next({ ...to, replace: true })
            return
          }
        } catch (error) {
          console.error('动态路由注册失败:', error)
        }
      }
      
      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST]

      let exist = false
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift()
        if (element?.name === to.name) exist = true

        if (element?.children) {
          serverMenuConfig.push(...(element.children as unknown as RouteRecordNormalized[]))
        }
      }
      if (exist && permissionsAllow) {
        next()
      } else next(NOT_FOUND)
    } else {
      // eslint-disable-next-line no-lonely-if
      if (permissionsAllow) next()
      else {
        const destination = Permission.findFirstPermissionRoute([], userStore.role) || NOT_FOUND
        next(destination)
      }
    }
    NProgress.done()
  })
}