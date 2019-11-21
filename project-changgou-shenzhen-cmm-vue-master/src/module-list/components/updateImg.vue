<template>
  <div>
    <el-dialog title="上传图片" :visible.sync="upVisible" width="30%" center class="uploadBox">
      <el-form ref="form" :model="photoInfo" label-width="120px">
        <el-form-item label="商品名称：">
          <span>{{nameInfo}}</span>
        </el-form-item>
        <el-form-item v-for="item in baseData.upPhotoData.values" :key="item.id">
          <span slot="label">{{item.PropertyName}}：</span>
          <span>{{item.name}}</span>
        </el-form-item>
        <el-form-item label="属性图片：">
          <el-button size="small" type="primary" @click="photoSelect('0')">图库选择</el-button>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/upload"
            accept="image/jpeg, image/gif, image/png"
            :before-upload="onBeforeUpload"
            :on-success="handleFileSuccess"
            :show-file-list="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
          </el-upload>
          <div class="el-upload__tip">只能上传jpg/png格式文件，建议大小：25px*25px</div>
        </el-form-item>
        <el-form-item label="特殊资源：">
          <el-radio-group v-model="photoInfo.select">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpPhoto(baseData.tableId)">确 定</el-button>
      </span>
    </el-dialog>
    <phtot-List ref="photo" :selectNum="selectNum"></phtot-List>
  </div>
</template>
<script>
import { listPhoto } from "@/api/base/commodity";
import phtotList from "./photo";
export default {
  props: {
    baseData: {
      type: Object
    },
    nameInfo: {
      type: String
    }
  },
  components: {
    phtotList
  },
  data() {
    return {
      upVisible: false,
      photoInfo: {
        select: 1
      },
      selectNum: "",
      attachments: []
    };
  },
  methods: {
    // 弹层显示
    dialogFormV() {
      this.upVisible = true;
    },
    // 弹层隐藏
    dialogFormH() {
      this.upVisible = false;
    },

    // 图库选择
    photoSelect(num) {
      this.$emit('photoSelect',num)
    },
    // 上传图片成功
    handleFileSuccess(res, file) {
      this.$message.success("上传成功!");
      this.attachments.push(file.response);
    },
    // 上传图片获取imges数据
    handleUpPhoto(Id) {
      this.upVisible = false;
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    }
  }
};
</script>

