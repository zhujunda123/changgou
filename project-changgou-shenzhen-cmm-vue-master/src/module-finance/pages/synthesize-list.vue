<template>
  <div class="dashboard-container" v-loading="loading" >
    <div class="content-header">
      <h1>
        交易列表
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      暂无
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
