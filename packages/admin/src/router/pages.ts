import type { RouteRecordRaw } from 'vue-router';
// @unocss-include

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/login.vue'),
  meta: {
    title: '登录',
  },
};
const pages: RouteRecordRaw[] = [
  {
    path: '/workbench',
    props: true,
    component: () => import('@/views/workbench/workbench.vue'),
    meta: {
      icon: 'i-ep-monitor',
      label: '工作台',
      affix: true,
    },
  },
  {
    path: '/hello/:msg?',
    props: true,
    component: () => import('@/views/HelloWorld.vue'),
    meta: {
      label: 'hello',
    },
  },
];
export default pages;
