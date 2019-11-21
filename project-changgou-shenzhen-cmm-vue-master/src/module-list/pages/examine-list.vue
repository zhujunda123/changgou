<template>
  <div class="dashboard-container" v-loading="loading">
    
    <div class="app-container">
      <!-- 搜索框 -->
    <div class="seacthBox">
      <!-- 搜索栏 -->
        <el-form :inline="true" :model="pagination" ref="pagination">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="pagination.name" placeholder="商品名称/商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="category1Id">
            <el-select v-model="pagination.category1Id" placeholder="请选择商品分类">
              <el-option
                v-for="item in classaData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="pagination.brandId" placeholder="请选择品牌">
              <el-option v-for="item in brandData" :label="item.name" :value="item.id" :key="item.id">{{item.name}}</el-option>
            </el-select>
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
        <!-- <div>{{barSearch.alertText}}</div> -->
        <!-- 数据表格 -->
        <el-table 
          :data="items" 
          border 
          style="width: 100%; margin-top:10px;" 
          @selection-change="handleSelectionChange"
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号" ></el-table-column>
          <el-table-column label="商品图片" width="200" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.image===''">
                暂无
              </span>
              <span class="imageSet" v-else>
                <img :src="scope.row.image">
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
          <el-table-column prop="sn" label="价格/货号" width="200"></el-table-column>
          <el-table-column prop="pageviews" label="标签" width="200" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isMarketable"
                active-text="上架"
                inactive-text="下架"
                @change="handleMarke(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="100" align="center">
            <template >
              <i class="el-icon-edit-outline iconSize"></i>
            </template>
          </el-table-column>
          <el-table-column prop="saleNum" label="销量" width="160"></el-table-column>
          <el-table-column label="审核状态" width="160" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.status==='1'">已审核</p>
              <p v-else>未审核</p>
            </template>
          </el-table-column>
          
          <el-table-column
            fixed="right"
            label="操作"
            width="200" align="center">
            <template slot-scope="scope">
              <!-- <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button> -->

              <el-button  v-if="scope.row.status==='1'" disabled type="text" size="small">审核</el-button>
              <el-button v-else @click="handleExamine(scope.row)" type="text" size="small">审核</el-button>
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

    <!-- Form -->

    <el-dialog title="商品审核" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="商品名称：">
          {{this.examineData.name}}
        </el-form-item>
        <el-form-item label="活动区域：">
          <el-radio-group v-model="form.radio">
            <el-radio :label="3">审核通过</el-radio>
            <el-radio :label="6">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="反馈详情">
          <el-input type="textarea" v-model="form.desc" placeholder="请输入内容"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleExamineOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {list, put, pull, category,brand,audit} from '@/api/base/commodity'

export default {
  name: 'basic-list',
  data() {
    return {
      dialogFormVisible: false,
      barSearch: {
        expandInputs: false,
        alertText: '',
        activeName: 'first'
      },
      form:{
        name:'',
        region:'',
        radio:'',
        desc:''
      },
      items: [],
      total:'',
      pagination: {
        page: 1,
        pagesize: 10,
        name:this.name,
        brandId:this.brandId,
        category1Id:this.category1Id
      },
      loading: false,
      multipleSelection: [],
      dialogVisible: false,
      formData: [],
      classaData: [],
      brandData:[],
      examineData:{}
    }
  },
  methods: {
    // 业务方法
    // 数据列表
    doQuery(paremt) {
      this.loading = true
      this.items = []
      var paremt=this.pagination
      list(paremt)
        .then(res => {
          this.items = res.data.data.list
          for(var i=0;i<this.items.length;i++){
            
            if(this.items[i].isMarketable==='1'){
              this.items[i].isMarketable=true
            }else{
             this.items[i].isMarketable=false
             }
          }
          this.total = res.data.data.total
          // this.barSearch.alertText = `共 ${this.total} 条记录`
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 商品品牌
      getBrandData(formName) {
        brand()
        .then(res => {
            this.brandData=res.data.data
        })
        .catch(err => {
          this.$message.error('获取信息失败');
        })
      },
    // 商品分类
    handleClassA(){
      category({'id':0})
      .then(res => {
        this.classaData=res.data.data
      })
    },
    // 上架下架
    handleMarke(obj){
      if(obj.isMarketable){
        put({id:obj.id})
          .then(res => {
            this.$message.success('已上架');
          })
      }else{
        pull({id:obj.id})
          .then(res => {
            this.$message.success('已下架');
          })
      }
    },
    handleRest() {
      this.$refs['pagination'].resetFields()
      this.doQuery()
    },
    handleSearch() {
      this.doQuery()
      
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
    handleEdit(){
      
    },
    handleExamine(val){
      this.examineData=val
      this.dialogFormVisible=true
    },
    handleExamineOk(){
      audit({'id':this.examineData.id})
          .then(res => {
            this.$message.success('已审核');
          })
    }
  },
  created() {
    this.doQuery()
    this.handleClassA()
    this.getBrandData()
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
