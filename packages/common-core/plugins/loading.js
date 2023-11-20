import { ElLoading } from 'element-plus';

let loadingInstance = null;
let count = 0;

export default {
  start(str = '') {
    loadingInstance = ElLoading.service({ lock: true, text: str, background: 'rgba(255, 255, 255, 0.3)' });
    count++;
  },
  end() {
    count--;
    if (count <= 0 && loadingInstance && loadingInstance.close) {
      loadingInstance?.close();
    }
  },
  finish() {
    count = 0;
    loadingInstance?.close();
  },
};
