<template>
  <div class="dashboard-container" v-loading="loading">
    
    
    <div class="app-container">
      <el-tabs v-model="barSearch.activeName" @tab-click="handleTabName" class="tabList">
        <el-tab-pane name="first">
          <span slot="label">全部列表(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">已上架(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="third">
          <span slot="label">未上架(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="four">
          <span slot="label">待审核(1000)</span>
        </el-tab-pane>
        <el-tab-pane name="five">
          <span slot="label">未通过(1000)</span>
        </el-tab-pane>
    </el-tabs>
      <!-- 搜索框 -->
    <div class="seacthBox">
      <!-- 搜索栏 -->
        <el-form :inline="true" :model="pagination" ref="pagination">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="pagination.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="category1Id">
            <el-select v-model="pagination.category1Id" placeholder="请选择商品分类" @change="handleclassType">
              <el-option
                v-for="item in classaData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

            <el-select v-model="pagination.category2Id" placeholder="请选择商品分类" v-if="twoData.length>0" @change="handleTwoType">
              <el-option
                v-for="item in twoData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="pagination.category3Id" placeholder="请选择商品分类" v-if="threeData.length>0" @change="handleThreeType">
              <el-option
                v-for="item in threeData"
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
          <el-table-column prop="brandId" label="编号" ></el-table-column>
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
                :disabled="scope.row.isDelete==='1'"
                @change="handleMarke(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="SKU库存" width="100" align="center">
            <template >
              <i class="el-icon-edit-outline iconSize"></i>
            </template>
          </el-table-column>
          <el-table-column prop="saleNum" label="销量" width="160"></el-table-column>
          <el-table-column label="审核状态" width="160" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.status==='0'">待审核</p>
              <p v-else-if="scope.row.status==='1'">已审核</p>
              <p v-else>审核未通过</p>
            </template>
          </el-table-column>
          
          <el-table-column
            fixed="right"
            label="操作"
            width="200" align="center">
            <template slot-scope="scope">
              <!-- <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button> -->
              <el-button @click="handleEdit(scope.row)" type="text" size="small" :disabled="scope.row.isDelete==='1'">编辑</el-button>
              <el-button  @click="handleDelete(scope.row)" type="text" size="small" :disabled="scope.row.isDelete==='1'">删除</el-button>
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
  </div>
</template>

<script>
import {list,listSerch, put, pull, category,remove,brandAll} from '@/api/base/commodity'

export default {
  name: 'basic-list',
  data() {
    return {
      formSearch: {
        user: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        state: ''
      },
      barSearch: {
        expandInputs: false,
        alertText: '',
        activeName: 'first'
      },
      items: [],
      total:'',
      pagination: {
        page: 1,
        pagesize: 10,
        name:this.name,
        brandId:this.brandId,
        category1Id:this.category1Id,
        category2Id:this.category2Id,
        category3Id:this.category3Id
      },
      loading: false,
      multipleSelection: [],
      dialogVisible: false,
      formData: [],
      classaData: [],
      twoData: [], // 二级数据
      threeData: [], // 区级数据
      brandData:[],
    }
  },
  methods: {
    // 业务方法
    // 数据列表
    doQuery(paremt) {
      this.loading = true
      list(paremt)
        .then(res => {
          var items=res.data.data.list
          for(var i=0;i<res.data.data.list.length;i++){
            res.data.data.list[i].id=parseInt(res.data.data.list[i])
          }
          this.items=items
          console.log(items)
          this.total = res.data.data.total
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 商品品牌
      getBrandData(formName) {
        brandAll()
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
    // 获取二级数据，子组件自定义的穿梭框传回的数据，val：[区域obj, 区域obj,...]
    handleclassType(val) {
      // console.log(val)
      this.pagination.category1Id = val;
      let flag = true;
      if (val !== undefined) {
        category({ id: val }).then(res => {
          
          this.twoData = res.data.data;
          
          flag = false;
        });
      }
      // 如果没有匹配到，都显示为空
      if (flag) {
        this.twoData = [];
        this.threeData = [];
      }
    },
    // 获取三级数据，子组件自定义的穿梭框传回的数据，val：[区域obj, 区域obj,...]
    handleTwoType(val) {
      this.pagination.category2Id = val;
      let flag = true;
      if (val !== undefined) {
        category({ id: val }).then(res => {
          this.threeData = res.data.data;
          
          flag = false;
        });
      }
      // 区级没有匹配到，显示为空
      if (flag) {
        this.threeData = [];
      }
    },
    // 获取三级数据
    handleThreeType(val) {
      this.pagination.category3Id = val;
    },
    // 上架下架
    handleMarke(obj){
      // console.log(obj)
      if(obj.isMarketable){
        put({id:obj.id})
          .then(res => {
            this.$message.success('已上架');
          })
      }else{
        pull({id:obj.id})
          .then(res => {
            // debugger
            // console.log(res)
            this.$message.success('已下架');
          })
      }
    },
    handleEdit(val){
      this.$router.push(`/commodity/add?id=`+val.id)
    },
    // 删除
    handleDelete(obj){
      if(obj.isMarketable){
        
        this.$message.error('请先下架');
      }else{
        this.$confirm('确认删除？')
        .then(ret => {
          remove({id:obj.brandId}).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.doQuery(this.pagination)
          })
          
        })
      }
      
      
    },
    // 重置
    handleRest() {
      this.$refs['pagination'].resetFields()
      this.doQuery(this.pagination)
    },
    // 查询列表
    handleSearch() {
      // this.doQuery(this.pagination)
      this.loading = true
      listSerch(this.pagination)
        .then(res => {
          var items=res.data.data.list
          
          this.items=items
          this.total = res.data.data.total
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
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
    // 筛选列表数据
    handleTabName(val){

      if(val.index==='1'){
        this.pagination.isMarketable='1'
        delete this.pagination.status
      }else if(val.index==='2'){
        this.pagination.isMarketable='0'
        delete this.pagination.status
      }else if(val.index==='3'){
        this.pagination.status='0'
        delete this.pagination.isMarketable
      }else if(val.index==='4'){
        this.pagination.status='2'
        delete this.pagination.isMarketable
      }
      this.handleSearch(this.pagination)
    }
  },
  created() {
    
  },
  mounted(){
    this.doQuery(this.pagination)
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
