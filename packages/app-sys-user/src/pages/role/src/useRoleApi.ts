import { ElNotification } from 'element-plus';
import { ElMessageBox } from 'element-plus';

export interface RoleModel {
  roleId?: String;
  roleCode?: String;
  roleName: String;
  organizeId?: String;
  organizeName?: String;
  createDate?: String;
  isUse?: string;
  effectiveStartDate?: string;
  effectiveEndDate?: string;
}

export const useRoleApi = function () {
  const loading = ref(false);
  const formModel = ref<RoleModel>({ roleName: '', isUse: '1' });

  /** 获取列表 */
  async function getRoleList(params: Recordable) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/role/getListByOrganizeId'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }

  /** 获取级联列表 */
  async function getRoleTree(params: Recordable) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/role/getListByOrganizeId'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }

  /** 获取列表 */
  async function getPermList(params: Recordable) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/role/getRoleListByOrganizeId'), { params })
      .then((data: any) => data.result)
      .finally(() => {
        loading.value = false;
      });
  }

  /** 获取详情 */
  async function queryInfo(id: string) {
    loading.value = true;
    return $http
      .get(resolveUrl('/user/role/getRoleInfo'), { params: { roleId: id } })
      .then((data: any) => {
        formModel.value = data.result;
        return data.result as Readonly<RoleModel>;
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
  // 启用停用
  async function toggleUse(row: RoleModel) {
    let params = { roleId: row.roleId };
    if (row.isUse == '0') {
      //停用
      return $http
        .get(resolveUrl('/user/role/deactivate'), { params })
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
        .get(resolveUrl('/user/role/enable'), { params })
        .then(() => {
          row.isUse = '1';
          ElNotification.success('已启用');
        })
        .catch((e) => {
          row.isUse = '0';
        });
    }
  }

  // 删除
  async function del(roleId: string) {
    return $http.get(resolveUrl('/user/role/delete'), { params: { roleId } });
  }
  async function delWithConfirm(roleId: string) {
    let isConfirm = await ElMessageBox.confirm('是否删除该岗位?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).catch((e) => false);

    if (isConfirm) return del(roleId);

    return Promise.reject(false);
  }

  /** 提交 */
  async function submit(params?: Recordable) {
    const data = { ...unref(formModel.value), ...params };
    loading.value = true;
    return $http.post(resolveUrl('/user/role/save'), data).finally(() => {
      loading.value = false;
    });
  }
  /** 岗位添加用户 */
  async function addUser(params?: Recordable) {
    const data = { ...params };
    loading.value = true;
    return $http.post(resolveUrl('/user/role/addUser'), data).finally(() => {
      loading.value = false;
    });
  }

  // 移除用户
  async function delUser(roleId: string, empId: string) {
    return $http.post(resolveUrl('/user/role/delUser'), { roleId, empId });
  }

  return {
    loading,
    formModel,
    getRoleList,
    getPermList,
    queryInfo,
    getNextCode,
    submit,
    del,
    delWithConfirm,
    getRoleTree,
    toggleUse,
    addUser,
    delUser,
  };
};
