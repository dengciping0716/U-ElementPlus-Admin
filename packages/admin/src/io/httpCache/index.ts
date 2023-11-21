import { LRUCache } from 'lru-cache';
import md5 from 'md5';
import { cloneDeep, omit } from 'lodash-es';
/**
 * http 缓存策略。使用LRU 缓存实现最近最少使用淘汰机制。
 */
class HttpCache {
  private cache: LRUCache<any, any>;
  private intervalCount: number;
  private debug: boolean;
  private includeTest: any;
  private excludeTest: any;
  constructor(max = 99, interval = 10, debug = false) {
    this.cache = new LRUCache({ max });
    this.intervalCount = interval;
    this.debug = debug;
  }
  /**
   * 设置包含规则
   */
  include(fn) {
    this.includeTest = fn;
  }
  /**
   * 设置排除规则
   */
  exclude(fn) {
    this.excludeTest = fn;
  }
  /**
   * 校验是否缓存
   * @param {*} url
   * @param {*} params
   * @returns
   */
  testAllowCache(url, params) {
    if (params?._allow_cache || params?.params?._allow_cache) {
      if (this.debug) console.log('http-cache test allow', url);
      return true;
    }

    //优先计算排除
    if (typeof this.excludeTest == 'function') {
      let bool = this.excludeTest(url, params);
      if (bool) return false;
    }
    if (typeof this.includeTest == 'function') {
      let bool = this.includeTest(url, params);
      if (bool) {
        if (this.debug) console.log('http-cache test allow', url);
      }
      if (bool) return true;
    }
  }

  /**
   * 获取请求对应的缓存key
   * @param {*} url
   * @param {*} params
   * @returns
   */
  getKey(url, params) {
    let key = url;
    if (params) {
      let hash = md5(JSON.stringify(params));
      key = key + '#' + hash;
    }
    return key;
  }

  //请求拦截器
  async before(key, force = false) {
    if (!force) {
      // 走缓存
      let data = this.cache.get(key);
      if (data === 'loading') {
        return this.polling(key);
      } else if (data) {
        if (this.debug) console.log('http-cache before : cached ', key);
        return Promise.resolve(cloneDeep(data));
      }
    }
    this.cache.set(key, 'loading');

    if (this.debug) console.log('http-cache before : not cache ', key);
    return null;
  }

  //响应拦截器
  after(key, data, e) {
    if (e) {
      this.cache.delete(key);
      return Promise.reject(e);
    } else {
      if (this.debug) console.log('http-cache after', key, data);

      this.cache.set(key, data);
      return Promise.resolve(cloneDeep(data));
    }
  }

  /**
   * 轮询结果
   * @param {*} key
   * @returns
   */
  async polling(key) {
    return new Promise((resolve, reject) => {
      let count = this.intervalCount;
      let callback = () => {
        let value = this.cache.get(key);

        if (this.debug) console.log('http-cache polling', key, value);

        if (null == value || !count--) {
          reject(new Error('http-cache polling 获取数据失败 ' + ' - ' + key));
          return;
        }
        if (value && value !== 'loading') {
          resolve(cloneDeep(value));
          return;
        }
        setTimeout(callback, 2000);
      };
      setTimeout(callback, 2000);
    });
  }
}

export default HttpCache;

// 拦截器 originFun为原函数
export const HttpInterceptor = function (httpCache, originFun) {
  async function _class(this: any) {
    let url = arguments[0];
    let params = arguments[1];
    // 校验是否开启缓存
    let allowCache = httpCache.testAllowCache(url, params);
    if (!allowCache) return originFun.apply(this, arguments);

    let key = httpCache.getKey(url, params);
    // 请求拦截
    let force = !!params?._force_cache || !!params?.params?._force_cache; // 开启强制重新请求。默认不开启
    let result = await httpCache.before(key, force).catch((e: any) => null);

    if (result) return result;
    // 原始请求
    let [e, data] = await originFun
      .apply(this, arguments)
      .then((res: any) => [null, res])
      .catch((e: any) => [e]);

    // 响应拦截
    return httpCache.after(key, data, e);
  }
  return _class;
};

/**
 * demo
 * 
const httpCache = new HttpCache();
httpCache.include((url, params) => {
  if (params?._allow_cache) {
    return true;
  }
  return false;
});
io.get = HttpInterceptor(httpCache, io.get);
io.post = HttpInterceptor(httpCache, io.post);

 */
