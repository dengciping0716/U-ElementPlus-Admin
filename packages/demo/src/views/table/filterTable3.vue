<template>
  <div class="m-page" wrap>
    <BasicTable @register="registerTable" border @filter-change="filterHandler">
      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="{ row, $index }">{{ row._is_filter ? '' : $index + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column v-bind="item">
            <template #default="{ row, column }">
              <filter-render
                v-if="row._is_filter"
                v-bind="item.filterAttrs"
                v-model="searchParams[item.filterModel || column.property]"
                @confirm="reload({ targetPage: 1 })" />
              <template v-else-if="item.prop == 'isUse'">
                <el-tag v-if="row.isUse == '1'" type="success">启用</el-tag>
                <el-tag v-if="row.isUse != '1'" type="info">停用</el-tag>
              </template>
              <template v-else-if="item.prop == 'sex'">
                <el-tag v-if="row.sex == '1'">男</el-tag>
                <el-tag v-if="row.sex != '1'" type="danger">女</el-tag>
              </template>
              <div v-else>{{ row[column.property] }}</div>
            </template>
          </el-table-column>
        </template>
        <el-table-column :resizable="true" label="操作" prop="btnCol" header-align="center" align="center" width="100" fixed="right">
          <template #default="{ row }">
            <div v-if="!row._is_filter" style="display: flex">
              <el-tooltip
                v-if="row.isConfirm !== '0' || row.aptitudeType != '0'"
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

//筛选
const fp_input = { headerFilterShow: true, filterAttrs: buildInput() };

const filters = {
  equipTypeName: {
    columnKey: 'equipTypeName',
    filters: [],
    'filter-multiple': false,
    'filter-placement': 'bottom-end',
    // 'filter-method': (value: any, row: any, column: any) => row.xx == value, // 本地筛选
  },
  disposalTypeName: {
    columnKey: 'disposalTypeName',
    filters: [
      { text: 'Home', value: 'Home' },
      { text: 'Office', value: 'Office' },
    ],
    filterMultiple: true,
    filterPlacement: 'bottom-end',
  },
  targetCode: {
    headerFilterShow: false,
    filterAttrs: buildInput('targetCode'),
  },
  planDate: {
    headerFilterShow: false,
    filterAttrs: buildDate(),
  },
  taxationType: {
    filterModel: 'taxationType',
    headerFilterShow: false,
    filterAttrs: buildDict('/auction/dict/getDictListInfo?dictGrp=GRP_EQUIP_TYPE'),
  },
};
const tableColumns = (): TableColumnProps[] => [
  { prop: 'empCode', label: '用户编码', minWidth: '140px', ...fp_input },
  { prop: 'empName', label: '用户名称', minWidth: '140px', ...fp_input },
  { prop: 'sex', label: '性别', width: '60px', ...fp_input },
  // { prop: '_', label: '部门', width: '100px' },
  { prop: 'telephone', label: '手机号码', width: '140px', ...fp_input },
  { prop: 'isUse', label: '是否启用', width: '120px', ...fp_input },
  { prop: 'createDate', label: '创建时间', width: '160px', ...fp_input },
  { prop: 'roleName', label: '岗位', width: '160px', ...fp_input },
  //
  { prop: 'targetCode', label: '标的编号', width: '120px', ...filters.targetCode },
  { prop: 'equipTypeName', label: '标的类型', width: '100px', ...filters.equipTypeName },
  { prop: 'taxationTypeName', label: '报价是否含税', width: '140px', ...filters.taxationType },
  { prop: 'disposalTypeName', label: '处置方式', width: '100px', ...filters.disposalTypeName },
  { prop: 'planDate', label: '拟拍日期', width: '148px', ...filters.planDate },
];
const [registerTable, { getTableEl, reload, setTargetPage, setColumns }] = useTable({
  showPage: true,
  immediate: true,
  isFitContent: true,
  showFilterRow: true,
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

onMounted(() => {
  $http
    .get(resolveUrl('/auction/dict/getDictListInfo?dictGrp=GRP_EQUIP_TYPE'))
    .then((data: any) => data.result)
    .then((data) => {
      filters.equipTypeName.filters = data?.map((row: any) => ({ text: row.dictLnm, value: row.dictCode }));
      setColumns(tableColumns());
    });
});
</script>
