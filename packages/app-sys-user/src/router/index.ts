import { RouteRecordRaw } from 'vue-router';

// @unocss-include
// 菜单menuCode 和 路由的name 去匹配
const pages: RouteRecordRaw[] = [
  {
    path: '/sys/setting',
    redirect: '/sys/setting/properties',
    name: 'sys:setting',
    props: true,
    meta: { icon: 'i-ep-setting', menuCode: 'sys:setting', label: '系统设置', sort: '2' },
    children: [
      {
        path: '/sys/setting/properties',
        name: 'sys:setting:properties',
        props: true,
        component: () => import('../pages/sys-setting/src/SettingTable.vue'),
        meta: { icon: 'i-ep-menu', label: '参数配置', menuCode: 'sys:setting' },
      },
      {
        path: '/sys/setting/dict',
        name: 'sys:setting:dict',
        props: true,
        component: () => import('../pages/sys-setting/src/DictGrpTable.vue'),
        meta: { icon: 'i-ep-menu', label: '数据字典', menuCode: 'sys:setting' },
      },
    ],
  },
  {
    path: '/sys/organization',
    name: 'sys:organize',
    props: true,
    component: () => import('../pages/organization/src/index.vue'),
    meta: { icon: 'i-ep-office-building', label: '组织机构', menuCode: 'sys:organize' },
  },
  {
    path: '/sys/user',
    name: 'sys:user',
    props: true,
    component: () => import('../pages/user/src/Manager.vue'),
    meta: { icon: 'i-ep-user', label: '用户管理', menuCode: 'sys:user' },
  },
  {
    path: '/sys/user/role/:roleId?',
    name: 'sys:user:role',
    props: true,
    component: () => import('../pages/user/src/UserTable4Role.vue'),
    meta: { hide: true, label: '岗位用户管理', menuCode: 'sys:user' },
  },
  {
    path: '/sys/role/perm/:roleId?',
    name: 'sys:role:perm',
    props: true,
    component: () => import('../pages/role/src/PermissionIndex.vue'),
    meta: { icon: 'i-ep-key', hide: false, label: '岗位权限', menuCode: 'sys:user' },
  },
];

const sysPage: RouteRecordRaw = {
  path: '/sys',
  name: 'sys',
  redirect: '/sys/user',
  meta: {
    label: '系统管理',
    icon: 'i-ep-setting',
  },
  children: pages,
};
export default sysPage;
