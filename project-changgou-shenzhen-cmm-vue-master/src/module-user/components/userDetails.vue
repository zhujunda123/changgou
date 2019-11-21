<template>
  <div>
    <div class="userInfo">
      <table class="userTable" cellspacing="0" cellpadding="0">
        <tr>
          <td rowspan="5" style="width:300px;" class="userHead">
            <p><img src="../../assets/userinfo.png"></p>
            <p>18000000000</p>
            <p><el-button type="primary" size="mini">黄金会员</el-button></p>
          </td>
          <th>用户ID</th>
          <td>8447466{{userDetailData.username}}</td>
          <th>职业</th>
          <td>学生{{userDetailData.username}}</td>
        </tr>
        <tr>
          <th>昵称</th>
          <td>8447466{{userDetailData.nickName}}</td>
          <th>个性签名</th>
          <td>学生{{userDetailData.nickName}}</td>
        </tr>
        <tr>
          <th>性别</th>
          <td>8447466</td>
          <th>喜欢的分类</th>
          <td>学生</td>
        </tr>
        <tr>
          <th>生日</th>
          <td>8447466</td>
          <th>注册时间</th>
          <td>学生</td>
        </tr>
        <tr>
          <th>城市</th>
          <td>8447466</td>
          <th>用户来源</th>
          <td>学生</td>
        </tr>
      </table>
    </div>
    <div class="detailCon">
        <div class="tableInfo">
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 统计信息
          </div>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="number" label="消费金额"></el-table-column>
            <el-table-column prop="ordernumner" label="订单数量" width="280"></el-table-column>
            <el-table-column prop="user" label="成长值" width="150"></el-table-column>
            <el-table-column prop="payment" label="优惠券（张）" width="150"></el-table-column>
            <el-table-column prop="source" label="商品评价" width="100"></el-table-column>
            <el-table-column prop="type" label="退货记录" width="150"></el-table-column>
            <el-table-column prop="type" label="登录次数" width="150"></el-table-column>
            <el-table-column prop="type" label="剩余抽奖次数" width="150"></el-table-column>
          </el-table>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="mode" label="关注"></el-table-column>
            <el-table-column prop="logistics" label="粉丝" width="280"></el-table-column>
            <el-table-column prop="tiem" label="收藏商品" width="150"></el-table-column>
            <el-table-column prop="activity" label="收藏专题" width="150"></el-table-column>
            <el-table-column width="100" label="收藏话题"></el-table-column>
            <el-table-column width="150" label="收藏评价"></el-table-column>
            <el-table-column width="150" label="邀请好友"></el-table-column>
            <el-table-column width="150"></el-table-column>
          </el-table>
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 收货地址
          </div>
          <el-table :data="itemsData" border style="width: 100%">
            <el-table-column prop="number" label="姓名" width="150"></el-table-column>
            <el-table-column prop="ordernumner" label="手机号码" width="280"></el-table-column>
            <el-table-column prop="payment" label="详细地址"></el-table-column>
            <el-table-column prop="user" label="邮政编码" width="150"></el-table-column>
            <el-table-column prop="payment" label="默认地址">
              <template slot-scope="scope">
              <span>
                <el-switch v-model="scope.row.status"></el-switch>
              </span>
            </template>
            </el-table-column>
          </el-table>
          <div class="textInfo">
            <i class="fa fa-bookmark" aria-hidden="true"></i> 订单记录
          </div>
          <el-table :data="listData" border style="width: 100%">
            <el-table-column prop="number" label="订单编号" width="150"></el-table-column>
            <el-table-column prop="name" label="提交时间" width="280"></el-table-column>
            <el-table-column prop="name" label="用户账号" width="180"></el-table-column>
            <el-table-column label="订单金额" width="150">
              <template slot-scope="scope">
                <span>￥{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="attribute" label="支付方式"></el-table-column>
            <el-table-column prop="num" label="订单来源" width="100"></el-table-column>
            <el-table-column label="订单状态" width="150"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.row)">查看订单</el-button>
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
</template>
<style>
</style>
<script>
import { addlist,addRow,deleRow} from "@/api/base/operate";
export default {
  name: "splitOrder",
  props: {
    
  },
  data() {
    return {
      dialogVisible: false,
      total: 0,
      itemData: [],
      checkData: [],
      userDetailData:{

      },
      operationData:[],
      itemsData:[],
      listData:[],
      pagination: {
        page: 1,
        size: 10
      }
    };
  },
  methods: {
      // 数据列表
    async doQuery(paremt) {
      this.loading = true;

      await addlist(this.pagination)
        .then(res => {
          this.items = res.data.data.rows;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 业务方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagination.page = val;
    },
    // 选中列表某一行
    async handleCheck(e, val) {
      if (e === true) {
        this.checkData.push(val);
        await addRow(val)
      } else {
        this.checkData.splice(val.id, 1);
        await deleRow(val.id)
      }
    },
    // 查看订单
    handleEdit(val){
      // this.$router.push('/order/orderDetails?id='+val.id)
      let routeUrl = this.$router.resolve({
          path: '/order/orderDetails?id='+val.id
     });
     window.open(routeUrl .href, '_blank');
    },
  },
  created() {},
  mounted() {}
};
</script>


