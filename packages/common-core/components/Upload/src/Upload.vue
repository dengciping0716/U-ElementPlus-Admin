<template>
  <el-upload ref="uploadRef" v-bind="uploadAttrs" v-model:file-list="fileList">
    <template #trigger>
      <slot>
        <el-button type="primary">选取文件</el-button>
      </slot>
    </template>

    <template #tip v-if="showTips">
      <div class="el-upload__tip"><i class="el-icon" i="ep-warning"></i> 文件大小不能超过 {{ maxSize }}MB!</div>
    </template>
  </el-upload>

  <div class="w-full" v-if="showList && fileList && fileList.length">
    <template v-for="(row, index) in fileList" :key="index">
      <div class="list-item">
        <div class="pr-2 flex-1">{{ row.name }}</div>
        <div class="pr-2 w-25" v-if="row.size">{{ (row.size / 1024).toFixed(1) }} KB</div>
        <!--  -->
        <div class=" ">
          <el-tooltip :enterable="false" content="下载" placement="top" v-if="!row.url">
            <el-link @click="fileDownload(row)"> <i class="i-ep-download"></i> </el-link>
          </el-tooltip>
          <el-tooltip :enterable="false" content="预览" placement="top" v-if="!row.url">
            <el-link @click="onPreview(row as UploadFile)"> <i class="i-ep-view"></i></el-link>
          </el-tooltip>
          <el-tooltip :enterable="false" content="删除" placement="top" v-if="!readonly">
            <el-link @click="uploadRef?.handleRemove(row as UploadFile)"> <i class="i-ep-delete"></i></el-link>
          </el-tooltip>
        </div>
      </div>
    </template>
  </div>

  <el-image-viewer v-bind="previewBindValues" v-if="previewBindValues.visible" />
</template>

<script setup lang="ts">
import type { MUploadProps, UploadFile } from './index';
import { ElImageViewer, UploadInstance, UploadProps, UploadUserFile } from 'element-plus';
import { useUpload } from './useUpload';

defineOptions({
  name: 'MUpload',
  inheritAttrs: false,
});
const uploadRef = ref<UploadInstance>();

const props = withDefaults(defineProps<MUploadProps>(), {
  showTips: true,
  showList: true,
  maxSize: 5,
  nameLength: 50,
});
const { fileList, previewBindValues, onChange, onPreview, onExceed, beforeRemove, fileDownload } = useUpload(uploadRef, props);

const innerPropsRef = ref<Partial<UploadProps>>();
const attrs = useAttrs();
const defaultAttrs = { autoUpload: false, beforeRemove, onChange, onExceed, onPreview, showFileList: false, multiple: true };
const uploadAttrs = computed<UploadProps>(() => {
  return { ...defaultAttrs, ...attrs, ...unref(innerPropsRef) } as UploadProps;
});
function setProps(props: Partial<UploadProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props };
}

const emit = defineEmits<{
  'update:modelValue': [value: UploadUserFile[]];
}>();

watch(fileList, (val) => {
  emit('update:modelValue', val || []);
});

function setFileList(list: UploadFile[]) {
  fileList.value = list;
}

watch(
  () => props.modelValue,
  (val) => {
    fileList.value = val;
  },
  { immediate: true }
);

defineExpose({
  fileList,
  setProps,
  setFileList,
  clear: () => uploadRef.value!.clearFiles(),
  submit: () => uploadRef.value!.submit(),
});
</script>
