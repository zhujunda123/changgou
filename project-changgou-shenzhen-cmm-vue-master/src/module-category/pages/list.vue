<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>{{ levels[currentLevel] }}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button
              icon="el-icon-back"
              v-if="currentLevel > 1"
              @click="goBackCategoryTableList"
            >返回</el-button>
            <el-button icon="el-icon-refresh" @click="searchCategoryTableList">刷新</el-button>
            <el-button icon="el-icon-plus" @click="goToCategoryAddView(parentId)">添加</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column label="级别">
            <template slot-scope="scope">{{ currentLevel }}</template>
          </el-table-column>
          <!-- 数量单位字段，后台未提供 -->
          <el-table-column prop="goodsNum" label="商品数量"></el-table-column>
          <el-table-column label="导航栏">
            <template slot-scope="scope">
              <el-switch active-value="1" inactive-value="0" v-model="scope.row.isMenu" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否显示">
            <template slot-scope="scope">
              <el-switch active-value="1" inactive-value="0" v-model="scope.row.isShow" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="seq" label="排序"></el-table-column>
          <el-table-column v-if="currentLevel < 3" fixed="right" label="设置" width="150">
            <template slot-scope="scope">
              <el-button @click="goToCategoryAddView(scope.row.id)" type="text" size="small">新增下级</el-button>
              <el-button @click="handleViewCategory(scope.row)" type="text" size="small">查看下级</el-button>
              <!-- 转移商品功能，后台未提供 -->
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="goToCategoryEditView(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="confirmDeleteCategory(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据表格 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { categoryList, detail, remove } from "@/api/business/category";

export default {
  name: "CategoryList",
  data() {
    const levels = {
      1: "商品分类",
      2: "二级分类",
      3: "三级分类"
    };
    return {
      loading: false,
      parentId: 0,
      levels: levels,
      currentLevel: 1,
      tableItems: []
    };
  },
  mounted() {
    // 查询商品分类列表
    this.searchCategoryTableList();
  },
  methods: {
    // 查询商品分类列表
    searchCategoryTableList() {
      this.loading = true;

      // 组装参数
      let params = {
        parentId: this.parentId
      };

      // 调用接口
      categoryList(params)
        .then(res => {
          this.tableItems = res.data.data;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 返回商品分类列表
    goBackCategoryTableList() {
      this.currentLevel--;

      // 调用接口
      detail({
        id: this.parentId
      })
        .then(res => {
          let data = res.data;

          if (data.code != 20000) {
            return;
          }
          this.parentId = data.data.parentId;
          // 查询商品分类列表
          this.searchCategoryTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转商品分类新增
    goToCategoryAddView(parentId) {
      this.$router.push("/commodity/category-add?parentId=" + parentId);
    },
    // 处理商品分类编辑
    goToCategoryEditView(item) {
      this.$router.push("/commodity/category-add?id=" + item.id);
    },
    // 处理商品分类查看
    handleViewCategory(item) {
      this.parentId = item.id;
      this.currentLevel++;
      // 查询商品分类列表
      this.searchCategoryTableList();
    },
    // 提醒商品分类删除
    confirmDeleteCategory(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理商品分类删除
          this.handleDeleteCategory(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理商品分类删除
    handleDeleteCategory(item) {
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
          // 查询商品分类列表
          this.searchCategoryTableList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
