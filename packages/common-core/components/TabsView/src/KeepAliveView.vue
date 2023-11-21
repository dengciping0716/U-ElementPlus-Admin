<template>
  <router-view>
    <template #default="{ Component, route }">
      <component ref="view" v-if="route.meta.noKeepAlive" :is="Component" :key="route.fullPath"></component>
      <keep-alive v-else :include="tabsViewStore.keys">
        <component ref="view" :is="wrap(route.fullPath, Component)" :key="route.fullPath"></component>
      </keep-alive>
    </template>
  </router-view>
</template>

<script setup>
import { ref, h } from 'vue';
import { useTabsStore } from './useTabsStore';
import { isFunction } from 'lodash-es';

const tabsViewStore = useTabsStore();

const view = ref(null);

const wrap = (fullPath, component) => {
  if (isFunction(component)) {
    component.name = fullPath;
  } else {
    component.type.__name = fullPath;
  }

  return component;
};

const route = useRoute();
onUnmounted(() => {
  tabsViewStore.closeOtherTabs(route);
});
</script>
