declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

declare module '@okui/utils/*';
declare module 'md5';
declare module 'dom-helpers';

declare module 'element-plus/dist/locale/zh-cn.mjs';

declare module 'mockjs';
