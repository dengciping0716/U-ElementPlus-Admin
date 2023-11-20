<template>
  <m-card shadow="never" class="mb-2">
    <template #header>
      <div class="flex justify-between items-center">
        <span>{{ systemName }}</span>
        <el-checkbox v-model="checkAll" size="small" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
    </template>
    <el-checkbox-group v-model="checked" @change="handleCheckedCitiesChange">
      <!--  -->
      <el-descriptions :column="1" border>
        <template v-for="menu in menuList" :key="menu.menuId">
          <el-descriptions-item label-align="left" :label="menu.fullName">
            <!--  -->
            <template v-for="perm in menu.permList" :key="perm.menuId">
              <el-checkbox :label="perm.menuId">{{ perm.menuName }}</el-checkbox>
            </template>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </el-checkbox-group>
  </m-card>
</template>

<script setup lang="ts">
import { pick } from 'lodash';
const emit = defineEmits(['update:modelValue']);
const props = defineProps<{ system: any; modelValue?: string[] | null }>();
const systemName = computed(() => props.system?.systemName);

const menuList = computed(() => {
  let menus = props.system?.listMenu?.reduce((res: any[], menu: any) => res.concat(createMenu(menu)), []);
  return menus;
});

const allPerm = computed(() => {
  return menuList.value?.reduce((res: any, menu: any) => {
    let perms = menu.permList?.map((row: any) => row.menuId);
    if (perms) {
      return res.concat(perms);
    } else {
      return res;
    }
  }, [] as string[]);
});

function createMenu(menu: any, parent: string[] = []) {
  if (menu.menuType == '1') {
    return menu;
  }
  let list: any[] = [];
  if (menu.listMenu?.length) {
    menu.permList = [];
    menu.listMenu.forEach((row: any) => {
      let res = createMenu(row, [...parent, menu.menuName]);
      if (Array.isArray(res)) {
        list = list.concat(res);
      } else {
        menu.permList.push(res);
      }
    });
  }

  menu.fullName = [...parent, menu.menuName].join(' / ');
  let target = pick(menu, ['menuCode', 'menuId', 'menuName', 'fullName', 'menuType', 'permList']);
  list.unshift(target);

  return list;
}

const checked = ref<string[]>([]);
watchEffect(() => {
  checked.value = Array.from(props?.modelValue || []);
});

const checkAll = ref(false);
const isIndeterminate = ref(false);

const handleCheckAllChange = (val: boolean) => {
  checked.value = val ? unref(allPerm) : [];
  isIndeterminate.value = false;
  emit('update:modelValue', unref(checked));
};

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === allPerm.value?.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < allPerm.value?.length;
  emit('update:modelValue', unref(checked));
};
</script>
