<template>
  <el-select v-bind="$attrs"  :remoteMethod="remoteSearch" :remote-show-suffix="true" @visible-change="visibleChange" @change="valueChange">
    <template #prefix v-if="loading || $attrs.prefix">
      <i :i="loading ? 'ep-loading' : $attrs.prefix" class="el-icon el-input__icon important-ml-0"></i>
    </template>

    <!-- 普通列表 -->
    <template v-if="!cacheKey">
      <template v-for="item in mOptions" :key="item[valueKey]">
        <el-option :label="item[labelKey]" :value="item[valueKey]"> </el-option>
      </template>
    </template>

    <!-- 最近输入 -->
    <template v-if="cacheKey && !tableColumns?.length">
      <el-option-group v-for="group in selectOptions" :key="group?.label" :label="group?.label">
        <el-option v-for="item in group?.options" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]"> </el-option>
      </el-option-group>
    </template>

    <!-- 表格样式 -->
    <template v-if="cacheKey && tableColumns?.length">
      <el-option-group v-for="group in selectOptions" :key="group.label" :label="group.label" class="select-table">
        <el-option v-if="group.options?.length" class="select-table-title select-table-row" disabled :value="'-1'">
          <span class="cell" v-for="(row, i) in tableColumns" :key="i">{{ row.label }}</span>
        </el-option>
        <template v-for="item in group.options" :key="item[valueKey]">
          <el-option class="select-table-row" :label="item[labelKey]" :value="item[valueKey]">
            <span class="cell" v-for="(row, i) in tableColumns" :key="i">{{ item[row.prop] }}</span>
          </el-option>
        </template>
      </el-option-group>
    </template>
  </el-select>
</template>

<script lang="ts">
export default {
  name: 'm-select',
};
</script>

<script setup lang="ts">
import { useHistory, HistoryProps } from '../../../hooks/useHistory';
import { useLazyLoad, LazyProps } from '../../../hooks/useLazyLoad';

const props = defineProps<{ options?: any[]; tableColumns?: any[]; props?: LazyProps<any> } & HistoryProps>();
const { loading, options, valueKey, labelKey, remoteSearch } = useLazyLoad(props.props);

const { selectOptions, resetHistory, setOptions, saveInput, findItem } = useHistory(
  toRef(props.checkNull),
  props.cacheKey,
  valueKey,
  labelKey
);

const mOptions = computed(() => {
  if (options.value?.length) return options.value;
  if (props.options?.length) return props.options;
  return [];
});

watchEffect(() => {
  setOptions(mOptions.value);
});

function visibleChange(v: boolean) {
  if (v && props.cacheKey) {
    resetHistory();
  }
}

function valueChange(val: any) {
  if (!val) return;
  if (Array.isArray(val)) {
    // 支持多选
    let result = val?.map((row) => findItem(row));
    saveInput(result);
  } else {
    let result = findItem(val);
    saveInput(result);
  }
}
</script>
