<template>
  <el-autocomplete
    v-if="cacheKey"
    v-bind="$attrs"
    :fetch-suggestions="querySearchAsync"
    @select="saveInput($event)"
    :select-when-unmatched="true">
    <template #prefix v-if="$slots.prefix">
      <slot name="prefix"></slot>
    </template>
    <template #suffix v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </template>
    <template #prepend v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </template>
    <template #append v-if="$slots.append">
      <slot name="append"></slot>
    </template>
  </el-autocomplete>
  <el-input v-else v-bind="$attrs">
    <template #prefix v-if="$slots.prefix">
      <slot name="prefix"></slot>
    </template>
    <template #suffix v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </template>
    <template #prepend v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </template>
    <template #append v-if="$slots.append">
      <slot name="append"></slot>
    </template>
  </el-input>
</template>

<script lang="ts">
export default {
  name: 'm-input',
};
</script>

<script setup lang="ts">
import { useHistory } from '../../../hooks/useHistory';
import type { HistoryProps } from '../../../hooks/useHistory';

const props = defineProps<HistoryProps>();
const { resetHistory, saveInput } = useHistory(toRef(props.checkNull), props.cacheKey);

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = resetHistory();
  cb(results);
};
</script>
