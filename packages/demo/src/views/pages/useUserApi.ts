import { formModel, FormModel, rules } from './editPage';

export const useUserApi = function () {
  const loading = ref(false);
  const model = ref<FormModel>({ ...formModel });

  /** 获取详情 */
  async function queryInfo(id: string) {
    loading.value = true;
    await $http
      .get(resolveUrl('/user/emp/getEmpInfo'), { params: { empId: id } })
      .then((data: any) => {
        Object.assign(model.value, data.result?.account);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  /** 获取编码 */
  async function getNextCode(projId: string) {
    await $http
      .get(resolveUrl('/user/emp/getNextCode'), { params: { projId } })
      .then((data: any) => {
        model.value.empCode = data.result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /** 提交 */
  async function submit(params?: Recordable) {
    const data = { ...unref(model.value), ...params };
    loading.value = true;
    return $http.post(resolveUrl('/user/emp/save'), data).finally(() => {
      loading.value = false;
    });
  }

  return { loading, model, queryInfo, getNextCode, submit };
};
