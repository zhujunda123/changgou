<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="formSearch">
          <el-form-item label="输入搜索：">
            <el-input v-model="formSearch.title" clearable placeholder="相册名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchAlbumTableList">查询</el-button>
            <el-button icon="el-icon-plus" @click="goToAlbumAddView">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索栏 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="title" label="相册名称"></el-table-column>
          <el-table-column label="封面" prop="image" ></el-table-column> 
             <!-- <el-table-column prop="imageItems"  label="imageItems"> </el-table-column> -->

          <!-- <el-table-column label="封面">
            <template slot-scope="scope">
              <img :src="scope.row.image">
            </template>
          </el-table-column>  -->
    
           
          <el-table-column label="图片数量">
            <template slot-scope="scope">
              {{ scope.row.imageItems ? (scope.row.imageItems).length : 0 }}
              </template>
          </el-table-column> 
          <!-- 排序和描述字段，后台未提供 -->
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="goToAlbumDetailView(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="goToAlbumEditView(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="confirmDeleteAlbum(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageination
          class="pagination"
          :pageNo="pagination.pageNo"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          @handlePagination="handleAlbumPagination"
        ></pageination>
        <!-- 数据表格 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { list, remove } from "@/api/business/album";
import Pageination from "@/components/pagination";

export default {
  name: "AlbumList",
  data() {
    return {
      loading: false,
      formSearch: {
        title: ""
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
    // 查询相册列表
    this.searchAlbumTableList();
  },
  components: {
    Pageination
  },
  methods: {
    // 查询相册列表
    searchAlbumTableList() {
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize
      };
      let title = this.formSearch.title;
      if (title) {
        params.title = title;
      }

      // 调用接口
      list(params)
        .then(res => {
          let ret = res.data.data;

          this.tableItems = ret.list;
          console.log(ret.list)
          this.pagination.total = ret.total;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 处理相册分页
    handleAlbumPagination(params) {
      this.pagination.pageNo = params.pageNo;
      this.pagination.pageSize = params.pageSize;
      // 刷新相册列表
      this.searchAlbumTableList();
    },
    // 跳转相册查看
    goToAlbumDetailView(item) {
      this.$router.push("/commodity/album-detail?id=" + item.id);
    },
    // 跳转相册新增
    goToAlbumAddView() {
      this.$router.push("/commodity/album-add");
    },
    // 跳转相册编辑
    goToAlbumEditView(item) {
      this.$router.push("/commodity/album-add?id=" + item.id);
    },
    // 提醒相册删除
    confirmDeleteAlbum(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理相册删除
          this.handleDeleteAlbum(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理相册删除
    handleDeleteAlbum(item) {
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
          // 查询相册列表
          this.searchAlbumTableList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
