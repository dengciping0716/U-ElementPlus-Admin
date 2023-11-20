<template>
  <div class="page-login relative">
    <div class="h-screen flex text-center min-w[960px] ma">
      <div class="flex-1 relative">
        <div class="flex justify-center items-center w-full h-full">
          <el-carousel height="350px" class="w-full">
            <el-carousel-item>
              <img src="~@/assets/images/login/banner-5.svg" alt="" style="width: 350px" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="~@/assets/images/login/banner-5.svg" alt="" style="width: 350px" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="~@/assets/images/login/banner-5.svg" alt="" style="width: 350px" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="~@/assets/images/login/banner-5.svg" alt="" style="width: 350px" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="~@/assets/images/login/banner-5.svg" alt="" style="width: 350px" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- <el-image src="~@/assets/images/login/banner-1.svg" alt="" fit="cover" class="top-0 w-full h-full" /> -->
      </div>
      <div class="flex-1 flex flex-col items-center justify-center relative">
        <div class="text-8 font-bold mb-4">欢迎使用{{ appName }}</div>
        <div>
          <div class="w-100 z-1 bg-white pt-2 pb-4 px-4 rounded min-h-1/2">
            <el-tabs v-model="loginType" class="">
              <PasswordLogin v-if="loginType == 'password'" class="w-full" />
              <PhoneLogin v-if="loginType == 'phone'" class="w-full" />
            </el-tabs>
            <div class="mt-2 flex">
              <el-button class="flex-1" size="small" v-if="loginType != 'phone'" @click="loginType = 'phone'"> 手机号登录 </el-button>
              <el-button class="flex-1" size="small" v-if="loginType != 'password'" @click="loginType = 'password'"> 密码登录 </el-button>
              <el-button class="flex-1" size="small" v-if="loginType != 'qrcode'" @click="loginType = 'qrcode'"> 扫码登录 </el-button>
              <el-button class="flex-1" size="small"> 注册 </el-button>
            </div>
          </div>
        </div>
        <div class="mt-10 text-xs text-gray">
          <p>
            Copyright &copy; 2023-至今
            <span class="mx-10">|</span>
            <a href="https://beian.miit.gov.cn/" target="_blank">黔ICP备2022003984号-2</a>
            <span class="mx-10">|</span>
            {{ faker.company.name() }}集团有限公司
          </p>
        </div>
      </div>

      <div class="absolute top-0 right-0">
        <a href="https://element-plus.org" target="_blank">
          <img class="h-11 p-1 m-2" src="https://element-plus.org/images/element-plus-logo.svg" />
        </a>
        <a href="https://cn.vitejs.dev/" target="_blank"> <img class="h-11 p-1 m-2" src="https://cn.vitejs.dev//logo.svg" /></a>
        <a href="https://unocss.dev/" target="_blank"> <img class="h-11 p-1 m-2" src="https://unocss.dev//logo.svg" /></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PhoneLogin from './src/PhoneLogin.vue';
import PasswordLogin from './src/PasswordLogin.vue';
const loginType = ref('password');
import banner from '@/assets/images/login/banner.jpg';
// let banner = faker.image.urlLoremFlickr({ category: 'business', width: 1024 });

import { faker } from '@faker-js/faker';
const appName = import.meta.env.VITE_GLOB_APP_TITLE;
</script>

<style lang="scss">
.page-login {
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/login/wave.svg');
    background-repeat: no-repeat;
    background-position: 100%;
    background-size: 100% 100%;
  }
}
</style>
