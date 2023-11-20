/**
 *
 */
import { ElDatePicker } from 'element-plus';
import 'element-plus/theme-chalk/src/date-picker.scss';

// 函数式组件
export function FilterRender(props, { slots, emit, attrs }) {
  // console.log('FilterRender:', props, attrs);
  if (props.slotTag == 'input') {
    attrs.onClear = attrs.onConfirm; //转换clear事件到confirm处理
    attrs.onChange = attrs.onConfirm; //转换clear事件到confirm处理
    return (
      <span class="flex flex-nowrap ">
        <m-input {...attrs}></m-input>
      </span>
    );
  }

  if (props.slotTag == 'select' || props.slotTag == 'dict') {
    attrs.onChange = attrs.onConfirm; //转换clear事件到confirm处理
    attrs.onClear = attrs.onConfirm; //转换clear事件到confirm处理
    return <m-select {...attrs}></m-select>;
  }

  if (props.slotTag == 'datePicker') {
    attrs.onChange = attrs.onConfirm; //转换clear事件到confirm处理
    attrs.onClear = attrs.onConfirm; //转换clear事件到confirm处理
    return <ElDatePicker {...attrs}></ElDatePicker>;
  }

  return null;
}

FilterRender.props = ['slotTag'];
