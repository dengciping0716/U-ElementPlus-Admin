import SelectUserByOrg from './SelectUserByOrg.vue';
export { SelectUserByOrg };

import InputUser from './InputUser';
export { InputUser };

export async function selectPersons(dialogProps = {}, dialogParams = {}) {
  return window.$dialog({
    component: SelectUserByOrg,
    props: dialogProps,
    params: Object.assign({}, dialogParams),
  });
}
