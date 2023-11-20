<template>
  <el-page-header class="pt-4 px-2" style="background-color: var(--el-bg-color-overlay)" v-bind="$attrs">
    <template #breadcrumb v-if="showBreadcrumb && breadcrumbs?.length">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbs" :to="item.to"> {{ item.label }} </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <div class="flex items-center">
        <slot name="content">
          <span class="text-large font-600 mr-3"> {{ title }} </span>
          <span class="text-sm mr-2" style="color: var(--el-text-color-regular)"> {{ subTitle }} </span>
        </slot>
      </div>
    </template>
    <template #extra v-if="$slots.extra">
      <div class="flex items-center">
        <slot name="extra"></slot>
      </div>
    </template>

    <template v-if="$slots.default">
      <slot></slot>
    </template>
  </el-page-header>
</template>

<script lang="ts" setup>
// import { PageHeaderProps, pageHeaderEmits } from 'element-plus';
defineOptions({
  name: 'MPageHeader',
});

interface Props {
  title: string;
  subTitle?: string;
  showBreadcrumb?: boolean; //是否显示面包屑
  breadcrumb?: { label: string; to: any }[]; // 自定义面包屑，否则根据路由生成
}
const props = defineProps<Props>();

const route = useRoute();
const breadcrumbs = computed(() => {
  if (props.breadcrumb?.length) return props.breadcrumb;
  const result: { label: string; to: any }[] = [];
  route.matched.forEach((element) => {
    if (element.meta.label) {
      result.push({ label: element.meta.label, to: element });
    }
  });

  return result;
});
</script>
