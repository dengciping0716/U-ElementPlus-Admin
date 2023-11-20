<template>
  <div class="m-page" wrap>
    <BasicTable @register="registerTable">
      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column header-align="center" align="center"  v-bind="item"></el-table-column>
        </template>
        <el-table-column prop="isUse" label="设置" header-align="center" align="center" >
          <template #default="scope">
            <el-switch active-value="1" inactive-value="0" v-model="scope.row.isUse" @change="toggleUse(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';
import { debounce } from 'lodash';
import { ElNotification } from 'element-plus';
import { useSysSettingApi } from './useSysSettingApi';

const { querySettingList, toggleUse } = useSysSettingApi();
const searchForm = ref<any>(null);
const searchParams = ref({});

const tableColumns = [
  { prop: 'propertyName', label: '属性名称', width: '240px' },
  { prop: 'propertyCode', label: '属性编码', minWwidth: '140px' },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: true,
  immediate: true,
  isFitContent: true,
  api: (params: any) => querySettingList({ ...params, ...unref(searchParams) }),
  tableColumns,
});

function doSearch() {
  setTargetPage(1);
  reload();
}
</script>
