import * as echarts from 'echarts';
import { debounce } from 'lodash';
import { useEventListener } from '@vueuse/core';
import { debounceFilter } from '@vueuse/core';
import { Ref } from 'vue';
export { stackBarHorizontal } from './source/bar';
export { pie } from './source/pie';

export const defaultColors = ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16', '#e86452', '#6dc8ec', '#945fb9', '#ff9845', '#1e9493', '#ff99c3'];

export function useEchart(selector: Ref<HTMLDivElement>, opt = {}, colors?: string[]): Ref<echarts.EChartsType | undefined> {
  const myChart = ref<echarts.EChartsType>();
  onMounted(() => {
    myChart.value = echarts.init(selector.value, colors ? { color: colors } : { color: defaultColors });
    myChart.value.setOption(opt);
  });

  useEventListener(
    window,
    'resize',
    debounce((evt) => myChart.value?.resize(), 300)
  );

  return myChart;
}
