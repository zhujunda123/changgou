<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>{{ form.id === 0 ? '添加分类' : '编辑分类' }}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-back" @click="goToCategoryListView">返回</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 表单区域 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="width:360px;">
          <el-form-item label="分类名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="上级分类：">{{ parentName }}</el-form-item>
          <el-form-item label="排序：">
            <el-input v-model="form.seq"></el-input>
          </el-form-item>
          <el-form-item label="是否显示：">
            <el-switch active-value="1" inactive-value="0" v-model="form.isShow"></el-switch>
          </el-form-item>
          <el-form-item label="是否显示在导航栏：">
            <el-switch active-value="1" inactive-value="0" v-model="form.isMenu"></el-switch>
          </el-form-item>
          <el-form-item label="选择模板：">
            <el-select v-model="form.templateId" placeholder="请选择模板">
              <el-option
                v-for="(item, index) in templates"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitCategory">提交</el-button>
          </el-form-item>
        </el-form>
        <!-- 表单区域 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { categorysAll, detail, add, update } from "@/api/business/category";
import { templatesAll } from "@/api/business/template";

export default {
  name: "CategoryAdd",
  data() {
    return {
      form: {
        id: 0,
        name: "",
        parentId: "",
        seq: "",
        isShow: "1",
        isMenu: "1",
        templateId: "",
        goodsNum: 0
      },
      rules: {
        name: [{ required: true, message: "请填写分类名称", trigger: "blur" }]
      },
      categorys: [],
      templates: []
    };
  },
  created() {
    let query = this.$route.query;
    let id = query.id;
    if (id) {
      this.form.id = id;
    }
    // 上级分类
    let parentId = query.parentId;
    if (parentId) {
      this.form.parentId = parseInt(parentId, 10);
    }
  },
  mounted() {
    // 查询商品分类列表
    this.searchCategoryList();
    // 查询模板列表
    this.searchTemplatesAll();
    if (this.form.id) {
      // 查询商品分类
      this.searchCategoryDetail();
    }
  },
  computed: {
    parentName() {
      let parentId = this.form.parentId;
      if (parentId == undefined || parentId === "") {
        return "";
      }
      if (parentId === 0) {
        return "顶级分类";
      }
      let category = this.categorys.find(element => {
        return element.id === parentId;
      });
      if (!category || !category.name) {
        return "";
      }
      return category.name;
    }
  },
  methods: {
    // 查询商品分类列表
    searchCategoryList() {
      // 调用接口
      categorysAll()
        .then(res => {
          this.categorys = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询模板列表
    searchTemplatesAll() {
      // 调用接口
      templatesAll()
        .then(res => {
          let ret = res.data.data;

          this.templates = ret;
          this.form.templateId = ret[0].id;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询商品分类
    searchCategoryDetail() {
      // 调用接口
      detail({
        id: this.form.id
      })
        .then(res => {
          this.form = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提交分类表单
    handleSubmitCategory() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return false;
        }
        let parentId = this.form.parentId;
        if (!parentId) {
          this.form.parentId = 0;
        }

        if (!this.form.id) {
          this.handleAddCategory();
        } else {
          this.handleUpdateCategory();
        }
      });
    },
    // 添加商品分类
    handleAddCategory() {
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
          this.goToCategoryListView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑商品分类
    handleUpdateCategory() {
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
          this.goToCategoryListView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转商品分类列表
    goToCategoryListView() {
      this.$router.push("/commodity/category-list");
    }
  }
};
</script>
