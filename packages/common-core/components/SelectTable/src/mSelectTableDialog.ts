import type { TableColumnProps } from '../../Table';

export interface SelectTableDialogConfig {
  title: string;
  width?: string; //可选， 默认1080};
  rowKey: string;
  searchKeyAlias?: string; //可选，搜索输入框字段名称。默认是searchKey
  searchPlaceholder?: string;
  tableColumns: TableColumnProps[];
  tableColumnsSelected: TableColumnProps[];
}

export type mSelectTableDialogProps = SelectTableDialogConfig & { multiple: boolean; lazyLoad: (params: any) => any };
