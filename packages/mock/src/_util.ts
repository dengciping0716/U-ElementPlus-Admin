// Interface data format used to return a unified format
import path from 'node:path';
import { createDefineMock } from 'vite-plugin-mock-dev-server';

export const definePostMock = createDefineMock((mock) => {
  mock.url = path.join('/mock', mock.url);
});

export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  TIMEOUT = 401,
  TYPE = 'success',
}

export function resultSuccess<T = Recordable>(result: T, { resultMsg = 'ok' } = {}) {
  return {
    resultCode: ResultEnum.SUCCESS,
    result,
    resultMsg,
    type: 'success',
  };
}

export function resultPageSuccess<T = any>(page: number, pageSize: number, list: T[], { resultMsg = 'ok' } = {}) {
  const pageData = pagination(page, pageSize, list);

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    resultMsg,
  };
}

export function resultError(resultMsg = 'Request failed', { resultCode = ResultEnum.ERROR, result = null } = {}) {
  return {
    resultCode,
    result,
    resultMsg,
    type: 'error',
  };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + Number(pageSize));
}

export interface requestParams {
  method: string;
  query: Record<string, string>; // query string parse
  params: Record<string, string>; // params parse
  headers: Record<string, string>; // request headers
  body: any; // request body
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.token;
}
