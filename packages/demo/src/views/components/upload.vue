<template>
  <div class="m-4 grid gap-2" style="grid-template-columns: 1fr 1fr 1fr 1fr">
    <m-card header="基本用法" shadow="never">
      <m-upload v-model="fileList" :limit="2"> </m-upload>
    </m-card>
    <!--  -->
    <m-card header="默认列表" shadow="never">
      <m-upload v-model="fileList" show-file-list :show-list="false"></m-upload>
    </m-card>
    <!--  -->
    <m-card header="照片墙" shadow="never">
      <m-upload v-model="fileList" list-type="picture-card" :showFileList="true" :show-list="false" :show-tips="false">
        <i i="ep-plus"></i>
      </m-upload>
    </m-card>
    <!--  -->
    <m-card header="拖拽" shadow="never">
      <m-upload v-model="fileList" drag :maxSize="10"> </m-upload>
    </m-card>
    <!--  -->
    <m-card header="按钮" shadow="never">
      <m-upload v-model="fileList" :maxSize="10" :show-list="false" :show-tips="false"> </m-upload>
    </m-card>
  </div>
</template>

<script setup lang="ts">
import { mUpload } from '@common/core';
import { UploadUserFile } from 'element-plus';

const fileList = ref<UploadUserFile[]>([
  {
    name: 'plant-2.png',
    url: '/images/plant-2.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-1.png',
    url: '/images/figure-1.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-2.png',
    url: '/images/figure-2.png',
  },
]);
</script>
