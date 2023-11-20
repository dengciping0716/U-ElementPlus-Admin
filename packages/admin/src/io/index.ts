import http from './http/axios';
const __http_perfix = import.meta.env.DEV ? '/mock' : '';

export const resolveUrl = function (url) {
  if (url?.startsWith('http')) return url;
  return (__http_perfix || '') + url;
};

window['$http'] = http;
export { http };
