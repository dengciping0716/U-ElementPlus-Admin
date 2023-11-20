<template>
  <el-menu
    :class="true ? 'has-active-bar' : ''"
    :default-active="menuStore.currentSys"
    :collapse="isCollapse"
    style="--el-menu-base-level-padding: 12px; --el-menu-item-height: 60px"
    v-bind="$attrs">
    <slot> </slot>

    <template v-for="(item, i) in items" :key="i">
      <!-- 一级菜单 -->
      <el-menu-item :index="item.menuCode" @click="go(item)" @mouseenter="showSubMenu(item)" @mouseleave="toggleSubMenu(false)">
        <div class="w-full flex justify-center items-center flex-col">
          <i class="text-4" :class="item.icon"></i>
          <span class="text-xs mt-1 font-600" v-if="!isCollapse && item.menuCode == menuStore.currentSys">{{ item.label }}</span>
          <span class="text-xs mt-1" v-else-if="!isCollapse">{{ item.label }}</span>
        </div>
      </el-menu-item>
    </template>
    <slot name="suffix"> </slot>
  </el-menu>
  <div
    v-show="isShowSubMenu"
    class="fixed top-0 z-2001"
    :style="isCollapse ? ' left:48px;' : ' left:80px;'"
    @mouseover="toggleSubMenu(true)"
    @mouseout="toggleSubMenu(false)">
    <BasicMenu class="w-40 h-screen py-2 flex-col" :items="subMenu?.children" :default-active="route.name">
      <div class="text-lg font-bold m-2 mb-5" style="color: var(--el-menu-text-color)">{{ subMenu?.label }}</div>
    </BasicMenu>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from '@/layout/types';
import { BasicMenu } from '../Menu';
import { basicProps } from './props';
import { debounce } from 'lodash';
const props = defineProps(basicProps);
const appName = import.meta.env.VITE_GLOB_APP_TITLE;
const route = useRoute();

import { useMenuStore } from '@/store/menuStore';
const menuStore = useMenuStore();
const { go } = menuStore;

const isShowSubMenu = ref(false);
const subMenu = ref<Menu>();
function showSubMenu(menu: Menu) {
  if (menu.children?.length) {
    toggleSubMenu(true);
    subMenu.value = menu;
  } else {
    toggleSubMenu(false);
  }
}

const toggleSubMenu = debounce((bool) => (isShowSubMenu.value = bool), 300);
</script>
