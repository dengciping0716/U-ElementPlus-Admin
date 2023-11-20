import { mDialogInput } from '@common/core';
import { h, mergeProps } from 'vue';
import SelectUserByOrg from './SelectUserByOrg.vue';
/**
 * dialoginput 组件的属性值
 * @param {*} dialogProps
 * @param {*} dialogParams
 * @returns
 */
const dialogInputAttrs = (dialogProps = {}, dialogParams = {}) => ({
  props: { label: 'empName', value: 'empId' },
  dialogProps: dialogProps,
  dialogParams: { ...dialogParams },
  component: SelectUserByOrg,
});

// 函数组件
export default (props: any, { slots, emit, attrs }: any) => {
  return h(mDialogInput, mergeProps({ loadDialog: dialogInputAttrs }, attrs), slots);
};
