<template>
  <el-radio-group v-bind="$attrs" v-loading="loading">
    <template v-for="item in mOptions" :key="item[valueKey]">
      <template v-if="effect == 'dark'">
        <el-radio-button :disabled="!!item.disabled" :label="item[valueKey]">{{ item[labelKey] }}</el-radio-button>
      </template>
      <template v-else>
        <el-radio :border="effect == 'plain'" :disabled="!!item.disabled" :label="item[valueKey]">{{ item[labelKey] }}</el-radio>
      </template>
    </template>
  </el-radio-group>
</template>

<script lang="ts">
export default {
  name: 'm-radio',
};
</script>

<script setup lang="ts">
import { useLazyLoad } from '../../../hooks/useLazyLoad';
import type { LazyProps } from '../../../hooks/useLazyLoad';

const props = defineProps<{ options?: any[]; effect?: 'dark' | 'plain' | null; props?: LazyProps<any> }>();
const { loading, options, valueKey, labelKey, remoteSearch } = useLazyLoad(props.props);

const effect = toRef(props.effect);

const mOptions = computed(() => {
  if (options.value?.length) return options.value;
  if (props.options?.length) return props.options;
  return [];
});
</script>
