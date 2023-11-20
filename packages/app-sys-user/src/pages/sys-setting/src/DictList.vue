<template>
  <div class="m-page">
    <ul class="flex justify-start gap-2">
      <template v-for="item in tableData" :key="item.dictCodeKbn">
        <li class="">
          <m-card>
            <DictListItem :item="item" @change="reload()"></DictListItem>
          </m-card>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import DictListItem from './DictListItem.vue';
import { sortBy } from 'lodash';

import { useDictApi, DictModel } from './useDictApi';
const { queryDictList } = useDictApi();

const props = defineProps<{ dictGrp: string }>();

type Row = DictModel & { isEdit: boolean; name: string; sort: number };
const tableData = ref<Row[]>();

function reload() {
  queryDictList({ dictGrp: props.dictGrp }).then((data: any) => (tableData.value = sortBy(data, 'sortNo')));
}
onMounted(() => {
  reload();
});
</script>
