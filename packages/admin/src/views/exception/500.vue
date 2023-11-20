<template>
  <div class="flex flex-col items-center w-full py-[80px]">
    <div class="text-center">
      <img src="~@/assets/images/exception/500.svg" alt="" style="width: 350px" />
    </div>
    <div class="text-center">
      <h1 class="text-base text-gray-500 py-4">抱歉，服务器出错了</h1>
    </div>
    <el-link type="primary" @click="goHome">回到首页</el-link>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
function goHome() {
  router.replace({ name: 'HOME' });
}
</script>
