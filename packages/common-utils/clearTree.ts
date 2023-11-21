import { isArray } from 'lodash-es';
/**
 *
 * @param {树状结构数据} tree
 * @param {子集字段的key} children
 * @param {可传入方法对子项进行特殊处理(非必传)} fn
 */
function clearTree(tree, children = 'children', fn: any = null) {
  for (let i = 0, l = tree.length; i < l; i++) {
    if (fn && typeof fn === 'function') {
      fn(tree[i]);
    }
    let child = tree[i][children];
    if (isArray(child) && child.length === 0) {
      tree[i][children] = null;
    } else {
      clearTree(child, children, fn);
    }
  }
}
export default clearTree;
