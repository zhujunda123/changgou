<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>规格参数</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-refresh" @click="searchTemplateTableList">刷新</el-button>
            <el-button icon="el-icon-plus" @click="openTemplateAddDialog">添加</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="模板名称"></el-table-column>
          <el-table-column prop="specNum" label="规格数量"></el-table-column>
          <el-table-column prop="paraNum" label="参数数量"></el-table-column>
          <el-table-column fixed="right" label="设置" width="150">
            <template slot-scope="scope">
              <el-button @click="goToSpecListView(scope.row)" type="text" size="small">规格列表</el-button>
              <el-button @click="goToParaListView(scope.row)" type="text" size="small">参数列表</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="openTemplateEditDialog(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="confirmDeleteTemplate(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageination
          class="pagination"
          :pageNo="pagination.pageNo"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          @handlePagination="handleTemplatePageination"
        ></pageination>
        <!-- 数据表格 / -->

        <!-- 添加模板 -->
        <el-dialog
          :title="form.id === 0 ? '添加模板' : '编辑模板' "
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="400px"
        >
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="模板名称：" label-width="95px" prop="name">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmitTemplate">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加模板 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { templateList, add, update, remove } from "@/api/business/template";
import Pageination from "@/components/pagination";

export default {
  name: "Template",
  data() {
    return {
      loading: false,
      tableItems: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      form: {
        id: 0,
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请填写类型名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // 查询模板列表
    this.searchTemplateTableList();
  },
  components: {
    Pageination
  },
  methods: {
    // 查询模板列表
    searchTemplateTableList() {
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize
      };

      // 调用接口
      templateList(params)
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
    // 处理模板分页
    handleTemplatePageination(params) {
      this.pagination.pageNo = params.pageNo;
      this.pagination.pageSize = params.pageSize;
      // 查询模板列表
      this.searchTemplateTableList();
    },
    // 跳转规格列表
    goToSpecListView(item) {
      this.$router.push("/commodity/spec-list?templateId=" + item.id);
    },
    // 跳转参数列表
    goToParaListView(item) {
      this.$router.push("/commodity/para-list?templateId=" + item.id);
    },
    // 打开模板新增对话框
    openTemplateAddDialog() {
      this.form.id = 0;
      this.form.name = "";
      this.dialogVisible = true;
    },
    // 打开模板编辑对话框
    openTemplateEditDialog(item) {
      this.form.id = item.id;
      this.form.name = item.name;
      this.dialogVisible = true;
    },
    // 处理提交模板
    handleSubmitTemplate() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return false;
        }
        if (!this.form.id) {
          this.handleAddTemplate();
        } else {
          this.handleEditTemplate();
        }
      });
    },
    // 处理模板添加
    handleAddTemplate() {
      // 调用接口
      add(this.form)
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
          this.dialogVisible = false;
          this.searchTemplateTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 处理模板编辑
    handleEditTemplate() {
      // 调用接口
      update(this.form)
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
          this.dialogVisible = false;
          this.searchTemplateTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提醒模板删除
    confirmDeleteTemplate(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理模板删除
          this.handleDeleteTemplate(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理模板删除
    handleDeleteTemplate(item) {
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
          this.searchTemplateTableList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
