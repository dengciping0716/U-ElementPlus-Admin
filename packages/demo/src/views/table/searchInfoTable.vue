<template>
  <div class="m-page" wrap>
    <BasicTable @register="registerTable">
      <!-- 查询条件 -->
      <template #search>
        <el-form :model="searchParams" :inline="true" ref="searchForm">
          <el-form-item label="编号：" prop="targetCode">
            <m-input
              placeholder="请输入编号"
              v-model="searchParams.targetCode"
              clearable
              prefix-icon="ep-search"
              check-null
              cacheKey="targetCode"
              :maxlength="10"></m-input>
          </el-form-item>
          <el-form-item label="名称：" prop="targetName">
            <el-input
              placeholder="请输入名称"
              v-model="searchParams.targetName"
              clearable
              prefix-icon="ep-search"
              :maxlength="20"></el-input>
          </el-form-item>
        </el-form>
        <el-divider direction="vertical" class="important-h-8 important-mr-3" />
        <div class="">
          <el-button icon="ep-refresh" @click="searchForm.resetFields()"> </el-button>
          <el-button type="primary" icon="ep-search" @click="doSearch()"> </el-button>
        </div>
      </template>

      <!-- 列设置 -->
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
        </el-table-column>
        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column v-bind="item">
            <template #default="{ row }" v-if="item.prop == 'isUse'">
              <el-tag v-if="row.isUse == '1'" type="success">启用</el-tag>
              <el-tag v-if="row.isUse != '1'" type="info">停用</el-tag>
            </template>
            <template #default="{ row }" v-if="item.prop == 'sex'">
              <el-tag v-if="row.sex == '1'">男</el-tag>
              <el-tag v-if="row.sex != '1'" type="danger">女</el-tag>
            </template>
          </el-table-column>
        </template>
        <el-table-column :resizable="true" label="操作" prop="btnCol" header-align="center" align="center" width="100" fixed="right">
          <template #default="scope">
            <div :key="scope.row.auctionsCode" style="display: flex">
              <el-tooltip
                v-if="scope.row.isConfirm !== '0' || scope.row.aptitudeType != '0'"
                slot="reference"
                content="查看"
                placement="top"
                :enterable="false">
                <el-button @click="log">查看</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>
      <!-- 
      <template #append> <div class="m-5 text-blue">append</div> </template>
      <template #empty> <div>empty</div> </template>
       -->
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
import { BasicTable, useTable } from '@common/core';

const searchForm = ref<any>(null);
const searchParams = ref({
  targetCode: '',
  type: '',
  targetName: '',
  tenantName: '',
  address: '',
});
const tableColumns = [
  { prop: 'empCode', label: '用户编码', minWidth: '140px' },
  { prop: 'empName', label: '用户名称', minWidth: '140px' },
  { prop: 'sex', label: '性别', width: '60px' },
  // { prop: '_', label: '部门', width: '100px' },
  { prop: 'telephone', label: '手机号码', width: '140px' },
  { prop: 'isUse', label: '是否启用', width: '120px' },
  { prop: 'createDate', label: '创建时间', width: '160px' },
  { prop: 'roleName', label: '岗位', width: '160px' },
];
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: true,
  immediate: true,
  isFitContent: true,
  api: (params: any) => $http.get(resolveUrl('/user/emp/search'), { ...params, ...unref(searchParams) }).then((data: any) => data.result),
  tableColumns,
});

function log() {
  console.log(222, getTableEl());
}

function doSearch() {
  setTargetPage(1);
  reload();
}

const dict = {
  value: 'dictCode',
  label: 'dictLnm',
  lazyLoad: () => $http.get(resolveUrl('/auction/dict/getDictListInfo?dictGrp=GRP_EQUIP_TYPE')).then((data: any) => data.result),
};
</script>
