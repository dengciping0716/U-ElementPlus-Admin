export default (interceptors) => {
  //
  interceptors.response.use(
    function (response) {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      let { data } = response;
      let { resultCode, resultMsg } = data;

      if (resultCode == 200) {
        // 统一处理动态表单扩展字段
        try {
          if (data.result) Object.assign(data.result, JSON.parse(data.result?.extraJson || '{}'));
        } catch (error) {
          console.log(error);
        } 
        //
        return data;
      } else {
        window['$message'].warning({ showClose: true, message: resultMsg || '请求失败,请重试' });
        return Promise.reject(data);
      }
    },
    function (error) { 
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      window['$message'].warning({ showClose: true, message: error.resultMsg || error.message || '网络异常,请稍后重试' });
      return Promise.reject(error);
    }
  );
};
