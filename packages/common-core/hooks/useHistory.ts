import { LRUCache } from 'lru-cache';
import type { Ref } from 'vue';
import { createStorage } from '@common/utils/storage';
const storage = createStorage({ name: 'history' });

/**
 * 缓存类
 */
class HistorySearch {
  private key: string;
  private history: LRUCache<string, any>;
  constructor(key: string, limit = 8) {
    this.key = key;
    this.history = new LRUCache({ max: limit });
  }

  async load() {
    // this.history.load(info || {});
    return storage.getItem(this.key).then((data: any) => {
      this.history.load(data || []);
    });
  }

  push(key: string, obj: any) {
    this.history.set(key, obj);
  }

  async save() {
    return storage.setItem(this.key, this.history.dump());
  }

  values() {
    return Array.from(this.history.values());
  }
}

/**
 * 缓存工厂，按字段分别存储
 */
export const factory = {
  state: {} as Record<string, HistorySearch>,
  get(key: string) {
    let obj = this.state[key];
    if (!obj) {
      obj = new HistorySearch(key);
      this.state[key] = obj;
      obj.load();
    }

    return obj;
  },
};

interface selectOptionsType {
  label: string;
  options: any[];
}

export interface HistoryProps {
  cacheKey?: string; // 开启输入历史
  checkNull?: boolean; //是否包含null值
}

/**
 *
 * @param cacheKey
 * @returns
 */
export const useHistory = function (checkNull: Ref<boolean>, cacheKey = 'input', valueKey = ref('value'), labelKey = ref('label')) {
  const _history = factory.get(cacheKey);

  const historyOptions = ref<any[]>([]);
  const searchOptions = ref<any[]>([]);

  const nullValue = { [unref(labelKey)]: '空值', [unref(valueKey)]: 'null' };

  const selectOptions = computed<selectOptionsType[]>(() => {
    const res = [] as selectOptionsType[];
    if (unref(checkNull)) res.push({ label: '', options: [nullValue] });
    if (!!searchOptions.value?.length) res.push({ label: '', options: searchOptions.value });
    if (!!historyOptions.value?.length) res.push({ label: '最近输入', options: historyOptions.value });
    return res;
  });

  function resetHistory() {
    historyOptions.value = _history.values();
    return historyOptions.value;
  }

  function setOptions(val: any[]) {
    searchOptions.value = val;
  }

  //输入框数据存储
  function saveInput(val?: any) {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach((ele) => _history.push(ele[unref(valueKey)], ele));
    } else {
      _history.push(val[unref(valueKey)], val);
    }
    _history.save();
  }

  function findItem(val: any) {
    let item = searchOptions.value?.find((ele) => ele[unref(valueKey)] == val);
    if (!item) item = historyOptions.value?.find((ele) => ele[unref(valueKey)] == val);
    return toRaw(item);
  }

  return { selectOptions, resetHistory, saveInput, setOptions, findItem };
};
