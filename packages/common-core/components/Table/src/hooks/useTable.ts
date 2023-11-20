import type { ComputedRef, Ref } from 'vue';
import type { WatchStopHandle } from 'vue';
import { isProdMode, getDynamicProps } from '../../../../utils';
import type { BasicTableProps, TableActionType, FetchParams } from '../BasicTable';
import type { PageOption } from '../../index';
import type { TableInstance, TableProps } from 'element-plus/es';

type Props = Partial<DynamicProps<BasicTableProps>> & Partial<TableProps<any>>;

export const useTable = function (tableProps?: Props): [(instance: TableActionType) => void, TableActionType] {
  const tableRef = ref<Nullable<TableActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  //   const formRef = ref<Nullable<UseTableMethod>>(null);

  let stopWatch: WatchStopHandle;

  function register(instance: TableActionType) {
    isProdMode() &&
      onUnmounted(() => {
        tableRef.value = null;
        loadedRef.value = null;
      });

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return;

    tableRef.value = instance;
    loadedRef.value = true;

    stopWatch?.();

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      { immediate: true, deep: true }
    );
  }
  function getTableInstance(): TableActionType {
    const table = unref(tableRef);
    if (!table) {
      console.error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
      );
    }
    return table as TableActionType;
  }
  const methods: TableActionType & Partial<TableInstance> = {
    getTableEl: () => getTableInstance().getTableEl(),
    doLayout: () => getTableInstance().getTableEl().doLayout(),
    setProps: (props: Partial<BasicTableProps>) => getTableInstance()?.setProps(props),
    setColumns: (val: any) => getTableInstance()?.setColumns(val),
    setTableData: (values: Recordable[]) => getTableInstance()?.setTableData(values),
    getDataSource: <T = Recordable>() => getTableInstance()?.getDataSource<T>(),
    getRawDataSource: <T = Recordable>() => getTableInstance()?.getRawDataSource<T>(),
    setTargetPage: (val: number) => getTableInstance()?.setTargetPage(val),
    setPagination: (values: PageOption) => getTableInstance()?.setPagination(values),
    reload: async (opt?: FetchParams) => getTableInstance()?.reload(opt),
    updateTableData: (index: number, key: string, value: any) => getTableInstance().updateTableData(index, key, value),
    updateTableDataRecord: (rowKey: string | number, record: Recordable) => getTableInstance()?.updateTableDataRecord(rowKey, record),
  };

  return [register, methods];
};
