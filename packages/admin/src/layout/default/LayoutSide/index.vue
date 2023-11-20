<template>
  <div
    class="aside-menu flex flex-col relative pt-2"
    :class="showMenuTrigger ? 'pb-12' : ''"
    style="background-color: var(--el-menu-bg-color)">
    <!-- 平台名称 -->
    <div v-if="showLogo" class="mb-2">
      <span>
        <img src="https://element-plus.org/images/element-plus-logo.svg" class="h-12 p-2 w-50" />
        <!-- style="transform: translateY(-60px); filter: drop-shadow(#fff 0 60px)"  -->
      </span>
      <!-- <span class="text-lg font-bold" style="color: var(--ok-menu-text-color)">{{ appName }}</span> -->
    </div>
    <!-- <div class="flex items-center justify-center text-white" style="height: calc(var(--ok-menu-item-height) + 2px)">
          <span>
            <img src="@/assets/logo.png" class="h-6" />
          </span>
          <span v-if="!isCollapse" class="text-lg font-bold">{{ appName }}</span>
        </div> -->
    <!-- 菜单名称 -->
    <div v-if="isSplitMenu" class="font-bold text-base m-2" :class="isCollapse ? 'ml-2' : 'ml-5'" style="color: var(--el-menu-text-color)">
      {{ rootLabel }}
    </div>

    <div v-if="showMenuTrigger" class="absolute bottom-0 w-full z-1">
      <el-menu class="important-b-0">
        <el-menu-item text @click="designStore.toggleCollapse()" class="justify-center">
          <i
            style="color: var(--el-menu-text-color)"
            class="i-ep-d-arrow-left transform transition-property-transform transition-duration-300"
            :class="designStore.isCollapse ? 'rotate-180' : ''">
          </i>
        </el-menu-item>
      </el-menu>
    </div>
    <!--  -->
    <el-scrollbar class="flex-1 min-h-0" height="100%">
      <MenuComp class="w-full important-b-0" :items="menuList" :isCollapse="isCollapse"> </MenuComp>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/store/menuStore';
import { useDesignStore } from '@/store/designStore';
import { storeToRefs } from 'pinia';
import { MenuTypeEnum, TriggerEnum } from '@/layout/enum';
const appName = import.meta.env.VITE_GLOB_APP_TITLE;

const props = defineProps<{
  showLogo?: boolean;
  showMenuTrigger?: boolean;
  menuMode?: string;
}>();

const menuStore = useMenuStore();
const menuList = computed(() => (isSplitMenu.value ? menuStore.subMenu?.children : menuStore.menuList) || []);
const rootLabel = computed(() => menuStore.subMenu?.label || '');

const designStore = useDesignStore();
const { isCollapse, isSplitMenu } = storeToRefs(designStore);

import { BasicMenu, MixAsideMenu } from '../Menu';
const MenuComp = computed(() => (designStore.menuType == MenuTypeEnum.MIX_SIDEBAR ? MixAsideMenu : BasicMenu));
</script>
