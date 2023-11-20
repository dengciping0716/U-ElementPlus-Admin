<template>
  <el-footer ref="footerRef" v-if="getShowLayoutFooter">
    <slot>
      <div class="text-center mt-3">Copyright &copy;2023 {{ appName }}</div>
    </slot>
  </el-footer>
</template>

<script setup lang="ts">
import { useDesignStore } from '@/store/designStore';
const designStore = useDesignStore();

const appName = import.meta.env.VITE_GLOB_APP_TITLE;

import { useLayoutHeight } from '@/hooks/usePageContext';
const footerRef = ref<ComponentRef>();
const { setFooterHeight } = useLayoutHeight();
const getShowLayoutFooter = computed(() => {
  if (unref(designStore.isShowFooter)) {
    const footerEl = unref(footerRef)?.$el;
    setFooterHeight(footerEl?.offsetHeight || 0);
  } else {
    setFooterHeight(0);
  }
  return unref(designStore.isShowFooter); // && !unref(currentRoute).meta?.hiddenFooter;
});
</script>