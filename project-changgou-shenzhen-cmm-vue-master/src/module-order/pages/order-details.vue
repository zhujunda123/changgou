<template>
  <div class="printBox">
    <header class="headerBg">
      <div class="headerBg">
        <div class="mainBox">
          <span class="fontL">订单详情</span>
          <!-- <span class="fontR">
            
          </span>-->
        </div>
      </div>
    </header>

    <div class="mainBox">
      <div class="orderStep">
        <el-steps :active="2" finish-status="success" align-center>
          <el-step>
            <div slot="title">
              <p>提交订单</p>
              <p>2018-07-19 15:43:23</p>
            </div>
          </el-step>
          <el-step>
            <div slot="title">
              <p>支付订单</p>
              <p>未支付</p>
            </div>
          </el-step>
          <el-step>
            <div slot="title">
              <p>平台发货</p>
              <p></p>
            </div>
          </el-step>
          <el-step>
            <div slot="title">
              <p>确认收货</p>
              <p></p>
            </div>
          </el-step>
          <el-step>
            <div slot="title">
              <p>完成评价</p>
              <p></p>
            </div>
          </el-step>
        </el-steps>
      </div>
      <div class="detailCon">
        <div class="statusTit">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> 当前订单状态：待付款
        </div>
        <div class="tableInfo">
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 基本信息
          </div>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="number" label="订单编号" width="150"></el-table-column>
            <el-table-column prop="ordernumner" label="发货单流水号" width="280"></el-table-column>
            <el-table-column prop="user" label="用户账号" width="150"></el-table-column>
            <el-table-column prop="payment" label="支付方式"></el-table-column>
            <el-table-column prop="source" label="订单来源" width="100"></el-table-column>
            <el-table-column prop="type" label="订单类型" width="150"></el-table-column>
          </el-table>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="mode" label="配送方式" width="150"></el-table-column>
            <el-table-column prop="logistics" label="物流单号" width="280"></el-table-column>
            <el-table-column prop="tiem" label="自动确认收货时间" width="150"></el-table-column>
            <el-table-column prop="activity" label="活动信息"></el-table-column>
            <el-table-column width="100"></el-table-column>
            <el-table-column width="150"></el-table-column>
          </el-table>
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 收货人信息
          </div>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="number" label="收货人" width="150"></el-table-column>
            <el-table-column prop="ordernumner" label="手机号码" width="280"></el-table-column>
            <el-table-column prop="user" label="邮政编码" width="150"></el-table-column>
            <el-table-column prop="payment" label="收货地址"></el-table-column>
          </el-table>
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 商品信息
          </div>
          <el-table :data="listData" border style="width: 100%">
            <el-table-column prop="number" label="商品图片" width="150"></el-table-column>
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
          <div class="tableFooter">
            <span>合计：¥19198.00</span>
          </div>
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 费用信息
          </div>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="number" label="商品合计" width="150"></el-table-column>
            <el-table-column prop="ordernumner" label="运费" width="280"></el-table-column>
            <el-table-column prop='user' label="优惠券" width="150"> </el-table-column>
            <el-table-column prop="payment" label="活动优惠"></el-table-column>
          </el-table>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="mode" label="订单总金额" width="150"></el-table-column>
            <el-table-column prop="logistics" label="应付款金额" width="280"></el-table-column>
            <el-table-column width="150"> </el-table-column>
            <el-table-column ></el-table-column>
          </el-table>
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 操作信息
          </div>
          <el-table :data="operationData" border style="width: 100%">
            <el-table-column prop="number" label="操作者" width="150"></el-table-column>
            <el-table-column prop="ordernumner" label="操作时间" width="280"></el-table-column>
            <el-table-column prop='user' label="订单状态" width="150"> </el-table-column>
            <el-table-column prop="payment" width="150" label="付款状态"></el-table-column>
            <el-table-column prop="payment" width="150" label="发货状态"></el-table-column>
            <el-table-column prop="payment" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
import { list } from "@/api/base/order";
export default {
  name: "printing",
  props: {},
  data() {
    return {
      itemsData: [
        {
          id: "1",
          number: "201807196398345",
          ordernumner: "未发货",
          user: "18000000000",
          payment: "未支付",
          source: "APP订单",
          type: "普通订单",
          mode: "未发货",
          logistics: "未发货",
          tiem: "15天",
          activity: "满100减10"
        }
      ],
      listData: [
        {
          id: "1",
          number: "No999999",
          name: "2018 iphoneXsMax128GB",
          price: "9599.00",
          attribute: "尺寸：X  颜色：黑色",
          num: 1,
          subtotal: "9599.00"
        },
        {
          id: "2",
          number: "No999999",
          name: "2018 iphoneXsMax128GB",
          price: "9599.00",
          attribute: "尺寸：X  颜色：黑色",
          num: 1,
          subtotal: "9599.00"
        },
        {
          id: "3",
          number: "No999999",
          name: "2018 iphoneXsMax128GB",
          price: "9599.00",
          attribute: "尺寸：X  颜色：黑色",
          num: 1,
          subtotal: "9599.00"
        }
      ],
      operationData:[]
    };
  },
  methods: {
    //业务方法
    // 数据列表
    async doQuery(paremt) {
      await list()
        .then(res => {
          this.itemsData = res.data.data.rows;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    console.log(this.$route.query);
  },
  mounted() {}
};
</script>


