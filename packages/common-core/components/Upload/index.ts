import Upload from './src/Upload.vue';

import { withInstall, withNoopInstall } from '../../utils';
export const mUpload = withInstall(Upload);
export default mUpload;

export * from './src/index';
// export type { UploadInstance } from './src/instance';
