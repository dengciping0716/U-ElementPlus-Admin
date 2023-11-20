<template>
  <div class="__page m-edit-page" v-loading="loading">
    <m-page-header :title="title" @back="back()">
      <template #extra>
        <el-button type="primary" @click="handlerSubmit" class="ml-2">确认</el-button>
      </template>
    </m-page-header>

    <div class="m-edit-content ma mt-4 max-w-[1080px]">
      <m-card header="基本信息" shadow="hover">
        <el-form label-position="right" inline ref="formRef" :model="model" :rules="rules" label-width="100px">
          <el-form-item label="手机号码" prop="telephone" class="w-1/3">
            <el-input v-model.trim="model.telephone" placeholder="请输入" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="用户编码" prop="empCode" class="w-1/3">
            <el-input v-model.trim="model.empCode" placeholder="请输入用户编码" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="empName" class="w-1/3">
            <el-input v-model.trim="model.empName" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="cardNum" class="w-1/3">
            <el-input v-model.trim="model.cardNum" placeholder="请输入身份证" :maxlength="18"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" class="w-1/3">
            <m-radio
              v-model="model.sex"
              :options="[
                { label: '男', value: 1 },
                { label: '女', value: 0 },
              ]"></m-radio>
          </el-form-item>

          <!-- <el-form-item label="账号" prop="empAccount">
              <el-input v-model.trim="model.empAccount" :maxlength="20"></el-input>
            </el-form-item> -->
          <!-- <el-form-item label="账号类型" prop="empType">
              <m-dict-select url="/user/dict/getDictInfoByAddOne" dictGrp="GRP_EMP_TYPE" :addOne="'1'" v-model="model.empType" />
            </el-form-item> -->
          <!-- <el-form-item label="有效期开始日期">
              <el-date-picker type="date" style="width:100%;" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="model.validStartDate" :clearable="true"> </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期结束日期">
              <el-date-picker type="date" style="width:100%;" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="model.validEndDate" :clearable="true"> </el-date-picker>
            </el-form-item> -->
          <el-form-item label="备注" class="w-full">
            <el-input type="textarea" :rows="3" v-model="model.remark" placeholder="请输入" :maxlength="200"></el-input>
          </el-form-item>
          <!-- <el-form-item label="附件" >
            <m-upload-file-list :limit="1" v-model="listFile" />
          </el-form-item> -->
          <!-- <el-form-item label="身份证">
              <el-input v-model.trim="model.cardNum" placeholder="请输入身份证" :maxlength=18></el-input>
            </el-form-item>
            <el-form-item label="入职日期">
              <el-date-picker type="date" style="width:100%;" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="model.hireDate" :clearable="true">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="离职日期">
              <el-date-picker type="date" style="width:100%;" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="model.leaveDate" :clearable="true">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="婚配" class="form-item-radio col-8">
              <el-radio-group v-model="model.married">
                <el-radio :label="1+''">已婚</el-radio>
                <el-radio :label="2+''">未婚</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="政治面貌">
              <m-dict-select url="/user/dict/getDictListInfo" dictGrp="GRP_OUTLOOK" v-model="model.political" />
            </el-form-item>
            <el-form-item label="文化程度">
              <m-dict-select url="/user/dict/getDictListInfo" dictGrp="GRP_CULTURE" v-model="model.culture" />
            </el-form-item>
            <el-form-item label="办公电话">
              <el-input v-model.trim="model.officePhone" placeholder="请输入" :maxlength=13></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input v-model.trim="model.email" placeholder="请输入" :maxlength=50></el-input>
            </el-form-item>
            <el-form-item label="通信地址" >
              <el-input type="textarea" :rows="3" v-model="model.postalAddress" placeholder="请输入" :maxlength=200></el-input>
            </el-form-item> -->
        </el-form>
      </m-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mPageHeader } from '@common/core';
import { FormInstance, ElMessage } from 'element-plus';
import { formModel, FormModel, rules } from './editPage';
import { useUserApi } from './useUserApi';
import { useTabsStore } from '@common/core';
//
import { usePageContext } from '@/hooks/usePageContext';
const { back } = usePageContext();
//

const props = defineProps<{ id: string }>();
const title = ref('新增');
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
  if (props.id) {
    title.value = '编辑';
    queryInfo(props.id);
    useTabsStore().updateTab({ label: '编辑用户' });
  } else {
    useTabsStore().updateTab({ label: '新增用户' });
    getNextCode('');
  }
});
</script>
