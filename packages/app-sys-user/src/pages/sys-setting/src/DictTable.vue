<template>
  <div class="m-page">
    <BasicTable @register="registerTable">
      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column header-align="center" align="center" v-bind="item"></el-table-column>
        </template>
        <el-table-column prop="dictValue" label="操作" width="120px" header-align="center" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" icon="ep-edit">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';
import { debounce } from 'lodash-es';
import { ElNotification } from 'element-plus';

import { useDictApi } from './useDictApi';
const { queryDictList } = useDictApi();

const props = defineProps<{ dictGrp: string }>();

const searchForm = ref<any>(null);
const searchParams = ref({});
const tableColumns = [
  { prop: 'dictCodeKbn', label: '区分编码', minWwidth: '140px' },
  { prop: 'dictLnm', label: '区分名称', minWwidth: '140px' },
  { prop: 'dictCode', label: '区分值', minWwidth: '140px' },
  { prop: 'sortNo', label: '排序', minWwidth: '140px' },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: false,
  immediate: true,
  isFitContent: true,
  api: (params: any) => queryDictList({ ...params, ...unref(searchParams), dictGrp: props.dictGrp }),
  tableColumns,
});

function doSearch() {
  setTargetPage(1);
  reload();
}
</script>
