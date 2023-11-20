<template>
  <div class="m-page" wrap>
    <BasicTable @register="registerTable">
      <template #col="{ tableColumns, targetPage, pageSize }">
        <el-table-column type="selection" width="45"> </el-table-column>

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
            <div :key="scope.row.auctionsCode">
              <el-tooltip
                v-if="scope.row.isConfirm !== '0' || scope.row.aptitudeType != '0'"
                slot="reference"
                content="查看"
                placement="top"
                :enterable="false">
                <el-button size="small" @click="log">查看</el-button>
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
const [registerTable, { getTableEl, reload }] = useTable({
  showPage: true,
  immediate: true,
  isFitContent: true,
  api: (params: any) => $http.get(resolveUrl('/user/emp/search'), params).then((data: any) => data.result),
  tableColumns,
});

function log() {
  console.log(222, getTableEl());
}
</script>
