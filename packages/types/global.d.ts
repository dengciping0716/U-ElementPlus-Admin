interface Window {
  $loading: any;
  $message: any;
  $dialog: any;
  $http: any;
  // 语言
  $t: any;
  $vue: any;
  // 键盘按键记录
  $KeyboardActive?: { [T: string]: boolean };
  onKeySpacePressHold?: Function;
}
type AnyFunction<T> = (...args: any[]) => T;
type TimeoutHandle = ReturnType<typeof setTimeout>;
type IntervalHandle = ReturnType<typeof setInterval>;
// vue
type PropType<T> = VuePropType<T>;
type VueNode = VNodeChild | JSX.Element;

type RouteRecordItem = IRouteRecordItem;

type Nullable<T> = T | null;
type Recordable<T = any> = Record<string, T>;

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

//
declare interface HttpRsult<T = any> {
  result?: T;
  resultCode: string;
  resultMsg: string;
}
