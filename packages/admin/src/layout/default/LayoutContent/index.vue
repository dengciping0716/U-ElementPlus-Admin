<template>
  <div :style="getPlaceholderDomStyle" v-show="false"></div>
  <el-main class="h-full relative" :style="{ '--page-height': pageHeight + 'px' }">
    <m-tabs-view v-if="designStore.isShowMultipleTab">
      <KeepAliveView />
    </m-tabs-view>
    <RouterView v-else></RouterView>
    <frame-layout />
  </el-main>
</template>

<script lang="ts" setup>
import type { VNode, CSSProperties } from 'vue';
import { mTabsView, KeepAliveView } from '@common/core';
import FrameLayout from '../../iframe/index.vue';
import { useDesignStore } from '@/store/designStore';
import { useLayoutHeight, usePageContext } from '@/hooks/usePageContext';

const designStore = useDesignStore();

// 设置头部高度，计算内容高度
const { pageHeight } = usePageContext();

const HEADER_HEIGHT = 50;
const TABS_HEIGHT = 42;
const { setHeaderHeight } = useLayoutHeight();
const getPlaceholderDomStyle = computed((): CSSProperties => {
  let height = HEADER_HEIGHT;

  if (unref(designStore.isShowMultipleTab)) {
    height += TABS_HEIGHT;
  }
  setHeaderHeight(height);
  return {
    height: `${height}px`,
  };
});
</script>
