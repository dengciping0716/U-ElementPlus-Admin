<template>
  <div :class="['layout-breadcrumb']">
    <el-breadcrumb>
      <template v-for="(route, i) in routes">
        <el-breadcrumb-item :to="route.redirect || i == routes.length - 1 ? undefined : route.path">
          <i v-if="route.meta?.icon" :class="['text-3 mr-1', route.meta?.icon]"></i>
          <span>{{ route.meta.label }}</span>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import type { RouteLocationMatched } from 'vue-router';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menuStore';

const routes = ref<RouteLocationMatched[]>([]);
const { currentRoute } = useRouter();

const menuStore = useMenuStore();

watchEffect(async () => {
  routes.value = currentRoute.value.matched.filter((row) => {
    if (row.name == 'HOME') return true;
    if (!row.redirect) return true;
    if (menuStore.menuList.some((menu) => menu.menuCode == row.name)) return true;
    return false;
  });
});
</script>
