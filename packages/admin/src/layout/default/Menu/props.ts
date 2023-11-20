import type { Menu } from '@/layout/types';
import type { PropType } from 'vue';

import { MenuModeEnum, MenuTypeEnum } from '@/layout/enum';

export const basicProps = {
  items: {
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
  // collapsedShowTitle: { type: Boolean },
  // 最好是4 倍数
  // inlineIndent: { type: Number, default: 20 },
  // 菜单组件的mode属性
  isCollapse: { type: Boolean },
  // mixSider: { type: Boolean },
  // accordion: { type: Boolean, default: true },
  // beforeClickFn: {
  //   type: Function as PropType<(key: string) => Promise<boolean>>,
  // },
};

export const itemProps = {
  item: {
    type: Object as PropType<Menu>,
    default: {},
  },
  showTitle: { type: Boolean, default: true },
};

export const contentProps = {
  item: {
    type: Object as PropType<Menu>,
    default: null,
  },
  showTitle: { type: Boolean, default: true },
};
