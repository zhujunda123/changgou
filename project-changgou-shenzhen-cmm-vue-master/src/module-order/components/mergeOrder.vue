<template>
  <el-dialog title="合并订单" :visible.sync="dialogTableVisible" width="35%" class="dialogBox">
    <p class="titInfo">当两个订单不一致时，合并后的订单信息（如：支付方式、配送方式、活动优惠等）以主订单为准。</p>
    <el-form ref="form" :model="orderForm" label-width="80px">
      <el-form-item label="主订单" prop="name">
        <el-select v-model="orderForm.order" placeholder="请选择">
          <el-option v-for="item in dataList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="从订单" prop="name">
        <el-select v-model="orderForm.order" placeholder="请选择">
          <el-option v-for="item in dataList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">重 置</el-button>
      <el-button type="primary" @click="handleSplitDefine">合 并</el-button>
    </span>
  </el-dialog>
</template>
<style>
</style>
<script>
export default {
  name: "splitOrder",
  props: {
    dataList: {
      type: Array
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      orderForm:{
        order:''
      },
    };
  },
  methods: {
    //业务方法
    // 拆分订单查询
    handleSplitSearch() {},
    handleSplitDefine(){
      this.dialogTableVisible=false
    },
  },
  created() {},
  mounted() {}
};
</script>


