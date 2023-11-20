import { usePermissionStore } from './permission/permissionStore';
import { defineStore } from 'pinia';
import storage from '@common/utils/storage';
import { RouteLocationRaw, RouteMeta } from 'vue-router';
import router from '@/router';
import { RouteRecordRaw } from 'vue-router';

import type { Menu } from '../layout/types';
import { isNil } from 'lodash';

import demoPage from 'demo/src/router';

/**
 * 路由 转 菜单
 * @param route
 * @returns
 */
export function route2Menu(route: RouteRecordRaw): Menu {
  let path = route.path.includes('/:') ? route.path.split('/:')[0] + '/1' : route.path;
  let menu: Menu = {
    path: path,
    label: route.meta?.label,
    icon: route.meta?.icon,
    menuCode: route.name as string,
    hide: route.meta?.hide,
    sort: -1,
  };

  if (route.children?.length) {
    menu.children = route.children.map((route: any) => route2Menu(route));
  }

  return menu;
}

export const useMenuStore = defineStore('app-menu', () => {
  const permission = usePermissionStore();
  const initMap: Menu[] = [{ path: '/workbench', label: '工作台', menuCode: '', icon: 'i-ep-monitor', sort: -1 }];
  const localMenu = ref<Menu[]>([]);
  const remoteMenu = ref<Menu[]>([]);
  const menuList = computed(() => [...initMap, ...localMenu.value, ...remoteMenu.value]?.sort((a, b) => (a.sort || 0) - (b.sort || 0)));
  const subMenu = computed(() => {
    let code = router.currentRoute?.value.meta.menuCode;
    if (isNil(code)) return;
    return menuList.value?.find((row) => row.menuCode == code || someMenu(row.children, code!));
  });
  const currentSys = computed(() => subMenu.value?.menuCode);

  let DemoMenu = route2Menu(demoPage);
  // DemoMenu.hide = true;
  // pushMenu(DemoMenu);
  DemoMenu.children?.map((menu) => pushMenu(menu));

  /**
   * 递归查找子树是否存在code
   * @param code
   * @param list
   * @returns
   */
  function someMenu(list: Menu[] = [], code: string) {
    return list?.some((menu: Menu) => {
      if (menu.menuCode == code) return true;
      if (menu.children?.length) return someMenu(menu.children, code);
      return false;
    });
  }

  /**
   * 从本地加载菜单以及权限
   */
  async function init() {
    //
    return storage.getItem('remote-menu').then((data: any) => {
      remoteMenu.value = data?.map((item: any) => createMenu(item)) || [];
    });
  }

  /**
   * 更新菜单
   * @param data
   */
  async function setRemoteMenu(data: any[] = []) {
    storage.setItem('remote-menu', data);
    remoteMenu.value = data?.map((item: any) => createMenu(item)) || [];
  }

  /**
   * 添加本地菜单
   * @param menu
   */
  function pushMenu(menu: Menu) {
    localMenu.value.push(menu);
  }

  /**
   * 转换后台菜单格式
   * @param item
   * @returns
   */
  function createMenu(item: any): Menu {
    const { label, path, menuCode, sort, perm, children } = item;
    //生成权限列表
    permission.setOauth(menuCode, perm);
    //生成菜单树
    const menu: Menu = { path, menuCode, label, sort };
    if (children?.length) {
      menu.children = children.map((row: any) => createMenu(row));
    }

    //
    let route = setRoute(path ? { path } : { name: menuCode }, { label });
    menu.path = menu?.path ?? route?.path;
    menu.icon = menu?.icon ?? route?.meta?.icon;

    //是否隐藏菜单
    menu.hide = !(menu.path || menu.children?.length);
    return menu;
  }

  /**
   * 补全真实路由
   * @param menuCode
   * @param meta
   */
  function setRoute(raw: RouteLocationRaw, meta: RouteMeta) {
    try {
      let location = router.resolve(raw);
      let route = location.matched[location.matched?.length - 1];
      if (route) Object.assign(route.meta, meta);
      return route;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 路由跳转
   */
  function go(menu: Menu) {
    if (!menu.path) {
      router.push({ name: menu.menuCode });
    } else if (menu.path?.startsWith('http')) {
      window.open(menu.path);
    } else {
      router.push({ path: menu.path });
    }
  }

  return { menuList, currentSys, subMenu, init, pushMenu, setRemoteMenu, go };
});
