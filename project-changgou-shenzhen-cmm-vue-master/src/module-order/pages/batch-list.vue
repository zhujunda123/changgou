<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <div class='appTitle'>批量发货<router-link to='/order/list'><i class='el-icon-arrow-left'></i>返回</router-link></div>
      <!-- 数据列表 -->
      <div class="basic-list-content">
        <div class="btnBox">
          <!-- 数据表格 -->
          <el-table 
            :data="items" 
            border 
            style="width: 100%; margin-top:10px;" 
            @selection-change="handleSelectionChange"
            
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="订单编号" width="200"></el-table-column>
            <el-table-column prop='name' label="收货人" width="200" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号码" width="200"></el-table-column>
            <el-table-column prop="zipCode" label="邮政编码" width="200"></el-table-column>
            <el-table-column prop="address" label="收货地址" align="center"></el-table-column>
            <el-table-column label="配送方式" width="180" align="center">
              <template slot-scope='scope'>
                <el-select v-model="scope.row.mode" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="物流单号" width="200" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.orderNumber" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- 数据表格 / -->
          <div class='btnCon'>
            <el-button >取消</el-button>
            <el-button type="primary" @click="handleOk">确定</el-button>
          </div>
        </div>
      <!-- 数据列表 / -->
      </div>
    </div>
    
      

  </div>
</template>

<script>
import {list} from '@/api/base/order'
export default {
  name: 'basic-list',
  components: {},
  data() {
    return {
      dialogbathVisible:false,
      loading: false,
      items: [
        {
        id:'1',
        name:'小李',
        phone:'15263695455',
        zipCode:'100001',
        address:'北京海淀区西三旗',
        mode:'圆通快递',
        orderNumber:'100000025'
        },
        {
        id:'2',
        name:'小李',
        phone:'15263695455',
        zipCode:'100001',
        address:'北京海淀区西三旗',
        mode:'申通快递',
        orderNumber:'100000025'
        }
      ],
      deliveryData:[],
      options: [{
          id: '1',
          value: '圆通快递'
        }, {
          id: '2',
          value: '申通快递'
        }, {
          id: '3',
          value: '顺丰快递'
        }, {
          id: '4',
          value: '天天快递'
        }, {
          id: '5',
          value: '韵达快递'
        }],
    }
  },
  methods: {
    // 业务方法
    // 数据列表
    async doQuery() {
      await list()
        .then(res => {
          this.items = res.data.data.rows
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 商品品牌
    async getDelivery(formName) {
      await brand()
      .then(res => {
          this.deliveryData=res.data.data
      })
      .catch(err => {
        this.$message.error('获取信息失败');
      })
    },
    async handleOk(){

    },
    handleSelectionChange(val) {
    },
  },
  created() {
  },
  mounted(){
    // this.doQuery()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
// 搜索栏

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
