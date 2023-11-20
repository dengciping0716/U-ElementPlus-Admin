<template>
  <el-config-provider namespace="el" :locale="zhCn" size="default" :button="{ autoInsertSpace: true }" :message="{ max: 5 }">
    <slot></slot>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

defineOptions({ name: 'MConfigProvider' });
</script>
