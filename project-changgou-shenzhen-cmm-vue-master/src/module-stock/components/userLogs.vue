<template>
  <div>
    <el-table :data="itemsData" border style="width: 100%">
      <el-table-column prop="number" label="时间" width="200"></el-table-column>
      <el-table-column prop="ordernumner" label="IP" width="200"></el-table-column>
      <el-table-column prop="user" label="地区"></el-table-column>
      <el-table-column prop="payment" label="登录方式" width="200"></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        class="pagiantion"
        v-show="total>0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      itemsData: [],
      pagination: {
        page: 1,
        pagesize: 10
      },
      total:null
    };
  },
  methods: {
    // 业务方法
    // 数据列表
    async doQuery(paremt) {
      this.loading = true;
      var paremt = this.pagination;

      await list(paremt)
        .then(res => {
          this.items = res.data.data.rows;
          this.total = res.data.data.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 每页条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagination.pagesize = val;
      this.doQuery(this.pagination);
    },
    // 当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagination.page = val;
      this.doQuery(this.pagination);
    },
  }
};
</script>

<style>
</style>

