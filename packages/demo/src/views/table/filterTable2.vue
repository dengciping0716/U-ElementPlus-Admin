<template>
  <div class="m-page" wrap>
    <BasicTable @register="registerTable" border @filter-change="filterHandler">
      <!-- 工具条 -->
      <template #toolBar>
        <el-button class="filter-toggle" text type="primary" icon="ep-filter" @click="showFilter = !showFilter">
          <span :class="showFilter ? '' : 'text-black dark:text-white'">过滤</span>
        </el-button>
        <el-divider direction="vertical" />
      </template>
      <!-- 过滤筛选 -->
      <template #filterBar v-if="showFilter">
        <FilterBar :filters="filters"></FilterBar>
      </template>

      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column v-bind="item">
            <template #default="{ row }" v-if="item.prop == 'isUse'">
              <el-tag v-if="row.isUse == '1'" type="success">启用</el-tag>
              <el-tag v-if="row.isUse != '1'" type="info">停用</el-tag>
            </template>
            <template #default="{ row }" v-if="item.prop == 'sex'">
              <el-tag v-if="row.sex == '1'">男</el-tag>
              <el-tag v-if="row.sex != '1'" type="danger">女</el-tag>
            </template>
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
import type { TableColumnProps } from '@common/core';
import { BasicTable, FilterBar, useTable } from '@common/core';
import { FilterRender, buildInput, buildDate, buildDict } from '@common/core';
const searchForm = ref<any>(null);
const searchParams = ref<Record<string, any>>({
  targetCode: '',
  type: '',
  targetName: '',
  tenantName: '',
  address: '',
});

const showFilter = ref(true);
//筛选
const filters = [
  {
    filterModel: 'targetCode',
    headerLable: '',
    headerFilterShow: true,
    filterAttrs: buildInput('targetCode', { placeholder: '搜索标的编号' }),
  },
  {
    filterModel: 'planDate',
    headerLable: '计划时间',
    headerFilterShow: true,
    filterAttrs: buildDate({ style: 'width:240px;' }),
  },
  // {
  //   filterModel: 'taxationType',
  //   headerLable: '含税类型',
  //   headerFilterShow: true,
  //   filterAttrs: buildDict('/auction/dict/getDictListInfo?dictGrp=GRP_EQUIP_TYPE', { style: 'width:100px;' }),
  // },
];
const tableColumns = (): TableColumnProps[] => [
  { prop: 'empCode', label: '用户编码', minWidth: '140px' },
  { prop: 'empName', label: '用户名称', minWidth: '140px' },
  { prop: 'sex', label: '性别', width: '60px' },
  // { prop: '_', label: '部门', width: '100px' },
  { prop: 'telephone', label: '手机号码', width: '140px' },
  { prop: 'isUse', label: '是否启用', width: '120px' },
  { prop: 'createDate', label: '创建时间', width: '160px' },
  { prop: 'roleName', label: '岗位', width: '160px' },
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
</script>
