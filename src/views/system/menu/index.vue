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
            <a-button type="primary">
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
          <a-button type="text" size="small">编辑</a-button>
          <a-button v-if="record.type !== 'button'" type="text" size="small">新增</a-button>
          <a-button type="text" size="small" status="danger">删除</a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useLoading from '@/hooks/loading'

const generateFormModel = () => {
  return {
    menuName: '',
    type: '',
    status: '',
  }
}

const { loading, setLoading } = useLoading(false)
const expandedKeys = ref<string[]>([])

const renderData = ref([
  {
    id: '1',
    menuName: '仪表盘',
    path: '/dashboard',
    icon: 'icon-dashboard',
    type: 'directory',
    sort: 1,
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: '1-1',
        menuName: '工作台',
        path: '/dashboard/workplace',
        type: 'menu',
        sort: 1,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '1-2',
        menuName: '实时监控',
        path: '/dashboard/monitor',
        type: 'menu',
        sort: 2,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
      },
    ],
  },
  {
    id: '2',
    menuName: '系统管理',
    path: '/system',
    icon: 'icon-settings',
    type: 'directory',
    sort: 10,
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: '2-1',
        menuName: '管理员管理',
        path: '/system/admin',
        type: 'menu',
        sort: 1,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: '2-1-1',
            menuName: '新增',
            code: 'admin:add',
            type: 'button',
            sort: 1,
            status: 'active',
            createTime: '2024-01-01 10:00:00',
          },
          {
            id: '2-1-2',
            menuName: '编辑',
            code: 'admin:edit',
            type: 'button',
            sort: 2,
            status: 'active',
            createTime: '2024-01-01 10:00:00',
          },
        ],
      },
      {
        id: '2-2',
        menuName: '角色管理',
        path: '/system/role',
        type: 'menu',
        sort: 2,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
      },
    ],
  },
])

const formModel = ref(generateFormModel())

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

const search = () => {
  setLoading(true)
  setTimeout(() => {
    setLoading(false)
  }, 1000)
}

const reset = () => {
  formModel.value = generateFormModel()
}

const onExpand = (rowKey: string, record: any) => {
  const index = expandedKeys.value.indexOf(rowKey)
  if (index > -1) {
    expandedKeys.value.splice(index, 1)
  } else {
    expandedKeys.value.push(rowKey)
  }
}

const expandAll = () => {
  const getAllKeys = (data: any[]): string[] => {
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