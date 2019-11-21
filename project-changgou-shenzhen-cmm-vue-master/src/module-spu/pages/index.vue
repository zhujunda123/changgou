<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="formSearch" class="spu-form">
          <el-form-item label="输入搜索：">
            <el-input v-model="formSearch.name" clearable placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              v-model="formSearch.categoryIds"
              :options="categoryTree"
              :props="{label: 'name', value: 'id'}"
              clearable
              placeholder="请选择商品分类"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="formSearch.brandId" clearable placeholder="请选择品牌">
              <el-option
                v-for="(item, index) in brandsAll"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchSpuTableList">查询</el-button>
            <el-button @click="clearSpuConditions">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索栏 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.image">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column label="商品分类">
            <template
              slot-scope="scope"
            >{{ scope.row.category1Name }} -> {{ scope.row.category2Name }} -> {{ scope.row.category3Name }}</template>
          </el-table-column>
          <el-table-column prop="sn" label="货号"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleRestoreSpu(scope.row)" type="text" size="small">还原</el-button>
              <el-button @click="confirmDeleteSpu(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageination
          class="pagination"
          :pageNo="pagination.pageNo"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          @handlePagination="handleSpuPageination"
        ></pageination>
        <!-- 数据表格 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { categorysAll } from "@/api/business/category";
import { brandsAll } from "@/api/business/brand";
import { list, restore, remove } from "@/api/business/spu";
import { getTrees } from "@/utils/tree";
import Pageination from "@/components/pagination";

export default {
  name: "Spu",
  data() {
    return {
      loading: false,
      formSearch: {
        name: "",
        categoryIds: [],
        brandId: ""
      },
      categoryList: [],
      categoryTree: [],
      brandsAll: [],
      tableItems: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    // 查询商品分类列表
    this.searchCategorysAll();
    // 查询品牌列表
    this.searchBrandList();
  },
  components: {
    Pageination
  },
  methods: {
    // 查询商品分类列表
    searchCategorysAll() {
      // 调用接口
      categorysAll()
        .then(res => {
          let temp = res.data.data;

          this.categoryList = temp;
          this.categoryTree = getTrees(JSON.parse(JSON.stringify(temp)), 0);

          // 查询商品回收站列表
          this.searchSpuTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询品牌列表
    searchBrandList() {
      // 调用接口
      brandsAll()
        .then(res => {
          this.brandsAll = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询商品回收站列表
    searchSpuTableList() {
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize,
        isDelete: "1"
      };
      for (let key in this.formSearch) {
        let value = this.formSearch[key];
        if (key != "categoryIds") {
          if (value) {
            params[key] = value;
          }
        } else {
          if (value.length) {
            params.category1Id = value[0];
            params.category2Id = value[1];
            params.category3Id = value[2];
          }
        }
      }

      // 调用接口
      list(params)
        .then(res => {
          let ret = res.data.data;

          let categoryList = this.categoryList;
          ret.list.forEach(element => {
            let category1 = categoryList.find(item => {
              return item.id === element.category1Id;
            });
            if (category1) {
              element.category1Name = category1.name;
            }
            let category2 = categoryList.find(item => {
              return item.id === element.category2Id;
            });
            if (category2) {
              element.category2Name = category2.name;
            }
            let category3 = categoryList.find(item => {
              return item.id === element.category3Id;
            });
            if (category3) {
              element.category3Name = category3.name;
            }
          });
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
    // 清空商品回收站条件
    clearSpuConditions() {
      for (let key in this.formSearch) {
        if (key != "categoryIds") {
          this.formSearch[key] = "";
        } else {
          this.formSearch[key] = [];
        }
      }
      // 查询商品回收站列表
      this.searchSpuTableList();
    },
    // 处理商品回收站分页
    handleSpuPageination(params) {
      this.pagination.pageNo = params.pageNo;
      this.pagination.pageSize = params.pageSize;
      // 查询商品回收站列表
      this.searchSpuTableList();
    },
    // 处理商品回收站还原
    handleRestoreSpu(item) {
      // 调用接口
      restore({
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
          // 查询商品回收站列表
          this.searchSpuTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提醒商品回收站删除
    confirmDeleteSpu(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理商品回收站删除
          this.handleDeleteSpu(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理商品回收站删除
    handleDeleteSpu(item) {
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
          // 查询商品回收站列表
          this.searchSpuTableList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.spu-form .el-form-item__content {
  width: 190px;
}
</style>