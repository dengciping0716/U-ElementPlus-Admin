export interface OrganizationModel {
  organizeName?: string;
  organizeId?: string;
  parentName?: string;
  parentId?: string;
}

export const useOrganizationApi = function () {
  const loading = ref(false);
  const formModel = ref<OrganizationModel>({});
  const organizeData = ref<OrganizationModel[]>([]);

  async function getOrganizeTree(params: any) {
    return $http
      .get(resolveUrl('/user/organize/getOrganizeTree'), { params })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      });
  }
  async function getOrganizeTreeByName(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/organize/getOrganizeTreeByName'), { params })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  async function getOrganizeTreeLevel3(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/organize/getOrganizeTreeLevel3'), { params })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  async function getOrganizeAndUser(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/organize/getOrganizeAndUserByTree'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }

  /** 获取详情 */
  async function queryInfo(id: string) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/organize/getOrganizeInfo'), { params: { organizeId: id } })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  /** 获取编码 */
  async function getNextCode(projId: string) {
    // await $http
    //   .get(resolveUrl('/user/organize/getNextCode'), { params: { projId } })
    //   .then((data: any) => {
    //     formModel.value.organizeCode = data.result;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  // 删除
  async function del(organizeId: string) {
    return $http.get(resolveUrl('/user/organize/delete'), { params: { organizeId } });
  }

  /** 提交 */
  async function submit(params?: Recordable) {
    const data = { ...unref(formModel.value), ...params };
    loading.value = true;
    return $http.post(resolveUrl('/user/organize/save'), data).finally(() => {
      loading.value = false;
    });
  }

  return {
    loading,
    formModel,
    organizeData,
    queryInfo,
    getNextCode,
    submit,
    del,
    getOrganizeTree,
    getOrganizeTreeByName,
    getOrganizeTreeLevel3,
    getOrganizeAndUser
  };
};
