/**
 *
 */
import Qs from 'qs';
import axios from 'axios';
import useAuth from './interceptor-auth';
import useData from './interceptor-data';
import HttpCache, { HttpInterceptor } from '../httpCache';

// 通用设置
// axios.defaults.adapter = uniappAdapter;
axios.defaults.timeout = 30000; // request timeout
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.paramsSerializer = {
  serialize: function (params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' });
  },
};

// create an axios instance
const service = axios.create({
  baseURL: '',
  timeout: 30000,
  validateStatus: function (status) {
    return status == 200;
  },
});

useAuth(service.interceptors);
useData(service.interceptors);

// http 缓存
const httpCache = new HttpCache();
httpCache.include((url, params) => {
  if (/dict\/getDictListInfo/.test(url)) {
    return true;
  }
  return false;
});
service.get = HttpInterceptor(httpCache, service.get);
service.post = HttpInterceptor(httpCache, service.post);

export default service;
