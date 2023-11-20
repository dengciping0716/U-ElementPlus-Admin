import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear);

// 左侧快捷选择
let pickerOptions = {
  shortcuts: [
    {
      text: '昨天',
      value: () => {
        const start = dayjs().startOf('day').subtract(1, 'day').toDate();
        const end = dayjs().endOf('day').subtract(1, 'day').toDate();
        return [start, end];
      },
    },
    {
      text: '今天',
      value: () => {
        const start = dayjs().startOf('day').toDate();
        const end = dayjs().endOf('day').toDate();
        return [start, end];
      },
    },
    {
      text: '最近7天',
      value: () => {
        const start = dayjs().subtract(1, 'weeks').startOf('day').toDate();
        const end = dayjs().endOf('day').toDate();
        return [start, end];
      },
    },
    {
      text: '本月',
      value: () => {
        const start = dayjs().startOf('month').toDate();
        const end = dayjs().endOf('day').toDate();
        return [start, end];
      },
    },
    {
      text: '上月',
      value: () => {
        const start = dayjs().subtract(1, 'months').startOf('months').toDate();
        const end = dayjs().subtract(1, 'months').endOf('month').toDate();
        return [start, end];
      },
    },
    {
      text: '本季度',
      value: () => {
        const start = dayjs().startOf('quarter').toDate();
        const end = dayjs().endOf('day').toDate();
        return [start, end];
      },
    },
    {
      text: '今年',
      value: () => {
        const start = dayjs().startOf('year').toDate();
        const end = dayjs().endOf('day').toDate();
        return [start, end];
      },
    },
  ],
};

export default pickerOptions;
