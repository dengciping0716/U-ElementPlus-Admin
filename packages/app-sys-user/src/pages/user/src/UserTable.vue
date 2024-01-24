<template>
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
        <!-- <el-form-item label="状态：" prop="isUse">
          <m-select prefix-icon="ep-search" remote filterable clearable checkNull :props="dict" v-model="searchParams.isUse" />
        </el-form-item> -->
      </el-form>
      <el-divider direction="vertical" class="important-h-8 important-mr-3" />
      <div class="">
        <el-button text icon="ep-refresh" @click="searchForm.resetFields()"></el-button>
        <el-button type="primary" icon="ep-search" @click="doSearch()"></el-button>
      </div>
    </template>

    <template #toolBar v-if="organizeCode">
      <el-button text type="primary" icon="ep-plus" @click="editRow()"> <span class="text-black dark:text-white">新增</span></el-button>
      <el-divider direction="vertical" />
      <el-button text type="primary" icon="ep-top-right" @click="editRow()">
        <span class="text-black dark:text-white">导出</span></el-button
      >
      <el-divider direction="vertical" />
    </template>

    <!-- 列设置 -->
    <template #col="{ tableColumns, targetPage, pageSize }">
      <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
        <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
      </el-table-column>
      <template v-for="(item, i) in tableColumns" :key="i">
        <el-table-column v-bind="item">
          <template #default="{ row }" v-if="item.prop == 'isUse'">
            <el-switch v-model="row.isUse" size="small" active-value="1" inactive-value="0" @change="toggleUse(row)" />
          </template>
          <template #default="{ row }" v-if="item.prop == 'sex'">
            <el-tag v-if="row.sex == '1'">男</el-tag>
            <el-tag v-if="row.sex != '1'" type="danger">女</el-tag>
          </template>
        </el-table-column>
      </template>
      <el-table-column prop="propertyValue" label="操作" width="120px" v-bind="_center">
        <template #default="scope">
          <el-button text size="small" type="primary" @click="editRow(scope.row)" icon="ep-edit"> </el-button>
          <el-button text size="small" type="danger" @click="delRow(scope.row)" icon="ep-delete"> </el-button>
        </template>
      </el-table-column>
    </template>
  </BasicTable>

  <el-dialog :title="editDailogModel.action + '用户'" v-if="editDailogModel.visible" v-model="editDailogModel.visible" width="600px">
    <UserEdit
      :id="editDailogModel.id"
      :organizeId="editDailogModel.organizeId"
      @submit="
        editDailogModel.visible = false;
        doSearch();
      "
      @cancel="editDailogModel.visible = false"
      @del="editDailogModel.visible = false" />
  </el-dialog>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';
import type { UserModel } from './useUserApi';
import { useUserApi } from './useUserApi';
import { ElMessageBox, ElNotification } from 'element-plus';
import UserEdit from './UserEdit.vue';

const props = defineProps<{ organizeCode?: string; organizeName?: string; organizeId?: string }>();

const { queryList, del, toggleUse } = useUserApi();

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
  { ..._center, prop: 'sex', label: '性别', width: '60px' },
  // { prop: '_', label: '部门', width: '100px' },
  { ..._center, prop: 'telephone', label: '手机号码', width: '140px' },
  { ..._center, prop: 'isUse', label: '是否启用', width: '120px', ...filters.isUse },
  { ..._center, prop: 'createDate', label: '创建时间', width: '160px' },
  { ..._center, prop: 'roleName', label: '岗位', width: '160px' },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: true,
  showSetting: true,
  isFitContent: true,
  api: (params: any) => queryList({ ...params, ...unref(searchParams), organizeCode: props.organizeCode }),
  tableColumns,
});

function filterHandler(val: any) {
  console.log('filterHandler:', val);

  Object.keys(val).forEach((ele) => {
    searchParams.value[ele] = val[ele][0];
  });
  doSearch();
}

watch(
  () => props.organizeCode,
  () => {
    doSearch();
  },
  { immediate: true }
);

function doSearch() {
  setTargetPage(1);
  reload();
}

const dict = {
  value: 'dictCode',
  label: 'dictLnm',
  lazyLoad: () => $http.get(resolveUrl('/auction/dict/getDictListInfo?dictGrp=GRP_IS_USE')).then((data: any) => data.result),
};

async function delRow(delRow: UserModel) {
  let isConfirm = await ElMessageBox.confirm(`是否删除用户 ${delRow.empName} ?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((e) => false);

  if (isConfirm)
    return del(delRow.empId!).then(() => {
      ElNotification.success(`删除用户 ${delRow.empName} 成功！`);
      doSearch();
    });

  return Promise.reject(false);
}

const editDailogModel = reactive({
  visible: false,
  action: '新增',
  id: '',
  organizeId: '',
});
// 0 新增，
function editRow(row?: UserModel) {
  if (row) {
    editDailogModel.visible = true;
    editDailogModel.action = '编辑';
    editDailogModel.id = row.empId!;
    editDailogModel.organizeId = props.organizeId || '';
  } else {
    editDailogModel.visible = true;
    editDailogModel.action = '新增';
    editDailogModel.id = '';
    editDailogModel.organizeId = props.organizeId || '';
  }
}
</script>
