<template>
  <div class="m-select-table">
    <div class="table-wrapper">
      <p v-if="!multiple" style="color: #999; line-height: 30px; font-size: 12px">
        <i class="el-icon-warning-outline" style="margin-right: 4px"></i>点击"选中"按钮或双击行即可选中
      </p>
      <el-table
        ref="table"
        :data="tableData"
        @row-dblclick="select"
        @row-click="rowClick"
        @select="onSelect"
        @select-all="onSelectAll"
        class="table-no-btns"
        style="width: 100%; position: relative"
        v-bind="$attrs"
        v-on="$listeners">
        <!-- <el-table-column label="#" header-align="center" align="center" minWidth="35">
          <template slot-scope="scope">
            {{ scope.$index + 1 + (page.targetPage - 1) * page.pageSize }}
          </template>
        </el-table-column> -->
        <el-table-column v-if="multiple" type="selection" width="35" fixed="left"> </el-table-column>

        <template v-for="(item, i) in tableColumns" :key="i">
          <el-table-column
            show-overflow-tooltip
            header-align="left"
            :min-width="item.width"
            :prop="item.prop"
            :label="item.label"
            :formatter="item.formatter">
          </el-table-column>
        </template>

        <el-table-column v-if="!multiple" label="操作" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <div class="control-btns">
              <el-button size="small" type="primary" @click="select(scope.row)">选择</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="clearfix" v-if="isPage">
        <el-pagination
          :background="pageOpt.background"
          :layout="pageOpt.layout"
          :page-sizes="pageOpt.pageSizes"
          @current-change="pageChange"
          @size-change="pageSizeChange"
          :total="page.totalCount"
          :pager-count="5"
          :current-page="page.targetPage"
        >
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
/**
 * 带可选行功能的表格，可单选、多选
 */
export default {
  name: 'mSelectTreeTable',

  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  components: {},
  props: {
    multiple: {
      // 是否多选
      type: Boolean,
      default: false,
    },
    tableColumns: {
      // 表头、列渲染信息
      type: Array,
      required: true,
    },
    options: Array,
  },
  methods: {
    toggleRowSelection() {
      this.$refs.table.toggleRowSelection(...arguments);
    },
    /** 单选状态 选中行 */
    select(row) {
      if (this.multiple) {
        return;
      }
      this.$emit('select-row', row);
    },
    /** 点击表格行 */
    rowClick(row, column, event) {
      if (!this.multiple) {
        return;
      }
      this.$refs.table.toggleRowSelection(row);

      this.$emit('onSelect', this.$refs.table.selection, row);
    },
    /** table选中单项 */
    onSelect(selection, row) {
      this.$emit('onSelect', selection, row);
    },
    /** table选中所有 */
    onSelectAll(selection) {
      this.$emit('onSelectAll', selection);
    },
    getSelectedRows() {
      if (!this.multiple) {
        return [];
      }
      return this.$refs.table.selection || [];
    },
  },
  watch: {
    options: {
      immediate: true,
      handler(v) {
        if (v) this.tableData = v;
      },
    },
  },
  mounted() {},
  created() {},
};
</script>
