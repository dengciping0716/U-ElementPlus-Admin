import { withInstall, withNoopInstall } from '../../utils';

import { FilterRender as RenderComp } from './src/Render.jsx';
export const FilterRender = withNoopInstall(RenderComp);
export default FilterRender;

import mPickerOptions from '@common/utils/datePickerOptions';

const defaultAttr = { size: 'default', clearable: true };
const multiple = { multiple: true, 'collapse-tags': true, 'collapse-tags-tooltip': true };

/** 构建输入型组件 */
export const buildInput = (key = 'input', attrs = {}) => {
  let props = { cacheKey: 'input-' + key };
  return { slotTag: 'input', placeholder: '', ...props, ...defaultAttr, ...attrs };
};
export const buildSelect = (attrs = {}) => {
  return { slotTag: 'select', placeholder: '全部', ...defaultAttr, ...attrs };
};

/** 构建数据字典组件 */
export const buildDict = (url = '', attrs = {}) => {
  let props = { value: 'dictCode', label: 'dictLnm', lazyLoad: () => $http.get(resolveUrl(url)).then((data: any) => data.result) };
  const dict = { remote: true, filterable: true, props };
  return { slotTag: 'select', placeholder: '全部', ...defaultAttr, ...dict, ...attrs };
};

/** 构建选择日期组件 */
export const buildDate = (attrs = {}) => ({
  slotTag: 'datePicker',
  type: 'date',
  'value-format': 'YYYY-MM-DD',
  ...defaultAttr,
  ...attrs,
});

/** 构建选择日期组件 */
export const buildDateRange = (attrs = {}) => ({
  slotTag: 'datePicker',
  type: 'daterange',
  'range-separator': '至',
  'start-placeholder': '开始日期',
  'end-placeholder': '结束日期',
  'value-format': 'YYYY-MM-DD',
  'unlink-panels': true,
  ...mPickerOptions,
  ...defaultAttr,
  ...attrs,
});
