import { ElNotification } from 'element-plus';

export interface UserModel {
  empId?: string;
  empCode?: string;
  empName?: string;
  telephone?: string;
  sex?: string;
  isUse?: string;
  roleId?: string;
  listRoleId?: string[];
}

export const useUserApi = function () {
  const loading = ref(false);
  const formModel = ref<UserModel>({
    sex: '1',
    isUse: '1',
  });
  const tableData = ref<UserModel[]>([]);

  async function queryList(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/emp/search'), { params })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  /**岗位用户 */
  async function queryListByRole(params: any) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/emp/queryPageByRoleId'), { params })
      .then((data: any) => data.result)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  /** 获取详情 */
  async function queryInfo(empId: string) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/emp/getEmpInfo'), { params: { empId } })
      .then((data: any) => (formModel.value = data.result))
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
    //   .get(resolveUrl('/user/emp/getNextCode'), { params: { projId } })
    //   .then((data: any) => {
    //     formModel.value.empCode = data.result;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  // 删除
  async function del(empId: string) {
    return $http.get(resolveUrl('/user/emp/delete'), { params: { empId } });
  }

  // 启用停用
  async function toggleUse(row: UserModel) {
    let params = { empId: row.empId };
    if (row.isUse == '0') {
      //停用
      return $http
        .get(resolveUrl('/user/emp/deactivate'), { params })
        .then(() => {
          row.isUse = '0';
          ElNotification.warning('已停用');
        })
        .catch((e) => {
          row.isUse = '1';
        });
    } else {
      //启用
      return $http
        .get(resolveUrl('/user/emp/enable'), { params })
        .then(() => {
          row.isUse = '1';
          ElNotification.success('已启用');
        })
        .catch((e) => {
          row.isUse = '0';
        });
    }
  }

  /** 提交 */
  async function submit(params?: Recordable) {
    const data = { ...unref(formModel.value), ...params };
    loading.value = true;
    return $http.post(resolveUrl('/user/emp/save'), data).finally(() => {
      loading.value = false;
    });
  }

  return {
    loading,
    formModel,
    tableData,
    queryList,
    queryInfo,
    getNextCode,
    submit,
    del,
    toggleUse,
    queryListByRole,
  };
};
