<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="手机号码：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="会员等级：">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="form.resource">
          <el-radio label="保密"></el-radio>
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日：">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="职业：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
       <el-form-item label="个人签名：">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：">
        <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="账户启用状态：">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>

      
     
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        pass:'',
        checkPass:'',
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style>
</style>


