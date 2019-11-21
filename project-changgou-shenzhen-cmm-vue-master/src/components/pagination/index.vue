<template>
  <el-pagination
    :current-page="pageNo"
    :page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    :layout="layout"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  ></el-pagination>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      reqiured: true,
      total: Number
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("handlePagination", { pageNo: val, pageSize: this.pageSize });
    },
    handleSizeChange(val) {
      this.$emit("handlePagination", { pageNo: this.pageNo, pageSize: val });
    }
  }
};
</script>

<style scoped>
.el-pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
