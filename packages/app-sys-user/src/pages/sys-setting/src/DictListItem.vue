<template>
  <el-descriptions border :column="1">
    <template #title>
      <div v-if="formModel.isEdit">
        <el-form ref="formRef" :model="formModel" :rules="rules">
          <el-form-item label="名称" prop="dictLnm"><el-input v-model="formModel.dictLnm" :maxlength="20"></el-input></el-form-item>
          <el-form-item label="排序"><el-input-number v-model="formModel.sortNo" :max="99" :min="0"></el-input-number></el-form-item>
          <div class="flex">
            <el-button class="flex-1" @click="handlerCancel()">取消</el-button>
            <el-button class="flex-1" type="primary" @click="handlerSubmit()">保存</el-button>
          </div>
        </el-form>
      </div>
      <div v-else>
        <el-tag size="small">{{ formModel.sortNo }}</el-tag>
        <span class="mx-2"> {{ formModel.dictLnm }}</span>
        <el-link icon="ep-edit" @click="formModel.isEdit = true"></el-link>
      </div>
    </template>
    <el-descriptions-item :label="formModel.dictCodeKbn">
      {{ formModel.dictCode }}
    </el-descriptions-item>
    <!-- 
                <el-descriptions-item label="编码">
                {{ item.dictCodeKbn }}
              </el-descriptions-item>
              <el-descriptions-item label="值">
                {{ item.dictCode }}
              </el-descriptions-item>
             -->
  </el-descriptions>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import type { FormInstance } from 'element-plus';

import { useDictApi } from './useDictApi';
import type { DictModel } from './useDictApi';

type Row = Partial<DictModel & { isEdit: boolean }>;

const emit = defineEmits<{
  change: [value: DictModel];
}>();

const { submit } = useDictApi();

const props = defineProps<{ item: DictModel }>();

const formModel = ref<Partial<Row>>({});
watchEffect(() => {
  let item = props.item;
  formModel.value = { ...item, isEdit: false };
});

const formRef = ref<FormInstance>();
const rules = { dictLnm: [{ required: true, message: '请输入名称', trigger: 'blur' }] };

/** 取消编辑 */
function handlerCancel() {
  formModel.value.dictLnm = props.item.dictLnm;
  formModel.value.sortNo = props.item.sortNo;
  formModel.value.isEdit = false;
}
/** 提交 */
async function handlerSubmit() {
  const valid = await formRef.value?.validate().catch((e) => false);
  if (!valid) return;
  let params: DictModel = {
    ...props.item,
    dictLnm: formModel.value.dictLnm || '',
    sortNo: formModel.value.sortNo || '',
  };
  return submit(params).then(() => {
    formModel.value.isEdit = false;
    ElNotification.success('保存成功！');
    emit('change', params);
  });
}
</script>
