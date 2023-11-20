import bus from '@common/utils/bus.js';
// originFun为原函数，before和after为增强方法
function constructor(originFun, before, after) {
  function _class() {
    before.apply(this, arguments);
    originFun.apply(this, arguments);
    after.apply(this, arguments);
  }
  return _class;
}

export const aspectRouter = function (router) {
  // AOP增强
  router.back = constructor(
    router.back,
    function () {
      // console.log('我在原方法前执行')
    },
    function () {
      // console.log('我在原方法后执行');
      bus.$emit('pageTabs:close', router.currentRoute);
    }
  );

  router.go = constructor(
    router.go,
    function () {
      // console.log('我在原方法前执行')
    },
    function () {
      // console.log('我在原方法后执行');
      if (arguments[0] < 0) {
        bus.$emit('pageTabs:close', router.currentRoute);
      }
    }
  );
};
