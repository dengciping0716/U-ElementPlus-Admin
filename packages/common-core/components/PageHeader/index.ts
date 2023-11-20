import { withInstall, withNoopInstall } from '../../utils';

import PageHeader from './src/index.vue';
export const mPageHeader = withInstall(PageHeader);
export default mPageHeader;

export type { PageHeaderInstance } from './src/instance';
