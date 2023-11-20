<template>
  <div class="text-5 font-bold m-5 mb-2">欢迎使用 {{ appName }}</div>
  <div class="flex gap-5 m-page -mt-5">
    <div class="flex-1 min-w-[760px]">
      <!--  -->
      <m-card shadow="hover" class="w-full mb-5">
        <div class="w-full flex gap-5 justify-between text-sm">
          <div class="flex-1 bg-gray-1 dark:bg-dark p-3">
            <div>计划方量</div>
            <div><span class="text-xl font-600">1123</span><span>方</span></div>
          </div>
          <div class="flex-1 bg-gray-1 dark:bg-dark p-3">
            <div>生产方量</div>
            <div><span class="text-xl font-600 c-success">1123</span><span>方</span></div>
          </div>
          <div class="flex-1 bg-gray-1 dark:bg-dark p-3">
            <div>计划方量</div>
            <div><span class="text-xl font-600 c-error">1123</span><span>方</span></div>
          </div>
          <div class="flex-1 bg-gray-1 dark:bg-dark p-3">
            <div>完成率</div>
            <div><span class="text-xl font-600 c-warning">98</span><span>%</span></div>
          </div>
        </div>
      </m-card>
      <!--  -->
      <m-card shadow="hover" class="w-full mb-5">
        <div><span class="font-bold text-sm">总数据</span> <span class="c-primary">(近一年)</span></div>
        <div ref="barChartRef" style="width: 100%; height: 370px"></div>
      </m-card>
      <!--  -->
      <div class="w-full h-[370px] flex gap-5">
        <m-card shadow="hover" body-style="padding:0px;" class="flex-1 h-full">
          <div class="my-2 mx-3"><span class="font-bold text-sm">数据列表</span></div>
          <BasicTable @register="registerTable" height="330px">
            <!-- 列设置 -->
            <template #col="{ tableColumns, targetPage, pageSize }">
              <el-table-column :resizable="true" label="序号" header-align="center" align="center" width="60">
                <template #default="scope">{{ scope.$index + 1 + (targetPage - 1) * pageSize }}</template>
              </el-table-column>
              <template v-for="(item, i) in tableColumns" :key="i">
                <el-table-column v-bind="item"> </el-table-column>
              </template>
            </template>
          </BasicTable>
        </m-card>
        <m-card shadow="hover" class="flex-1 h-full">
          <div><span class="font-bold text-sm">数据分类</span></div>
          <div ref="pieChartRef" style="width: 100%; height: 320px"></div>
        </m-card>
      </div>
    </div>
    <div class="w-80">
      <m-card shadow="hover" class="mb-5">
        <div class="flex justify-between mb-2"><span class="font-bold text-sm">快捷入口</span> <span class="text-info">更多>></span></div>
        <div class="p-2 grid grid-cols-3 justify-items-center gap-2">
          <template v-for="i in 5" :key="i">
            <div class="text-center">
              <div class="p-2 b-rd bg-gray-1 c-gray-5">
                <i class="text-5 i-comp-component"></i>
              </div>
              <div class="w-full mt-1">测试{{ i }}</div>
            </div>
          </template>
        </div>
        <el-divider></el-divider>
        <div><span class="font-bold text-sm mb-2">最近访问</span></div>
        <div class="p-2 grid grid-cols-3 justify-items-center gap-2">
          <template v-for="i in 2" :key="i">
            <div class="text-center">
              <div class="p-1 b-rd bg-gray-1 c-gray-5">
                <i class="text-5 i-comp-component"></i>
              </div>
              <div class="w-full mt-1">测试{{ i }}</div>
            </div>
          </template>
        </div>
      </m-card>
      <!--  -->
      <m-card shadow="hover">
        <div class="flex justify-between"><span class="font-bold text-sm">公告公示</span> <span class="text-info">更多>></span></div>
        <template v-for="i in 6" :key="i">
          <div class="py-2 b-0 b-b border-solid border-coolgray-1">
            <el-text truncated size="small">
              <el-tag :type="i % 2 == 0 ? 'success' : ''" size="small" class="mx-1" effect="light">
                {{ i % 2 == 0 ? '活动' : '消息' }}
              </el-tag>
              <span>内容更新优惠活动内容更新优惠活动内容更新优惠活动内容更新优惠活动</span>
            </el-text>
          </div>
        </template>
      </m-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { merge } from 'lodash';
import { useEchart, stackBarHorizontal, pie } from '@common/utils/chart';
const appName = import.meta.env.VITE_GLOB_APP_TITLE;

const barChartRef = ref();
const barChart = useEchart(barChartRef, stackBarHorizontal);

const pieChartRef = ref();
const pieChart = useEchart(pieChartRef);

setTimeout(() => {
  let source = [
    ['name', ...Array.from({ length: 9 }, (val, i) => '2023-' + (i + 1))],
    ['入库', ...Array.from({ length: 9 }, (val, i) => (Math.random() * 10000).toFixed(2))],
    ['出库', ...Array.from({ length: 9 }, (val, i) => (Math.random() * 10000).toFixed(2))],
  ];
  barChart.value?.setOption({
    dataset: { source },
    tooltip: { trigger: 'item' },
    series: [
      { seriesLayoutBy: 'row', type: 'bar' },
      { seriesLayoutBy: 'row', type: 'bar' },
    ],
  });

  pieChart.value?.setOption(
    merge({}, pie, {
      legend: { right: '5%', top: '10%' },
      series: [
        {
          center: ['30%', '50%'],
          name: '访问来源',
          roseType: 'angle',
          data: [
            // 数据数组，name 为数据项名称，value 为数据项值
            { value: 235, name: '视频广告' },
            { value: 274, name: '联盟广告' },
            { value: 310, name: '邮件营销' },
            { value: 335, name: '直接访问' },
            { value: 400, name: '搜索引擎' },
          ],
        },
      ],
    })
  );
}, 500);
//

// table
import { BasicTable, useTable } from '@common/core';

const _center = { headerAlign: 'center', align: 'center' };

const tableColumns = [
  // { ..._center, prop: 'empCode', label: '编码', minWidth: '140px' },
  { ..._center, prop: 'a', label: '合同', minWidth: '100px' },
  { ..._center, prop: 'b', label: '签订方量（方）', width: '140px' },
  { ..._center, prop: 'c', label: '签订人', width: '100px' },
  { ..._center, prop: 'd', label: '签订时间', width: '180px' },
];

async function queryList(params: any) {
  return [
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
    { a: '合同', b: '111', c: '签订人', d: '2023-3-1' },
  ];

  // loading.value = true;
  // return $http
  //   .post(resolveUrl('/attend/askLeave/search'), params)
  //   .then((data: any) => data.result)
  //   .catch((err) => {
  //     console.log(err);
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
}
const [registerTable, { getTableEl, reload, setTargetPage }] = useTable({
  showPage: false,
  showSetting: false,
  api: (params: any) => queryList({ ...params }),
  tableColumns,
  immediate: true,
});
</script>
