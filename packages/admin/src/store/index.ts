import type { App } from 'vue';
import { markRaw } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';
import { Router } from 'vue-router';
import savePlugin from './plugin/save';

import { useUserStore } from './userStore';
import { initDesignStore } from './designStore';
import { useMenuStore } from './menuStore';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}
const pinia = createPinia();

export function setupStore(app: App<Element>) {
  pinia
    .use(({ store }) => {
      store.router = markRaw(router);
    })
    .use(savePlugin);
  app.use(pinia);
}

export { pinia };

export async function initStore() {
  // Store 准备就绪后处理主题色
  initDesignStore();
  // 加载登录状态
  await useUserStore().init();
  // 注册菜单
  const menuStore = useMenuStore();
  await menuStore.init();
}
