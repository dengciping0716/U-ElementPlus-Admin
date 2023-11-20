import type { TableColumnProps } from '../../Table';

export interface mSelectTableProps {
  multiple: boolean; // 是否多选
  tableColumns: Array<TableColumnProps>; // 表头、列渲染信息
  options?: Array<any>;
  rowKey: string; //每个节点用来作为唯一标识的属性,应该是唯一的.配合selectedIds 实现默认选择;
  selectedIds?: Array<any>;
  lazyLoad: Function;
}

export interface mSelectTableEmits {
  (event: 'confirm', row: any): void;
  (event: 'select', selection: any[], row: any): void;
  (event: 'selectAll', selection: any): void;
}
