<!-- 

    结合keep-alive 可以实现缓存
    结合 << :key >> 可以缓存同一组件不同参数的页面
    <keep-alive :max="20">
      <router-view :key="$route.fullPath" />
    </keep-alive>
   -->

<template>
  <div class="tabs-view tabs-view-default-background sticky left-0">
    <div class="tabs-view-main">
      <div ref="navWrap" class="tabs-card" :class="{ 'tabs-card-scrollable': scrollable }">
        <span class="tabs-card-prev" :class="{ 'tabs-card-prev-hide': !scrollable }" @click="scrollPrev">
          <i class="i-ep-arrow-left"> </i>
        </span>
        <span class="tabs-card-next" :class="{ 'tabs-card-next-hide': !scrollable }" @click="scrollNext">
          <i class="i-ep-arrow-right"> </i>
        </span>
        <div ref="navScroll" class="tabs-card-scroll">
          <template v-for="item in tabsList" :key="item.fullPath">
            <el-tag
              :id="`tag${item.fullPath.split('/').join('\/')}`"
              class="tabs-card-scroll-item"
              :closable="!item.meta?.affix"
              :type="item.fullPath == tabsViewStore.activeKey ? '' : 'info'"
              :effect="item.fullPath == tabsViewStore.activeKey ? 'light' : 'plain'"
              @click="goPage(item)"
              @close="removeTab(item)"
              @contextmenu.prevent.native="handleContextMenu($event, item)">
              <i v-if="item.meta?.icon" :class="['fa', item.meta?.icon]"></i> {{ item.meta?.label || 'unknow' }}
            </el-tag>
          </template>
        </div>
      </div>
      <!--  -->
      <div class="flex justify-center items-center mr-2 ml-1">
        <div class="tabs-close" @click="reloadTab()">
          <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
            <i i="ep-refresh-right"></i>
          </el-tooltip>
        </div>
        <div class="tabs-close" @click="toggleFullScreen">
          <el-tooltip class="item" effect="dark" content="内容全屏" placement="bottom">
            <i i="ep-full-screen"></i>
          </el-tooltip>
        </div>
        <div class="tabs-close flex justify-center items-center">
          <el-dropdown ref="dropDown" trigger="click" @visible-change="restContextTab" @command="handleCommand" :popper-options="popperOpt">
            <i i="ep-arrow-down" class="el-dropdown-link"></i>
            <template #dropdown>
              <el-dropdown-menu :visibleArrow="false" ref="dropDownMenu">
                <template v-for="item in TabsMenuOptions" :key="item.key">
                  <el-dropdown-item :command="item.key" v-bind="item"> {{ item.label }}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  <div ref="pageContent" class="fullscreen w-full">
    <slot></slot>
  </div>
</template>

<!--  -->
<script setup>
import { useFullscreen } from '@vueuse/core';
import elementResizeDetectorMaker from 'element-resize-detector';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useTabsStore } from './useTabsStore';

defineOptions({ name: 'MTabsView' });

const pageContent = ref(null);
const { isFullscreen, enter, exit, toggle: toggleFullScreen } = useFullscreen(pageContent);

const route = useRoute();
const router = useRouter();
const tabsViewStore = useTabsStore();
const { removeTab, closeCurrentTab, reloadTab } = tabsViewStore;

watch(
  () => route.fullPath,
  (to) => {
    if (tabsViewStore.addTabs(route)) {
      tabsViewStore.activeKey = to;
      updateNavScroll(true);
    }
  },
  { immediate: true }
);

// // 注入刷新页面方法
provide('reloadPage', reloadTab);

const state = reactive({
  scrollable: false,
  dropdownX: 0,
  dropdownY: 0,
  showDropdown: false,
  isMultiHeaderFixed: false,
  // multiTabsSetting: getMultiTabsSetting
});
let { scrollable, dropdownX, dropdownY, showDropdown } = toRefs(state);

// 标签页列表
const tabsList = computed(() => tabsViewStore.tabsList);

const navScroll = ref(null);
const navWrap = ref(null);

/**
 * @param value 要滚动到的位置
 * @param amplitude 每次滚动的长度
 */
function scrollTo(value, amplitude) {
  const currentScroll = navScroll.value.scrollLeft;
  const scrollWidth =
    (amplitude > 0 && currentScroll + amplitude >= value) || (amplitude < 0 && currentScroll + amplitude <= value)
      ? value
      : currentScroll + amplitude;
  navScroll.value && navScroll.value.scrollTo(scrollWidth, 0);
  if (scrollWidth === value) return;
  return window.requestAnimationFrame(() => scrollTo(value, amplitude));
}

function scrollPrev() {
  const containerWidth = navScroll.value.offsetWidth;
  const currentScroll = navScroll.value.scrollLeft;
  if (!currentScroll) return;
  const scrollLeft = currentScroll > containerWidth ? currentScroll - containerWidth : 0;
  scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
}
function scrollNext() {
  const containerWidth = navScroll.value.offsetWidth;
  const navWidth = navScroll.value.scrollWidth;
  const currentScroll = navScroll.value.scrollLeft;
  if (navWidth - currentScroll <= containerWidth) return;
  const scrollLeft = navWidth - currentScroll > containerWidth * 2 ? currentScroll + containerWidth : navWidth - containerWidth;
  scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
}

/**
 * @param autoScroll 是否开启自动滚动功能
 */
async function updateNavScroll(autoScroll) {
  await nextTick();
  if (!navScroll.value) return;
  const containerWidth = navScroll.value.offsetWidth;
  const navWidth = navScroll.value.scrollWidth;
  if (containerWidth < navWidth) {
    state.scrollable = true;
    if (autoScroll) {
      let tagList = navScroll.value.querySelectorAll('.tabs-card-scroll-item') || [];
      [...tagList].forEach((tag) => {
        // fix SyntaxError
        if (tag.id === `tag${tabsViewStore.activeKey?.split('/').join('\/')}`) {
          tag.scrollIntoView && tag.scrollIntoView();
        }
      });
    }
  } else {
    state.scrollable = false;
  }
}
function handleResize() {
  updateNavScroll(true);
}
function onElementResize() {
  let observer;
  observer = elementResizeDetectorMaker();
  observer.listenTo(navWrap.value, handleResize);
}
onMounted(() => {
  onElementResize();
});

// 右键菜单
const dropDown = ref(null);
const dropDownMenu = ref(null);
const offsetX = ref(0);
const popperOpt = {
  modifiers: [
    {
      name: 'computeStyles',
      options: {
        roundOffsets: ({ x, y }) => ({ x: offsetX.value || x, y }),
      },
    },
  ],
};
let contextTab = ref(null);
function handleContextMenu(e, item) {
  e.preventDefault();
  // isCurrent.value = PageEnum.BASE_HOME_REDIRECT === item.path;
  state.showDropdown = false;
  contextTab.value = item;
  // 兼容mac 笔记本需要两次延迟
  offsetX.value = e.clientX - 20;
  dropDown.value.handleOpen();
}
// 重置右键菜单响应为当前选择
function restContextTab(visible) {
  if (!visible) {
    contextTab.value = null;
    nextTick().then(() => (offsetX.value = 0));
  }
}

//tags 跳转页面
function goPage(e) {
  const { fullPath } = e;
  if (fullPath === route.fullPath) return;
  router.replace(e);
}

/** tab 功能 */

//tags 右侧下拉菜单
const TabsMenuOptions = computed(() => {
  const list = unref(tabsList);
  let target = unref(contextTab) || route;
  const isDisabled = list.length <= 1;
  const isFirst = list?.length > 1 && list[0]?.fullPath === target?.fullPath;
  const isLast = list?.length > 1 && list[list.length - 1]?.fullPath === target?.fullPath;
  return [
    // {
    //   label: '内容全屏',
    //   key: '0',
    //   icon: 'ep-full-screen'
    // },
    // {
    //   label: '刷新当前',
    //   key: '1',
    //   icon: 'ep-refresh-right'
    // },
    {
      label: `关闭当前`,
      key: '2',
      disabled: isDisabled,
      icon: 'ep-minus',
    },
    {
      label: '关闭其他',
      key: '3',
      disabled: isDisabled,
      icon: 'ep-minus',
    },
    {
      label: '关闭左侧',
      key: '4',
      disabled: isDisabled || isFirst,
      icon: 'ep-d-arrow-left',
    },
    {
      label: '关闭右侧',
      key: '5',
      disabled: isDisabled || isLast,
      icon: 'ep-d-arrow-right',
    },
    {
      label: '关闭全部',
      key: '6',
      disabled: isDisabled,
      icon: 'ep-close',
    },
  ];
});

const handleCommand = function (command) {
  let target = contextTab.value || route;
  switch (command) {
    //全屏
    case '0':
      toggleFullScreen();
      break;
    //刷新
    case '1':
      reloadTab();
      break;
    //关闭当前
    case '2':
      removeTab(target);
      break;
    //关闭其他
    case '3':
      tabsViewStore.closeOtherTabs(target);
      router.replace(target);
      break;
    //关闭左侧
    case '4':
      tabsViewStore.closeLeftTabs(target);
      router.replace(target);
      break;
    //关闭右侧
    case '5':
      tabsViewStore.closeRightTabs(target);
      router.replace(target);
      break;
    //关闭所有
    case '6':
      tabsViewStore.closeAllTabs();
      router.replace('/');
      break;
  }
  updateNavScroll();
  state.showDropdown = false;
};
</script>

<style lang="scss">
.tabs-view {
  display: flex;
  transition: all 0.2s ease-in-out;

  &-main {
    height: 40px;
    display: flex;
    align-items: center;
    max-width: 100%;
    min-width: 100%;
    .tabs-card {
      -webkit-box-flex: 1;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      position: relative;
      height: 100%;
      .tabs-card-prev,
      .tabs-card-next {
        width: 32px;
        text-align: center;
        position: absolute;
        height: 100%;
        line-height: 100%;
        cursor: pointer;
        i {
          height: 100%;
          line-height: 100%;
          font-size: 14px;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          // height: 32px;
          // width: 32px;
        }
      }
      .tabs-card-prev {
        left: 0;
      }
      .tabs-card-next {
        right: 0;
      }
      .tabs-card-next-hide,
      .tabs-card-prev-hide {
        display: none;
      }
      &-scroll {
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        display: flex;
      }
    }
    .tabs-card-scrollable {
      padding: 0 32px;
      overflow: hidden;
    }
  }

  .el-tag.el-tag--info {
    --el-tag-text-color: getCssVar('text-color');
  }

  .el-tag + .el-tag {
    position: relative;
    &::before {
      content: ' ';
      height: 100%;
      width: 1px;
      background-color: getCssVar('border-color');
      position: absolute;
      left: 0px;
    }
  }
  .el-tag {
    height: 100%;
    border-width: 0px;
    border-radius: 0px;
    &.el-tag--info {
      --ok-tag-text-color: getCssVar('text', 'color-primary');
    }
    &:hover {
      background-color: getCssVar('color-primary', 'light-9');
      color: getCssVar('color-primary');
    }
  }
  .tabs-close + .tabs-close {
    margin-left: 4px;
  }
  .tabs-close {
    min-width: 32px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: getCssVar('color-primary', 'light-9');
    border-radius: 2px;
    cursor: pointer;
    //margin-right: 10px;

    &-btn {
      color: var(--color);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.tabs-view-default-background {
  background-color: getCssVar('bg-color');
  border-radius: 2px;
  border-bottom: 1px solid getCssVar('border-color');
}

// .tabs-view-fix {
//   position: fixed;
//   z-index: 5;
//   padding: 6px 19px 6px 10px;
//   left: 200px;
// }

.tabs-view-fix {
  position: sticky;
  top: 50px;
}

.tabs-view-fixed-header {
  top: 0;
}
</style>
