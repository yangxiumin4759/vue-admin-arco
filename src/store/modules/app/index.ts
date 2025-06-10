import { defineStore } from 'pinia'
import { Notification } from '@arco-design/web-vue'
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface'
import type { RouteRecordNormalized } from 'vue-router'
import defaultSettings from '@/config/settings.json'
import { getMenuList } from '@/api/user'
import { AppState } from './types'

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state }
    },
    appDevice(state: AppState) {
      return state.device
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[]
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial)
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark'
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        this.theme = 'light'
        document.body.removeAttribute('arco-theme')
      }
    },
    toggleDevice(device: string) {
      this.device = device
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null
      try {
        // 检查本地缓存
        const cachedData = this.getCachedMenuData()
        if (cachedData) {
          this.serverMenu = cachedData
          return
        }

        notifyInstance = Notification.info({
          id: 'menuNotice',
          content: '正在加载菜单...',
          closable: true,
        })
        
        const { data } = await getMenuList()
        this.serverMenu = data
        
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: '菜单加载成功',
          closable: true,
        })
      } catch (error) {
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: '菜单加载失败',
          closable: true,
        })
      }
    },
    
    // 获取缓存的菜单数据
    getCachedMenuData() {
      try {
        const cached = localStorage.getItem('cached-menu-data')
        if (cached) {
          const { data, timestamp, role } = JSON.parse(cached)
          const currentRole = localStorage.getItem('userRole')
          
          // 检查缓存是否过期（1小时）和角色是否匹配
          const isExpired = Date.now() - timestamp > 60 * 60 * 1000
          const roleChanged = role !== currentRole
          
          if (!isExpired && !roleChanged) {
            return data
          } else {
            // 清除过期或角色不匹配的缓存
            localStorage.removeItem('cached-menu-data')
          }
        }
      } catch (error) {
        console.error('获取缓存菜单数据失败:', error)
        localStorage.removeItem('cached-menu-data')
      }
      return null
    },
    
    clearServerMenu() {
      this.serverMenu = []
      // 清除菜单缓存
      localStorage.removeItem('cached-menu-data')
    },
  },
})

export default useAppStore