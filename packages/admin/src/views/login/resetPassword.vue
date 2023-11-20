<template>
  <el-dialog v-model="visible" width="480px" title="修改密码" :closeOnClickModal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" v-loading="loading" v-if="visible">
      <el-form-item label="原密码" prop="passwordAgo">
        <el-input v-model.trim="form.passwordAgo" autocomplete="off" show-password :maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="passwordNew">
        <el-input v-model.trim="form.passwordNew" autocomplete="off" placeholder="" show-password :maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="确认" prop="password_two">
        <el-input v-model.trim="form.password_two" autocomplete="off" placeholder="" show-password :maxlength="16"></el-input>
      </el-form-item>
      <div class="flex justify-center">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handlerSubmit">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus';

defineOptions({
  name: 'mResetPassword',
});
const form = ref({
  passwordAgo: '',
  passwordNew: '',
  password_two: '',
});
const formRef = ref<FormInstance>();
const rules = {
  passwordAgo: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  passwordNew: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: passwordLength, message: '密码长度为8-16位字符，必须包含大小写字母，数字，特殊字符', trigger: 'blur' },
  ],
  password_two: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: passwordValidate, message: '两次输入结果不一致', trigger: 'blur' },
    { validator: passwordValidate2, message: '新密码和原密码不能相同', trigger: 'blur' },
  ],
};
function passwordLength(rule: any, val: any, callback: any) {
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9]).{8,16}$/;
  if (reg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
}
function passwordValidate(rule: any, val: any, callback: any) {
  if (val === form.value.passwordNew) {
    callback();
  } else {
    callback(new Error(''));
  }
}
function passwordValidate2(rule: any, val: any, callback: any) {
  if (val !== form.value.passwordAgo) {
    callback();
  } else {
    callback(new Error(''));
  }
}
const visible = ref(false);
const loading = ref(false);
/** 提交 */
async function handlerSubmit() {
  const valid = await formRef.value!.validate().catch((e) => false);
  if (!valid) return;

  loading.value = true;
  console.log(form);
  let params = {
    passwordAgo: form.value.passwordAgo,
    newPassword: form.value.passwordNew,
    confirmPassword: form.value.passwordNew,
  };
  $http
    .post(resolveUrl('/user/emp/updatePassword'), params)
    .then((data) => {
      ElNotification.success(`密码修改成功！`);
      visible.value = false;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
}
function show() {
  visible.value = true;
  form.value = {
    passwordAgo: '',
    passwordNew: '',
    password_two: '',
  };
}

defineExpose({ show });
</script>
