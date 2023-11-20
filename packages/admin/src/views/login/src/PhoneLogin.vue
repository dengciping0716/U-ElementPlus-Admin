<template>
  <el-form
    ref="formLogin"
    class="form__login"
    :model="formVal"
    :rules="formRules"
    @keyup.native.enter="handlerLogin()"
    label-width="0"
    label-position="left">
    <el-form-item prop="telephone">
      <el-input v-focus placeholder="请输入手机号" v-model="formVal.telephone"></el-input>
    </el-form-item>
    <el-form-item prop="telVerifyCode">
      <el-input v-model="formVal.telVerifyCode" maxlength="4" placeholder="请输入验证码">
        <template #suffix>
          <el-link :disabled="isGetMessageCode" :underline="false" style="line-height: 32px; padding-right: 10px" @click="getVerifyCode">{{
            getMessageLabel
          }}</el-link>
        </template>
      </el-input>
    </el-form-item>
    <el-button type="primary" class="w-full" :loading="loading" @click="handlerLogin()">登录</el-button>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { phoneValid } from '@common/utils/reg';

import { useLoginWithPhone } from './useLogin';
const { getMessageLabel, isGetMessageCode, formVal, sendVerifyCode, requestLogin, loading } = useLoginWithPhone();

const formRules = reactive<FormRules>({
  telephone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: phoneValid, message: '请输入正确的手机号码', trigger: 'blur' },
    // { pattern: 'admin', message: '用户名不正确' }
  ],
  telVerifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    // { pattern: 'admin', message: '密码不正确' }
  ],
});

const formLogin = ref<FormInstance>();
/**
 * 获取验证码
 */
const getVerifyCode = async function () {
  formLogin.value?.validateField('telephone', (isValid: boolean) => {
    if (!isValid) return;
    if (unref(isGetMessageCode)) return;
    isGetMessageCode.value = true;
    sendVerifyCode();
  });
};

const handlerLogin = function () {
  formLogin.value?.validate((b: any) => {
    if (!b) return;
    let { telephone, telVerifyCode } = formVal;

    const params = {
      account: telephone,
      telVerifyCode: telVerifyCode,
      isPassWord: '0',
      type: 'PC',
    };
    requestLogin(params);
  });
};
</script>
