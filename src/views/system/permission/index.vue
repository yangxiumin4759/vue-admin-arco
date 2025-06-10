<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.permission']" />
    <a-card class="general-card" :title="$t('menu.system.permission')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="permissionName" label="权限名称">
                  <a-input v-model="formModel.permissionName" placeholder="请输入权限名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" label="权限类型">
                  <a-select v-model="formModel.type" placeholder="请选择权限类型">
                    <a-option value="menu">菜单权限</a-option>
                    <a-option value="button">按钮权限</a-option>
                    <a-option value="api">接口权限</a-option>
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
              新增权限
            </a-button>
            <a-button>
              <template #icon>
                <icon-download />
              </template>
              导出
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #type="{ record }">
          <a-tag v-if="record.type === 'menu'" color="blue">菜单权限</a-tag>
          <a-tag v-else-if="record.type === 'button'" color="green">按钮权限</a-tag>
          <a-tag v-else color="orange">接口权限</a-tag>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 'active'" color="green">启用</a-tag>
          <a-tag v-else color="red">禁用</a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small">编辑</a-button>
          <a-button type="text" size="small" status="danger">删除</a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import useLoading from '@/hooks/loading'
import { Pagination } from '@/types/global'

const generateFormModel = () => {
  return {
    permissionName: '',
    type: '',
    status: '',
  }
}

const { loading, setLoading } = useLoading(false)
const renderData = ref([
  {
    id: 1,
    permissionName: '系统管理',
    permissionCode: 'system:manage',
    type: 'menu',
    description: '系统管理菜单权限',
    status: 'active',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    permissionName: '用户新增',
    permissionCode: 'user:add',
    type: 'button',
    description: '用户新增按钮权限',
    status: 'active',
    createTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    permissionName: '用户查询接口',
    permissionCode: 'api:user:query',
    type: 'api',
    description: '用户查询接口权限',
    status: 'active',
    createTime: '2024-01-03 10:00:00',
  },
])

const formModel = ref(generateFormModel())

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
  total: 3,
})

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    slotName: 'index',
    width: 80,
  },
  {
    title: '权限名称',
    dataIndex: 'permissionName',
  },
  {
    title: '权限编码',
    dataIndex: 'permissionCode',
  },
  {
    title: '权限类型',
    dataIndex: 'type',
    slotName: 'type',
  },
  {
    title: '描述',
    dataIndex: 'description',
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

const onPageChange = (current: number) => {
  pagination.current = current
}
</script>

<script lang="ts">
export default {
  name: 'PermissionManagement',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>