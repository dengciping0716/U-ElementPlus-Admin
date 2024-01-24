<template>
  <el-form :model="formModel" ref="formRef" :rules="rules" v-loading="loading" label-width="100px">
    <el-form-item label="所属组织" prop="organizeName">
      <el-input v-model="formModel.organizeName" autocomplete="off" disabled></el-input>
    </el-form-item>
    <el-form-item label="岗位名称" prop="roleName">
      <el-input v-model="formModel.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="启用" prop="isUse">
      <m-radio
        v-model="formModel.isUse"
        :options="[
          { label: '启用', value: '1' },
          { label: '停用', value: '0' },
        ]"></m-radio>
    </el-form-item>

    <el-form-item label="有效时间" prop="effectiveStartDate">
      <el-date-picker v-model="dateDrange" type="daterange" value-format="YYYY-MM-DD" cleable v-bind="datePickerOptions"></el-date-picker>
    </el-form-item>

    <div class="flex justify-center">
      <el-button type="danger" @click="deleteRole()" v-if="props.id">删 除</el-button>
      <el-button @click="emit('cancel', '')">取 消</el-button>
      <el-button type="primary" @click="() => handlerSubmit()">确 定</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useRoleApi } from './useRoleApi';
import datePickerOptions from '@common/utils/datePickerOptions';

const emit = defineEmits<{
  submit: [value: string];
  cancel: [value: string];
  del: [value: string];
}>();

const props = defineProps<{ id?: string; params?: any }>();
const { loading, formModel, queryInfo, submit, delWithConfirm } = useRoleApi();

const dateDrange = ref([formModel.value?.effectiveStartDate, formModel.value?.effectiveEndDate]);
watchEffect(() => {
  let [startD, endD] = dateDrange.value;
  formModel.value.effectiveStartDate = startD;
  formModel.value.effectiveEndDate = endD;
});

watchEffect(() => {
  formModel.value.organizeId = props.params?.organizeId;
  formModel.value.organizeName = props.params?.organizeName;
});

const formRef = ref<FormInstance>();
const rules = { roleName: [{ required: true, message: '请输岗位名称', trigger: 'blur' }] };

/** 提交 */
async function handlerSubmit() {
  const valid = await formRef.value?.validate().catch((e) => false);
  if (!valid) return Promise.reject(false);
  return submit().then(() => {
    ElMessage.success('保存成功！');
    emit('submit', '');
  });
}

watchEffect(() => {
  if (props.id) {
    queryInfo(props.id);
  }
});

// 删除
async function deleteRole() {
  delWithConfirm(props.id!).then(() => {
    ElMessage({ type: 'success', message: '删除成功!' });
    emit('del', '');
  });
}

defineExpose({ handlerSubmit });
</script>
