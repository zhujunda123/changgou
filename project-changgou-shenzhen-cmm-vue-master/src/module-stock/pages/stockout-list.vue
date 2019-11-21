<template>
  <div class="dashboard-container" v-loading="loading" >
    <div class="content-header">
      <h1>
        用户列表
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <!-- 搜索框 -->
      <div class="seacthBox">
        <el-form :inline="true" :model="pagination" ref="pagination">
          <el-form-item label="用户账号" prop="name">
            <el-input v-model="pagination.name" placeholder="用户ID/账号"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="category1Id">
            <el-input v-model="pagination.category1Id" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="brandId">
            <el-time-select
              v-model="pagination.time"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="请选择时间">
            </el-time-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleRest">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 搜索框 / -->
      <!-- <div class="infoTip">
        <el-button type="primary" class="butT" @click="handleUpdate()">赠送优惠券</el-button>
        <el-button type="primary" class="butT" @click="handleExport">导出数据</el-button>
      </div> -->
      <!-- table -->
      <div class="box">
        <el-table
          :data="items"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="用户ID" width="200px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户账号" width="300px">
            <template slot-scope="scope">
              <span class="link-type">{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户昵称" width="150px" align="center">
            <span>scope.row.nickName</span>
            <template slot-scope="scope">
              <span v-if="scope.row.status==='0'">未开始</span>
              <span v-if="scope.row.status==='1'">活动进行中</span>
              <span v-if="scope.row.status==='2'">已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="会员等级" width="250px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userLevel }}</span>
            </template>
          </el-table-column>
          <el-table-column label="消费金额" width="250px">
            <template slot-scope="scope">
              <span>￥{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单数量">
            <template slot-scope="scope">
              <span>￥{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户启用状态" align="center" width="150px">
            <template slot-scope="scope">
              <span>
                <el-switch v-model="scope.row.status" @change='handleSet'></el-switch>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleSet(scope.row)">查看</el-button>
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            class="pagiantion"
            v-show="total>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <!-- 弹层 -->
        <!-- <add-Dialog
        ref="addActive"
        :textTitle='textTitle'
      ></add-Dialog> -->
      </div>
      <!-- end -->
    </div>
  </div>
</template>

<script>
import { list,remove} from "@/api/base/operate";
// import addDialog from './../components/addActive'
export default {
  name: "basic-list",
  components: {
    // addDialog,
  },
  data() {
    return {
      items: [
        // {
        //   id:1,
        //   username:'18000000000',
        //   nickName:'JiangX',
        //   userLevel:'黄金会员',
        //   consumption:'9599.00',
        //   orderNumber:'10',
        //   status:'1'
        // }
      ],
      total: null,
      textTitle:'',
      pagination: {
        page: 1,
        pagesize: 10,
        title: this.title
      },
      form: {
        remarks: ""
      },
      loading: false,
      objId:'',
      multipleSelection: []
    };
  },
  methods: {
    // 业务方法
    // 数据列表
    async doQuery(paremt) {
      this.loading = true;
      var paremt = this.pagination;

      await list(paremt)
        .then(res => {
          this.items = res.data.data.rows;
          this.total = res.data.data.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 搜索活动
    handleSearch(){
      this.doQuery(this.pagination)
    },
    // 充值订单
    handleRest() {
      this.$refs['pagination'].resetFields()
      this.doQuery()
    },
    // 创建
    handleUpdate(val) {
        this.$refs.addActive.dialogVisible=true
        if(val===undefined){
            this.textTitle='添加'
            console.log(this.textTitle)
        }else{
            this.textTitle='编辑'
            this.objId=val.id
            // this.hanldeEditForm(val.id)
        }
    },
    // 设置商品
    handleSee(val){
      this.$router.push('/spike/operateset?id='+val.id)

    },
    handleSet(val){
      // this.$router.push("/user/info?id=" + val.id)
      this.$router.push("/user/info?id=" + val.id);
    },
    // 导出数据
    handleExport(){
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    // 删除
    handleDelete(obj) {
      if (obj.isMarketable) {
        this.$message.error("请先下架");
      } else {
        this.$confirm("确认删除？").then(async () => {
          await remove({ id: obj.id }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.doQuery(this.pagination);
          });
        });
      }
    },
    // UI方法
    // 每页条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagination.pagesize = val;
      this.doQuery(this.pagination);
    },
    // 当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagination.page = val;
      this.doQuery(this.pagination);
    },

  },
  created() {},
  mounted() {
    this.doQuery();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
