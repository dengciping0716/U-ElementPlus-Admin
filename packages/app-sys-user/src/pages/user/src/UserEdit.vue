<template>
  <el-form :model="formModel" ref="formRef" :rules="rules" v-loading="loading" label-width="100px">
    <el-form-item label="用户编码" prop="empCode" v-if="props.id">
      <el-input disabled v-model="formModel.empCode" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="用户名称" prop="empName">
      <el-input v-model="formModel.empName" placeholder="请输入" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="telephone">
      <el-input v-model.trim="formModel.telephone" placeholder="请输入" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <m-radio
        v-model="formModel.sex"
        :options="[
          { label: '男', value: '1' },
          { label: '女', value: '0' },
        ]"></m-radio>
    </el-form-item>
    <el-form-item label="启用" prop="isUse">
      <m-radio
        v-model="formModel.isUse"
        :options="[
          { label: '启用', value: '1' },
          { label: '停用', value: '0' },
        ]"></m-radio>
    </el-form-item>

    <el-form-item label="岗位" prop="roleId">
      <m-checkbox v-model="formModel.roleId" placeholder="请选择岗位" filterable :options="roleOptions" multiple :props="roleProps">
      </m-checkbox>
    </el-form-item>

    <div class="flex justify-center">
      <el-button type="danger" @click="deleteRow()" v-if="props.id">删 除</el-button>
      <el-button @click="emit('cancel', '')">取 消</el-button>
      <el-button type="primary" @click="handlerSubmit">确 定</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useUserApi } from './useUserApi';
import { ElMessageBox, ElNotification } from 'element-plus';
import { useRoleApi } from '../../role';

const emit = defineEmits<{
  submit: [value: string];
  cancel: [value: string];
  del: [value: string];
}>();

const props = defineProps<{ id?: string; params?: any; organizeId?: string }>();
const { loading, formModel, queryInfo, submit, del } = useUserApi();

const formRef = ref<FormInstance>();
const rules = {
  empName: [{ required: true, message: '请输用户名称', trigger: 'blur' }],
  telephone: [{ required: true, message: '请输手机号', trigger: 'blur' }],
  // roleId: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
};

//岗位列表
const { getRoleTree } = useRoleApi();
const roleProps = { multiple: false, label: 'roleName', value: 'roleId' };
const roleOptions = ref([]);
watchEffect(() => {
  getRoleTree(props.params).then((data) => (roleOptions.value = data));
});

/** 提交 */
async function handlerSubmit() {
  const valid = await formRef.value?.validate().catch((e) => false);
  if (!valid) return;

  return submit(unref(props.params)).then(() => {
    ElNotification.success('保存成功！');
    emit('submit', '');
  });
}

watchEffect(() => {
  if (props.id) {
    queryInfo(props.id);
  }
});

// 删除
async function deleteRow() {
  let isConfirm = await ElMessageBox.confirm('是否删除该用户?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((e) => false);

  if (!isConfirm) return;
  del(props.id!).then(() => {
    ElNotification({ type: 'success', message: '删除成功!' });
    emit('del', '');
  });
}

defineExpose({ handlerSubmit });
</script>
