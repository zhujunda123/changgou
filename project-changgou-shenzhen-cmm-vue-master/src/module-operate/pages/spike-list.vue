<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="content-header">
      <h1>
        秒杀专区
        <small>设置商品</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>秒杀专区</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <!-- 搜索框 -->
      <div class="seacthBox">
        <el-form :inline="true" :model="pagination" ref="pagination">
          <el-form-item label="活动名称：" prop="name">
            <el-input
              placeholder="活动名称"
              v-model="pagination.title"
              style="width: 200px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
          <el-button class="dalfBut" @click="handleSearch">查询</el-button>
        </el-form>
      </div>
      <!-- 搜索框 / -->
      <div class="infoTip">
        <el-button type="primary" class="butT" @click="handleUpdate()">添加活动</el-button>
        <el-button type="primary" class="butT" @click="handleList">秒杀时间段</el-button>
      </div>
      <!-- table -->
      <div class="box">
        <el-table
          :data="items"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="项目编号" width="200px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动标题" width="300px">
            <template slot-scope="scope">
              <span class="link-type">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动状态" width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==='0'">未开始</span>
              <span v-if="scope.row.status==='1'">活动进行中</span>
              <span v-if="scope.row.status==='2'">已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" width="250px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" width="250px">
            <template slot-scope="scope">
              <span>{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上线/下架" align="center" width="150px">
            <template slot-scope="scope">
              <span>
                <el-switch v-model="scope.row.soldStatus"></el-switch>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleSet(scope.row)">设置商品</el-button>
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
        <add-Dialog
        ref="addActive"
        :textTitle='textTitle'
      ></add-Dialog>
      </div>
      <!-- end -->
    </div>
  </div>
</template>

<script>
import { list,remove} from "@/api/base/operate";
import addDialog from './../components/addActive'
export default {
  name: "basic-list",
  components: {
    addDialog,
  },
  data() {
    return {
      items: [],
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
      objId:''
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
    handleSet(val){
      this.$router.push('/spike/operateset?id='+val.id)

    },
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagination.page = val
    },
    // 秒杀时间段列表
    handleList(){
        this.$router.push('/spike/operateset')
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
