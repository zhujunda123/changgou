<template>
  <el-dialog
    :title="textTitle"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="活动标题：" prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="开始时间：" prop="beginTime">
        <el-date-picker v-model="formData.beginTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：" prop="endTime">
        <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="上线/下架：">
        <el-radio-group v-model="formData.soldStatus">
          <el-radio label="上线"></el-radio>
          <el-radio label="下架"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style>
</style>
<script>
export default {
  name: "splitOrder",
  props: {
    textTitle: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        title: "",
        beginTime: "",
        endTime: "",
        soldStatus: ""
      },
      rules: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        beginTime: [
          { type: "date", required: true, message: "请选择", trigger: "change" }
        ],
        endTime: [
          { type: "date", required: true, message: "请选择", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //业务方法
    // 重置表单
    resetForm() {
      this.formData = {};
    },
    // 添加编辑提交
    handleOk() {
      if (this.formData.soldStatus === "上线") {
        this.formData.soldStatus = "1";
      } else {
        this.formData.soldStatus = "0";
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.objId !== "") {
            // axios
            //   .post(this.apiUrl + `/activitySeckill/update.do`, this.formData)
            //   .then(response => {});
          } else {
            // axios
            //   .post(this.apiUrl + `/activitySeckill/add.do`, this.formData)
            //   .then(response => {});
          }
          this.dialogFormH();
          this.resetForm();
          this.$emit("getList");
        }
      });
    },
    // 弹层隐藏
    dialogFormH() {
      this.dialogVisible = false;
    },
    handleClose() {
      this.dialogFormH();
      this.resetForm();
    }
  },
  created() {},
  mounted() {}
};
</script>


