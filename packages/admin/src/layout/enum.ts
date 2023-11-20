/**
 * @description: menu type
 */
export enum MenuTypeEnum {
  // left menu
  SIDEBAR = 'sidebar',

  MIX_SIDEBAR = 'mix-sidebar',
  // mixin menu
  MIX = 'mix',
  // top menu
  TOP_MENU = 'top-menu',
}

// 折叠触发器位置
export enum TriggerEnum {
  // 不显示
  NONE = 'NONE',
  // 菜单底部
  FOOTER = 'FOOTER',
  // 头部
  HEADER = 'HEADER',
}

export type Mode = 'vertical' | 'vertical-right' | 'horizontal' | 'inline';

// menu mode
export enum MenuModeEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  VERTICAL_RIGHT = 'vertical-right',
  INLINE = 'inline',
}

export enum MenuSplitTyeEnum {
  NONE,
  TOP,
  LEFT,
}

export enum TopMenuAlignEnum {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}

export enum MixSidebarTriggerEnum {
  HOVER = 'hover',
  CLICK = 'click',
}

export const menuTypeList = [
  {
    title: '左侧菜单模式', //t('layout.setting.menuTypeSidebar'),
    mode: MenuModeEnum.VERTICAL,
    type: MenuTypeEnum.SIDEBAR,
  },
  {
    title: '顶部菜单混合模式', //t('layout.setting.menuTypeMix'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX,
  },

  {
    title: '顶部菜单模式', //t('layout.setting.menuTypeTopMenu'),
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
  },
  {
    title: '左侧菜单混合模式', //t('layout.setting.menuTypeMixSidebar'),
    mode: MenuModeEnum.VERTICAL_RIGHT,
    type: MenuTypeEnum.MIX_SIDEBAR,
  },
];

//

export const menuTriggerOptions = [
  {
    value: TriggerEnum.NONE,
    label: '不显示', // t('layout.setting.menuTriggerNone'),
  },
  {
    value: TriggerEnum.FOOTER,
    label: '底部', // t('layout.setting.menuTriggerBottom'),
  },
  {
    value: TriggerEnum.HEADER,
    label: '顶部', // t('layout.setting.menuTriggerTop'),
  },
];
