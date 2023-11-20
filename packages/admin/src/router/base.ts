import { RouteRecordRaw } from 'vue-router';

export const enum PageEnum {
  HOME_NAME = 'HOME',
  BASE_LOGIN_NAME = 'Login',
  ERROR_PAGE_NAME_403 = 'ErrorPage403',
  ERROR_PAGE_NAME_404 = 'ErrorPage404',
  ERROR_PAGE_NAME_500 = 'ErrorPage500',
}

export const LAYOUT = () => import('@/layout/default/index.vue');
export const REDIRECT = () => import('@/layout/default/redirect.vue');
export const RELOAD = () => import('@/layout/default/reload.vue');

export const ParentLayout = () => import('@/layout/default/parentLayout.vue');

export const ErrorPage404 = () => import('@/views/exception/404.vue');

export const ErrorPage403 = () => import('@/views/exception/403.vue');

export const ErrorPage500 = () => import('@/views/exception/500.vue');

export const HttpErrorPage: RouteRecordRaw[] = [
  {
    path: '/error/404',
    name: PageEnum.ERROR_PAGE_NAME_404,
    component: ErrorPage404,
    meta: {
      title: PageEnum.ERROR_PAGE_NAME_404,
      label: '404',
    },
  },
  {
    path: '/error/403',
    name: PageEnum.ERROR_PAGE_NAME_403,
    component: ErrorPage403,
    meta: {
      title: PageEnum.ERROR_PAGE_NAME_403,
      label: '403',
    },
  },
  {
    path: '/error/500',
    name: PageEnum.ERROR_PAGE_NAME_500,
    component: ErrorPage500,
    meta: {
      title: PageEnum.ERROR_PAGE_NAME_500,
      label: '500',
    },
  },
];

export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: ErrorPage404,
  meta: {
    title: 'ErrorPage404',
    hideBreadcrumb: true,
  },
};

export const ReloadRoute: RouteRecordRaw = {
  path: '/reload',
  name: 'Reload',
  component: RELOAD,
  meta: { title: 'Reload' },
};

export const RedirectRoute: RouteRecordRaw = {
  path: '/redirect',
  name: 'Redirect',
  component: LAYOUT,
  meta: {
    title: 'Redirect',
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: 'Redirect',
      component: REDIRECT,
      meta: {
        title: 'Redirect',
        hideBreadcrumb: true,
        hide: true,
      },
    },
  ],
};
