<template>
  <div ref="mDragHandler" class="m-drag" title="收缩侧边栏">⋮</div>
</template>
<script>
/** 修改 兄弟元素 class="m-resize" 的宽度 */
export default {
  name: 'mResizeHandler',
  props: {
    max: Number
  },
  data: () => ({
    value: ''
  }),
  created() {},
  mounted() {
    this.dragControllerDiv();
  },
  watch: {},
  components: {},
  methods: {
    dragControllerDiv() {
      let _this = this;
      let handler = this.$refs['mDragHandler'];
      let box = handler.parentElement;
      let left = box.getElementsByClassName('m-resize')[0];
      _this.value = left.clientWidth;
      _this.maxWidth = _this.max || left.clientWidth;
      // 鼠标按下事件
      handler.onmousedown = function(e) {
        let lastX = e.screenX;
        // 鼠标拖动事件
        document.onmousemove = function(e) {
          let v = lastX - e.screenX;
          lastX = e.screenX;
          //
          _this.value = Math.max(0, Math.min(_this.value - v, _this.maxWidth));
          left.style.width = `${_this.value}px`;
          left.style.flex = `0 0 ${_this.value}px`; //支持flex布局
        };
        // 鼠标松开事件
        document.onmouseup = function(evt) {
          //颜色恢复
          // handler.style.background = '#d6d6d6';
          document.onmousemove = null;
          document.onmouseup = null;
          handler.releaseCapture && handler.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        };
        handler.setCapture && handler.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
/*拖拽区div样式*/
.m-drag {
  cursor: col-resize;
  margin: auto;
  width: 10px;
  height: 50px;
  line-height: 50px;
  background-color: #d6d6d6;
  background-size: cover;
  background-position: center;
  border-radius: 5px 0px 0px 5px;
  font-size: 24px;
  color: white;
  margin-left: -10px;
  z-index: 1;
  /*拖拽区鼠标悬停样式*/

  &:hover {
    background-color: var(--el-color-primary);
    // color: #444444;
  }
}
</style>
