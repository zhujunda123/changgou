<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>规格列表</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-back" @click="goToTemplateListView">返回</el-button>
            <el-button icon="el-icon-refresh" @click="searchSpecTableList">刷新</el-button>
            <el-button icon="el-icon-plus" @click="goToSpecAddView">添加</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="规格名称"></el-table-column>
          <el-table-column label="模板">
            <template
              slot-scope="scope"
            >{{ templates.find(element => { return element.id === scope.row.templateId }).name }}</template>
          </el-table-column>
          <el-table-column prop="options" label="可选值列表">
            <template slot-scope="scope">{{ scope.row.options.replace(new RegExp(",", "g"), "\n") }}</template>
          </el-table-column>
          <el-table-column prop="seq" label="排序"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="goToSpecEditView(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="confirmDeleteSpec(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageination
          class="pagination"
          :pageNo="pagination.pageNo"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          @handlePagination="handleSpecPageination"
        ></pageination>
        <!-- 数据表格 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { templatesAll } from "@/api/business/template";
import { list, remove } from "@/api/business/spec";
import Pageination from "@/components/pagination";

export default {
  name: "SpecList",
  data() {
    return {
      loading: false,
      tableItems: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      templateId: 0,
      templates: []
    };
  },
  created() {
    this.templateId = parseInt(this.$route.query.templateId, 10);
  },
  mounted() {
    // 查询模板列表
    this.searchTemplatesAll();
  },
  components: {
    Pageination
  },
  methods: {
    // 查询模板列表
    searchTemplatesAll() {
      console.log(333333333)
      // 调用接口
      templatesAll()
        .then(res => {
          this.templates = res.data.data;
          console.log(res.data.data)
           console.log(111111111)
          // 查询规格列表
          this.searchSpecTableList();
        })
        .catch(err => {
          console.log(err);
          console.log(2222)
        });
    },
    // 查询规格列表
    searchSpecTableList() {
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize,
        templateId: this.templateId
      };

      // 调用接口
      list(params)
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
    // 处理规格分页
    handleSpecPageination(params) {
      this.pagination.pageNo = params.pageNo;
      this.pagination.pageSize = params.pageSize;
      // 查询规格列表
      this.searchSpecTableList();
    },
    // 跳转规格新增
    goToSpecAddView() {
      this.$router.push("/commodity/spec-add?templateId=" + this.templateId);
    },
    // 跳转规格编辑
    goToSpecEditView(item) {
      this.$router.push("/commodity/spec-add?id=" + item.id);
    },
    // 提醒规格删除
    confirmDeleteSpec(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理规格删除
          this.handleDeleteSpec(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理规格删除
    handleDeleteSpec(item) {
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
          // 查询规格列表
          this.searchSpecTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转规格参数列表
    goToTemplateListView() {
      this.$router.push("/commodity/template-list");
    }
  }
};
</script>
