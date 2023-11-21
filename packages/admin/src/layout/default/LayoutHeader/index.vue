<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useDesignStore } from '@/store/designStore';
import { useMenuStore } from '@/store/menuStore';
import { useUserStore } from '@/store/userStore';
import { RouterLink } from 'vue-router';

import Breadcrumb from '../Breadcrumb.vue';
import ResetPassword from '@/views/login/resetPassword.vue';
import SettingDrawer from '../setting/SettingDrawer.vue';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '@/layout/enum';
import { BasicMenu } from '../Menu';
import { omit } from 'lodash-es';

const props = defineProps<{
  showLogo?: boolean;
  showMenuTrigger?: boolean;
  menuMode?: string;
}>();

const appName = import.meta.env.VITE_GLOB_APP_TITLE;

const store = useDesignStore();
const { toggleDark, toggleCollapse } = store;

const menuStore = useMenuStore();
const userStore = useUserStore();

const menuList = computed(() => {
  if (store.menuMode == MenuModeEnum.HORIZONTAL) {
    return menuStore.menuList;
  }

  if (store.isSplitMenu) {
    return menuStore.menuList?.map((item) => omit(item, 'children'));
  }
});
const { isLogin, userName, avatar } = storeToRefs(userStore);

const router = useRouter();
function toLogout() {
  userStore.logout().then(() => router.replace({ name: 'Login' }));
}

const ResetPasswordRef = ref<any>();

const showSetting = ref(false);
</script>

<template>
  <div class="flex flex-nowrap top-menu" style="background-color: var(--el-menu-bg-color)" v-bind="$attrs">
    <!--  -->
    <div class="flex-1 min-w-0">
      <BasicMenu :items="menuList" class="w-full" mode="horizontal" :ellipsis="true" :default-active="menuStore.currentSys">
        <!-- 平台名称 -->
        <div style="height: var(--el-menu-item-height)">
          <span v-if="showLogo">
            <img src="https://element-plus.org/images/element-plus-logo.svg" class="h-12 p-2 w-50" />
            <!-- style="transform: translateY(-60px); filter: drop-shadow(#fff 0 60px)"  -->
          </span>
          <!-- <span class="text-lg font-bold" style="color: var(--ok-menu-text-color)">{{ appName }}</span> -->
        </div>
        <!-- 收缩菜单 -->
        <el-menu-item v-if="showMenuTrigger" @click="toggleCollapse()">
          <i
            class="text-5 transform transition-property-transform transition-duration-300"
            :class="store.isCollapse ? 'rotate-180 i-ep-fold' : 'i-ep-fold'">
          </i>
          <!-- <el-icon><Fold /></el-icon> -->
        </el-menu-item>
        <Breadcrumb v-if="store.isShowBreadCrumb && !menuList" class="h-full px-4 flex items-center" />
      </BasicMenu>
    </div>

    <!--  -->
    <el-menu mode="horizontal" :ellipsis="false">
      <el-menu-item class="" @click="router.replace('/demo')"> <i class="inline-flex mr-2" i="ep-question-filled" />文档 </el-menu-item>

      <el-menu-item @click="toggleDark()">
        <i class="inline-flex" i="dark:ep-moon ep-sunny" />
      </el-menu-item>
      <!--  -->
      <el-menu-item v-if="!isLogin">
        <router-link to="/login">登录</router-link>
      </el-menu-item>
      <el-sub-menu v-else index="" popper-class="dark-menu">
        <template #title>
          <div class="flex items-center">
            <el-avatar :size="30" :src="avatar" class="user-photo">{{ userName }}</el-avatar>
            <span v-popover:user-pop class="mx-2">
              <span> {{ userName }} </span>
            </span>
          </div>
        </template>

        <el-menu-item class=""><i class="el-icon i-ep-user" />个人中心 </el-menu-item>
        <el-menu-item class="" @click="ResetPasswordRef.show()"><i class="el-icon i-ep-unlock" />修改密码 </el-menu-item>
        <el-divider class="important-my-2" />
        <el-menu-item class="" @click="toLogout()"><i class="el-icon i-carbon-exit" />退出登录 </el-menu-item>
      </el-sub-menu>
      <el-menu-item @click="showSetting = true">
        <i class="inline-flex text-4 i-ep-setting" />
      </el-menu-item>
    </el-menu>
  </div>
  <!--  -->
  <SettingDrawer v-model="showSetting" size="300px"></SettingDrawer>
  <!--  -->
  <ResetPassword ref="ResetPasswordRef"></ResetPassword>
</template>

<style lang="scss">
.top-menu {
  .el-menu--horizontal > .el-menu-item {
    border-bottom: none;
    border-top: 2px solid transparent;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-top: 2px solid getCssVar('menu', 'active-color');
  }
}
</style>
