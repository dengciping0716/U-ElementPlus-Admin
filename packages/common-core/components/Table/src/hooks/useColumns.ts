/**
 *
 */
import { ref, unref, computed, onMounted, watch, reactive, watchEffect } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps, TableActionType, TableColumnProps, FetchParams } from '../BasicTable';
import storage from '@common/utils/storage';

const PREFIX_CACHE = 'table_columns_';
const DEFAULT_META = { visible: true, typeName: '常规字段' };

export const useColumns = function (propsRef: ComputedRef<BasicTableProps>) {
  const tableColumns = ref<Array<TableColumnProps>>();
  const rawTableColums = ref<TableColumnProps[]>();

  const cacheKey = computed(() => {
    let { cacheKey, showSetting } = unref(propsRef);
    return cacheKey && showSetting ? PREFIX_CACHE + cacheKey : null;
  });

  watchEffect(() => {
    let { tableColumns } = unref(propsRef);
    setColumns(tableColumns);
  });
  /**
   * 从缓存加载显示字段
   */
  async function validColumns(allColumns: any[] = []) {
    if (!cacheKey.value) return allColumns;

    let cacheList = await storage.getItem<string[]>(cacheKey.value);
    if (cacheList?.length) {
      // 缓存的字段列表
      let col = cacheList.map((prop) => allColumns.find((item) => item.prop === prop)).filter((item) => !!item);
      return col;
    } else {
      // 表格默认的字段列表
      return allColumns.filter((item) => item.meta?.visible);
    }
  }

  async function setColumns(val: Recordable[] = []) {
    const allColumns = val.map((row) => ({ meta: DEFAULT_META, ...row }));
    rawTableColums.value = allColumns;
    tableColumns.value = await validColumns(allColumns);
  }

  function saveColumns(columns: any[] = []) {
    tableColumns.value = columns;
    if (!cacheKey.value) return;
    let props = columns?.map((v) => v.prop);
    storage.setItem(cacheKey.value, props);
  }

  return { tableColumns, rawTableColums, setColumns, saveColumns };
};
