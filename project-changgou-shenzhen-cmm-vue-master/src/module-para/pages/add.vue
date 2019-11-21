<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>{{ form.id === 0 ? '添加参数' : '编辑参数' }}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-back" @click="goToParaListView">返回</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 表单区域 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="width:360px;">
          <el-form-item label="参数名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="属性值可选值列表：">
            <el-input type="textarea" v-model="options"></el-input>
          </el-form-item>
          <el-form-item label="参数排序：">
            <el-input v-model.number="form.seq"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitPara">提交</el-button>
          </el-form-item>
        </el-form>
        <!-- 表单区域 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { detail, add, update } from "@/api/business/para";

export default {
  name: "ParaAdd",
  data() {
    return {
      options: "",
      form: {
        id: 0,
        name: "",
        options: "",
        seq: "",
        templateId: 0
      },
      rules: {
        name: [{ required: true, message: "请填写参数名称", trigger: "blur" }]
      }
    };
  },
  created() {
    let query = this.$route.query;

    let id = query.id;
    if (id) {
      this.form.id = parseInt(id, 10);
    }
    let templateId = query.templateId;
    if (templateId) {
      this.form.templateId = parseInt(templateId, 10);
    }
  },
  mounted() {
    if (this.form.id) {
      // 查询参数详情
      this.searchParaDetail();
    }
  },
  methods: {
    // 查询参数详情
    searchParaDetail() {
      // 调用接口
      detail({
        id: this.form.id
      })
        .then(res => {
          this.form = res.data.data;
          this.options = this.form.options.replace(new RegExp(",", "g"), "\n");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提交参数表单
    handleSubmitPara() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return false;
        }
        this.form.options = this.options.replace(new RegExp("\n", "g"), ",");

        if (!this.form.id) {
          this.handleAddPara();
        } else {
          this.handleUpdatePara();
        }
      });
    },
    // 添加参数
    handleAddPara() {
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
          this.goToParaListView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑参数
    handleUpdatePara() {
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
          this.goToParaListView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转参数列表
    goToParaListView() {
      this.$router.push(
        "/commodity/para-list?templateId=" + this.form.templateId
      );
    }
  }
};
</script>
