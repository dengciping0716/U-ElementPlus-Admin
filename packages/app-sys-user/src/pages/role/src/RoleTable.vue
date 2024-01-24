<template>
  <div class="w-full relative" wrap v-bind="$attrs">
    <BasicTable @register="registerTable">
      <!-- 工具条 -->
      <template #toolBar>
        <div class="flex-1">
          <span class="mr-2 font-bold">组织岗位</span> <el-tag>{{ organizeName }}</el-tag>
        </div>
        <el-button text @click="editRow()" icon="ep-plus" type="primary">新增</el-button>
        <el-divider direction="vertical" />
        <el-button text @click="editRow()" icon="ep-delete" type="danger">删除</el-button>
      </template>

      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column type="selection" width="55" header-align="center" align="center" />
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column v-bind="item">
            <template #default="scope" v-if="item.prop == 'isUse'">
              <el-switch v-model="scope.row.isUse" size="small" active-value="1" inactive-value="0" @change="toggleUse(scope.row)" />
            </template>
          </el-table-column>
        </template>
        <el-table-column :resizable="true" label="操作" prop="btnCol" header-align="center" align="center" width="180" fixed="right">
          <template #default="scope">
            <div>
              <el-tooltip content="用户管理" placement="top">
                <el-link class="mr-2" type="primary">
                  <RouterLink class="el-icon i-ep-user" :to="'/sys/user/role/' + scope.row.roleId"> </RouterLink>
                </el-link>
              </el-tooltip>
              <el-tooltip content="权限管理" placement="top">
                <el-link class="mr-2" type="primary">
                  <RouterLink class="el-icon i-carbon:two-factor-authentication" :to="'/sys/role/perm/' + scope.row.roleId"> </RouterLink>
                </el-link>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-link class="mr-2" size="small" type="primary" @click="editRow(scope.row)" icon="ep-edit"></el-link>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-link class="mr-2" size="small" type="danger" @click="deleteRow(scope.row.roleId)" icon="ep-delete"> </el-link>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>
    </BasicTable>

    <el-dialog :title="editDailogModel.action + '岗位'" v-if="editDailogModel.visible" v-model="editDailogModel.visible" width="600px">
      <RoleEdit
        :id="editDailogModel.id"
        :params="props"
        @cancel="editDailogModel.visible = false"
        @submit="
          editDailogModel.visible = false;
          doSearch();
        "
        @del="
          editDailogModel.visible = false;
          doSearch();
        " />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';
import { ElMessageBox, ElNotification } from 'element-plus';
import type { RoleModel } from './useRoleApi';
import { useRoleApi } from './useRoleApi';
import RoleEdit from './RoleEdit.vue';
const props = defineProps<{
  organizeId?: string;
  organizeName?: string;
  organizeCode?: string;
}>();

const { getRoleList, delWithConfirm, toggleUse } = useRoleApi();
const searchForm = ref<any>(null);
const searchParams = ref<Partial<RoleModel>>();

const _center = { headerAlign: 'center', align: 'center' };
const tableColumns = [
  { prop: 'roleCode', label: '岗位编号', minWidth: '100px', ..._center },
  { prop: 'roleName', label: '岗位名称', minWidth: '100px', ..._center },
  { prop: 'effectiveStartDate', label: '有效开始时间', minWidth: '160px', ..._center },
  { prop: 'effectiveEndDate', label: '有效结束时间', minWidth: '160px', ..._center },
  { prop: 'isUse', label: '是否启用', minWidth: '60px', ..._center },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: false,
  immediate: false,
  isFitContent: true,
  border: true,
  api: (params: any) => getRoleList({ organizeId: props.organizeId }),
  tableColumns,
});

function doSearch() {
  setTargetPage(1);
  reload();
}

watchEffect(() => {
  if (props.organizeId) doSearch();
});

const editDailogModel = reactive({
  visible: false,
  action: '新增',
  id: '',
});

// 0 新增，
function editRow(row?: any) {
  if (row) {
    editDailogModel.visible = true;
    editDailogModel.action = '编辑';
    editDailogModel.id = row.roleId;
  } else {
    editDailogModel.visible = true;
    editDailogModel.action = '新增';
    editDailogModel.id = '';
  }
}
// 删除
async function deleteRow(id: string) {
  delWithConfirm(id).then(() => {
    ElNotification({ type: 'success', message: '删除成功!' });
    doSearch();
  });
}
</script>
