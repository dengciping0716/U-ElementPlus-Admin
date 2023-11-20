import loading from './loading';
import Dialog from './dialog.js';
import { ElMessage } from 'element-plus';

export const setupPlugins = function (app) {
  const dialogFunc = Dialog(app);
  window['$dialog'] = dialogFunc;
  app.config.globalProperties.$dialog = dialogFunc;

  window['$loading'] = loading;
  app.config.globalProperties.$loading = loading;

  window['$message'] = ElMessage;
  // app.config.globalProperties.$message = Dialog; //element已提供
};
