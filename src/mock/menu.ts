import Mock from 'mockjs'
import setupMock, { successResponseWrap } from '@/utils/setup-mock'

// 模拟菜单数据
let menuData = [
  {
    id: '1',
    menuName: '仪表盘',
    path: '/dashboard',
    icon: 'icon-dashboard',
    type: 'directory',
    sort: 1,
    locale: 'menu.dashboard',
    roles: ['*'],
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: '1-1',
        menuName: '工作台',
        path: '/dashboard/workplace',
        component: '/views/dashboard/workplace/index.vue',
        type: 'menu',
        sort: 1,
        locale: 'menu.dashboard.workplace',
        roles: ['*'],
        status: 'active',
        parentId: '1',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '1-2',
        menuName: '实时监控',
        path: '/dashboard/monitor',
        component: '/views/dashboard/monitor/index.vue',
        type: 'menu',
        sort: 2,
        locale: 'menu.dashboard.monitor',
        roles: ['admin'],
        status: 'active',
        parentId: '1',
        createTime: '2024-01-01 10:00:00',
      },
    ],
  },
  {
    id: '2',
    menuName: '列表页',
    path: '/list',
    icon: 'icon-list',
    type: 'directory',
    sort: 2,
    locale: 'menu.list',
    roles: ['*'],
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: '2-1',
        menuName: '查询表格',
        path: '/list/search-table',
        component: '/views/list/search-table/index.vue',
        type: 'menu',
        sort: 1,
        locale: 'menu.list.searchTable',
        roles: ['*'],
        status: 'active',
        parentId: '2',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '2-2',
        menuName: '卡片列表',
        path: '/list/card',
        component: '/views/list/card/index.vue',
        type: 'menu',
        sort: 2,
        locale: 'menu.list.cardList',
        roles: ['*'],
        status: 'active',
        parentId: '2',
        createTime: '2024-01-01 10:00:00',
      },
    ],
  },
  {
    id: '3',
    menuName: '系统管理',
    path: '/system',
    icon: 'icon-settings',
    type: 'directory',
    sort: 10,
    locale: 'menu.system',
    roles: ['admin'],
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: '3-1',
        menuName: '管理员管理',
        path: '/system/admin',
        component: '/views/system/admin/index.vue',
        type: 'menu',
        sort: 1,
        locale: 'menu.system.admin',
        roles: ['admin'],
        status: 'active',
        parentId: '3',
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: '3-1-1',
            menuName: '新增',
            code: 'admin:add',
            type: 'button',
            sort: 1,
            roles: ['admin'],
            status: 'active',
            parentId: '3-1',
            createTime: '2024-01-01 10:00:00',
          },
          {
            id: '3-1-2',
            menuName: '编辑',
            code: 'admin:edit',
            type: 'button',
            sort: 2,
            roles: ['admin'],
            status: 'active',
            parentId: '3-1',
            createTime: '2024-01-01 10:00:00',
          },
        ],
      },
      {
        id: '3-2',
        menuName: '角色管理',
        path: '/system/role',
        component: '/views/system/role/index.vue',
        type: 'menu',
        sort: 2,
        locale: 'menu.system.role',
        roles: ['admin'],
        status: 'active',
        parentId: '3',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '3-3',
        menuName: '权限管理',
        path: '/system/permission',
        component: '/views/system/permission/index.vue',
        type: 'menu',
        sort: 3,
        locale: 'menu.system.permission',
        roles: ['admin'],
        status: 'active',
        parentId: '3',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '3-4',
        menuName: '菜单管理',
        path: '/system/menu',
        component: '/views/system/menu/index.vue',
        type: 'menu',
        sort: 4,
        locale: 'menu.system.menu',
        roles: ['admin'],
        status: 'active',
        parentId: '3',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '3-5',
        menuName: '部门管理',
        path: '/system/department',
        component: '/views/system/department/index.vue',
        type: 'menu',
        sort: 5,
        locale: 'menu.system.department',
        roles: ['admin'],
        status: 'active',
        parentId: '3',
        createTime: '2024-01-01 10:00:00',
      },
    ],
  },
]

setupMock({
  setup() {
    // 获取菜单列表
    Mock.mock(new RegExp('/api/menu/list'), () => {
      return successResponseWrap(menuData)
    })

    // 新增菜单
    Mock.mock(new RegExp('/api/menu/add'), (params) => {
      const data = JSON.parse(params.body)
      const newMenu = {
        ...data,
        id: Mock.Random.id(),
        createTime: Mock.Random.datetime(),
      }
      
      if (data.parentId) {
        // 添加到父菜单的children中
        const addToParent = (menus, parentId, newItem) => {
          for (const menu of menus) {
            if (menu.id === parentId) {
              if (!menu.children) menu.children = []
              menu.children.push(newItem)
              return true
            }
            if (menu.children && addToParent(menu.children, parentId, newItem)) {
              return true
            }
          }
          return false
        }
        addToParent(menuData, data.parentId, newMenu)
      } else {
        menuData.push(newMenu)
      }
      
      return successResponseWrap(newMenu)
    })

    // 更新菜单
    Mock.mock(new RegExp('/api/menu/update/(.*)'), (params) => {
      const id = params.url.split('/').pop()
      const data = JSON.parse(params.body)
      
      const updateMenu = (menus, targetId, updateData) => {
        for (const menu of menus) {
          if (menu.id === targetId) {
            Object.assign(menu, updateData)
            return true
          }
          if (menu.children && updateMenu(menu.children, targetId, updateData)) {
            return true
          }
        }
        return false
      }
      
      updateMenu(menuData, id, data)
      return successResponseWrap(data)
    })

    // 删除菜单
    Mock.mock(new RegExp('/api/menu/delete/(.*)'), (params) => {
      const id = params.url.split('/').pop()
      
      const deleteMenu = (menus, targetId) => {
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].id === targetId) {
            menus.splice(i, 1)
            return true
          }
          if (menus[i].children && deleteMenu(menus[i].children, targetId)) {
            return true
          }
        }
        return false
      }
      
      deleteMenu(menuData, id)
      return successResponseWrap(true)
    })

    // 获取动态路由
    Mock.mock(new RegExp('/api/menu/routes'), () => {
      const role = window.localStorage.getItem('userRole') || 'admin'
      
      // 过滤菜单数据，只返回当前用户有权限的菜单
      const filterMenusByRole = (menus, userRole) => {
        return menus.filter(menu => {
          if (menu.status !== 'active') return false
          if (!menu.roles.includes('*') && !menu.roles.includes(userRole)) return false
          
          if (menu.children) {
            menu.children = filterMenusByRole(menu.children, userRole)
          }
          
          return true
        })
      }
      
      const filteredMenus = filterMenusByRole(JSON.parse(JSON.stringify(menuData)), role)
      
      // 转换为路由格式
      const convertToRoutes = (menus) => {
        return menus.map(menu => {
          const route = {
            path: menu.path,
            name: menu.path?.split('/').pop() || menu.menuName,
            component: menu.component,
            meta: {
              locale: menu.locale,
              requiresAuth: true,
              icon: menu.icon,
              order: menu.sort,
              roles: menu.roles,
            }
          }
          
          if (menu.children && menu.children.length > 0) {
            route.children = convertToRoutes(menu.children.filter(child => child.type !== 'button'))
          }
          
          return route
        }).filter(route => route.path) // 只返回有路径的菜单
      }
      
      return successResponseWrap(convertToRoutes(filteredMenus))
    })
  },
})