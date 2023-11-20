<template>
  <div class="flex">
    <div v-show="!isCollapse"><slot></slot></div>
    <div class="h-full flex items-center">
      <div class="bg-gray py-2 border-rd-r cursor-pointer" @click="isCollapse = !isCollapse">
        <button v-if="isCollapse" class="text-white cursor-pointer i-ep-arrow-right"></button>
        <button v-else class="text-white cursor-pointer i-ep-arrow-left"></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'mCollapseWrap',
});
const isCollapse = ref(false);
</script>
