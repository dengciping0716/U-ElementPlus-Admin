<template>
  <m-page-header title="岗位权限管理" :subTitle="roleName" @back="back()">
    <template #extra>
      <el-button type="primary" icon="ep-plus" @click="handlerSubmit()">提交</el-button>
    </template>
  </m-page-header>

  <div class="m-page" v-loading="loading">
    <div>
      <m-radio
        v-model="searchParams.viewType"
        class="mb-2"
        effect="dark"
        :options="[
          { label: '电脑端', value: 'pc' },
          { label: '移动端', value: 'app' },
        ]">
      </m-radio>
    </div>
    <div style="column-gap: 10px" class="xl:columns-3 sm:columns-1 lg:columns-2">
      <template v-for="system in tableData" :key="system.systemId">
        <PermissionSys :system="system" v-model="system.listCheckMenuId"></PermissionSys>
      </template>

      <m-card header="更多" shadow="never" class="mb-2">
        <div class="h-40 text-gray">需要更多功能请联系管理员</div>
      </m-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElNotification } from 'element-plus';
import { usePermApi } from './usePermApi';
import { useRoleApi } from './useRoleApi';
import { mPageHeader } from '@common/core';
import PermissionSys from './PermissionSys.vue';
//
import { usePageContext } from '@/hooks/usePageContext';
const { back } = usePageContext();
//
const props = defineProps<{ roleId: string }>();

const { getPermList, submit, loading } = usePermApi();
const { queryInfo } = useRoleApi();

const searchForm = ref<any>(null);
const searchParams = ref<Recordable>({
  viewType: 'pc',
});
const tableData = ref<any[]>([]);

const roleName = ref('');
watchEffect(() => {
  queryInfo(props.roleId).then((data) => {
    roleName.value = (data.organizeName || '') + ' / ' + data.roleName;
  });
});
watchEffect(() => {
  getPermList({ ...unref(searchParams), roleId: props.roleId }).then((data) => {
    tableData.value = data;
  });
});

/** 提交 */
async function handlerSubmit() {
  let listMenuId = tableData.value?.reduce((res: string[], sys: any) => res.concat(sys.listCheckMenuId), []);
  let params = {
    ...unref(searchParams),
    roleId: props.roleId,
    listMenuId,
  };
  return submit(params).then(() => {
    ElNotification.success('保存成功！');
  });
}
</script>
