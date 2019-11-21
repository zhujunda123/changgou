<template>
  <el-dialog
    title="上传图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeclose"
    width="550px"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="选择相册：" prop="id" label-width="100px">
        <el-select v-model="form.id" placeholder="请选择相册">
          <el-option
            v-for="(item, index) in albums"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择图片：" label-width="100px">
        <el-upload
          ref="upload"
          action="/upload"
          drag
          multiple
          accept="image/jpeg,image/png"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-remove="handleUploadRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">按住ctrl可同时批量选择多张图片上传</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="handleUploadAlbum">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { update } from "@/api/business/album";

export default {
  name: "UploadImagesDialog",
  props: ["albums"],
  data() {
    return {
      dialogVisible: false,
      form: {
        id: "",
        fileList: []
      },
      rules: {
        id: [{ required: true, message: "请选择相册", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 打开对话框
    openDialog() {
      this.dialogVisible = true;
    },
    // 重置对话框
    resetDialog() {
      this.form = {
        id: "",
        fileList: []
      };
      this.$refs["upload"].clearFiles();
    },
    // 关闭前的回调
    beforeclose(done) {
      this.resetDialog();
      done();
    },
    // 关闭对话框
    closeDialog() {
      this.resetDialog();
      this.dialogVisible = false;
    },
    // 限制格式和大小
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt50K = file.size / 1024 < 50;

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
      this.form.fileList = fileList;
    },
    // 处理文件移除
    handleUploadRemove(file, fileList) {
      this.form.fileList = fileList;
    },
    // 处理上传图片
    handleUploadAlbum() {
      // 非空判断
      let formValid;
      this.$refs["form"].validate(valid => {
        formValid = valid;
      });
      if (!formValid) {
        return;
      }

      // 组装参数
      let album = this.albums.find(element => {
        return element.id === this.form.id;
      });
      let imageItems = album.imageItems;

      if (!imageItems) {
        imageItems = [];
      } else {
        imageItems = JSON.parse(imageItems);
      }
      this.form.fileList.forEach(element => {
        imageItems.push({
          url: element.response,
          uid: element.uid,
          status: element.status
        });
      });
      imageItems = JSON.stringify(imageItems);

      album.imageItems = imageItems;
      // 调用接口
      update(album)
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
          this.$emit("submitImagesSuccess");
          this.closeDialog();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>