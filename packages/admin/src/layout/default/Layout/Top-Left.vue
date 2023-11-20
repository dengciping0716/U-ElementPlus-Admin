<template>
  <el-container direction="vertical">
    <LayoutHeader
      class="sticky top-0 z-11"
      :style="LIGHT_MENU_STYLE"
      :show-menu-trigger="designStore.menuTrigger == TriggerEnum.HEADER"
      :show-logo="true"
      menuMode="1" />
    <el-container>
      <el-aside
        :width="designStore.isCollapse ? '65px' : '180px'"
        style="height: calc(100vh - var(--el-menu-item-height)); top: var(--el-menu-item-height)"
        class="transform transition-duration-300 sticky left-0 z-10">
        <LayoutSide
          class="w-full h-full transform transition-duration-300"
          :style="designStore.menuStyle"
          :show-menu-trigger="designStore.menuTrigger == TriggerEnum.FOOTER"
          :show-logo="false" />
      </el-aside>
      <el-container direction="vertical">
        <LayoutContent></LayoutContent>
        <LayoutFooter> </LayoutFooter>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { LayoutContent } from '../LayoutContent';
import { LayoutFooter } from '../LayoutFooter';
import { LayoutHeader } from '../LayoutHeader';
import { LayoutSide } from '../LayoutSide';
import { TriggerEnum } from '@/layout/enum';
import { useDesignStore, LIGHT_MENU_STYLE } from '@/store/designStore';
const designStore = useDesignStore();
</script>
