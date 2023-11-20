/**
 * 弹窗辅助工具，用于方便打开自定义弹窗
 * eg.
 */
import { h, render, nextTick, ref } from 'vue';
import { sleep } from '@common/utils/promise';
import { mConfigProvider } from '../components/ConfigProvider';

export default function (app) {
  let uid = 0;

  const defaults = {
    component: '', // 弹窗组件
    props: '', // 弹窗属性
    params: '', // show函数参数
  };

  let msgQueue = [];

  const defaultCallback = (currentMsg, action, data) => {
    if (currentMsg) {
      let callback = currentMsg.callback;
      if (typeof callback === 'function') {
        callback(action, data);
      }
      if (currentMsg.resolve) {
        if (action === 'confirm' || action === 'submit') {
          currentMsg.resolve(data);
        } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
          currentMsg.reject({ action });
        }
      }
    }
  };

  const renderComp = async function (currentMsg, component, props = {}) {
    var layerDom = document.createElement('div');
    document.body.appendChild(layerDom);
    await nextTick();
    let comRef = ref(null);

    let close = async () => {
      // console.log('remove dom');
      render(null, layerDom); // 销毁绑定的组件
      await nextTick();
      layerDom.remove();
    };

    let vNode = h({
      render() {
        return h(
          mConfigProvider,
          {},
          {
            default: () =>
              h(component, {
                ref: comRef,
                key: `${++uid}`,
                ...props,
                onClose: (data) => {
                  close();
                  defaultCallback(currentMsg, 'close', data);
                },
                onCancel: (data) => {
                  defaultCallback(currentMsg, 'cancel', data);
                },
                onConfirm: (data) => {
                  defaultCallback(currentMsg, 'confirm', data);
                },
                handlerSubmit: (data) => {
                  defaultCallback(currentMsg, 'submit', data);
                },
              }),
          }
        );
      },
    });
    vNode.appContext = app._context;
    render(vNode, layerDom);

    while (!comRef.value) {
      await sleep(50);
    }

    return comRef.value;
  };

  const showNextMsg = async () => {
    if (!msgQueue.length) return;
    let currentMsg = msgQueue.shift();
    const { component, props = {}, params } = currentMsg.options || {};
    if (!component) return;

    let instance = await renderComp(currentMsg, component, props);

    if (Array.isArray(params)) {
      instance?.show(...params);
    } else {
      instance?.show(params);
    }
  };

  const Dialog = function (options, callback) {
    if (options.callback && !callback) {
      callback = options.callback;
    }

    if (typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        // eslint-disable-line
        msgQueue.push({
          options: Object.assign({}, defaults, options),
          callback: callback,
          resolve: resolve,
          reject: reject,
        });

        showNextMsg();
      });
    } else {
      msgQueue.push({
        options: Object.assign({}, defaults, options),
        callback: callback,
      });

      showNextMsg();
    }
  };

  return Dialog;
}
