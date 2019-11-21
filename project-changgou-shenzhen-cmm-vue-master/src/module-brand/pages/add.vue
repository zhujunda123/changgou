<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>{{ form.id === 0 ? '添加品牌' : '编辑品牌' }}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-back" @click="goToBrandListView">返回</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <!-- 表单区域 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="width:510px;">
          <el-form-item label="品牌名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母：">
            <el-input v-model="form.letter"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO：" prop="image">
            <el-upload
              action="/upload"
              drag
              :multiple="false"
              accept="image/jpeg,image/png"
              :limit="1"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过50kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitBrand">提交</el-button>
          </el-form-item>
        </el-form>
        <!-- 表单区域 / -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { detail, add, update, upload } from "@/api/business/brand";

export default {
  name: "BrandAdd",
  data() {
    return {
      form: {
        id: 0,
        name: "",
        letter: "",
        image: ""
      },
      rules: {
        name: [{ required: true, message: "请填写品牌名称", trigger: "blur" }],
        image: [{ required: true, message: "请上传品牌LOGO", trigger: "blur" }]
      }
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.form.id = parseInt(id, 10);
    }
  },
  mounted() {
    if (this.form.id) {
      // 查询品牌详情
      this.searchBrandDetail();
    }
  },
  methods: {
    // 查询品牌详情
    searchBrandDetail() {
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
    // 限制格式和大小
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt50K = file.size / 1024 < 500;

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是jpg/png格式");
        return false;
      }
      if (!isLt50K) {
        this.$message.error("上传图片大小不能超过50kb");
        return false;
      }
      return true;
    },
    // 处理文件上传
    handleUploadSuccess(response, file, fileList) {
      this.form.image = response;
    },
    // 提交品牌表单
    handleSubmitBrand() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return false;
        }
        if (!this.form.id) {
          this.handleAddBrand();
        } else {
          this.handleUpdateBrand();
        }
      });
    },
    // 添加品牌
    handleAddBrand() {
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
          this.goToBrandListView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑品牌
    handleUpdateBrand() {
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
          this.goToBrandListView();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转品牌列表
    goToBrandListView() {
      this.$router.push("/commodity/brand-list");
    }
  }
};
</script>
