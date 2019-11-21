<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>参数列表</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-back" @click="goToTemplateListView">返回</el-button>
            <el-button icon="el-icon-refresh" @click="searchParaTableList">刷新</el-button>
            <el-button icon="el-icon-plus" @click="goToParaAddView">添加</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 数据表格 -->
        <el-table :data="tableItems" border style="width:100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="参数名称"></el-table-column>
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
              <el-button @click="goToParaEditView(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="confirmDeletePara(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageination
          class="pagination"
          :pageNo="pagination.pageNo"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          @handlePagination="handleParaPageination"
        ></pageination>
        <!-- 数据表格 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { templatesAll } from "@/api/business/template";
import { list, remove } from "@/api/business/para";
import Pageination from "@/components/pagination";

export default {
  name: "ParaList",
  data() {
    return {
      loading: false,
      tableItems: [],
      pagination: {
        page: 1,
        size: 10,
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
      // 调用接口
      templatesAll()
        .then(res => {
          this.templates = res.data.data;
          // 查询参数列表
          this.searchParaTableList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询参数列表
    searchParaTableList() {
      this.loading = true;

      // 组装参数
      let pagination = this.pagination;
      let params = {
        page: pagination.pageNo,
        size: pagination.pageSize,
        templateId: this.templateId
      };

      list(params)
        .then(res => {
          let ret = res.data.data;

          this.tableItems = ret.rows;
          this.pagination.total = ret.total;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 处理参数分页
    handleParaPageination(params) {
      this.pagination.pageNo = params.pageNo;
      this.pagination.pageSize = params.pageSize;
      // 查询参数列表
      this.searchParaTableList();
    },
    // 跳转参数新增
    goToParaAddView() {
      this.$router.push("/commodity/para-add?templateId=" + this.templateId);
    },
    // 跳转参数编辑
    goToParaEditView(item) {
      this.$router.push("/commodity/para-add?id=" + item.id);
    },
    // 提醒参数删除
    confirmDeletePara(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理参数删除
          this.handleDeletePara(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理参数删除
    handleDeletePara(item) {
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
          // 查询参数列表
          this.searchParaTableList();
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
