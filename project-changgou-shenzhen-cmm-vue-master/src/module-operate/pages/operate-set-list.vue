<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="content-header">
      <h1>
        秒杀专区
        <small>设置商品</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>秒杀专区</el-breadcrumb-item>
        <el-breadcrumb-item>设置商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <!-- table -->
      <div class="box">
        <el-table :data="items" border fit highlight-current-row style="width: 100%;">
          <el-table-column label="编号" width="310px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="秒杀时段名称" width="300px">
            <template slot-scope="scope">
              <span class="link-type">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="每日开始时间" width="250px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="每日结束时间" width="250px">
            <template slot-scope="scope">
              <span>{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品数量" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{scope.row.pQuantity}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleList(scope.row)">商品列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- end -->
    </div>
  </div>
</template>

<script>
import { listset } from "@/api/base/operate";
export default {
  name: "set-list",
  components: {},
  data() {
    return {
      items: [
          {
              id:'1',
              title:'测试',
              beginTime:'2019-07-12',
              endTime:'2019-07-12',
              pQuantity:''
          }
      ],
      loading: false,
      linkId: ""
    };
  },
  methods: {
    // 业务方法
    handleList(val) {
    //   this.$router.push({path:'/spike/operatelist',query: { id: val.id }})
    this.$router.push({path:'/spike/operate-list',query:{id:val.id}})
    },
    // 数据列表
    async doQuery(paremt) {
      this.loading = true;

      await listset()
        .then(res => {
          this.items = res.data.data.rows;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
  },
  mounted() {
    // this.doQuery();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
