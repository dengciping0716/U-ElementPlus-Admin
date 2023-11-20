import type { TableInstance, TableProps, TableColumnCtx } from 'element-plus/es';
import type { PageOption } from '../index';
import type { SearchState } from './hooks/useDataSource';
export { SearchState };

export type FetchParams = {
  pageSize?: number;
  targetPage?: number;
} & Partial<SearchState>;

export interface TableActionType {
  getTableEl: () => TableInstance;
  setProps: (props: Partial<BasicTableProps>) => void;
  setColumns: (val: any) => void;
}

export interface TableActionType {
  setTableData: (values: Recordable[]) => void;
  getDataSource: <T = Recordable>() => T[];
  getRawDataSource: <T = Recordable>() => T[];
  setPagination: (opt: PageOption) => void;
  setTargetPage: (val: number) => void;
  reload: (opt?: FetchParams) => Promise<void>;
  updateTableData: (index: number, key: string, value: any) => Recordable;
  updateTableDataRecord: (rowKey: string | number, record: Recordable) => Recordable | void;

  // deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => void;
  // insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => Recordable[] | void;
  // findTableDataRecord: (rowKey: string | number) => Recordable | void;
}
export interface TableActionType {
  doLayout?: () => void;
}

export type BasicTableProps = {
  cacheKey?: string; //用与缓存数据
  rowKey?: string | ((record: Recordable) => string);
  autoCreateKey?: boolean; // 自动生成row-key
  /**
   * The column contains children to display
   * @default 'children'
   * @type string | string[]
   */
  childrenColumnName?: string;
  tableColumns?: Array<TableColumnProps>; //列配置
  api?: (opt: any) => Promise<any>; //请求数据函数
  immediate?: boolean; //立即请求api
  showPage?: boolean; //是否分页
  showSetting?: boolean; // 是否显示列设置
  showFilterRow?: boolean; // 是否显示过滤条件单独一行
  isFitContent?: boolean; // 是否充满屏幕剩余高度
};

declare interface TableColumnMETA {
  visible: boolean; //默认显示列
  typeName: string; // 分类展示
}

declare interface TableColumnHeader {
  filterAttrs?: any; // 筛选组件属性
  filterModel?: string; // 筛选结果字段名称
}

export type TableColumnProps = Partial<
  TableColumnCtx<any> & TableColumnHeader & { meta: TableColumnMETA } & { format: (val: string) => any }
>;

export interface BasicTableEmits {
  (event: 'register', instance: TableActionType): void;
  (event: 'dataChange'): void;
}
