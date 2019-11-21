<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="formSearch">
          <el-form-item label="输入搜索：">
            <el-input v-model="formSearch.name" clearable placeholder="品牌名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchBrandTableList">查询</el-button>
            <el-button icon="el-icon-plus" @click="goToBrandAddView">添加</el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索栏 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="品牌名称"></el-table-column>
          <el-table-column prop="letter" label="品牌首字母"></el-table-column>
          <el-table-column label="LOGO">
            <template slot-scope="scope">
              <img :src="scope.row.image">
            </template>
          </el-table-column>
          <!-- "相关"字段，后台未提供 -->
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="goToBrandEditView(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="confirmDeleteBrand(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageination
          class="pagination"
          :pageNo="pagination.pageNo"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          @handlePagination="handleBrandPageination"
        ></pageination>
        <!-- 数据表格 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { brandList,searchBrandList, remove } from "@/api/business/brand";
import Pageination from "@/components/pagination";

export default {
  name: "BrandList",
  data() {
    return {
      loading: false,
      formSearch: {
        page: 1,
        size: 10,
        name: this.name
      },
      tableItems: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    // 查询品牌列表
    this.brandList();
  },
  components: {
    Pageination
  },
  methods: {
    // 查询品牌列表
    searchBrandTableList() {
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize,
        data: {}
      };
      let name = this.formSearch.name;
      if (name) {
        params.data.name = name;
      }

      // 调用接口
      searchBrandList(params)
        .then(res => {
          let ret = res.data.data;

          this.tableItems = ret.list;
          this.pagination.total = ret.total;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    brandList(){
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize,
        data: {}
      };
      let name = this.formSearch.name;
      if (name) {
        params.data.name = name;
      }
       // 调用接口
      brandList(params)
        .then(res => {
          let ret = res.data.data;

          this.tableItems = ret.list;
          this.pagination.total = ret.total;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 处理品牌分页
    handleBrandPageination(params) {
      this.pagination.pageNo = params.pageNo;
      this.pagination.pageSize = params.pageSize;
      // 查询品牌列表
      this.searchBrandTableList();
    },
    // 跳转品牌新增
    goToBrandAddView() {
      this.$router.push("/commodity/brand-add");
    },
    // 跳转品牌编辑
    goToBrandEditView(item) {
      this.$router.push("/commodity/brand-add?id=" + item.id);
    },
    // 提醒品牌删除
    confirmDeleteBrand(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理品牌删除
          this.handleDeleteBrand(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理品牌删除
    handleDeleteBrand(item) {
      // 调用接口
      remove({
        id: item.id
      })
        .then(res => {
          let data = res.data;

          if (data.code != 20000) {
            this.$message({
              type: "error",
              message: data.message
            });
            return;
          }
          this.$message({
            type: "success",
            message: data.message
          });
          // 查询品牌列表
          this.searchBrandTableList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
