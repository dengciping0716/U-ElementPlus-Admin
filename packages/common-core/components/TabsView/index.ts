import { withInstall, withNoopInstall } from '../../utils';

import TabsView from './src/TabsView.vue';
import KeepAliveView from './src/KeepAliveView.vue';

export const mTabsView = withInstall(TabsView, { KeepAliveView });
export default mTabsView;

export { KeepAliveView };

export { useTabsStore } from './src/useTabsStore';
