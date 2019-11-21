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
        <el-breadcrumb-item>设置商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <!-- table -->
      <div class="box">
        <div class="infoTip">
          <el-button type="primary" class="butT" @click="handleSave()">保存</el-button>
          <el-button type="primary" class="butT" @click="handleAdd">添加</el-button>
        </div>
        <el-table :data="items.rows" border fit highlight-current-row style="width: 100%;">
          <el-table-column label="编号" width="310px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" width="300px">
            <template slot-scope="scope">
              <span class="link-type">{{ scope.row.productName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="货号" width="250px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.productNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品价格" width="150px" align="center">
            <template slot-scope="scope">
              <span>
                <el-input
                  type="text"
                  v-model="scope.row.price"
                  @input.native="handleInput($event,0)"
                ></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="秒杀价格" width="150px">
            <template slot-scope="scope">
              <span>
                <el-input
                  type="text"
                  v-model="scope.row.seckillPrice"
                  @input.native="handleInput($event,1)"
                ></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="秒杀数量" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{scope.row.seckillNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余数量" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{scope.row.residueNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="限购数量" align="center" width="150px">
            <template slot-scope="scope">
              <span>
                <el-input
                  type="text"
                  v-model="itemLinNum.buyLimitNum"
                  @input.native="handleInput($event,2,)"
                  @change="handleBlur(scope.row)"
                ></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="排序" align="center" width="150px">
            <template slot-scope="scope">
              <span>
                <el-input type="text" v-model="scope.row.sort"></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDeleted(scope.row)">删除</el-button>
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
      </div>
      <!-- end -->
      <add ref="add"></add>
    </div>
  </div>
</template>

<script>
import { listset, remove, saveNumber } from "@/api/base/operate";
import add from "./../components/add";
export default {
  name: "set-list",
  components: {
    add
  },
  data() {
    return {
      items: [
        {
          id: "1",
          title: "测试",
          beginTime: "2019-07-12",
          endTime: "2019-07-12",
          pQuantity: ""
        }
      ],
      loading: false,
      linkId: "",
      total: 0,
      itemLinNum: {},
      pagination: {
        page: 1,
        size: 10
      }
    };
  },
  methods: {
    // 业务方法
    // 业务方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagination.page = val;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    // input输入数字
    handleInput(e, num) {
      // 通过正则过滤小数点后两位
      var regT = /^[0-9]*/g;
      var regS = /^\d*(\.?\d{0,0})/g;
      var reg = /^\d*(\.?\d{0,2})/g;
      if (!regT.test(e.target.value)) {
        this.$message.error("请输入正确的数值");
      } else {
        if (num === 0 || num === 1) {
          e.target.value = e.target.value.match(reg)[0] || null;
        }
        if (num === 2) {
          e.target.value = e.target.value.match(regS)[0] || null;
        }
      }
    },
    // 界面交互
    //秒杀限购数量
    async handleBlur(val) {
      this.itemLinNum.itemDetailId = val.id;
      await saveNumber(this.itemLinNum);
    },
    //获取秒杀专区-保存数据
    async handleSave() {
      //   axios
      //     .post(
      //       this.apiUrl + `/itemDetailSeckill/update.do?id=${this.linkId}`,
      //       this.items
      //     )
      //     .then(response => {});
      await saveData(this.$route.query.id,this.items);
    },
    // 秒杀专区-添加列表
    handleAdd() {
      this.$refs.add.dialogVisible = true;
      this.$refs.add.doQuery()
      //   axios
      //     .get(this.apiUrl + `/sku/findAll.do`, this.pagination)
      //     .then(response => {
      //       this.itemData = response.data;
      //       this.total = this.itemData.length;
      //       this.pagination.page = Math.ceil(this.total / this.pagination.size);
      //     });
    },
    // 秒杀专区添加列表-搜索
    handleSearch() {},
    // 删除
    handleDeleted(row) {
      this.$confirm("确认删除？").then(async () => {
        await remove({ id: obj.id }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.doQuery(this.pagination);
        });
      });
    },
    // 数据列表
    async doQuery(paremt) {
      this.loading = true;

      await listset()
        .then(res => {
          this.items = res.data.data.rows;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
      console.log(this.$route.query.id)
  },
  mounted() {
    // this.doQuery();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
