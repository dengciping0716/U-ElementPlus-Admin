import { useEventListener } from '@vueuse/core';
import { useDesignStore } from '@/store/designStore';
import { useTabsStore } from '@common/core';
import { debounce } from 'lodash-es';

const headerHeightRef = ref(0);
const footerHeightRef = ref(0);

export function useLayoutHeight() {
  function setHeaderHeight(val) {
    headerHeightRef.value = val;
  }
  function setFooterHeight(val) {
    footerHeightRef.value = val;
  }
  return { headerHeightRef, footerHeightRef, setHeaderHeight, setFooterHeight };
}

export function usePageContext() {
  const contentHeight = ref(window.innerHeight);

  const pageHeight = computed(() => {
    return unref(contentHeight) - unref(headerHeightRef);
  });

  useEventListener(
    window,
    'resize',
    debounce((evt) => (contentHeight.value = window.innerHeight), 300)
  );

  //
  const designStore = useDesignStore();
  //
  const tabsStore = useTabsStore();

  const router = useRouter();
  function back() {
    const route = unref(router.currentRoute);
    router.back();
    if (designStore.isShowMultipleTab) {
      setTimeout(() => tabsStore.closeCurrentTab(route), 300);
    }
  }

  return { pageHeight, updateTab: tabsStore.updateTab, closeCurrentTab: tabsStore.closeCurrentTab, back };
}
