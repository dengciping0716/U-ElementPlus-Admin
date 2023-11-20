<template>
  <div class="w-screen h-screen"></div>  
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';
// 重新加载前路径页面
onMounted(() => {
  useRouter().go(-1)
})
</script>
 
