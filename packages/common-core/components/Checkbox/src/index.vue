<template>
  <el-checkbox-group v-bind="$attrs" v-loading="loading">
    <template v-for="item in mOptions" :key="item[valueKey]">
      <template v-if="effect == 'dark'">
        <el-checkbox-button v-bind="item" :label="item[valueKey]">{{ item[labelKey] }}</el-checkbox-button>
      </template>
      <template v-else>
        <el-checkbox v-bind="item" :label="item[valueKey]" :border="effect == 'plain'">{{ item[labelKey] }}</el-checkbox>
      </template>
    </template>
  </el-checkbox-group>
</template>

<script lang="ts">
export default {
  name: 'm-checkbox',
};
</script>

<script setup lang="ts">
import { useLazyLoad, LazyProps } from '../../../hooks/useLazyLoad';

const props = defineProps<{ options?: any[]; effect?: 'dark' | 'plain'; props?: LazyProps<any> }>();
const { loading, options, valueKey, labelKey, remoteSearch } = useLazyLoad(props.props);

const effect = toRef(props.effect);

const mOptions = computed(() => {
  if (options.value?.length) return options.value;
  if (props.options?.length) return props.options;
  return [];
});
</script>
