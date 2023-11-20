<template>
  <el-form :model="filterInfo" :inline="true" ref="searchForm">
    <template v-for="item in filters">
      <el-form-item :label="item.headerLable" :label-width="item.headerLable ? '' : '0px'" :prop="item.filterModel">
        <filter-render
          v-bind="item.filterAttrs"
          v-model="filterInfo[item.filterModel]"
          @confirm="tableInstance.reload({ targetPage: 1 })" />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { FilterRender } from '../../';
import { useTableContext } from './hooks/useTableContext';
const tableInstance = useTableContext();
let filterInfo = tableInstance.searchState?.filterInfo;

interface filterOpt {
  headerFilterShow?: boolean;
  filterAttrs: any;
  headerLable: string;
  filterModel: string;
}

interface FilterBarProps {
  filters: filterOpt[];
}

const props = defineProps<FilterBarProps>();
const { filters } = toRefs(props);
</script>
