import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { createRouterGuards } from './router-guards';
import { LAYOUT, HttpErrorPage, RedirectRoute, ReloadRoute, ErrorPageRoute } from './base';
import pages, { LoginRoute } from './pages';
// d.ts
// @unocss-include
declare module 'vue-router' {
  interface RouteMeta {
    title?: string; // 浏览器标题
    label?: string; // 标签页名称
    icon?: string; //iconfont class name
    affix?: boolean; //是否固定在tabs-view
    requiresAuth?: boolean;
    notKeepAlive?: boolean; //是否缓存页面
    hide?: boolean; //在菜单中是否显示
    hideBreadcrumb?: boolean; //是否显示
    btnOauth?: Record<string, boolean>; //按钮权限列表
    menuCode?: string; //菜单权限
    frameSrc?: string; //iframe 内嵌网页链接
  }
}

// import modules from './modules'
const RootRoute: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HOME',
    redirect: '/workbench',
    component: LAYOUT,
    meta: {
      icon: 'i-ep-home-filled',
    },
    children: [...HttpErrorPage, ...pages],
  },
];

export const constantRouter: any[] = [...RootRoute, RedirectRoute, ReloadRoute, ErrorPageRoute, LoginRoute];

const router = createRouter({
  history: createWebHistory('/'),
  routes: constantRouter,
  strict: true,
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router;
