/** 饼图常规配置 */

const itemStyle = {
  normal: {
    opacity: 0.7,
    borderWidth: 1, // 白色间隔线
    borderColor: '#fff'
  }
}

const pie = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical'
  },
  series: [{
    type: 'pie',
    radius: '60%',
    center: ['50%', '50%'],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      normal: itemStyle.normal
    },
    label: {
      normal: {
        show: true,
        position: 'outside',
        formatter: '{b} \n {c}人'
      }
    }
  }]
}

export { pie }
