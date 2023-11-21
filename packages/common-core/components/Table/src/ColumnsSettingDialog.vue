<template>
  <el-dialog title="设置显示字段" append-to-body v-model="dialogVisible" width="960px" v-bind="$attrs">
    <div class="flex overflow-auto" style="height: 400px">
      <div class="flex-1 pr-5 overflow-auto">
        <div v-for="(children, key) in columsGroup" :key="key">
          <div class="mb-2 font-600">{{ key }}</div>
          <el-checkbox-group class="mb-2" v-model="checkList">
            <el-checkbox class="w-30 mb-2" v-for="(item, index) in children" :key="index" :label="item">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="w-50 border-solid border-0 border-l-1 border-stone pl-5 overflow-auto">
        <div class="mb-2 font-600">当前选定的字段</div>

        <draggable v-if="showDrag" v-model="checkList" itemKey="prop" :component-data="{ name: 'fade' }" animation="300">
          <template #item="{ element, index }">
            <div class="flex items-center mb-1">
              <span class="mover cursor-grab pr-2 i-carbon-draggable"></span>
              <span class="flex-1">{{ element.label }}</span>
              <span class="el-icon-close cursor-pointer py-1 px-2" @click="checkList.splice(index, 1)"></span>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="" @click="reset">重 置</el-button>
        <el-button size="small" type="primary" @click="confirm">保 存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
/**
 * 表格设置显示字段弹窗组件
 */
import draggable from 'vuedraggable';
import { groupBy } from 'lodash-es';

const DEFAULT_META = { visible: true, typeName: '常规字段' };

export default {
  name: 'mTableColumnsSettingDialog',
  components: { draggable },
  data() {
    return {
      showDrag: false,
      checkList: [],
    };
  },
  props: {
    modelValue: Boolean,
    value: Array,
    columns: Array,
  },

  computed: {
    dialogVisible: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit('update:modelValue', v);
      },
    },
    columsGroup() {
      return groupBy(this.columns, 'meta.typeName');
    },
  },
  watch: {
    value: {
      handler(v = []) {
        this.checkList = [...v];
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.showDrag = true;
    });
  },
  methods: {
    reset() {
      const allColumns = this.columns;
      this.checkList = allColumns.filter((item) => item.meta?.visible);
    },
    confirm() {
      this.$emit('confirm', [...this.checkList]);
      this.dialogVisible = false;
    },
  },
};
</script>
