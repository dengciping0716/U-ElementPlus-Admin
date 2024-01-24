<template>
  <div class="__page m-detail-page" v-loading="loading">
    <m-page-header :title="title" :show-breadcrumb="true" @back="back()">
      <template #extra>
        <!-- <el-button type="primary" @click="handlerSubmit" class="ml-2">确认</el-button> -->
      </template>
    </m-page-header>

    <m-card class="m-detail-page-content ma mt-4 max-w-[1080px]" shadow="never" header="基本信息">
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item label-class-name="w-[130px]" label="手机号码"> {{ model.telephone }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="用户编码"> {{ model.empCode }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="姓名"> {{ model.empName }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="身份证"> {{ model.cardNum }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="性别">{{ model.sex }} </el-descriptions-item>

        <el-descriptions-item label-class-name="w-[130px]" label="账号"> {{ model.empAccount }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="账号类型">{{ model.empTypeName }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="有效期开始日期">{{ model.validStartDate }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="有效期结束日期">{{ model.validEndDate }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="备注" :span="3">{{ model.remark }} </el-descriptions-item>
        <!-- <el-descriptions-item  label-class-name="w-[130px]" label="附件" >
            <m-upload-file-list :limit="1" v-model="listFile" />
          </el-descriptions-item> -->
        <el-descriptions-item label-class-name="w-[130px]" label="身份证"> {{ model.cardNum }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="入职日期">{{ model.hireDate }}</el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="离职日期">{{ model.leaveDate }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="婚配">{{ model.married }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="政治面貌">{{ model.political }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="文化程度">{{ model.culture }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="办公电话"> {{ model.officePhone }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="电子邮箱"> {{ model.email }} </el-descriptions-item>
        <el-descriptions-item label-class-name="w-[130px]" label="通信地址">{{ model.postalAddress }} </el-descriptions-item>
      </el-descriptions>
    </m-card>
  </div>
</template>

<script setup lang="ts">
import { mPageHeader } from '@common/core';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useUserApi } from './useUserApi';
//
import { usePageContext } from '@/hooks/usePageContext';
const { back } = usePageContext();
//
const route = useRoute();

const props = defineProps<{ id: string }>();
const title = ref('');
const { loading, model, queryInfo, getNextCode, submit } = useUserApi();

const formRef = ref<FormInstance>();

/** 提交 */
async function handlerSubmit() {
  const valid = await formRef.value?.validate().catch((e) => false);
  if (!valid) return;

  submit().then(() => {
    ElMessage.success('保存成功！');
    back();
  });
}

onMounted(() => {
  queryInfo(props.id);
  title.value = route.meta?.label || '详情';
});
</script>
