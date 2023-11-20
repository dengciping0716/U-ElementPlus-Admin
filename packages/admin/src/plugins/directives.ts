import { App } from 'vue';
import VueLazyLoad from 'vue3-lazyload';
import Image_404 from '@/assets/images/exception/image-404.png';
import { BtnOauthTip, BtnOauthShow, BtnOauthHide } from '@/store/permission/directive';
/**
 * 获取错误处理图片，默认 404 图
 * @returns url
 */
export const requireErrorImg = () => Image_404;

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  app.directive('oauth', BtnOauthTip); // 权限验证
  app.directive('oauth-tip', BtnOauthTip); // 权限验证
  app.directive('oauth-show', BtnOauthShow); // 权限验证
  app.directive('oauth-hide', BtnOauthHide); // 权限验证
  // 图片懒加载
  app.use(VueLazyLoad, {
    error: requireErrorImg(),
  });
}
