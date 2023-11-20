export interface PropertyModel {
  propertyId?: string;
  propertyCode?: string;
  propertyName?: string;
  isUse?: string;
}

import { ElNotification } from 'element-plus';
export const useSysSettingApi = function () {
  const loading = ref(false);
  const formModel = ref<PropertyModel>({});
  const tableData = ref<PropertyModel[]>([]);

  /** 属性配置 */
  async function querySettingList(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/property/search'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }
  // 属性的启用停用
  async function toggleUse(row: PropertyModel) {
    let params = { propertyId: row.propertyId, isUse: row.isUse };
    if (row.isUse == '0') {
      //停用
      return $http
        .get(resolveUrl('/user/property/deactivate'), { params })
        .then(() => {
          row.isUse = '0';
          ElNotification.warning(row.propertyName + '已停用');
        })
        .catch((e) => {
          row.isUse = '1';
        });
    } else {
      //启用
      return $http
        .get(resolveUrl('/user/property/enable'), { params })
        .then(() => {
          row.isUse = '1';
          ElNotification.success(row.propertyName + '已启用');
        })
        .catch((e) => {
          row.isUse = '0';
        });
    }
  }

  return {
    loading,
    formModel,
    tableData,
    querySettingList,
    toggleUse,
  };
};
