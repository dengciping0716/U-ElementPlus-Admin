import { definePostMock, resultError, resultSuccess, getRequestToken, requestParams } from '../_util';
import Mock, { Random } from 'mockjs';
import { faker } from '@faker-js/faker';
import routeList from '../mock-data/user-route-list.json';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'admin',
      realName: 'ep Admin',
      avatar: faker.image.avatar(),
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
      routeList,
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: faker.image.avatar(),
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
      routeList,
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};
export default definePostMock([
  {
    url: '/user/getVerifyCode',
    method: 'GET',
    body: () =>
      resultSuccess({
        verifyCodeEncrypt: Mock.mock('@id'),
        verifyCodePic: Random.image('82x32', Random.color(), Random.color(), Random.string(4)),
      }),
  },
  // mock user login
  {
    url: '/user/login',
    method: 'POST',
    body: ({ body }) => {
      const { username, password } = body;
      const checkUser = createFakeUserList().find((item) => item.username === username && password === item.password);
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const { userId, username: _username, token, realName, desc, roles, avatar, routeList } = checkUser;
      return resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc,
        avatar,
        routeList,
      });
    },
  },
  {
    url: '/user/getUserInfo',
    method: 'GET',
    body: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
  {
    url: '/user/getPermCode',
    method: 'GET',
    body: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    },
  },
  {
    url: '/user/logout',
    method: 'GET',
    body: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, { resultMsg: 'Token has been destroyed' });
    },
  },
  {
    url: '/user/testRetry',
    status: 405,
    method: 'GET',
    body: () => {
      return resultError('Error!');
    },
  },
  {
    url: '/user/organize/getOrganizeTree',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-organize-getOrganizeTree.json')).default;
      return data;
    },
  },
  {
    url: '/user/organize/getOrganizeAndUserByTree',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-organize-getOrganizeAndUserByTree.json')).default;
      return data;
    },
  },
  {
    url: '/user/role/getListByOrganizeId',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-role-getListByOrganizeId.json')).default;
      return data;
    },
  },
  {
    url: '/user/role/getRoleInfo',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-role-getRoleInfo.json')).default;
      return data;
    },
  },
  {
    url: '/user/dict/getDictGroupList',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-dict-getDictGroupList.json')).default;
      return data;
    },
  },
  {
    url: '/user/dict/getDictList',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-dict-getDictList.json')).default;
      return data;
    },
  },
  {
    url: '/user/emp/search',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-emp-search.json')).default;
      return data;
    },
  },
  {
    url: '/user/menu/getListSysMenuByRole',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-menu-getListSysMenuByRole.json')).default;
      return data;
    },
  },
  {
    url: '/user/property/search',
    status: 200,
    method: 'GET',
    body: async () => {
      let data = await (await import('../mock-data/user-property-search.json')).default;
      return data;
    },
  },
]);
