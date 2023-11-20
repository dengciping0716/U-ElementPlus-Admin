import { debounce } from 'lodash';
import bus from '@common/utils/bus';

import { useUserStore } from '@/store/userStore';
import router from '@/router';

export default (interceptors) => {
  interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      if (!config._not_require_auth) {
        config.headers.token = useUserStore().token;
      }
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );
  //
  interceptors.response.use(
    function (response) {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      let { data = {} } = response;
      let { resultCode, resultMsg } = data;
      if (resultCode === '401') {
        // window['$message'].warning({ showClose: true, message: resultMsg || '请重新登录!' });
        useUserStore().$reset();
        router.replace('/');
        bus.$emit('user:reset');
        return Promise.reject(data);
      } else if (resultCode === '408') {
        // window['$message'].warning({ showClose: true, message: resultMsg || '密码过期，请修改密码!' });
        bus.$emit('user:resetPassword');
        return Promise.reject(data);
      }

      return response;
    },
    function (error) {
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  );
};
