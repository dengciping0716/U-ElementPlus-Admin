import { defineStore } from 'pinia';

export const enum OatuhTypeEnum {
  // 所有权限
  ALL = 'ALL',
  // 查看权限，远程菜单默认有查看权限
  VIEW = 'VIEW',
}

export const usePermissionStore = defineStore('app-permission', () => {
  const oauthList = ref<Record<string, Record<string, boolean>>>({});

  /**
   * 采集菜单权限列表
   */
  function setOauth(menuCode: string, oauths: string[]) {
    oauthList.value[menuCode] = transformOauth(oauths);
  }

  /**
   * 收集按钮权限
   * @param list
   * @returns
   */
  function transformOauth(list: string[] = []): Record<string, boolean> {
    return list.reduce(
      (result: Record<string, boolean>, key) => {
        result[key] = true;
        return result;
      },
      { VIEW: true }
    );
  }

  /**
   * 校验是否有页面权限
   * @param menuCode
   * @returns
   */
  function hasViewOauth(menuCode?: string): boolean {
    return hasOauth(menuCode, OatuhTypeEnum.VIEW);
  }

  /**
   * 校验是否有权限
   * @param menuCode
   * @returns
   */
  function hasOauth(menuCode = '', name: string): boolean {
    if (!menuCode) {
      return false;
    }
    let oauths = oauthList.value[menuCode];
    return oauths?.[OatuhTypeEnum.ALL] || oauths?.[name];
  }

  return { setOauth, oauthList, hasOauth, hasViewOauth };
});
