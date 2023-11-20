<template>
  <div :style="getWrapStyle" v-loading="loading">
    <iframe ref="frameRef" :src="frameSrc" :style="getWrapStyle" :class="`iframe-page__main`" @load="hideLoading"></iframe>
  </div>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { ref, unref, computed } from 'vue';
import { usePageContext } from '@/hooks/usePageContext';

defineProps({
  frameSrc: { type: String, default: '' },
});

const loading = ref(true);
const frameRef = ref<HTMLFrameElement>();
const { pageHeight } = usePageContext();

const getWrapStyle = computed((): CSSProperties => {
  return {
    height: `${unref(pageHeight)}px`,
  };
});

function hideLoading() {
  loading.value = false;
}
</script>
<style lang="scss" scoped>
.iframe-page {
  &__main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: getCssVar('color-white');
    border: 0;
    box-sizing: border-box;
  }
}
</style>
