<template>
  <el-dialog title="拆分订单" :visible.sync="dialogFormVisible" width="35%">
    <el-form :inline="true" :model="formBase" ref="pagination">
      <el-form-item label="需要拆分订单" prop="name">
        <el-input v-model="formBase.orderNumber" placeholder="输入订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSplitSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="orderData">
      <el-table-column property="id" label="商品名称" width="150"></el-table-column>
      <el-table-column property="name" label="价格/货号" width="200"></el-table-column>
      <el-table-column property="address" label="属性"></el-table-column>
      <el-table-column property="number" label="数量"></el-table-column>
      <el-table-column property="stock" label="库存"></el-table-column>
      <el-table-column property="spnumber" label="拆分数量"></el-table-column>
    </el-table>
    <p class="padInfo">拆分订单时，输入需要拆分的数量即可</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSplitDefine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style>
</style>
<script>
export default {
  name: "splitOrder",
  props:{
    orderData:{
        type:Array
    }
  },
  data() {
    return {
        dialogFormVisible: false,
        formBase:{
            orderNumber:''
        }
    };
  },
  methods: {
    //业务方法
    // 拆分订单查询
    handleSplitSearch(){

    },
    handleSplitDefine(){
      this.dialogFormVisible=false
    },
  },
  created() {
    
  },
  mounted(){

  }
};
</script>


