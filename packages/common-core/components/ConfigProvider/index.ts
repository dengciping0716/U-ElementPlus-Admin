import { withInstall, withNoopInstall } from '../../utils';

import ConfigProvider from './src/index.vue';
export const mConfigProvider = withInstall(ConfigProvider);
export default mConfigProvider;
