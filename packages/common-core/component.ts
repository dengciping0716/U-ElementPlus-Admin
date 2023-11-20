import { BasicTable } from './components/Table';
import { mSelect } from './components/Select';
import { mSelectTable } from './components/SelectTable';
import { mCascader } from './components/Cascader';
import { mInput } from './components/Input';
import { mDialogInput } from './components/DialogInput';
import { mConfigProvider } from './components/ConfigProvider';
import { mCard } from './components/Card';
import { mCheckbox } from './components/Checkbox';
import { mCollapseWrap } from './components/CollapseWrap';
import { FilterRender } from './components/FilterRender';
import { mRadio } from './components/Radio';
import { mTabsView } from './components/TabsView';
import type { Plugin } from 'vue';

export default [
  BasicTable,
  mSelect,
  mSelectTable,
  mCascader,
  mInput,
  mDialogInput,
  BasicTable,
  mConfigProvider,
  mCard,
  mCheckbox,
  mCollapseWrap,
  FilterRender,
  mRadio,
  mTabsView,
] as Plugin[];
