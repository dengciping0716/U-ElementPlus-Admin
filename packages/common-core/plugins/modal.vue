<template>
  <el-dialog v-model="isShow" v-bind="$attrs">
    <div v-if="content">{{ content }}</div>
    <slot></slot>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
  name: 'm-modal',
  props: ['content'],
  setup(props, { expose, attrs, slots, emit }) {
    const state = reactive({
      isShow: true,
      attrs,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
