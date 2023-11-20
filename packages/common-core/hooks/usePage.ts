/**
 * composition api 的分页通用逻辑
 * @returns
 */
import { reactive, toRefs } from 'vue';
import { PaginationProps } from 'element-plus';

export type PaginationPositon = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

export type PageInfoType = {
  pageSize: number;
  targetPage: number;
  totalCount: number;
};

const pageOption = {
  small: false,
  placement: 'end', // start | center | end
  background: true,
  layout: 'total,prev,pager,next,jumper,sizes',
  pageSizes: [10, 15, 20, 30, 100],
};

export type PageOption = Partial<PaginationProps & typeof pageOption>;

export function usePage() {
  let page = reactive({
    pageSize: 10,
    targetPage: 1,
    totalCount: 0,
  });

  let pageOpt = reactive({ ...pageOption });

  function setPagination(opt: PageOption) {
    Object.assign(pageOpt, opt);
  }

  function setTargetPage(val: number) {
    page.targetPage = val;
  }

  return {
    pageInfo: page,
    ...toRefs(page),
    pageOpt,
    setPagination,
    setTargetPage,
  };
}
