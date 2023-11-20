export interface DictGrpModel {
  dictId?: string;
  dictGrp?: string;
  dictGrpName?: string;
}

export interface DictModel {
  dictId?: string;
  dictCodeKbn: string;
  dictCode: string;
  dictLnm: string;
  sortNo: string | number;
}

import { ElNotification } from 'element-plus';
export const useDictApi = function () {
  const loading = ref(false);
  const formModel = ref<Partial<DictModel>>({});
  const tableData = ref<DictModel[]>([]);
  /** 字典列表 */
  async function queryDictGroupList(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/dict/getDictGroupList'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }
  /** 字典列表 */
  async function queryDictList(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/dict/getDictList'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }

  /** 提交 */
  async function submit(params?: Recordable) {
    loading.value = true;
    return $http.post(resolveUrl('/user/dict/save'), params).finally(() => {
      loading.value = false;
    });
  }

  return {
    loading,
    formModel,
    tableData,
    queryDictGroupList,
    queryDictList,
    submit,
  };
};
