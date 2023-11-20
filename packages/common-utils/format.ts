/**
 * 格式化千分位数字
 * @param {number, string} value
 * @returns 100,000.00
 */
export const numStr = function (value: string | number) {
  if (!Number.isFinite(+value)) return value;
  return (value + '').replace(/(?=(?!^)(?:\d{3})+(?:\.|$))(\d{3}(\.\d+$)?)/g, ',$1');
};
