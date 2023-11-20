// @unocss-include

import { RouteRecordRaw } from 'vue-router';
const IFrame = () => import('@/layout/iframe/FrameBlank.vue');

// 菜单menuCode 和 路由的name 去匹配
const pages: RouteRecordRaw[] = [
  {
    path: '/demo/permission',
    name: 'D001',
    props: true,
    component: () => import('../views/permission/index.vue'),
    meta: { icon: 'i-ep-key', menuCode: 'D001', label: '功能权限' },
  },
  {
    path: '/demo/permission/page',
    name: 'D002',
    props: true,
    component: () => import('../views/permission/index.vue'),
    meta: { icon: 'i-ep-key', requiresAuth: true, menuCode: 'D002', label: '页面权限' },
  },
  {
    path: '/demo/table',
    redirect: '/demo/table/simple',
    name: 'D102',
    props: true,
    meta: { icon: 'i-comp-table', label: '表格', menuCode: 'D102' },
    children: [
      {
        path: '/demo/table/simple',
        name: 'D10201',
        props: true,
        component: () => import('../views/table/simple.vue'),
        meta: { label: '简单表格' },
      },
      {
        path: '/demo/table/searchInfo',
        name: 'D10202',
        props: true,
        component: () => import('../views/table/searchInfoTable.vue'),
        meta: { label: '查询表格' },
      },
      {
        path: '/demo/table/filter',
        name: 'D10203',
        props: true,
        component: () => import('../views/table/filterTable.vue'),
        meta: { label: '过滤表格' },
      },
      {
        path: '/demo/table/filter2',
        name: 'D10205',
        props: true,
        component: () => import('../views/table/filterTable2.vue'),
        meta: { label: '过滤表格2' },
      },
      {
        path: '/demo/table/filter3',
        name: 'D10206',
        props: true,
        component: () => import('../views/table/filterTable3.vue'),
        meta: { label: '过滤表格3' },
      },
      {
        path: '/demo/table/setting',
        name: 'D10204',
        props: true,
        component: () => import('../views/table/settingTable.vue'),
        meta: { label: '带列配置表格' },
      },
    ],
  },
  {
    path: '/demo/components',
    redirect: '/demo/components/dialog',
    name: 'D201',
    props: true,
    meta: { icon: 'i-comp-component', menuCode: 'D201', label: '组件' },
    children: [
      {
        path: '/demo/components/dialog',
        name: 'D20101',
        props: true,
        component: () => import('../views/components/dialog.vue'),
        meta: { icon: 'i-comp-dialog', label: '弹窗' },
      },
      {
        path: '/demo/components/upload',
        name: 'D20102',
        props: true,
        component: () => import('../views/components/upload.vue'),
        meta: { icon: 'i-comp-upload', label: '上传组件' },
      },
    ],
  },
  {
    path: '/demo/pages',
    redirect: '/demo/pages/editPage',
    name: 'D301',
    props: true,
    meta: { icon: 'i-ep-orange', menuCode: 'D301', label: '页面' },
    children: [
      {
        path: '/demo/pages/editPage/:id?',
        name: 'D30101',
        props: true,
        component: () => import('../views/pages/editPage.vue'),
        meta: { label: '编辑页', menuCode: 'D301' },
      },
      {
        path: '/demo/pages/detailPage/:id',
        name: 'D30102',
        props: true,
        component: () => import('../views/pages/detailPage.vue'),
        meta: { label: '用户详情', menuCode: 'D301' },
      },
    ],
  },
  {
    path: '/demo/frame',
    redirect: '/demo/frame/element',
    name: 'D401',
    props: true,
    meta: { icon: 'i-ep-platform', menuCode: 'D401', label: '外部页面' },
    children: [
      {
        path: '/demo/frame/unocss',
        name: 'D40101',
        props: true,
        component: IFrame,
        meta: { label: 'unocss文档（内嵌）', menuCode: 'D401', frameSrc: 'https://unocss.dev/' },
      },
      {
        path: '/demo/frame/element',
        name: 'D40102',
        props: true,
        component: IFrame,
        meta: { label: 'Element文档（内嵌）', menuCode: 'D401', frameSrc: 'https://element-plus.org/zh-CN/' },
      },
      {
        path: 'https://element-plus.org/zh-CN/',
        name: 'D40103',
        props: true,
        component: IFrame,
        meta: { label: 'Element文档（外链）', menuCode: 'D401' },
      },
    ],
  },
];
export { pages };

const demoPage: RouteRecordRaw = {
  path: '/demo',
  redirect: '/demo/permission',
  meta: {
    label: 'Demo',
    menuCode: 'D00',
    icon: 'i-ep-help',
    hide: false,
  },
  children: pages,
};

export default demoPage;
