<template>
  <el-dialog
    title="转移相册"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="400px"
  >
    <el-form :model="form">
      <el-form-item label="选择相册：" label-width="95px">
        <el-select v-model="form.id" placeholder="请选择相册">
          <el-option
            v-for="(item, index) in albums"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleTransferAlbum">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "TransferAlbumDialog",
  props: ["id", "albums"],
  data() {
    return {
      dialogVisible: false,
      form: {
        id: ""
      }
    };
  },
  methods: {
    // 打开对话框
    openDialog() {
      this.dialogVisible = true;
      this.form = {
        id: ""
      };
    },
    // 关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
    // 处理转移相册
    handleTransferAlbum() {
      this.closeDialog();
    }
  }
};
</script>
