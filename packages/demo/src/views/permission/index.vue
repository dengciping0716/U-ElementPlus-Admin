<template>
  <div class="w-full my-40 text-center">
    <el-button type="primary" @click="toggle">切换权限</el-button>
    <el-button type="primary" v-oauth="'EDIT'">按钮权限提示</el-button>
    <el-button type="primary" v-oauth-show="'EDIT'">有权限才显示 </el-button>
    <el-button type="primary" v-oauth-hide="'EDIT'">有权限则隐藏</el-button>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { usePermissionStore } from '@/store/permission/permissionStore';

const reloadPage = inject<Function>('reloadPage');
const store = usePermissionStore();

function toggle() {
  if (!store.hasOauth('D001', 'EDIT')) store.setOauth('D001', ['EDIT']);
  else store.setOauth('D001', ['DEL']);
  reloadPage?.();
}
</script>
