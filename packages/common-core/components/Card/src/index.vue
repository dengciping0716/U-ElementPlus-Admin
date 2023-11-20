<template>
  <el-card v-bind="$attrs">
    <slot></slot>
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>
  </el-card>
</template>

<script>
export default {
  name: 'MCard',
};
</script>
