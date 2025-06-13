<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.department']" />
    <a-card class="general-card" :title="$t('menu.system.department')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="departmentName" label="部门名称">
                  <a-input v-model="formModel.departmentName" placeholder="请输入部门名称" />
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
              新增部门
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
        <template #departmentName="{ record }">
          <a-space>
            <icon-apartment v-if="record.level === 1" />
            <icon-user-group v-else />
            {{ record.departmentName }}
          </a-space>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 'active'" color="green">启用</a-tag>
          <a-tag v-else color="red">禁用</a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small">编辑</a-button>
          <a-button type="text" size="small">新增下级</a-button>
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
    departmentName: '',
    status: '',
  }
}

const { loading, setLoading } = useLoading(false)
const expandedKeys = ref<string[]>([])

const renderData = ref([
  {
    id: '1',
    departmentName: '总公司',
    departmentCode: 'HQ',
    level: 1,
    parentId: null,
    manager: '张三',
    phone: '010-12345678',
    email: 'hq@company.com',
    sort: 1,
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: '1-1',
        departmentName: '技术部',
        departmentCode: 'TECH',
        level: 2,
        parentId: '1',
        manager: '李四',
        phone: '010-12345679',
        email: 'tech@company.com',
        sort: 1,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: '1-1-1',
            departmentName: '前端组',
            departmentCode: 'FE',
            level: 3,
            parentId: '1-1',
            manager: '王五',
            phone: '010-12345680',
            email: 'fe@company.com',
            sort: 1,
            status: 'active',
            createTime: '2024-01-01 10:00:00',
          },
          {
            id: '1-1-2',
            departmentName: '后端组',
            departmentCode: 'BE',
            level: 3,
            parentId: '1-1',
            manager: '赵六',
            phone: '010-12345681',
            email: 'be@company.com',
            sort: 2,
            status: 'active',
            createTime: '2024-01-01 10:00:00',
          },
        ],
      },
      {
        id: '1-2',
        departmentName: '市场部',
        departmentCode: 'MKT',
        level: 2,
        parentId: '1',
        manager: '孙七',
        phone: '010-12345682',
        email: 'mkt@company.com',
        sort: 2,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: '1-3',
        departmentName: '人事部',
        departmentCode: 'HR',
        level: 2,
        parentId: '1',
        manager: '周八',
        phone: '010-12345683',
        email: 'hr@company.com',
        sort: 3,
        status: 'active',
        createTime: '2024-01-01 10:00:00',
      },
    ],
  },
])

const formModel = ref(generateFormModel())

const columns = [
  {
    title: '部门名称',
    dataIndex: 'departmentName',
    slotName: 'departmentName',
  },
  {
    title: '部门编码',
    dataIndex: 'departmentCode',
  },
  {
    title: '负责人',
    dataIndex: 'manager',
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
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

const onExpand = (rowKey: string) => {
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
  name: 'DepartmentManagement',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
</template>