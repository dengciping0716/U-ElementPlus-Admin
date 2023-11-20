<template>
  <el-container>
    <el-aside style="overflow: visible" :width="asideWidth" class="h-screen sticky top-0 z-11 ransform transition-duration-300">
      <LayoutSide
        class="w-full h-screen"
        :style="designStore.menuStyle"
        :show-menu-trigger="designStore.menuTrigger == TriggerEnum.FOOTER"
        :show-logo="true" />
    </el-aside>

    <el-container direction="vertical">
      <LayoutHeader
        class="sticky top-0 z-10"
        :style="LIGHT_MENU_STYLE"
        :show-menu-trigger="designStore.menuTrigger == TriggerEnum.HEADER"
        :show-logo="false"
        menuMode="1" />
      <LayoutContent></LayoutContent>
      <LayoutFooter> </LayoutFooter>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { LayoutContent } from '../LayoutContent';
import { LayoutFooter } from '../LayoutFooter';
import { LayoutHeader } from '../LayoutHeader';
import { LayoutSide } from '../LayoutSide';
import { MenuTypeEnum, TriggerEnum } from '@/layout/enum';
import { useDesignStore, LIGHT_MENU_STYLE } from '@/store/designStore';
const designStore = useDesignStore();

const asideWidth = computed(() => {
  if (designStore.menuType == MenuTypeEnum.MIX_SIDEBAR) {
    return designStore.isCollapse ? '48px' : '80px';
  } else {
    return designStore.isCollapse ? '65px' : '180px';
  }
});
</script>
