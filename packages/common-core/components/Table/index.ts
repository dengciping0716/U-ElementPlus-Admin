import BasicTable from './src/BasicTable.vue';
import ColumnsSettingDialog from './src/ColumnsSettingDialog.vue';
import FilterBar from './src/FilterBar.vue';

import { withInstall, withNoopInstall } from '../../utils';
withInstall(BasicTable, { ColumnsSettingDialog, FilterBar });
export { BasicTable, FilterBar };
export default BasicTable;

export * from './src/BasicTable';
export type { BasicTableInstance } from './src/instance';

export { usePage } from '../../hooks/usePage';
export type { PageOption, PageInfoType } from '../../hooks/usePage';
export { useTable } from './src/hooks/useTable';
