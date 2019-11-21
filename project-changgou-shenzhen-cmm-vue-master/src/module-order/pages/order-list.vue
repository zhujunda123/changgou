<template>
  <div class="dashboard-container" v-loading="loading">
    
    
    <div class="app-container">
      
      <el-tabs v-model="barSearch.activeName" @tab-click="handleTabName" class="tabList">
        <el-tab-pane name="first">
          <span slot="label">全部订单(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">待付款(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="third">
          <span slot="label">待发货(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="four">
          <span slot="label">已发货(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="five">
          <span slot="label">已完成(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="six">
          <span slot="label">已关闭(1000)</span>
        </el-tab-pane>
    </el-tabs>
      <!-- 搜索框 -->
    <div class="seacthBox">
      <!-- 搜索栏 -->
        <el-form :inline="true" :model="pagination" ref="pagination">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="pagination.name" placeholder="订单编号/商品货号"></el-input>
          </el-form-item>
          <el-form-item label="收货人" prop="category1Id">
            <el-input v-model="pagination.category1Id" placeholder="收货人姓名/手机号码"></el-input>
          </el-form-item>
          <el-form-item label="提交时间" prop="brandId">
            <el-time-select
              v-model="pagination.time"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleRest">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <!-- 搜索框 / -->
      <!-- 数据列表 -->
      <div class="basic-list-content">
        <div class="btnBox">
          <el-button type="primary" @click="handleSplit">拆分订单</el-button>
          <el-button type="primary" @click="handleMerge">合并订单</el-button>
          <el-button type="primary" @click="handlePrinting">打印发货单</el-button>
          <router-link to='/order/batch' class='el-button el-button--primary el-button--medium'>批量发货</router-link>
          <el-button type="primary">导出订单</el-button>
        </div>
        <!-- <div>{{barSearch.alertText}}</div> -->
        <!-- 数据表格 -->
        <el-table 
          :data="items" 
          border 
          style="width: 100%; margin-top:10px;" 
          @selection-change="handleSelectionChange"
          
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="订单编号" ></el-table-column>
          <el-table-column prop="updateTime" label="提交时间" width="200" align="center"></el-table-column>
          <el-table-column prop="username" label="用户账号" width="200"></el-table-column>
          <el-table-column prop="payMoney" label="订单金额" width="200"></el-table-column>
          <el-table-column prop="payStatus" label="支付方式" width="200" align="center"></el-table-column>
          <el-table-column prop="sourceType" label="订单来源" width="100" align="center"></el-table-column>
          <el-table-column label="订单状态" width="160" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.orderStatus==='0'">未完成</p>
              <p v-if="scope.row.orderStatus==='1'">已完成</p>
              <p v-else>已退货</p>
            </template>
          </el-table-column>
          
          <el-table-column
            fixed="right"
            label="操作"
            width="200" align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">查看订单</el-button>
              <el-button @click="handleGoods(scope.row)" type="text" size="small">订单发货</el-button>
              <el-button @click="handleClose(scope.row)" type="text" size="small">关闭订单</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除订单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination 
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(pagination.page)"
          :total="Number(total)"
          :page-size="Number(pagination.pagesize)"
          :page-sizes="[10,20,30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          >
        </el-pagination>
        <!-- 数据表格 / -->
      </div>
      <!-- 数据列表 / -->
    </div>
    <!-- 拆分订单 -->
    <Dialog
      ref="splitOrder"
      :orderData="orderData"
    ></Dialog>
    
    <!-- end -->
    <!-- 合并订单 -->
    <merge-Dialog
      ref="mergeOrder"
      :dataList="dataList"
    ></merge-Dialog>
    <!-- end -->
    <!-- 合并订单 -->
    <batch-Dialog
      ref="batchOrder"
    ></batch-Dialog>
    <!-- end -->
    <!-- 关闭订单 -->
    <el-dialog
    title="关闭订单"
    :visible.sync="closeVisible"
    width="30%">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="操作备注" prop="remarks">
        <el-input type="textarea" v-model="form.remarks"></el-input>
      </el-form-item>
    </el-form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDefine">确 定</el-button>
    </span>
  </el-dialog>
    <!-- end -->
  </div>
</template>

<script>
import {list,brand} from '@/api/base/order'
import Dialog from './../components/splitOrder'
import mergeDialog from './../components/mergeOrder'
import batchDialog from './../components/batchOrder'
export default {
  name: 'basic-list',
  components: {
    Dialog,
    mergeDialog,
    batchDialog
  },
  data() {
    return {
      barSearch: {
        expandInputs: false,
        alertText: '',
        activeName: 'first'
      },
      items: [],
      total:'',
      pagination: {
        page: 1,
        pagesize: 10,
        name:this.name,
        brandId:this.brandId,
        category1Id:this.category1Id,
        time:this.time
      },
      form:{
        remarks:''
      },
      loading: false,
      multipleSelection: [],
      brandData:[],
      closeVisible:false,
      orderData:[
        {
          'id':1,
          'name':'2018 iphoneXsMax128GB',
          'price':'9599.00',
          'number':'10',
          'stock':'1000',
          'spnumber':'50'
        }
      ],
      dataList:[
        {
          'id': '1',
          'label': '主订单一'
        },
        {
          'id': '2',
          'label': '主订单二'
        }
      ],
      rules: {
        remarks: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    // 业务方法
    // 数据列表
    async doQuery(paremt) {
      this.loading = true
      var paremt=this.pagination

      await list(paremt)
        .then(res => {
          this.items = res.data.data.rows
          this.total = res.data.data.total
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 商品品牌
    async getBrandData(formName) {
      await brand()
      .then(res => {
          this.brandData=res.data.data
      })
      .catch(err => {
        this.$message.error('获取信息失败');
      })
    },
    // 查看订单
    handleEdit(val){
      // this.$router.push('/order/orderDetails?id='+val.id)
      let routeUrl = this.$router.resolve({
          path: '/order/orderDetails?id='+val.id
     });
     window.open(routeUrl .href, '_blank');
    },
    // 删除
    handleDelete(obj){
      if(obj.isMarketable){
        this.$message.error('请先下架');
      }else{
        this.$confirm('确认删除？')
        .then(async () => {
         await remove({id:obj.id}).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          this.doQuery(this.pagination)
          })
          
        })
      }
      
      
    },
    // 拆分订单
    handleSplit(){
      this.$refs.splitOrder.dialogFormVisible=true
    },
    // 充值订单
    handleRest() {
      this.$refs['pagination'].resetFields()
      this.doQuery()
    },
    // 搜索
    handleSearch() {
      this.doQuery()
      
    },
    // 合并订单
    handleMerge(){
      this.$refs.mergeOrder.dialogTableVisible=true
    },
    // 打印发货单
    handlePrinting(){
      let routeUrl = this.$router.resolve({
          path: "/order/printingOrder"
     });
     window.open(routeUrl .href, '_blank');
    },
    handleDefine(){
      this.closeVisible=false
    },
    handleGoods(val){
      let routeUrl = this.$router.resolve({
          path: "/order/batch?id=?"+val.id
     });
     window.open(routeUrl .href, '_blank');
    },
    handleClose(){
      this.closeVisible=true
    },
    // UI方法
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 每页条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagination.pagesize=val
      this.doQuery(this.pagination)
    },
    // 当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagination.page=val
      this.doQuery(this.pagination)
    },
    // 筛选列表数据
    handleTabName(val){
      if(val.index==='1'){
        this.pagination.setIsMarketable=1
        delete this.pagination.tStatus
      }else if(val.index==='2'){
        this.pagination.setIsMarketable=0
        delete this.pagination.tStatus
      }else if(val.index==='3'){
        this.pagination.tStatus=0
        delete this.pagination.setIsMarketable
      }else if(val.index==='4'){
        this.pagination.tStatus=1
        delete this.pagination.setIsMarketable
      }
      this.doQuery(this.pagination)
    }
  },
  created() {
    
  },
  mounted(){
    this.doQuery()
    // this.getBrandData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
// 搜索栏
.basic-list-query {
  .el-card__body {
    padding: 20px 20px 0px 20px;
  }
  .el-tabs__header {
    margin: 0px;
  }
  .el-tabs__active-bar {
    height: 3px;
  }
  .search {
    text-align: center;
    .el-select .el-input {
      width: 130px;
    }
    .input-with-select {
      width: 50%;
    }
  }
}
// 筛选栏位
.basic-list-bar {
  .el-checkbox__input {
    display: none;
  }
  .el-checkbox__label {
    padding-left: 0px;
  }
  .row {
    border-bottom: 1px dashed #e8e8e8;
    &.auto-hidden {
      max-height: 50px;
      overflow: hidden;
    }
    &.expand {
      max-height: 82px;
    }
    &:last-child {
      border: none;
      margin: 0px;
      padding: 0px;
    }
  }
}
.basic-list-content {
  margin-top: 20px;
  .item {
    border-bottom: 1px solid #e8e8e8;
    a {
      color: #1890ff;
    }
    &:last-child {
      border: none;
    }
  }
  .image {
    width: 16px;
    height: 16px;
    border-radius: 48px;
  }
  .tag {
    margin-right: 5px;
  }
  .btnMore {
    margin: 20px 0px;
    text-align: center;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
