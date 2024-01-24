<template>
  <div ref="wrapRef" class="w-full h-full" v-bind="$attrs" v-loading="loading">
    <!-- 搜索条 -->
    <m-card shadow="never" class="search-bar w-full mb-2" :body-style="{ padding: 0, width: '100%' }" v-if="$slots.search">
      <div class="flex items-center p-3 w-full">
        <slot name="search"> </slot>
      </div>
    </m-card>

    <m-card shadow="never" class="table-wrap w-full" :body-style="{ padding: '0', width: '100%' }">
      <!-- 工具条 -->
      <div
        class="tool-bar flex justify-end items-center m-3"
        :class="$slots.filterBar ? 'is-filter' : ''"
        v-if="$slots.toolBar || getProps.showSetting">
        <slot name="toolBar"> </slot>
        <!-- 设置按钮 -->
        <el-button v-if="getProps?.showSetting" text type="primary" icon="ep-grid" @click="showColumnsSettingDilog = true">
          <span class="text-black dark:text-white">自定义表头</span>
        </el-button>
      </div>

      <!-- 过滤层 -->
      <div class="filter-bar flex flex-wrap items-center m-3" v-if="$slots.filterBar">
        <slot name="filterBar"> </slot>
      </div>
      <!-- 表格 -->
      <el-table ref="tableElRef" v-bind="getProps" :data="tableData">
        <slot name="col" v-bind="{ tableColumns, targetPage, pageSize }"></slot>

        <template #append v-if="!!$slots.append">
          <slot name="append"></slot>
        </template>
        <template #empty v-if="!!$slots.empty">
          <slot name="empty"></slot>
        </template>
      </el-table>

      <!-- 分页 -->
      <div
        v-if="getProps.showPage"
        class="clearfix flex items-center m-3"
        :class="{
          'justify-center': pageOpt.placement == 'center',
          'justify-start': pageOpt.placement == 'start',
          'justify-end': pageOpt.placement == 'end',
        }">
        <el-pagination
          v-model:page-size="pageSize"
          v-model:current-page="targetPage"
          :total="totalCount"
          v-bind="pageOpt"
          @size-change="targetPage = 1" />
      </div>
    </m-card>
  </div>

  <ColumnsSettingDialogVue
    v-if="showColumnsSettingDilog"
    v-model="showColumnsSettingDilog"
    :columns="rawTableColums"
    :value="tableColumns"
    @confirm="saveColumns" />
</template>

<script setup lang="ts">
import type { BasicTableProps, TableActionType, BasicTableEmits } from './BasicTable';
import { createTableContext } from './hooks/useTableContext';
import { useColumns } from './hooks/useColumns';
import { usePage } from '../index';
import { useDataSource } from './hooks/useDataSource';
import { omit } from 'lodash-es';
import ColumnsSettingDialogVue from './ColumnsSettingDialog.vue';

import type { TableInstance, TableProps } from 'element-plus/es';
import { isNil } from 'lodash-es';

const emit = defineEmits<BasicTableEmits>();

const showColumnsSettingDilog = ref(false);

type Props = Partial<TableProps<any> & BasicTableProps>;
// props
const attrs = useAttrs();
const props = defineProps<BasicTableProps>();
const innerPropsRef = ref<Props>();
const getProps = computed<Props>(() => {
  return { stripe: true, ...props, ...attrs, ...unref(innerPropsRef) };
});
function setProps(props: Partial<Props>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props };
}

// pages
const { pageSize, targetPage, totalCount, pageOpt, setPagination, setTargetPage, pageInfo } = usePage();
// colums
const { tableColumns, rawTableColums, setColumns, saveColumns } = useColumns(getProps);

const wrapRef = ref(null);
const tableElRef = ref<TableInstance>();

function getTableEl() {
  return tableElRef.value as TableInstance;
}

const getBindValues = computed(() => {
  // const dataSource = unref(getDataSourceRef);
  let propsData: any = {
    ...unref(getProps),
    ...unref(pageInfo),
  };
  propsData = omit(propsData, ['class', 'onChange']);
  return propsData;
});

const tableData = ref([]);

watch(tableData, () => {
  emit('dataChange');
});

function fitContent(paddingBottom = 20) {
  let top = getTableEl()?.$el?.getBoundingClientRect()?.y;
  if (!isNil(top)) {
    if (getProps.value.showPage) {
      setProps({ height: `calc(100vh - ${paddingBottom}px - 58px - ${top}px)` });
    } else {
      setProps({ height: `calc(100vh - ${paddingBottom}px - ${top}px)` });
    }
  }
}

onMounted(() => {
  let { isFitContent, height } = getProps.value;
  if (isFitContent && !height) fitContent();
});

const { loading, searchState, reload, setTableData, updateTableData, updateTableDataRecord, getDataSource, getRawDataSource } =
  useDataSource(getProps, { tableData, pageInfo });

const tableAction: TableActionType = {
  getTableEl,
  setProps,
  setColumns,
  //
  reload,
  setTableData,
  getDataSource,
  getRawDataSource,
  setPagination,
  setTargetPage,
  updateTableData,
  updateTableDataRecord,
  //
};

createTableContext({ ...tableAction, searchState, wrapRef, getBindValues });

defineExpose({ tableAction });

emit('register', tableAction);
</script>

<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
.is-filter :deep(.filter-toggle) {
  position: relative;
  &::after {
    content: ' ';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid getCssVar('fill-color', 'light');
    border-top: 10px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    bottom: -2px;
  }
}
.filter-bar {
  box-shadow: 0 0 0 12px getCssVar('fill-color', 'light');
  :deep(.el-form) {
    background-color: getCssVar('fill-color', 'light');
  }
}
.search-bar,
.filter-bar {
  :deep(.el-form-item) {
    --uno-apply: m-0;
    background-color: getCssVar('fill-color', 'blank');
  }

  :deep(.el-form) {
    --uno-apply: flex flex-wrap gap-2 flex-1;
  }
}

.search-bar.wrap,
.filter-bar {
  :deep(.el-form-item) {
    box-shadow: 0 0 0 1px getCssVar('input', 'border-color') getCssVar('border-color') inset;
    padding: 2px 8px;
    border-radius: 4px;
    &:has(.el-input__wrapper.is-focus) {
      box-shadow: 0 0 0 1px getCssVar('color-primary') getCssVar('color-primary') inset;
    }
    &:has(.is-active:hover) {
      box-shadow: 0 0 0 1px getCssVar('color-primary') getCssVar('color-primary') inset;
    }
    &:hover {
      box-shadow: 0 0 0 1px getCssVar('color-info') getCssVar('color-info') inset;
    }
  }

  :deep(.el-date-editor),
  :deep(.el-select),
  :deep(.el-select .el-input__wrapper.is-focus),
  :deep(.el-select .el-input.is-focus .el-input__wrapper),
  :deep(.el-input__wrapper) {
    box-shadow: none !important;
  }
}
// 过滤表头样式
:deep(.tr-filter) {
  .el-table__cell {
    vertical-align: baseline;
  }
}
</style>
