// import { ElMessage } from 'element-plus';
import { usePermissionStore } from '@/store/permission/permissionStore';

/** 自定义指令 按钮权限 */
export const BtnOauthTip = {
  mounted(el, binding, vnode, prevVnode) {
    let { hasOauth } = usePermissionStore();
    const route = binding.instance.$parent.$route;
    if (!hasOauth(route?.meta?.menuCode, binding.value)) {
      el.classList.add('is-disabled');
      el.disabled = true;
      //

      el.addEventListener(
        'mouseenter',
        function (event) {
          event.stopPropagation();
          // highlight the mouseenter target
          // event.target.style.color = 'purple';

          // // reset the color after a short delay
          // setTimeout(function() {
          //   event.target.style.color = '';
          // }, 500);
        },
        false
      );
      el.addEventListener(
        'mouseover',
        function (event) {
          event.stopPropagation();
          // highlight the mouseenter target
          // event.target.style.color = 'purple';

          // // reset the color after a short delay
          // setTimeout(function() {
          //   event.target.style.color = '';
          // }, 500);
        },
        false
      );
      let ele = document.createElement('div');
      ele.classList.add('message-oauth');
      ele.innerText = '您的账号没有此项操作权限，请联系管理员~';
      el.classList.add('message-oauth-wrap');
      el.appendChild(ele);
    }
  },
};

const toggle = function (el, hidden) {
  if (hidden) {
    el.classList.add('hidden');
  } else {
    el.classList.remove('hidden');
  }
};

export const BtnOauthShow = {
  // 绑定钩子，只会调用一次
  beforeMount: function (el, binding, vnode) {
    const route = binding.instance.$parent.$route;
    const { hasOauth } = usePermissionStore();
    let bool = hasOauth(route?.meta?.menuCode, binding.value);
    toggle(el, !bool);
  },
  // 数据更新钩子，数据更新时调用。主要是翻页时候用到。
  beforeUpdate: function (el, binding, vnode) {
    const route = binding.instance.$parent.$route;
    const { hasOauth } = usePermissionStore();
    let bool = hasOauth(route?.meta?.menuCode, binding.value);
    toggle(el, !bool);
  },
};

export const BtnOauthHide = {
  // 绑定钩子，只会调用一次
  beforeMount: function (el, binding, vnode) {
    const route = binding.instance.$parent.$route;
    const { hasOauth } = usePermissionStore();
    let bool = hasOauth(route?.meta?.menuCode, binding.value);
    toggle(el, bool);
  },
  // 数据更新钩子，数据更新时调用。主要是翻页时候用到。
  beforeUpdate: function (el, binding, vnode) {
    const route = binding.instance.$parent.$route;
    const { hasOauth } = usePermissionStore();
    let bool = hasOauth(route?.meta?.menuCode, binding.value);
    toggle(el, bool);
  },
};
