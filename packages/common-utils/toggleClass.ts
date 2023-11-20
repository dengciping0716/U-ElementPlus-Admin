const docEle = document.documentElement;
export function toggleClass(flag: boolean, clsName: string, targetEl = docEle) {
  let { className } = targetEl;
  className = className.replace(clsName, '');
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

export function setCssVar(prop: string, val: any, targetEl = docEle) {
  targetEl.style.setProperty(prop, val);
}
