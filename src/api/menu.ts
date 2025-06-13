import axios from 'axios'

export interface MenuRecord {
  id: string
  menuName: string
  path?: string
  component?: string
  code?: string
  icon?: string
  type: 'directory' | 'menu' | 'button'
  sort: number
  locale?: string
  roles: string[]
  status: 'active' | 'inactive'
  parentId?: string
  createTime: string
  children?: MenuRecord[]
}

export interface MenuListRes {
  list: MenuRecord[]
  total: number
}

// 获取菜单列表
export function queryMenuList() {
  return axios.get<MenuRecord[]>('/api/menu/list')
}

// 新增菜单
export function addMenu(data: Partial<MenuRecord>) {
  return axios.post('/api/menu/add', data)
}

// 更新菜单
export function updateMenu(id: string, data: Partial<MenuRecord>) {
  return axios.put(`/api/menu/update/${id}`, data)
}

// 删除菜单
export function deleteMenuById(id: string) {
  return axios.delete(`/api/menu/delete/${id}`)
}

// 获取动态路由
export function getDynamicRoutes() {
  return axios.get('/api/menu/routes')
}