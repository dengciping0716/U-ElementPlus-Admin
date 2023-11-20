import { App } from 'vue';
import noDataTip from './noDataTip';
/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) { 
  app.directive('noDataTip', noDataTip);
}
