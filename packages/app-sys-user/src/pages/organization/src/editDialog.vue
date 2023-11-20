<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :show-close="!loading"
    :closeOnClickModal="false"
    :close-on-press-escape="false"
    width="480px">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="上级部门" prop="parentName">
        <el-input v-model.trim="formModel.parentName" :maxlength="20" disabled></el-input>
      </el-form-item>
      <el-form-item label="组织名称" prop="organizeName">
        <el-input v-model.trim="formModel.organizeName" :maxlength="20" clearable></el-input>
      </el-form-item>
      <div class="flex justify-center">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handlerSubmit">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node';

import { FormInstance, ElMessage } from 'element-plus';
import { useOrganizationApi, OrganizationModel } from './useOrganizationApi';
const { submit, loading, formModel } = useOrganizationApi();
const rules = {
  organizeName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
};

const title = ref('');
const visible = ref(false);
const formRef = ref<FormInstance>();

const save = {
  node: null as any,
  type: 'add',
};
/** 显示弹窗 */
function show(node: Node, type = 'add') {
  save.node = node;
  save.type = type;

  title.value = type === 'add' ? '新增' : '编辑';
  if (type === 'add') {
    formModel.value = {
      organizeName: '',
      parentName: node.label,
      parentId: node.key as string,
      organizeId:'',
    };
  } else {
    formModel.value = {
      organizeName: node.label,
      organizeId: node.key as string,
      parentName: node.parent.label,
      parentId: node.parent.key as string,
    };
  }

  visible.value = true;
}

const emit = defineEmits<{
  submit: [data: OrganizationModel, node: any, type: string];
}>();
/** 提交 */
async function handlerSubmit() {
  const valid = await formRef.value!.validate().catch((e) => false);
  if (!valid) return;
  submit().then((data) => {
    ElMessage.success(`${title.value}机构成功！`);
    emit('submit', unref(formModel), save.node, save.type);
    visible.value = false;
  });
}

defineExpose({ show });
</script>
