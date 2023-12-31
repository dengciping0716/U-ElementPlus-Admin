import { computed, toRaw, unref } from 'vue';
import { isNil, uniqBy } from 'lodash-es';
import { useTabsStore } from '@common/core';
import { useRouter } from 'vue-router';
import type { RouteRecordRaw, RouteRecordName } from 'vue-router';
import { useDesignStore } from '@/store/designStore';

export function useFrameKeepAlive() {
  const router = useRouter();
  const { currentRoute } = router;
  const { isShowMultipleTab } = useDesignStore();
  const tabStore = useTabsStore();
  const getFramePages = computed(() => {
    const ret = getAllFramePages(toRaw(router.getRoutes()) as RouteRecordRaw[]) || ([] as RouteRecordRaw[]);
    return ret;
  });

  const getOpenTabList = computed((): RouteRecordName[] => {
    return tabStore.tabsList.reduce((prev: RouteRecordName[], next: any) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.name);
      }
      return prev;
    }, []);
  });

  function getAllFramePages(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    let res: RouteRecordRaw[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, 'name');
    return res;
  }

  function showIframe(item: RouteRecordRaw) {
    return item.name === unref(currentRoute).name;
  }

  function hasRenderFrame(name: RouteRecordName | undefined) {
    if (isNil(name)) return false;
    if (!unref(isShowMultipleTab)) {
      return router.currentRoute.value.name === name;
    }
    return unref(getOpenTabList).includes(name);
  }

  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}
