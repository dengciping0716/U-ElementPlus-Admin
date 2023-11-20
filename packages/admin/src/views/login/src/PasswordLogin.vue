<template>
  <!-- 密码登录 -->
  <el-form ref="formLogin" :model="formVal" @keyup.native.enter="login()" :rules="formRules" label-width="0" label-position="top">
    <el-form-item label="" prop="username">
      <el-input v-focus ref="inputUserName" placeholder="请输入手机号" v-model="formVal.username"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input v-model="formVal.password" placeholder="请输入密码" show-password></el-input>
    </el-form-item>
    <el-form-item label="" v-if="isverify">
      <div class="w-full flex items-center">
        <el-input class="flex-1" v-model.trim="formVal.verifyCode" placeholder="验证码" maxlength="4"></el-input>
        <div class="cursor-pointer" style="width: 82px; height: 32px" @click.stop="getVerifyCode">
          <el-image class="w-full h-full" :src="checkImg"></el-image>
        </div>
      </div>
    </el-form-item>
    <el-link style="float: right; margin-bottom: 10px" :underline="false" type="primary">
      <router-link to="/forgetPassword">忘记密码？</router-link>
    </el-link>
    <el-button type="primary" class="w-full" v-loading="loading" @click="login()">登录</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

import { useLoginWithPassword } from './useLogin';
const { formVal, isverify, checkImg, getVerifyCode, requestLogin, loading } = useLoginWithPassword();

const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    // { pattern: 'admin', message: '用户名不正确' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // { pattern: 'admin', message: '密码不正确' }
  ],
});

const formLogin = ref<FormInstance>();

const login = function () {
  formLogin.value?.validate((b: any) => {
    if (!b) return;
    if (unref(isverify) && !formVal.verifyCode) {
      ElMessage.error('请输入验证码');
      return;
    }
    requestLogin();
  });
};

onMounted(() => getVerifyCode());
</script>
