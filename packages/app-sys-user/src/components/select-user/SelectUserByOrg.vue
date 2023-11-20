<template>
  <el-dialog
    class="org-user"
    v-model="visible"
    draggable
    :show-close="false"
    :closeOnClickModal="false"
    :close-on-press-escape="false"
    :width="'720px'">
    <template #header></template>
    <el-row>
      <el-col :span="14">
        <div class="h-120 p-4 b-0 b-r b-solid b-gray-3">
          <el-input placeholder="搜索" v-model="searchKey" clearable prefix-icon="ep-search" class="max-w-60 mb-2"> </el-input>

          <div class="list-item" v-if="companyName">
            <span class="i-ic:baseline-folder" style="color: var(--el-color-primary)"></span>
            <span class="ellipsis-scroll p-2 flex-1">{{ companyName }}</span>
          </div>
          <el-scrollbar height="360px">
            <el-tree ref="treeRef" class="scrollbar" show-checkbox v-bind="treeProps" @check="checkChange">
              <template #default="{ node, data }">
                <div class="list-item" v-if="!data.isUser">
                  <span class="i-ic:baseline-folder" style="color: var(--el-color-primary)"></span>
                  <span :title="node.label" class="ellipsis-scroll p-2 flex-1">{{ data.organizeName }}</span>
                </div>
                <div class="list-item p-1" v-if="data.isUser">
                  <el-avatar size="small">{{ data.empName[data.empName.length - 1] }}</el-avatar>
                  <span :title="node.label" class="ellipsis-scroll p-2 flex-1">{{ data.empName }}</span>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <!-- 多选 -->
      <el-col :span="10">
        <div class="h-120 p-4 flex flex-col">
          <div class="font-bold text-base" v-if="!mSelected.length">选择员工</div>
          <div v-if="mSelected.length">已选 {{ mSelected.length }}</div>

          <el-scrollbar>
            <ul>
              <li v-for="(user, index) in mSelected" :key="user.empId" class="flex justify-between items-center p-1">
                <span class="flex items-center">
                  <el-avatar size="small" class="mr-2">{{ user.empName[user.empName.length - 1] }}</el-avatar>
                  <span> {{ user.empName }} </span>
                </span>
                <el-button size="small" type="info" @click="unselect(index, user)" icon="ep-close"> </el-button>
              </li>
            </ul>
          </el-scrollbar>
          <div class="flex">
            <el-button class="flex-1" @click="visible = false">取消</el-button>
            <el-button class="flex-1" @click="confirmHandler()" type="primary">确定</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, readonly, nextTick, ref, toRefs } from 'vue';
import { useOrganizationTree } from './useOrganizationTree';

const emit = defineEmits(['confirm', 'update:modelValue']);
const visible = ref(false);

const props = defineProps<{ multiple?: boolean; params?: any }>();
const { multiple } = toRefs(props);

const { treeProps, treeRef, companyName } = useOrganizationTree(props);
let mSelected = ref<any[]>([]);

let searchKey = ref('');
let searchParams = ref<Recordable>({});

// const lazyLoadFunc = async function (params: any) {
//   searchParams.value[  'searchKey'] = searchKey.value;

//   if (props.lazyLoad) {
//     return props.lazyLoad(Object.assign({}, searchParams.value, params));
//   }

//   return Promise.reject('lazyLoad is undefine!');
// };

function show(params = {}) {
  searchKey.value = '';
  searchParams.value = {
    ...params,
  };
  visible.value = true;
}

function checkChange(a: any, b: any) {
  console.log(a, b);
  let { checkedNodes } = b;
  if (multiple.value) {
    mSelected.value = checkedNodes.filter((row: any) => row.isUser);
  } else {
    if (a.isUser) {
      mSelected.value = [a];
      treeRef.value!.setCheckedNodes([a]);
    }
  }
}

/** 单选模式 选中 */
function confirmHandler(row?: any) {
  if (multiple.value) {
    emit('confirm', row || mSelected.value);
  } else {
    emit('confirm', row || mSelected.value[0]);
  }
  visible.value = false;
}
/** 取消选中 */
async function unselect(index: number, row: any) {
  mSelected.value.splice(index, 1);

  await nextTick();
  treeRef.value!.setChecked(row.empId, false, false);
}

defineExpose({ show });
</script>

<style lang="scss">
.org-user {
  border-radius: 8px;

  .el-dialog__header,
  .el-dialog__body {
    padding: 0;
  }
}
</style>
