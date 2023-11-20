/** 水平柱状堆叠图 */
const stackBarHorizontal = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  legend: {
    // data: [],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '8%',
    containLabel: true,
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
  ],
};

export { stackBarHorizontal };
