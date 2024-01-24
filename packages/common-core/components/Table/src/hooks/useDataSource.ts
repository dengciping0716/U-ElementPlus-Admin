/**
 *
 */
import { ref, unref, computed, onMounted, watch, reactive, watchEffect, nextTick } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps, TableActionType, FetchParams } from '../BasicTable';
import type { PageInfoType } from '../../index';
import { isFunction, buildUUID } from '@common/utils';
import { get, cloneDeep, merge, debounce } from 'lodash-es';
import { useTimeoutFn } from '@vueuse/core';
export const ROW_KEY = 'key';

export interface SearchState {
  sortInfo: Recordable;
  filterInfo: Recordable;
}

interface ActionType {
  pageInfo: PageInfoType;
  tableData: Ref<Recordable[]>;
}

export function useDataSource(propsRef: ComputedRef<BasicTableProps>, { tableData, pageInfo }: ActionType) {
  const loading = ref(false);

  const searchState = reactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  });
  const dataSourceRef = ref<Recordable[]>([]);
  const rawDataSourceRef = ref<Recordable>([]);

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch([() => pageInfo.pageSize, () => pageInfo.targetPage], () => reload());

  onMounted(() => {
    setTableData([]);
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  /** 请求表格数据 */
  async function fetch(opt?: FetchParams) {
    const { api } = unref(propsRef);
    if (!api || !isFunction(api)) return;
    let dataSource: Recordable[] = [];

    try {
      let { pageSize, targetPage } = unref(pageInfo);
      let params: Recordable = merge({ pageSize, targetPage, sortInfo: searchState.sortInfo }, searchState.filterInfo, opt);

      loading.value = true;

      const res = await api(params);
      if (res) {
        let resultItems: Recordable[] = Array.isArray(res) ? res : get(res, 'pageData');
        const resultTotal: number = Array.isArray(res) ? res.length : get(res, 'totalCount');
        dataSource = resultItems;
        pageInfo.totalCount = resultTotal;

        rawDataSourceRef.value = resultItems;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }

    setTableData(dataSource);
  }

  const reload = async (opt?: FetchParams) => {
    await fetch(opt);
  };

  function setTableData(values: Recordable[]) {
    if (unref(propsRef).showFilterRow) {
      values.unshift({ _is_filter: true });
    }
    dataSourceRef.value = values;
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[];
  }

  function getRawDataSource<T = Recordable>() {
    return rawDataSourceRef.value as T[];
  }

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  }
  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return dataSource;
    }
    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0];
      const lastItem = dataSource[dataSource.length - 1];

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          setTableKey(dataSource);
        }
      }
    }
    return dataSource;
  });

  async function updateTableData(index: number, key: string, value: any) {
    const record = dataSourceRef.value[index];
    if (record) {
      dataSourceRef.value[index][key] = value;
    }
    return dataSourceRef.value[index];
  }

  function updateTableDataRecord(rowKey: string | number, record: Recordable): Recordable | undefined {
    const row = findTableDataRecord(rowKey);

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field];
      }
      return row;
    }
  }

  function findTableDataRecord(rowKey: string | number) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;

    const rowKeyName = unref(getRowKey);
    if (!rowKeyName) return;

    const { childrenColumnName = 'children' } = unref(propsRef);

    const findRow = (array: any[]): Recordable | undefined => {
      let ret;
      array.some(function iter(r) {
        if (typeof rowKeyName === 'function') {
          if ((rowKeyName(r) as string) === rowKey) {
            ret = r;
            return true;
          }
        } else {
          if (Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey) {
            ret = r;
            return true;
          }
        }
        return r[childrenColumnName] && r[childrenColumnName].some(iter);
      });
      return ret;
    };

    return findRow(dataSourceRef.value);
  }

  return {
    loading,
    searchState: toRefs(searchState),
    reload,
    setTableData,
    getDataSource,
    getRawDataSource,
    updateTableData,
    updateTableDataRecord,
  };
}
