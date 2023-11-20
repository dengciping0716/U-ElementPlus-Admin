import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';
import { mixLevel, getCssVar, getCssVarName } from '@common/utils/style';
import { toggleClass } from '@common/utils';
import Color from 'color';

import { MenuTypeEnum, MenuModeEnum, TriggerEnum } from '../layout';

export const LIGHT_MENU_STYLE = {
  //light
  'font-weight': 600,
  [getCssVarName('menu', 'bg-color')]: getCssVar('bg-color'),
};
export const DARK_MENU_STYLE = {
  //aside dark
  // 'font-weight': 600,
  [getCssVarName('menu', 'item-height')]: '40px',
  [getCssVarName('menu', 'bg-color')]: '#263040', //mixLevel(this.appTheme, 0.3),
  [getCssVarName('bg-color-overlay')]: mixLevel('#263040', 0.3), //mixLevel(this.appTheme, 0.3),
  [getCssVarName('menu', 'hover-bg-color')]: mixLevel('#263040', 0.3), //mixLevel(this.appTheme, 0.3),
  // [getCssVarName('bg-color-overlay')]: getCssVar('color-primary', 'light-3'), //mixLevel(this.appTheme, 0.3),
  // [getCssVarName('menu', 'hover-bg-color')]: getCssVar('color-primary', 'light-3'), //mixLevel(this.appTheme, 0.3),
  [getCssVarName('menu', 'text-color')]: `#fff`,
  [getCssVarName('menu', 'hover-text-color')]: `#fff`,
  [getCssVarName('menu', 'active-color')]: getCssVar('color-primary'),
  [getCssVarName('menu', 'border-color')]: mixLevel('#263040', 0.3),
};
/** 构建顶部导航条色彩样式 */
export const buildMenuStyle = function (color: string) {
  return {
    'font-weight': 600,
    [getCssVarName('menu', 'bg-color')]: color, //mixLevel(this.appTheme, 0.3),
    [getCssVarName('bg-color-overlay')]: mixLevel(color, 0.3), //mixLevel(this.appTheme, 0.3),
    [getCssVarName('menu', 'hover-bg-color')]: mixLevel(color, 0.3), //mixLevel(this.appTheme, 0.3),
    [getCssVarName('menu', 'text-color')]: '#fff',
    [getCssVarName('menu', 'hover-text-color')]: '#fff',
    [getCssVarName('menu', 'active-color')]: '#FFF', //this.appTheme,
  };
};

export type AppThemeColorType = {
  CMYK: number[];
  RGB: number[];
  hex: string;
  name: string;
  pinyin: string;
};

const defaultSetting = {
  isDark: false,
  appTheme: import.meta.env.VITE_GLOB_THEME,
  isPrimaryMenu: false,
  menuMode: MenuModeEnum.INLINE,
  menuType: MenuTypeEnum.MIX,
  menuTrigger: TriggerEnum.HEADER,
  isSplitMenu: false,
  isShowBreadCrumb: false,
  isShowMultipleTab: true,
  isShowFooter: false,
  isGrayMode: false,
  isColorWeak: false,
};
export type DesignStateType = {
  isCollapse: boolean; // 菜单是否收起
} & typeof defaultSetting;

export const isDarkRef = useDark();
export const toggleDark = useToggle(isDarkRef);
// 当前选择的主题
export const useDesignStore = defineStore('app-design', {
  state: (): DesignStateType => ({
    isCollapse: false,
    ...defaultSetting,
  }),
  getters: {
    menuStyle(): any {
      if (this.isDark || !this.appTheme) return DARK_MENU_STYLE;
      return this.isPrimaryMenu ? buildMenuStyle(this.appTheme) : DARK_MENU_STYLE;
    },
  },
  actions: {
    // 切换主题
    toggleDark(): void {
      this.isDark = !this.isDark;
    },
    // 设置颜色
    setAppColor(color: string): void {
      this.appTheme = color;
    },
    /**
     * * 修改主题色
     * @param themeName 主题名称
     * @returns
     */
    resetHtmlTheme(): void {
      const isUse = unref(isDarkRef) || !this.appTheme;
      const el = window.document.documentElement;
      el.style.setProperty(getCssVarName('color-primary'), isUse ? '' : this.appTheme);
      el.style.setProperty(getCssVarName('color-primary', 'light-3'), isUse ? '' : mixLevel(this.appTheme, 0.3));
      el.style.setProperty(getCssVarName('color-primary', 'light-5'), isUse ? '' : mixLevel(this.appTheme, 0.5));
      el.style.setProperty(getCssVarName('color-primary', 'light-7'), isUse ? '' : mixLevel(this.appTheme, 0.7));
      el.style.setProperty(getCssVarName('color-primary', 'light-8'), isUse ? '' : mixLevel(this.appTheme, 0.8));
      el.style.setProperty(getCssVarName('color-primary', 'light-9'), isUse ? '' : mixLevel(this.appTheme, 0.9));
    },

    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  save: { enabled: true },
});

export const initDesignStore = async function () {
  const design = useDesignStore();
  design.$subscribe(
    (mutation, state) => {
      if (state.isDark != isDarkRef.value) toggleDark();
      toggleClass(state.isGrayMode, 'gray-mode');
      toggleClass(state.isColorWeak, 'color-weak');
      design.resetHtmlTheme();
    },
    { detached: true }
  );
};
