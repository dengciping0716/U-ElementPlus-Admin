<template>
  <el-cascader
    ref="cascader"
    v-bind="$attrs"
    :options="options"
    :props="props"
    :value="mValue"
    @clear="clear()"
    @visible-change="handlerVisibleChange"
    @change="valueChange">
  </el-cascader>
</template>

<script>
import { sleep } from '@common/utils/promise';

export default {
  name: 'mCascader',

  data() {
    return {
      loading: false,
      mValue: '',
      cache: [],
    };
  },
  components: {},
  props: {
    value: {
      type: [String, Array],
      default: '',
    },
    options: Array,
    label: String,
    props: Object,
  },
  computed: {},
  methods: {
    async handlerVisibleChange(visible) {
      if (visible) return;
      // 取消选择时，避免输入框无值
      this.$emit('update:label', this.$refs.cascader.inputValue);

      this.$emit('input', this.mValue);
      this.$emit('change', this.mValue);

      let nodes = this.$refs.cascader.getCheckedNodes();
      if (nodes?.length && !!nodes[0]) {
        let objs = nodes.map((item) => item?.data);

        if (this.props.multiple) {
          this.$emit('change-data', objs);
        } else {
          this.$emit('change-data', objs[0]);
        }
      }

      await sleep(500);
      let label = this.cache[this.mValue];
      if (label) this.$refs.cascader.inputValue = label;
    },
    getObject(array, key, value) {
      var o;
      array.some(function iter(a) {
        if (a[key] === value) {
          o = a;
          return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
      });
      return o;
    },
    async valueChange(v, n) {
      this.mValue = v;
    },
    clear() {
      this.$emit('input', '');
      this.$emit('clear');
    },
  },
  watch: {
    value: {
      immediate: true,
      handler: async function (v) {
        this.mValue = v;
      },
    },
    label: {
      immediate: true,
      handler: async function (v) {
        await this.$nextTick();
        this.$refs.cascader.inputValue = v;
        this.cache[this.mValue] = v;
      },
    },
  },
  mounted() {},
  created() {},
};
</script>
