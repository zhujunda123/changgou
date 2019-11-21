<template>
  <el-dialog title="批量发货" :visible.sync="dialogbathVisible" width="80%" class="dialogBox">
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
          <el-table-column prop="id" label="订单编号" ></el-table-column>
          <el-table-column label="收货人" width="200" align="center"></el-table-column>
          <el-table-column prop="name" label="手机号码" width="200"></el-table-column>
          <el-table-column prop="sn" label="邮政编码" width="200"></el-table-column>
          <el-table-column prop="pageviews" label="收货地址" width="200" align="center"></el-table-column>
          <el-table-column label="配送方式" width="100" align="center"></el-table-column>
          <el-table-column label="物流单号" width="160" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.status==='1'">已审核</p>
              <p v-else>未审核</p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据表格 / -->
      </div>
      <!-- 数据列表 / -->
    </div>
  </el-dialog>
</template>

<script>
import {list} from '@/api/base/order'
export default {
  name: 'basic-list',
  components: {},
  data() {
    return {
      dialogbathVisible:false,
      items: []
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
    async getBrandData(formName) {
      await brand()
      .then(res => {
          this.brandData=res.data.data
      })
      .catch(err => {
        this.$message.error('获取信息失败');
      })
    },
    handleSelectionChange(val) {
    },
  },
  created() {
    console.log(1)
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
