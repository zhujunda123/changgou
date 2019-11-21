<template>
  <div class="printBox">
    <header class="headerBg">
      <div class="headerBg">
        <div class="mainBox">
          <span class="fontL">批量打印发货单</span>
          <span class="fontR">
            <el-button type="primary">
              <i class="fa fa-print" aria-hidden="true"></i> 打印
            </el-button>
          </span>
        </div>
      </div>
    </header>
    <div class="mainBox">
      <div class="printCon">
        <div class="tableTitle">订单信息</div>
        <el-table :data="itemsData" border style="width: 100%">
          <el-table-column prop="number" label="货号" width="150"></el-table-column>
          <el-table-column prop="name" label="商品名称" width="280"></el-table-column>
          <el-table-column label="价格" width="150">
            <template slot-scope="scope">
              <span>￥{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="attribute" label="属性"></el-table-column>
          <el-table-column prop="num" label="数量" width="100"></el-table-column>
          <el-table-column label="小计" width="150">
            <template slot-scope="scope">
              <span>￥{{scope.row.subtotal}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div  class="tableFooter"><span>商品总价：¥19198.00</span><span>运费：¥10.00</span><span>订单总金额：¥19208.00</span><span>支付方式：支付宝</span></div>
        <div class="orderInfo clear">
          <div class="text">
            <p>18000000000 </p>
            <ul>
              <li>手机号码：18000000000</li>
              <li>提交时间：2018-07-19 15:43:23</li>
              <li>订单编号：201807196398345</li>
              <li>收货地址： 上海市浦东区东方明珠10层</li>
            </ul>
          </div>
          <div class="code"><img src="../../assets/code2.jpg"></div>
        </div>
      </div>
      <div class="printCon">
        <div class="tableTitle">订单信息</div>
        <el-table :data="itemsData" border style="width: 100%">
          <el-table-column prop="number" label="货号" width="150"></el-table-column>
          <el-table-column prop="name" label="商品名称" width="280"></el-table-column>
          <el-table-column label="价格" width="150">
            <template slot-scope="scope">
              <span>￥{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="attribute" label="属性"></el-table-column>
          <el-table-column prop="num" label="数量" width="100"></el-table-column>
          <el-table-column label="小计" width="150">
            <template slot-scope="scope">
              <span>￥{{scope.row.subtotal}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div  class="tableFooter"><span>商品总价：¥19198.00</span><span>运费：¥10.00</span><span>订单总金额：¥19208.00</span><span>支付方式：支付宝</span></div>
        <div class="orderInfo clear">
          <div class="text">
            <p>18000000000 </p>
            <ul>
              <li>手机号码：18000000000</li>
              <li>提交时间：2018-07-19 15:43:23</li>
              <li>订单编号：201807196398345</li>
              <li>收货地址： 上海市浦东区东方明珠10层</li>
            </ul>
          </div>
          <div class="code"><img src="../../assets/code2.jpg"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
import {list} from '@/api/base/order'
export default {
  name: "printing",
  props: {},
  data() {
    return {
      itemsData: [
        {
          id:'1',
          number: "No999999",
          name: "2018 iphoneXsMax128GB",
          price: "9599.00",
          attribute:'尺寸：X  颜色：黑色',
          num:1,
          subtotal:'9599.00'
        },
        {
          id:'2',
          number: "No999999",
          name: "2018 iphoneXsMax128GB",
          price: "9599.00",
          attribute:'尺寸：X  颜色：黑色',
          num:1,
          subtotal:'9599.00'
        },
        {
          id:'3',
          number: "No999999",
          name: "2018 iphoneXsMax128GB",
          price: "9599.00",
          attribute:'尺寸：X  颜色：黑色',
          num:1,
          subtotal:'9599.00'
        }
      ]
    };
  },
  methods: {
    //业务方法
    // 数据列表
    async doQuery(paremt) {

      await list()
        .then(res => {
          this.itemsData = res.data.data.rows
        })
        .catch(err => {
          this.loading = false
        })
    },
  },
  created() {
    console.log(this.$route.query)
  },
  mounted() {}
};
</script>


