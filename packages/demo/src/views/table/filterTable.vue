<template>
  <div class="m-page" wrap>
    <BasicTable @register="registerTable" @filter-change="filterHandler">
      <!-- 查询条件 -->
      <template #search>
        <el-form :model="searchParams" :inline="true" ref="searchForm">
          <el-form-item label="标的编号：" prop="targetCode">
            <el-input
              placeholder="请输入标的编号"
              v-model="searchParams.targetCode"
              clearable
              prefix-icon="ep-search"
              :maxlength="10"></el-input>
          </el-form-item>
        </el-form>
        <el-divider direction="vertical" class="important-h-8 important-mr-3" />
        <div class="">
          <el-button icon="ep-refresh" @click="searchForm.resetFields()"> </el-button>
          <el-button type="primary" icon="ep-search" @click="doSearch()"> </el-button>
        </div>
      </template>

      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column v-bind="item">
            <!-- header 过滤组件 -->
            <el-table-column v-bind="item" :filters="null" columnKey="">
              <template #header="{ column }">
                <filter-render
                  v-if="item.filterAttrs"
                  v-bind="item.filterAttrs"
                  v-model="searchParams[item.filterModel || column.property]"
                  @confirm="reload({ targetPage: 1 })" />
              </template>
              <template #default="{ row }" v-if="item.prop == 'isUse'">
                <el-tag v-if="row.isUse == '1'" type="success">启用</el-tag>
                <el-tag v-if="row.isUse != '1'" type="info">停用</el-tag>
              </template>
              <template #default="{ row }" v-if="item.prop == 'sex'">
                <el-tag v-if="row.sex == '1'">男</el-tag>
                <el-tag v-if="row.sex != '1'" type="danger">女</el-tag>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
        <el-table-column :resizable="true" label="操作" prop="btnCol" header-align="center" align="center" width="100" fixed="right">
          <template #default="scope">
            <div :key="scope.row.auctionsCode" style="display: flex">
              <el-tooltip
                v-if="scope.row.isConfirm !== '0' || scope.row.aptitudeType != '0'"
                slot="reference"
                content="查看"
                placement="top"
                :enterable="false">
                <el-button @click="log">查看</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { BasicTable, useTable, TableColumnProps } from '@common/core';
import { FilterRender, buildInput, buildDate, buildDict } from '@common/core';
const searchForm = ref<any>(null);
const searchParams = ref<Record<string, any>>({
  targetCode: '',
  type: '',
  targetName: '',
  tenantName: '',
  address: '',
});

const fp_input = { filterAttrs: buildInput() };
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
  createDate: {
    filterModel: 'createDate：',
    headerLable: '计划时间',
    headerFilterShow: true,
    filterAttrs: buildDate({ style: 'width:100%;' }),
  },
};

const _center = { headerAlign: 'center', align: 'center' };

const tableColumns = (): TableColumnProps[] => [
  { ..._center, prop: 'empCode', label: '用户编码', minWidth: '140px', ...fp_input },
  { ..._center, prop: 'empName', label: '用户名称', minWidth: '140px', ...fp_input },
  { ..._center, prop: 'sex', label: '性别', width: '60px', ...fp_input },
  // { prop: '_', label: '部门', width: '100px' },
  { ..._center, prop: 'telephone', label: '手机号码', width: '140px', ...fp_input },
  { ..._center, prop: 'isUse', label: '是否启用', width: '120px', ...filters.isUse },
  { ..._center, prop: 'createDate', label: '创建时间', width: '160px', ...filters.createDate },
  { ..._center, prop: 'roleName', label: '岗位', width: '160px', ...fp_input },
];
const [registerTable, { getTableEl, reload, setTargetPage, setColumns }] = useTable({
  showPage: true,
  immediate: true,
  isFitContent: true,
  cacheKey: 'simple-table',
  showSetting: true,
  api: (params: any) => $http.get(resolveUrl('/user/emp/search'), { ...params, ...unref(searchParams) }).then((data: any) => data.result),
  tableColumns: tableColumns(),
});

function log() {
  console.log('log:', getTableEl());
}

function doSearch() {
  setTargetPage(1);
  reload();
}

function filterHandler(val: any) {
  console.log('filterHandler:', val);
}

onMounted(() => {});
</script>
