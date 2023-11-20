<template>
  <el-button v-if="slotTag == 'button'" type="primary" v-bind="$attrs" @click.stop="handleFocus"> <slot> 选择 </slot> </el-button>
  <el-input v-else :disabled="readonly" v-bind="$attrs" v-model="innerLabel" :readonly="true" @clear="clear">
    <template #append v-if="!readonly">
      <span style="cursor: pointer" @click.stop="handleFocus"> <slot> 选择 </slot> </span>
    </template>
  </el-input>
</template>

<!--  -->
<script setup>
defineOptions({
  name: 'm-dialog-input',
});

const { proxy } = getCurrentInstance();
const props = defineProps({
  modelValue: [Object, String, Array, null],
  label: String,
  multiple: Boolean,
  readonly: Boolean,
  slotTag: String,
  loadDialog: Function,
});

const emit = defineEmits(['update:modelValue', 'update:label', 'change']);

const selectedData = ref([]);
const innerValue = ref([]);
const innerLabel = ref('');

watchEffect(() => {
  innerLabel.value = props.label;
});

/** 显示弹窗 */
async function handleFocus() {
  let { component, dialogParams, dialogProps, props: KeyProps } = props.loadDialog();

  if (!component) {
    $message('未设置弹窗组件');
    return;
  }
  //
  const [err, res] = await proxy
    .$dialog({
      component: component,
      props: { ...dialogProps, selectedData: selectedData.value, multiple: props.multiple },
      params: Object.assign({}, dialogParams),
    })
    .then((res) => [null, res])
    .catch((err) => [err]);

  if (err) return;
  //
  let valueKey = KeyProps?.value || 'value';
  let labelKey = KeyProps?.label || 'label';

  if (res instanceof Array) {
    innerValue.value = res.map((item) => item[valueKey]);
    innerLabel.value = res.map((item) => item[labelKey]).join(',');
  } else {
    innerValue.value = res[valueKey];
    innerLabel.value = res[labelKey];
  }
  selectedData.value = res;
  emit('update:modelValue', innerValue.value);
  emit('update:label', innerLabel.value);
  emit('change', res);
}

function clear() {
  selectedData.value = [];
  innerLabel.value = '';
  innerValue.value = '';
  emit('update:modelValue', null);
  emit('update:label', '');
  emit('change', null);
}
</script>
