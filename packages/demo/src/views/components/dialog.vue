<template>
  <div class="w-full my-40 text-center">
    <!-- 方式1 -->
    <div>
      <mDialogInput
        class="w-100"
        placeholder="请输入处置单位"
        v-model="searchParams.tenantName"
        clearable
        prefix-icon="ep-search"
        :loadDialog="dialogInputAttrs"
        :maxlength="50"></mDialogInput>
    </div>
    <div class="m-4">
      <mDialogInput slotTag="button" :multiple="true" v-model="searchParams.tenantName" :loadDialog="dialogInputAttrs"></mDialogInput>
    </div>
    <!-- 方式2 -->

    <div class="m-4">
      <el-button class="search-btn" @click="testDialog?.show()">标准选择窗:多选</el-button>
      <mSelectTableDialog v-bind="dialogAttrs" :multiple="true" ref="testDialog" />
    </div>
    <!-- 方式3 -->
    <div class="m-4">
      <InputComp slotTag="button">标准选择窗：单选</InputComp>
    </div>
    <!-- 方式4 -->
    <div class="m-4">
      <el-button @click="showDialog()">show 函数</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mSelectTableDialog, mDialogInput } from '@common/core';
import type { mSelectTableDialogInstance } from '@common/core';
import { InputComp, dialogInputAttrs, dialogAttrs, showDialog } from './dialog.js';

const searchParams = ref({ tenantName: '' });
const testDialog = ref<mSelectTableDialogInstance>();
</script>
