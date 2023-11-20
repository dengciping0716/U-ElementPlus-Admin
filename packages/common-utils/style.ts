import Color from 'color';
// 
export const getCssVar = (arg1: string, arg2?: string) => {
  return `var(${getCssVarName(arg1, arg2)})`;
};
export const getCssVarName = (arg1: string, arg2?: string) => {
  const $namespace = 'el';
  return `--${$namespace}-${arg1}` + (arg2 ? '-' + arg2 : '');
};

// * 动画
export const animationsClass = (animations: string[]) => {
  if (animations.length) {
    return `animate__animated  animate__${animations[0]}`;
  }
  return '';
};

/**
 * * hsla 转换
 * @param color 颜色
 * @param alpha 默认1
 * @returns
 */
export function alpha(color: string, alpha = 1) {
  return Color(color).alpha(alpha).toString();
}

/**
 * * 颜色透明
 * rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
 * @param color 颜色
 * @param concentration 0~1 浓度
 * @returns
 */
export function fade(color: string, fade: number) {
  return Color(color).fade(fade).toString();
}

/**
 * * 颜色变亮
 * hsl(100, 50%, 10%) -> hsl(100, 50%, 50%)
 * @param color 颜色
 * @param concentration 0~1 浓度
 * @returns
 */
export function lighten(color: string, concentration: number) {
  return Color(color).lighten(concentration).toString();
}

/**
 * * 颜色变暗
 * hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)
 * @param color 颜色
 * @param concentration 0~1 浓度
 * @returns
 */
export function darken(color: string, concentration: number) {
  return Color(color).darken(concentration).toString();
}

/**
 * * hsl 转成16进制
 * @param hsl
 * @returns
 */
export function hslToHexa(hslString: string): string {
  const color = Color(hslString);
  return color.hexa();
}

export function hslToHex(hslString: string): string {
  const color = Color(hslString);
  return color.hex();
}

/**
 * 颜色变淡
 * @param target
 * @param number
 * @returns
 */
export function mixLevel(target: string, number: number): string {
  const color = Color('rgb(255, 255, 255)');
  return color.mix(Color(target), 1 - number).toString();
}
