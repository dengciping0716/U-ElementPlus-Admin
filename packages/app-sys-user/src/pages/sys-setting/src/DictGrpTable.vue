<template>
  <div class="m-page">
    <BasicTable @register="registerTable">
      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column type="expand">
          <template #default="scope">
            <DictList :dict-grp="scope.row.dictGrp"></DictList>
          </template>
        </el-table-column>
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column header-align="center" align="center" v-bind="item"></el-table-column>
        </template>
        <!-- <el-table-column prop="dictValue" label="操作" width="120px" header-align="center" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" icon="ep-edit">编辑</el-button>
          </template>
        </el-table-column> -->
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';
import { debounce } from 'lodash-es';
import { ElNotification } from 'element-plus';

import { useDictApi } from './useDictApi';
import DictTable from './DictTable.vue';
import DictList from './DictList.vue';

const { queryDictGroupList } = useDictApi();

const searchForm = ref<any>(null);
const searchParams = ref({});
const tableColumns = [
  { prop: 'dictGrp', label: '字典编码', minWwidth: '140px' },
  { prop: 'dictGrpName', label: '字典名称', minWwidth: '140px' },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: true,
  immediate: true,
  isFitContent: true,
  api: (params: any) => queryDictGroupList({ ...params, ...unref(searchParams) }),
  tableColumns,
});

function doSearch() {
  setTargetPage(1);
  reload();
}
</script>
