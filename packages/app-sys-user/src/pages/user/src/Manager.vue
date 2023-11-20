<template>
  <div class="m-page m-page-split">
    <m-collapse-wrap class="h-full">
      <m-card header="组织机构" class="w-80 h-full flex-none" shadow="hover">
        <OrganizationView @change="organizeObj = $event" readonly></OrganizationView>
      </m-card>
    </m-collapse-wrap>
    <div class="flex-1 min-w-0 relative">
       <UserTable :organizeCode="organizeObj?.organizeCode" :organizeId="organizeObj?.organizeId"></UserTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrganizationView } from '..';
import UserTable from './UserTable.vue';
const organizeObj = ref<any>();
</script>
