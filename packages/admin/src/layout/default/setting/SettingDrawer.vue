<template>
  <el-drawer v-bind="$attrs" append-to-body title="功能配置" direction="rtl">
    <div class="text-center -mt-5">
      <el-divider><span class="font-bold font-italic">主题色</span></el-divider>
      <el-color-picker v-model="store.appTheme" @change="setAppColor($event)" />
      <el-divider><span class="font-bold font-italic">暗夜模式</span></el-divider>
      <el-switch v-model="store.isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" style="--el-switch-on-color: #273352" />
      <!--  -->
      <el-divider><span class="font-bold font-italic">导航栏模式</span></el-divider>
      <TypePicker class="w-full mb-2" :def="store.menuType" :handler="handlerType"> </TypePicker>
      <div class="flex justify-between items-center mb-1">
        <span> 侧边栏颜色跟随主题 </span> <el-switch v-model="store.isPrimaryMenu" />
      </div>
      <!--  -->
      <el-divider><span class="font-bold font-italic">界面功能</span></el-divider>
      <div class="flex justify-between items-center mb-1">
        <span> 分割菜单 </span> <el-switch v-model="store.isSplitMenu" :disabled="MenuTypeEnum.MIX != store.menuType" />
      </div>
      <div class="flex justify-between items-center mb-1">
        <span> 菜单折叠按钮 </span>
        <el-select v-model="store.menuTrigger" class="w-20" size="small">
          <el-option v-for="item in menuTriggerOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="flex justify-between items-center mb-1"><span> 面包屑 </span> <el-switch v-model="store.isShowBreadCrumb" /></div>
      <div class="flex justify-between items-center mb-1"><span> 标签页 </span> <el-switch v-model="store.isShowMultipleTab" /></div>
      <div class="flex justify-between items-center mb-1"><span> 页脚 </span> <el-switch v-model="store.isShowFooter" /></div>
      <div class="flex justify-between items-center mb-1"><span> 灰色模式 </span> <el-switch v-model="store.isGrayMode" /></div>
      <div class="flex justify-between items-center mb-1"><span> 色弱模式 </span> <el-switch v-model="store.isColorWeak" /></div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import TypePicker from './components/TypePicker.vue';
import { useDesignStore } from '@/store/designStore';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { menuTriggerOptions, MenuTypeEnum } from '@/layout/enum';

const store = useDesignStore();
const { toggleDark, setAppColor, toggleCollapse } = store;

function handlerType({ type, mode }) {
  store.menuType = type;
  store.menuMode = mode;
  if (type != MenuTypeEnum.MIX) {
    store.isSplitMenu = false;
  }
}
</script>

<style scoped></style>
../../store/enum
