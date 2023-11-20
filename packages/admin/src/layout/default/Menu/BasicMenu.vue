<template>
  <el-menu
    :class="true ? 'has-active-bar' : ''"
    :default-openeds="openeds"
    :default-active="route.name"
    :collapse="isCollapse"
    :unique-opened="false"
    v-bind="$attrs">
    <slot> </slot>

    <template v-for="(item, i) in items" :key="i">
      <!-- 一级菜单 -->
      <el-menu-item v-if="!item.hide && !item.children?.length" :index="item.menuCode" @click="go(item)">
        <i v-if="$attrs.mode != 'horizontal'" class="mr-1" :class="item.icon"></i>
        <template #title>
          <span>{{ item.label }}</span>
        </template>
      </el-menu-item>
      <!-- 二级菜单 -->
      <BasicSubMenu v-if="!item.hide && item.children?.length" :item="item"></BasicSubMenu>
    </template>

    <slot name="suffix"></slot>
  </el-menu>
</template>

<script setup lang="ts">
import BasicSubMenu from './BasicSubMenu.vue';

import { basicProps } from './props';
const props = defineProps(basicProps);
const openeds = computed(() => props.items?.map((item) => item?.menuCode));
const route = useRoute();
const appName = import.meta.env.VITE_GLOB_APP_TITLE;
//
import { useMenuStore } from '@/store/menuStore';
const menuStore = useMenuStore();
const { go } = menuStore;
</script>

<style lang="scss">
.aside-menu {
  // 侧边菜单选中条
  .has-active-bar.el-menu--collapse .el-sub-menu.is-active,
  .has-active-bar.el-menu--vertical .el-menu-item.is-active {
    border-left: 2px solid getCssVar('menu', 'active-color');
  }

  .el-menu--vertical .el-menu-item.is-active,
  .el-menu--collapse .el-sub-menu.is-active,
  .el-sub-menu__title:hover,
  .el-menu-item:hover {
    background-color: getCssVar('menu', 'hover-bg-color');
    color: getCssVar('menu', 'hover-text-color');
  }
  .el-menu--collapse .el-sub-menu .el-sub-menu__title {
    padding-right: 0;
  }
}

.dark-menu {
  --el-menu-bg-color: #263040;
  --el-bg-color-overlay: rgb(103, 110, 121);
  --el-menu-hover-bg-color: rgb(103, 110, 121);
  --el-menu-text-color: #fff;
  --el-menu-hover-text-color: #fff;
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-border-color: rgb(103, 110, 121);
}
</style>
