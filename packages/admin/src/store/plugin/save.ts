/**
 * https://github.com/Seb-L/pinia-plugin-persist
 * 自动存储state插件需要配置
 * save:{enabled:true}
 */
import storageUtil from '@common/utils/storage';
import type { PiniaPluginContext } from 'pinia';

export interface SaveStrategy {
  key?: string;
  storage?: StorageAdapter;
  paths?: string[];
}

export interface SaveOptions {
  enabled: true;
  strategies?: SaveStrategy[];
}

type Store = PiniaPluginContext['store'];
type PartialState = Partial<Store['$state']>;

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    save?: SaveOptions;
  }
}

export interface StorageAdapter {
  set(key: string, state: any): Promise<boolean>;
  get(key: string): Promise<object>;
}

export const sessionStorageAdapter: StorageAdapter = {
  set(key, state) {
    return Promise.resolve(sessionStorage.setItem(key, JSON.stringify(state))).then((e) => true);
  },
  get(key) {
    return Promise.resolve(JSON.parse(sessionStorage.getItem(key) || ''));
  },
};

export const defaultAdapter: StorageAdapter = {
  set(key, state) {
    // console.log('set',key)
    return storageUtil.setItem(key, state);
  },
  get(key) {
    // console.log('get',key)
    return storageUtil.getItem<any>(key);
  },
};

export const updateStorage = (strategy: SaveStrategy, store: Store) => {
  const storage = strategy.storage || defaultAdapter;
  const storeKey = strategy.key || store.$id;
  if (strategy.paths) {
    const partialState = strategy.paths.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key];
      return finalObj;
    }, {} as PartialState);

    storage.set(storeKey, toRaw(partialState));
  } else {
    storage.set(storeKey, toRaw(store.$state));
  }
};

export default ({ options, store }: PiniaPluginContext): void => {
  if (!options.save?.enabled) return;
  let { strategies } = options.save;
  const defaultStrat: SaveStrategy = { key: 'pinia_' + store.$id, storage: defaultAdapter };

  const strategieList = strategies?.length ? strategies : [defaultStrat];

  const list = strategieList.map((strategy) => {
    const storage = strategy.storage || defaultAdapter;
    const storeKey = strategy.key || defaultStrat.key;
    return storage.get(storeKey as string).then((res: any) => {
      if (res) {
        // console.log('pinia patch:', storeKey, res);
        store.$patch(res);
        updateStorage(strategy, store);
      }
    });
  });
  Promise.all(list).finally(() => {
    store.$subscribe(() => {
      strategieList.forEach((strategy) => {
        updateStorage(strategy, store);
      });
    });
  });
};
