<template>
  <el-dialog
    class="select-class m-select-table-dialog m-select-user-dialog"
    v-model="visible"
    draggable
    :title="title"
    :closeOnClickModal="false"
    :close-on-press-escape="false"
    :width="width || '1080px'">
    <el-row :gutter="20">
      <el-col :span="multiple ? 14 : 24">
        <mSelectTable
          height="350px"
          ref="tableRef"
          :lazyLoad="lazyLoadFunc"
          :selectedIds="selectedIds"
          :rowKey="rowKey"
          :multiple="multiple"
          :tableColumns="tableColumns"
          @confirm="confirmHandler"
          @select="onSelect"
          @selectAll="onSelectAll">
          <template #search>
            <div class="flex-1">
              <el-input
                style="width: 300px"
                v-model="searchKey"
                :placeholder="searchPlaceholder || '按名称搜索'"
                clearable
                @keyup.enter="tableRef?.doSearch()"></el-input>
              <el-button @click="tableRef?.doSearch()" type="primary">搜索</el-button>
            </div>
          </template>
        </mSelectTable>
      </el-col>
      <!-- 多选 -->
      <el-col :span="multiple ? 10 : 0">
        <div class="p-2">已选( {{ mSelected.length }} )</div>
        <el-table :data="mSelected" border height="440px">
          <template v-for="(item, i) in tableColumnsSelected" :key="i">
            <el-table-column v-bind="item" show-overflow-tooltip header-align="left"> </el-table-column>
          </template>
          <el-table-column label="操作" header-align="center" align="center" width="60">
            <template #default="scope">
              <div class="control-btns">
                <el-button type="primary" @click="unselect(scope.$index, scope.row)">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      
      </el-col>
    </el-row>
    <div v-if="multiple" class="form-btns mt-4 flex justify-end">
          <el-button class="w-40" @click="visible = false">取消</el-button>
          <el-button class="w-40" @click="confirmHandler()" type="primary">确定</el-button>
        </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { mSelectTableInstance } from './instance';
import mSelectTable from './mSelectTable.vue';
import { reactive, readonly, nextTick, ref, toRefs } from 'vue';
import type { mSelectTableDialogProps } from './mSelectTableDialog';

const emit = defineEmits(['confirm', 'update:modelValue']);
const visible = ref(false);

const props = defineProps<mSelectTableDialogProps>();
const { tableColumns, tableColumnsSelected, title, searchKeyAlias, searchPlaceholder, rowKey, width, multiple } = toRefs(props);

let mSelected = ref<any[]>([]);
let selectedIds = computed(() => mSelected.value.map((v) => v[rowKey.value]));

let searchKey = ref('');
let searchParams = ref<Recordable>({});

const lazyLoadFunc = async function (params: any) {
  searchParams.value[searchKeyAlias?.value || 'searchKey'] = searchKey.value;

  if (props.lazyLoad) {
    return props.lazyLoad(Object.assign({}, searchParams.value, params));
  }

  return Promise.reject('lazyLoad is undefine!');
};

const tableRef = ref<mSelectTableInstance>();
function show(params = {}) {
  searchKey.value = '';
  searchParams.value = {
    ...params,
  };
  visible.value = true;
}

/** 单选模式 选中 */
function confirmHandler(row?: any) {
  emit('confirm', row || mSelected.value);
  visible.value = false;
}
/** table选中单项 */
function onSelect(selection: any[], row: any) {
  const key = rowKey.value;
  if (selection.find((val) => row[key] === val[key])) {
    mSelected.value.push(row); // 添加选中的
  } else {
    mSelected.value = mSelected.value.filter((val) => row[key] !== val[key]); // 删除未选中的
  }
}
/** table选中所有 */
function onSelectAll(selection: any[]) {
  const key = rowKey.value;

  if (selection.length) {
    const Ids = mSelected.value.map((v) => v[key]);
    let arr = selection.filter((val) => !Ids.includes(val[key]));
    mSelected.value = mSelected.value.concat(arr); // 添加选中的
  } else {
    const Ids = tableRef.value?.getDataSource().map((v) => v[key]);
    mSelected.value = mSelected.value.filter((val) => !Ids?.includes(val[key])); // 删除未选中的
  }
}
/** 取消选中 */
async function unselect(index: number, row: any) {
  mSelected.value.splice(index, 1);
  await nextTick();
  tableRef.value?.checkSelect();
}

defineExpose({ show });
</script>
