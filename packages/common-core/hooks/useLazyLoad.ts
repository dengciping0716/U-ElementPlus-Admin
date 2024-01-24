/** */
import type { Ref } from 'vue';

export interface LazyProps<T> {
  label: string;
  value: string;
  lazyLoad: (params: { searchKey?: string; pageSize: number; targetPage: number }) => Promise<any[] | null>;
}

export const useLazyLoad = function (props?: LazyProps<any>) {
  const loading = ref(false);
  const options = ref<Nullable<any>>(null);

  const valueKey = computed(() => props?.value || 'value');
  const labelKey = computed(() => props?.label || 'label');

  async function remoteSearch(searchKey?: string) {
    if (searchKey === '') return;
    console.log('remoteSearch:', searchKey);

    loading.value = true;
    options.value = await props?.lazyLoad({ searchKey, pageSize: 50, targetPage: 1 }).catch(() => null);
    loading.value = false;
  }

  watchEffect(() => {
    if (!!props?.lazyLoad) remoteSearch();
  });
  return { loading, valueKey, labelKey, options, remoteSearch };
};
