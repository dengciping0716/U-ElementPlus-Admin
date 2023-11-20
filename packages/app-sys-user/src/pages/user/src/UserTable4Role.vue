<template>
  <m-page-header :title="'岗位用户管理'" :subTitle="roleName" @back="back()">
    <template #extra>
      <!-- <el-button type="primary" icon="ep-plus" @click="editRow()">新增</el-button> -->
    </template>
  </m-page-header>

  <div class="m-page">
    <BasicTable @register="registerTable" v-bind="$attrs" @filter-change="filterHandler">
      <!-- 查询条件 -->
      <template #search>
        <el-form :model="searchParams" :inline="true" ref="searchForm">
          <el-form-item label="用户名称：" prop="empName">
            <m-input
              placeholder="请输入用户名称"
              v-model="searchParams.empName"
              clearable
              prefix-icon="ep-search"
              check-null
              cacheKey="empName"
              :maxlength="10"></m-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="telephone">
            <m-input
              placeholder="请输入手机号"
              v-model="searchParams.telephone"
              clearable
              prefix-icon="ep-search"
              check-null
              cacheKey="telephone"
              :maxlength="10"></m-input>
          </el-form-item>
        </el-form>
        <el-divider direction="vertical" class="important-h-8 important-mr-3" />
        <div class="">
          <el-button icon="ep-refresh" @click="searchForm.resetFields()"> </el-button>
          <el-button type="primary" icon="ep-search" @click="doSearch()"> </el-button>
        </div>
      </template>
      <template #toolBar>
        <el-button type="primary" icon="ep-plus" @click="selectUserRef!.show()">添加</el-button>
        <el-divider direction="vertical" />
      </template>

      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column v-bind="item">
            <template #default="scope" v-if="item.prop == 'isUse'">
              <el-switch v-model="scope.row.isUse" size="small" active-value="1" inactive-value="0" @change="toggleUse(scope.row)" />
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="propertyValue" label="操作" width="180px" v-bind="_center">
          <template #default="scope">
            <el-button size="small" type="danger" @click="delRow(scope.row)" icon="ep-delete"> </el-button>
          </template>
        </el-table-column>
      </template>
    </BasicTable>

    <selectUserByOrg :multiple="true" ref="selectUserRef" @confirm="handlerAddUser" />
  </div>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';
import { UserModel, useUserApi } from './useUserApi';
import { ElMessageBox, ElNotification } from 'element-plus';
import { mPageHeader } from '@common/core';
import { SelectUserByOrg } from '../../..';
import { useRoleApi } from '../..';

//
import { usePageContext } from '@/hooks/usePageContext';
const { back } = usePageContext();
//
const props = defineProps<{ roleId: string }>();

const { queryInfo, addUser, delUser } = useRoleApi();
const { queryList, del, toggleUse } = useUserApi();

const roleName = ref('');
watchEffect(() => {
  queryInfo(props.roleId).then((data) => {
    roleName.value = (data.organizeName || '') + ' / ' + data.roleName;
  });
});

const selectUserRef = ref<InstanceType<typeof SelectUserByOrg>>();
const searchForm = ref<any>(null);
const searchParams = ref<Recordable>({
  telephone: '',
  empName: '',
  isUse: '',
});

//筛选
const filters = {
  isUse: {
    columnKey: 'isUse',
    filters: [
      { text: '启用', value: '1' },
      { text: '停用', value: '0' },
    ],
    filterMultiple: false,
    filterPlacement: 'bottom-end',
  },
};
const _center = { headerAlign: 'center', align: 'center' };

const tableColumns = [
  { ..._center, prop: 'empCode', label: '用户编码', minWidth: '140px' },
  { ..._center, prop: 'empName', label: '用户名称', minWidth: '140px' },
  { ..._center, prop: 'empName', label: '性别', width: '60px' },
  // { prop: '_', label: '部门', width: '100px' },
  { ..._center, prop: 'telephone', label: '手机号码', width: '140px' },
  { ..._center, prop: 'isUse', label: '是否启用', width: '120px', ...filters.isUse },
  { ..._center, prop: '_', label: '创建时间', width: '160px' },
  { ..._center, prop: 'roleName', label: '岗位', width: '160px' },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: true,
  showSetting: true,
  isFitContent: true,
  immediate: true,
  api: (params: any) => queryList({ ...params, ...unref(searchParams), roleId: props.roleId }),
  tableColumns,
});

function filterHandler(val: any) {
  console.log('filterHandler:', val);

  Object.keys(val).forEach((ele) => {
    searchParams.value[ele] = val[ele][0];
  });
  doSearch();
}

function doSearch() {
  setTargetPage(1);
  reload();
}

async function delRow(row: UserModel) {
  let isConfirm = await ElMessageBox.confirm(`是否移除用户 ${row.empName} ?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((e) => false);

  if (isConfirm)
    return delUser(props.roleId, row.empId!).then(() => {
      ElNotification.success('移除成功！');
      doSearch();
    });

  return Promise.reject(false);
}

async function handlerAddUser(users: UserModel[]) {
  let params = {
    roleId: props.roleId,
    listEmpId: users.map((row) => row.empId),
  };
  addUser(params).then(() => {
    ElNotification.success('保存成功！');
    doSearch();
  });
}
</script>

<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
});
</script>
