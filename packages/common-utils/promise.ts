/** promise 相关工具函数 */

/**
 *
 * @param {number} ms 毫秒数
 * @returns
 */
export const sleep = function (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/** 小程序api 或其他配置类api 转promise */
export const toPromise = function (fn: any, config = {}) {
  return new Promise((resolve, reject) => {
    fn({
      ...config,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      cancel: (err) => {
        reject(err);
      },
    });
  });
};
