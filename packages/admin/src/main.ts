import { createApp } from 'vue';
import App from './App.vue';
import { setupDirectives, initFunction } from '@/plugins';
import router, { setupRouter } from '@/router';

import { setupStore, initStore } from '@/store';

import okui from '@common/core';

// import '@unocss/reset/normalize.css';
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/sanitize/assets.css';
import 'virtual:uno.css';
import '@/styles/index.scss';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';


import { registerPackage } from './packages';
async function appInit() {
  // const goAppProvider = createApp(GoAppProvider)

  const app = createApp(App);

  app.use(ElementPlus, { namespace: 'el', size: 'default', locale: zhCn });

  // 注册elment icons; ep-close
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component('ep' + key, component);
  }
  // 注册全局自定义组件
  // setupCustomComponents(app)

  // 注册全局自定义指令
  setupDirectives(app);
  // 挂载状态管理
  setupStore(app);
  await initStore();
  app.use(okui);
  //加载子模块
  registerPackage(app, router);
  // 挂载路由
  setupRouter(app);
  // 路由准备就绪后挂载APP实例
  await router.isReady();

  // 语言注册
  // app.use(i18n)

  // 挂载到页面
  app.mount('#app', true);
  // 挂载到 window
  window['$vue'] = app;
}

appInit()
  .then(() => initFunction())
  .catch((err) => console.log(err));
