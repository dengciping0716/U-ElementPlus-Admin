<template>
  <div class="m-organize-tree">
    <el-input placeholder="请输入部门名称" v-model="searchKey" clearable prefix-icon="ep-search" class="max-w-60 mb-2"> </el-input>
    <el-tree ref="treeRef" :key="treeKey" v-loading="loading" v-bind="treeProps" @node-click="nodeClick" :filter-node-method="filterNode">
      <template #default="{ node, data }">
        <div class="list-item">
          <i class="i-ep-folder" style="color:var(--el-color-primary)"></i>
          <span :title="node.label" class="ellipsis-scroll p-2 flex-1">{{ node.label }}</span>
          <span @click.stop v-if="!readonly">
            <el-tooltip content="新增" placement="top" :enterable="false">
              <el-button size="small" icon="ep-plus" @click="editRef!.show(node, 'add')"> </el-button>
            </el-tooltip>
            <el-tooltip v-if="node.level > 1" content="编辑" placement="top" :enterable="false">
              <el-button size="small" icon="ep-edit" @click="editRef!.show(node, 'edit')"> </el-button>
            </el-tooltip>
            <el-popover v-if="node.level > 1" placement="top" width="180" class="delete_popover">
              <p class="delete-popover-notice">
                确定删除 <span class="delete-target">{{ node.label }}</span> 吗？
              </p>
              <div style="text-align: right; margin: 0">
                <el-button>取消</el-button>
                <el-button type="primary" @click="treeRemove(node)">确定</el-button>
              </div>
              <template #reference>
                <el-button size="small" icon="ep-delete" type="danger"></el-button>
              </template>
            </el-popover>
          </span>
        </div>
      </template>
    </el-tree>

    <!-- 新增/编辑   弹窗 -->
    <EditDialog ref="editRef" @submit="editSubmit" />
  </div>
</template>

<script setup lang="ts">
import EditDialog from './editDialog.vue';
import { debounce, omit } from 'lodash-es';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { ElTree, ElMessage } from 'element-plus';
import { useOrganizationApi } from '..';

const props = defineProps<{ params?: any; readonly?: boolean }>();
const emit = defineEmits<{
  change: [value: { organizeName: string; organizeId: string; organizeCode: string }];
}>();

const { loading, organizeData, del, getOrganizeTreeLevel3, getOrganizeTree, getOrganizeTreeByName } = useOrganizationApi();

const searchKey = ref('');
const defaultExpandedKeys = ref([]);
const selectId = ref('');

const editRef = ref<InstanceType<typeof EditDialog>>();
const treeRef = ref<InstanceType<typeof ElTree>>();

const isLazy = ref(false);

const treeProps = computed(() => {
  let p = {
    indent: 12,
    highlightCurrent: true,
    renderAfterExpand: false,
    checkOnClickNode: true,
    expandOnClickNode: false,
    defaultExpandedKeys: defaultExpandedKeys.value,
    nodeKey: 'organizeId',
    props: { label: 'organizeName', children: 'listOrganize', isLeaf: 'leaf' },
    data: organizeData.value,
  };
  if (!isLazy.value) return Object.assign(p, { defaultExpandAll: true, lazy: false });

  if (searchKey.value) {
    //接口不支持懒加载
    return Object.assign(p, { defaultExpandAll: true, lazy: false });
  } else {
    return Object.assign(p, { defaultExpandAll: false, lazy: true, load: loadNode });
  }
});

onMounted(() => {
  if (!isLazy.value) {
    getOrganizeTree({ ...unref(props.params) })
      .then((data) => {
        organizeData.value = data;
        return data[0];
      })
      .then(async (selected) => {
        treeRef.value!.setCurrentKey(selected?.organizeId);
        nodeClick(selected);
      });
  }
});

// created() {
const _filterNode = debounce(() => {
  treeRef.value!.filter(searchKey.value);
}, 300);
// },

/** 获取组织机构信息 */
function loadNode(node: Node, resolve: (data: any[]) => void) {
  const { level, data } = node;

  const { params } = props;
  if (level == 0) {
    getOrganizeTreeLevel3(unref(props.params)).then((raw) => resolve(raw || []));
    return;
  } else if (data.listOrganize) {
    resolve(data.listOrganize);
  } else {
    let p = { organizeId: data?.organizeId, ...params };
    getOrganizeTree(p).then((raw) => resolve(raw || []));
  }
}

function searchByName() {
  getOrganizeTreeByName({ ...unref(props.params), organizeName: searchKey.value }).then((data) => {
    organizeData.value = data;
  });
}
const searchByNameDebounce = debounce(searchByName, 1000);

const treeKey = ref(0);
watchEffect(async () => {
  if (searchKey.value) {
    _filterNode();
    // await searchByNameDebounce();
  } else {
    organizeData.value = [];
  }
  treeKey.value = Date.now(); //自动刷新el-tree
});

/** tree 新增、编辑 弹窗提交后 */
function editSubmit(data: any, node: Node, type: string) {
  // debugger
  if (type == 'add') {
    treeRef.value!.append(data, node);
    node.isLeaf = false;
    // node.isLeafByUser = false;
  }
  if (type == 'edit') {
    Object.assign(node.data, data);
  }
}

/** tree 删除节点 */
function treeRemove(node: Node) {
  del(node.data.organizeId).then((data) => {
    ElMessage.success('删除成功');
    treeRef.value!.remove(node);
  });
}
/** tree 点击节点 */
function nodeClick(data: any, node?: Node, instance?: any, event?: any) {
  selectId.value = data.organizeId;
  emit('change', { organizeId: data.organizeId, organizeCode: data.organizeCode, organizeName: data.organizeName });
}
function filterNode(value: string, data: any) {
  if (!value) return true;
  return data.organizeName?.includes(value);
}
</script>

<style lang="scss">
.m-organize-tree {
  .el-tree {
    border: none;
    height: calc(100% - 28px);
    overflow: auto;

    .ellipsis-scroll {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
