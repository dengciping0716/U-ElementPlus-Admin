import dayjs from 'dayjs';
import { nextTick } from 'vue';
import { omit, get } from 'lodash';

let loopId: NodeJS.Timeout | null;
interface AuthInfo {
  token: string;
  expTime: string;
  refreshToken: string;
  realName: string;
  avatar: string;
  userId: string;
}
/**
 *
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {},
    authInfo: {} as AuthInfo,
  }),
  getters: {
    token(): string {
      return this.authInfo.token;
    },
    isLogin(): boolean {
      let exp = Number(this.authInfo?.expTime || 0) - dayjs().valueOf();
      return exp > 0;
    },
    userName(): string {
      return this.authInfo.realName;
    },
    avatar(): string {
      return this.authInfo.avatar;
    },
  },
  actions: {
    /**
     * 加载登录信息
     */
    async init() {
      await new Promise((resolve, reject) => setTimeout(resolve, 500)); //等待读取本地存储登录信息 ；500ms

      if (this.isLogin) this.loopRefresh();

      // 标签切换重新轮询token
      document.addEventListener('visibilitychange', () => {
        if (loopId) {
          if (document.hidden) clearTimeout(loopId);
          if (!document.hidden) this.loopRefresh();
        }
      });

      //其他页签退出登录,刷新token等事件触发
      window.addEventListener('storage', (e) => {
        if (e?.key == 'authinfo') {
          this.$patch({ authInfo: JSON.parse(e.newValue || '{}') });
        }
      });
    },

    /**
     * 账号信息
     * @param info
     */
    async setAuthInfo(info: any) {
      info.expTime = dayjs()
        .add(info.refreshTime || 3600*24*7, 's')
        .valueOf();
      this.authInfo = info;
      this.loopRefresh();
    },
    /**
     * 获取用户信息
     * @param {*} param0
     * @returns
     */
    async getUserInfo() {
      await new Promise((resolve) => setTimeout(resolve, 500)); //等待1s 等待读取token

      let userInfo = await $http
        .get(resolveUrl('/user/getLoginInfoByToken'), { params: { isLogin: 1 } })
        .then((data: any) => data.result)
        .catch(() => null);

      this.userInfo = userInfo || {};
      if (!userInfo) this.$reset();

      return userInfo || {};
    },
    /**
     * 定时刷新token
     * @param {*} param0
     * @returns
     */
    async loopRefresh() {
      if (loopId) clearTimeout(loopId);
      loopId = null;
      let exp = Number(this.authInfo?.expTime || 0) - 10 * 1000 - dayjs().valueOf();
      if (exp <= 0) {
        //已过期，重新登录
        console.log('loopRefresh reset');
        this.$reset();
      } else {
        console.log('loopRefresh refreshToken', exp);
        // console.log(`延时 ${exp / 1000}s 刷新token`);
        loopId = setTimeout(() => this.refreshToken(), exp);
      }
    },
    /**
     * 刷新token
     * @param {*} param0
     * @returns
     */
    async refreshToken() {
      let res = await $http
        .get(resolveUrl('/user/refreshToken'), { params: { refreshToken: this.authInfo?.refreshToken } })
        .then((data: any) => data.result)
        .catch(() => null);

      if (!res) {
        this.$reset();
      } else {
        let authInfo = Object.assign(this.authInfo, res);
        this.setAuthInfo(authInfo);
      }
      return res || {};
    },
    /**
     * 登出
     * @param {*} param0
     */
    async logout() {
      await $http.get(resolveUrl('/user/logoutSystem'), {}).catch(() => null);
      this.$reset();
    },
  },
  save: {
    enabled: true,
  },
});
