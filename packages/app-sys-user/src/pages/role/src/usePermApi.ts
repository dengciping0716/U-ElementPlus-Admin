/**
 * 权限相关功能
 */

export const usePermApi = function () {
  const loading = ref(false);

  /** 获取列表 */
  async function getPermList(params: Recordable) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/menu/getListSysMenuByRole'), { params })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  /** 提交 */
  async function submit(params?: Recordable) {
    const data = { ...params };
    loading.value = true;
    return $http.post(resolveUrl('/user/role/saveRoleOfMenu'), data).finally(() => {
      loading.value = false;
    });
  }

  return { loading, getPermList, submit };
};
