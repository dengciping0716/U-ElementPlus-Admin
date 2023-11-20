<template>
  <el-container direction="vertical">
    <LayoutHeader class="sticky top-0 z-10" :style="LIGHT_MENU_STYLE" :show-logo="true" />
    <LayoutContent></LayoutContent>
    <LayoutFooter> </LayoutFooter>
  </el-container>
</template>

<script lang="ts" setup>
import { LayoutContent } from '../LayoutContent';
import { LayoutFooter } from '../LayoutFooter';
import { LayoutHeader } from '../LayoutHeader';
import { LIGHT_MENU_STYLE } from '@/store/designStore';
</script>
