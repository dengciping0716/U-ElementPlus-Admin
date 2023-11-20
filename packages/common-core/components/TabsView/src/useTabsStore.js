import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import { nextTick } from 'vue';
// import { RouteLocationNormalized } from 'vue-router';
// 不需要出现在标签页中的路由
const whiteList = ['Redirect', 'Login', '404', '403', '500'];

// export type RouteItem = Partial<RouteLocationNormalized> & {
//   fullPath: string;
//   path: string;
//   name: string;
//   hash: string;
//   meta: object;
//   params: object;
//   query: object;
// };

// export type ITabsViewState = {
//   tabsList: RouteItem[]; // 标签页
// };

//保留固定路由
function retainAffixRoute(list) {
  return list.filter((item) => item?.meta?.affix ?? false);
}

// 获取简易的路由对象
const getSimpleRoute = (route) => {
  const { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
};

export const useTabsStore = defineStore('app-tabs-view', {
  state: () => ({
    tabsList: [],
    activeKey: '',
  }),
  getters: {
    keys() {
      return this.tabsList.map((item) => item.fullPath);
    },
    // 最后一个tab
    last() {
      const currentRoute = this.tabsList[Math.max(0, this.tabsList.length - 1)];
      return currentRoute;
    },
    activedTab() {
      const currentRoute = this.tabsList.find((route) => route.fullPath == this.activeKey);
      return currentRoute;
    },
  },
  actions: {
    getSimpleRoute,
    // 初始化标签页
    initTabs(routes) {
      this.tabsList = routes;
    },
    // 添加标签页
    addTabs(route) {
      route = getSimpleRoute(route);
      if (whiteList.includes(route.name)) return false;
      const isExists = this.tabsList.some((item) => item.fullPath == route.fullPath);
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    // 关闭页面
    removeTab(route) {
      if (this.tabsList.length === 1) {
        return ElMessage.warning('这已经是最后一页，不能再关闭了！');
      }
      if (this.activeKey == route.fullPath) {
        let nextRoute = this.next(route.fullPath);
        nextTick(() => this.router.push(nextRoute));
      }
      this.closeCurrentTab(route);
    },
    updateTab(meta) {
      if (this.activedTab) {
        Object.assign(this.activedTab.meta, meta);
      }
    },
    // // 刷新页面
    async reloadTab() {
      this.closeCurrentTab({ fullPath: this.activeKey });
      setTimeout(() => {
        this.router.push({ path: '/redirect' + this.activeKey });
      }, 100);
    },
    // 关闭左侧
    closeLeftTabs({ fullPath }) {
      const index = this.tabsList.findIndex((item) => item.fullPath == fullPath);
      this.tabsList = this.tabsList.filter((item, i) => i >= index || (item?.meta?.affix ?? false));
    },
    // 关闭右侧
    closeRightTabs({ fullPath }) {
      const index = this.tabsList.findIndex((item) => item.fullPath == fullPath);
      this.tabsList = this.tabsList.filter((item, i) => i <= index || (item?.meta?.affix ?? false));
    },
    // 关闭其他
    closeOtherTabs({ fullPath }) {
      this.tabsList = this.tabsList.filter((item) => item.fullPath == fullPath || (item?.meta?.affix ?? false));
    },
    // 关闭当前页
    closeCurrentTab({ fullPath }) {
      const index = this.tabsList.findIndex((item) => item.fullPath == fullPath);
      this.tabsList.splice(index, 1);
    },
    // 关闭全部
    closeAllTabs() {
      // console.log(retainAffixRoute(this.tabsList));
      this.tabsList = retainAffixRoute(this.tabsList);
    },
    // 计算相邻的tab
    next(activePath) {
      let tabs = this.tabsList;
      let index = tabs.findIndex((tab) => tab.fullPath === activePath) || tabs.length;
      let nextTab = tabs[index + 1] || tabs[index - 1];
      if (nextTab) return nextTab;
    },
  },
});
