import { mSelectTableDialog, mDialogInput } from '@common/core';
import { h, mergeProps } from 'vue';

/**
 * 弹窗模块
 */

const defaultConfig = {
  title: '选择企业',
  width: '1080px', //可选， 默认1080};
  rowKey: 'tenantId',
  searchKeyAlias: 'tenantName', //可选，搜索输入框字段名称。默认是searchKey
  searchPlaceholder: '按名称搜索',
  tableColumns: [
    { prop: 'tenantCode', label: '企业编号', minWidth: '100' },
    { prop: 'tenantName', label: '企业全称', minWidth: '100' },
    { prop: 'name', label: '企业名称', minWidth: '100' },
    { prop: 'commissionRate', label: '基础佣金率', minWidth: '100' },
    { prop: 'legalPerson', label: '联系人', Width: '180' },
    { prop: 'phone', label: '联系电话', Width: '180' },
  ],
  tableColumnsSelected: [
    { prop: 'tenantName', label: '企业名称', minWidth: '100' },
    { prop: 'legalPerson', label: '联系人', Width: '180' },
    { prop: 'phone', label: '联系电话', Width: '180' },
  ],
};

const loadFunc = async function (p) {
  let url = p.type == 2 ? '/user/tenant/searchByType' : 'user/tenant/search';
  // type（1：处置单位；2：服务单位；3，竞买单位）
  return $http.post(resolveUrl(url), p).then((data) => data.result);
};

/** 选择弹窗的属性值 */
export const dialogAttrs = { ...defaultConfig, lazyLoad: loadFunc };

/**
 * dialoginput 组件的属性值
 * @param {*} dialogProps
 * @param {*} dialogParams
 * @returns
 */
export const dialogInputAttrs = (dialogProps = {}, dialogParams = {}) => ({
  props: { label: 'tenantName', value: 'tenantId' },
  dialogProps: mergeProps(dialogAttrs, dialogProps),
  dialogParams: { type: 1, organization: true, ...dialogParams },
  component: mSelectTableDialog,
});

// 函数组件
export const InputComp = (props, { slots, emit, attrs }) => {
  return h(mDialogInput, mergeProps({ loadDialog: dialogInputAttrs }, attrs), slots);
};


export const showDialog = function (dialogProps = {}, dialogParams = {}) {
  return $dialog({
    component: mSelectTableDialog,
    props:  mergeProps(dialogAttrs, dialogProps),
    params: Object.assign({}, dialogParams),
  })
    .then((res) => [null, res])
    .catch((err) => [err]);
};