import { withInstall, withNoopInstall } from '../../utils';
import SelectTable from './src/mSelectTable.vue';
import SelectTableDialog from './src/mSelectTableDialog.vue';

export const mSelectTableDialog = withInstall(SelectTableDialog, { SelectTable });
export default mSelectTableDialog;
export const mSelectTable = withNoopInstall(SelectTable);

export * from './src/mSelectTable';
export * from './src/mSelectTableDialog';
export * from './src/instance';
