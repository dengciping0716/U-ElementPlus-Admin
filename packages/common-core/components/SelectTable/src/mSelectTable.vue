<script setup lang="ts">
/**
 * 带可选行功能的表格，可单选、多选
 */

import { BasicTable, useTable, TableColumnProps } from '../../Table';
import { nextTick } from 'vue';
import type { mSelectTableEmits, mSelectTableProps } from './mSelectTable';

defineOptions({
  name: 'MSelectTable',
});

const emit = defineEmits<mSelectTableEmits>();
const props = defineProps<mSelectTableProps>();

const { multiple = false, tableColumns, lazyLoad } = toRefs(props);

const [registerTable, { getTableEl, reload, getDataSource, setTargetPage, setPagination }] = useTable({
  showPage: true,
  immediate: true,
  border:true,
  api: lazyLoad,
  tableColumns,
});

onMounted(() => {
  setPagination({
    small: true,
    placement: 'center',
    layout: 'total,prev,pager,next',
  });
});

/** 检查选中项 */
async function checkSelect() {
  let { multiple, rowKey, selectedIds = [] } = props;
  if (!multiple || !rowKey) return;
  await nextTick();
  getDataSource()?.forEach((val: any) => {
    const bool = selectedIds.includes(val[rowKey]);
    getTableEl().toggleRowSelection(unref(val), bool);
  });
}

/** 单选状态 选中行 */
function confirmHandler(row: any) {
  if (unref(multiple)) return;
  emit('confirm', row);
}

/** 点击表格行 */
function rowClick(row: any, column: any, event: any) {
  if (!unref(multiple)) return;
  // @ts-ignore
  getTableEl().toggleRowSelection(row);

  emit('select', getTableEl().getSelectionRows(), row);
}
/** table选中单项 */
function onSelect(selection: any, row: any) {
  emit('select', selection, row);
}
/** table选中所有 */
function onSelectAll(selection: any) {
  emit('selectAll', selection);
}

function doSearch() {
  setTargetPage(1);
  reload();
}

defineExpose({ checkSelect, doSearch, getDataSource });
</script>

<template>
  <!-- 简化版 -->
  <BasicTable
    @register="registerTable"
    class="relative table-no-btns"
    v-bind="$attrs"
    @data-change="checkSelect"
    @row-dblclick="confirmHandler"
    @row-click="rowClick"
    @select="onSelect"
    @select-all="onSelectAll">

    <template #toolBar>
      <slot name="search"></slot>

      <p v-if="!multiple" style="color: #999; line-height: 30px; font-size: 12px">
        <i class="el-icon-warning-outline" style="margin-right: 4px"></i>点击"选中"按钮或双击行即可选中
      </p>
    </template>
    <!--  -->
    <template #col="{ tableColumns, targetPage, pageSize }">
      <el-table-column v-if="multiple" type="selection" width="45"> </el-table-column>
      <el-table-column label="#" header-align="center" align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 + (targetPage - 1) * pageSize }}
        </template>
      </el-table-column>

      <template v-for="(item, i) in tableColumns" :key="i">
        <el-table-column show-overflow-tooltip header-align="left" v-bind="item">
          <template #default="{ row, column }">
            {{ item?.format ? item.format(row[column.property]) : row[column.property] }}
          </template>
        </el-table-column>
      </template>

      <el-table-column v-if="!multiple" label="操作" header-align="center" align="center" width="80">
        <template #default="scope">
          <div>
            <el-button type="primary" @click="confirmHandler(scope.row)">选择</el-button>
          </div>
        </template>
      </el-table-column>
    </template>
  </BasicTable>
</template>
