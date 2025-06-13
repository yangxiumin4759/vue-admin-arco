<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="menuName" label="菜单名称">
                  <a-input v-model="formModel.menuName" placeholder="请输入菜单名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" label="菜单类型">
                  <a-select v-model="formModel.type" placeholder="请选择菜单类型">
                    <a-option value="directory">目录</a-option>
                    <a-option value="menu">菜单</a-option>
                    <a-option value="button">按钮</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select v-model="formModel.status" placeholder="请选择状态">
                    <a-option value="active">启用</a-option>
                    <a-option value="inactive">禁用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="showAddModal">
              <template #icon>
                <icon-plus />
              </template>
              新增菜单
            </a-button>
            <a-button @click="expandAll">
              <template #icon>
                <icon-expand />
              </template>
              展开全部
            </a-button>
            <a-button @click="collapseAll">
              <template #icon>
                <icon-shrink />
              </template>
              收起全部
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :pagination="false"
        :expanded-keys="expandedKeys"
        @expand="onExpand"
      >
        <template #menuName="{ record }">
          <a-space>
            <component :is="record.icon" v-if="record.icon" />
            {{ record.menuName }}
          </a-space>
        </template>
        <template #type="{ record }">
          <a-tag v-if="record.type === 'directory'" color="blue">目录</a-tag>
          <a-tag v-else-if="record.type === 'menu'" color="green">菜单</a-tag>
          <a-tag v-else color="orange">按钮</a-tag>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 'active'" color="green">启用</a-tag>
          <a-tag v-else color="red">禁用</a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="editMenu(record)">编辑</a-button>
          <a-button v-if="record.type !== 'button'" type="text" size="small" @click="addChildMenu(record)">新增</a-button>
          <a-button type="text" size="small" status="danger" @click="deleteMenu(record)">删除</a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑菜单弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      width="600px"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="menuForm" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
        <a-form-item field="parentId" label="上级菜单" v-if="menuForm.parentId">
          <a-input v-model="parentMenuName" disabled />
        </a-form-item>
        <a-form-item field="menuName" label="菜单名称" :rules="[{ required: true, message: '请输入菜单名称' }]">
          <a-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item field="type" label="菜单类型" :rules="[{ required: true, message: '请选择菜单类型' }]">
          <a-select v-model="menuForm.type" placeholder="请选择菜单类型" @change="onTypeChange">
            <a-option value="directory">目录</a-option>
            <a-option value="menu">菜单</a-option>
            <a-option value="button">按钮</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="path" label="路由路径" v-if="menuForm.type !== 'button'" :rules="[{ required: true, message: '请输入路由路径' }]">
          <a-input v-model="menuForm.path" placeholder="如：/system/admin" />
        </a-form-item>
        <a-form-item field="component" label="组件路径" v-if="menuForm.type === 'menu'" :rules="[{ required: true, message: '请输入组件路径' }]">
          <a-input v-model="menuForm.component" placeholder="如：/views/system/admin/index.vue" />
        </a-form-item>
        <a-form-item field="code" label="权限编码" v-if="menuForm.type === 'button'">
          <a-input v-model="menuForm.code" placeholder="如：admin:add" />
        </a-form-item>
        <a-form-item field="icon" label="菜单图标" v-if="menuForm.type !== 'button'">
          <a-input v-model="menuForm.icon" placeholder="如：icon-settings" />
        </a-form-item>
        <a-form-item field="sort" label="排序" :rules="[{ required: true, message: '请输入排序' }]">
          <a-input-number v-model="menuForm.sort" placeholder="数字越小越靠前" :min="0" />
        </a-form-item>
        <a-form-item field="locale" label="国际化标识" v-if="menuForm.type !== 'button'">
          <a-input v-model="menuForm.locale" placeholder="如：menu.system.admin" />
        </a-form-item>
        <a-form-item field="roles" label="可见角色">
          <a-select v-model="menuForm.roles" placeholder="请选择可见角色" multiple>
            <a-option value="*">所有用户</a-option>
            <a-option value="admin">管理员</a-option>
            <a-option value="user">普通用户</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="status" label="状态" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model="menuForm.status" placeholder="请选择状态">
            <a-option value="active">启用</a-option>
            <a-option value="inactive">禁用</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import { queryMenuList, addMenu, updateMenu, deleteMenuById } from '@/api/menu'

interface MenuRecord {
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

const generateFormModel = () => {
  return {
    menuName: '',
    type: '',
    status: '',
  }
}

const { loading, setLoading } = useLoading(false)
const expandedKeys = ref<string[]>([])
const modalVisible = ref(false)
const isEdit = ref(false)
const currentEditId = ref('')
const formRef = ref()

const renderData = ref<MenuRecord[]>([])
const formModel = ref(generateFormModel())

const menuForm = ref<Partial<MenuRecord>>({
  menuName: '',
  type: 'menu',
  path: '',
  component: '',
  code: '',
  icon: '',
  sort: 0,
  locale: '',
  roles: ['*'],
  status: 'active',
  parentId: '',
})

const modalTitle = computed(() => isEdit.value ? '编辑菜单' : '新增菜单')
const parentMenuName = ref('')

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    slotName: 'menuName',
  },
  {
    title: '路径',
    dataIndex: 'path',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '权限编码',
    dataIndex: 'code',
  },
  {
    title: '类型',
    dataIndex: 'type',
    slotName: 'type',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]

const fetchData = async () => {
  setLoading(true)
  try {
    const { data } = await queryMenuList()
    renderData.value = data
  } catch (err) {
    Message.error('获取菜单列表失败')
  } finally {
    setLoading(false)
  }
}

const search = () => {
  fetchData()
}

const reset = () => {
  formModel.value = generateFormModel()
  fetchData()
}

const onExpand = (rowKey: string) => {
  const index = expandedKeys.value.indexOf(rowKey)
  if (index > -1) {
    expandedKeys.value.splice(index, 1)
  } else {
    expandedKeys.value.push(rowKey)
  }
}

const expandAll = () => {
  const getAllKeys = (data: MenuRecord[]): string[] => {
    let keys: string[] = []
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        keys.push(item.id)
        keys = keys.concat(getAllKeys(item.children))
      }
    })
    return keys
  }
  expandedKeys.value = getAllKeys(renderData.value)
}

const collapseAll = () => {
  expandedKeys.value = []
}

const showAddModal = () => {
  isEdit.value = false
  menuForm.value = {
    menuName: '',
    type: 'menu',
    path: '',
    component: '',
    code: '',
    icon: '',
    sort: 0,
    locale: '',
    roles: ['*'],
    status: 'active',
    parentId: '',
  }
  parentMenuName.value = ''
  modalVisible.value = true
}

const addChildMenu = (record: MenuRecord) => {
  isEdit.value = false
  menuForm.value = {
    menuName: '',
    type: 'menu',
    path: '',
    component: '',
    code: '',
    icon: '',
    sort: 0,
    locale: '',
    roles: ['*'],
    status: 'active',
    parentId: record.id,
  }
  parentMenuName.value = record.menuName
  modalVisible.value = true
}

const editMenu = (record: MenuRecord) => {
  isEdit.value = true
  currentEditId.value = record.id
  menuForm.value = { ...record }
  
  if (record.parentId) {
    const findParentName = (data: MenuRecord[], parentId: string): string => {
      for (const item of data) {
        if (item.id === parentId) {
          return item.menuName
        }
        if (item.children) {
          const found = findParentName(item.children, parentId)
          if (found) return found
        }
      }
      return ''
    }
    parentMenuName.value = findParentName(renderData.value, record.parentId)
  } else {
    parentMenuName.value = ''
  }
  
  modalVisible.value = true
}

const deleteMenu = async (record: MenuRecord) => {
  try {
    await deleteMenuById(record.id)
    Message.success('删除成功')
    fetchData()
  } catch (err) {
    Message.error('删除失败')
  }
}

const onTypeChange = (value: string) => {
  if (value === 'button') {
    menuForm.value.path = ''
    menuForm.value.component = ''
    menuForm.value.icon = ''
  } else if (value === 'directory') {
    menuForm.value.component = ''
    menuForm.value.code = ''
  } else {
    menuForm.value.code = ''
  }
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (valid) return

    if (isEdit.value) {
      await updateMenu(currentEditId.value, menuForm.value)
      Message.success('更新成功')
    } else {
      await addMenu(menuForm.value)
      Message.success('新增成功')
    }
    
    modalVisible.value = false
    fetchData()
  } catch (err) {
    Message.error(isEdit.value ? '更新失败' : '新增失败')
  }
}

const handleCancel = () => {
  modalVisible.value = false
}

// 初始化数据
fetchData()
</script>

<script lang="ts">
export default {
  name: 'MenuManagement',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
</template>