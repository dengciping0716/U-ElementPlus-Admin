import type { Ref, ComputedRef } from 'vue';
import type { BasicTableProps, TableActionType, SearchState } from '../BasicTable';
import { provide, inject } from 'vue';

const key = Symbol('basic-table');

type Instance = TableActionType & {
  searchState: SearchState;
  wrapRef: Ref<Nullable<HTMLElement>>;
  getBindValues: ComputedRef<Recordable>;
};

type RetInstance = Omit<Instance, 'getBindValues'> & {
  getBindValues: ComputedRef<BasicTableProps>;
};

export function createTableContext(instance: Instance) {
  provide(key, instance);
}

export function useTableContext(): RetInstance {
  return inject(key) as RetInstance;
}
