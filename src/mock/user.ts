import setupMock, { failResponseWrap, successResponseWrap } from '@/utils/setup-mock'
import Mock from 'mockjs'

import { MockParams } from '@/types/mock'
import { isLogin } from '@/utils/auth'

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin'
        return successResponseWrap({
          name: '王立群',
          avatar: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
        })
      }
      return failResponseWrap(null, '未登录', 50008)
    })

    // 登录
    Mock.mock(new RegExp('/api/user/login'), (params: MockParams) => {
      const { username, password } = JSON.parse(params.body)
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 50000)
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000)
      }
      if (username === 'admin' && password === 'admin') {
        window.localStorage.setItem('userRole', 'admin')
        return successResponseWrap({
          token: '12345',
        })
      }
      if (username === 'user' && password === 'user') {
        window.localStorage.setItem('userRole', 'user')
        return successResponseWrap({
          token: '54321',
        })
      }
      return failResponseWrap(null, '账号或者密码错误', 50000)
    })

    // 登出
    Mock.mock(new RegExp('/api/user/logout'), () => {
      return successResponseWrap(null)
    })

    // 用户的服务端菜单 - 从菜单管理系统获取
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const role = window.localStorage.getItem('userRole') || 'admin'
      
      // 这里直接返回空数组，因为菜单数据现在由菜单管理系统提供
      // 实际的菜单数据通过 /api/menu/routes 接口获取
      const menuList = []

      // 缓存菜单数据到本地存储
      localStorage.setItem('cached-menu-data', JSON.stringify({
        data: menuList,
        timestamp: Date.now(),
        role: role
      }))

      return successResponseWrap(menuList)
    })
  },
})