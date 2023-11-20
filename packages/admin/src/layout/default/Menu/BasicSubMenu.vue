<template>
  <el-sub-menu v-if="!item.hide && item.children?.length" popper-class="dark-menu" :index="item.label">
    <template #title>
      <i class="mr-1" :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </template>

    <template v-for="(second, ii) in item.children" :key="ii">
      <template v-if="!second.hide && !second.children?.length">
        <el-menu-item :index="second.menuCode" @click="go(second)">
          <i class="mr-1" :class="second.icon" v-if="second.icon"></i>
          <template #title>
            <span>{{ second.label }} </span>
          </template>
        </el-menu-item>
      </template>

      <!-- 子菜单 -->
      <BasicSubMenu v-if="!second.hide && second.children?.length" :item="second"></BasicSubMenu>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { itemProps } from './props';
defineOptions({
  name: 'BasicSubMenu',
});
const props = defineProps(itemProps);
//
import { useMenuStore } from '@/store/menuStore';
const menuStore = useMenuStore();
const { go } = menuStore;
</script>
