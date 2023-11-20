<template>
  <div class="m-page m-page-split" wrap>
    <m-collapse-wrap class="h-full">
      <m-card class="xl:w-150 sm:w-100 h-full" shadow="hover">
        <OrganizationView @change="organizeObj = $event"></OrganizationView>
      </m-card>
    </m-collapse-wrap>
    <!-- <m-card v-if="!!organizeId" class="flex-2" shadow="hover">
      <template #header>
        <span class="mr-2">岗位</span>
        <el-tag type="">{{ organizeObj?.organizeName }}</el-tag>
      </template>
    </m-card> -->

    <div v-if="!!organizeId" class="flex-1 min-w-0">
      <RoleTable v-bind="organizeObj"></RoleTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoleTable, OrganizationView } from '..';
const organizeObj = ref<{ organizeName: string; organizeId: string }>();
const organizeId = computed(() => organizeObj.value?.organizeId);
</script>
