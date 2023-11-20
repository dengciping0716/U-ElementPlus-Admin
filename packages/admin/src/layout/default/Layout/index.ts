import TopLeft from './Top-Left.vue';
import LeftTop from './Left-Top.vue';
import Top from './Top.vue';
import { MenuTypeEnum, TriggerEnum } from '@/layout/enum';
import { useDesignStore } from '@/store/designStore';
import { h } from 'vue';

export default function (props, { slots, emit, attrs }) {
  let store = useDesignStore();
  if (store.menuType == MenuTypeEnum.TOP_MENU) {
    return h(Top, attrs, slots);
  }
  if (store.menuType == MenuTypeEnum.SIDEBAR) {
    return h(LeftTop, attrs, slots);
  }
  if (store.menuType == MenuTypeEnum.MIX) {
    return h(TopLeft, attrs, slots);
  }
  if (store.menuType == MenuTypeEnum.MIX_SIDEBAR) {
    return h(LeftTop, attrs, slots);
  }
}
