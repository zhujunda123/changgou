<template>
    <div>
        <h3 class="goodTit"><i></i>基本信息</h3>
        <el-form :model="goods.spu" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"  style="width:60%">
        <el-form-item label="商品分类">
            {{conInfo.firstInfo.name}}{{conInfo.twoInfo.name}}{{conInfo.threeInfo.name}}<span class="btnEdit" @click='handleEdit'>编辑分类</span>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
            <el-input v-model="goods.spu.name"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="caption">
            <el-input v-model="goods.spu.caption"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="goods.spu.brandId"  filterable placeholder="请选择品牌">
            <el-option v-for="item in brandData" :label="item.name" :value="item.id" :key="item.id">{{item.name}}</el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品介绍" prop="introduction">
            <el-input type="textarea" v-model="goods.spu.introduction"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="模板" prop="freightId">
            <el-select v-model="goods.spu.freightId" filterable placeholder="请选择模板" @change="handleChange(goods.spu.freightId,1)">
            <el-option v-for="item in templateData"  :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item> -->
        <h3 class="goodTit"><i></i>库存规格</h3>
        <el-form-item label="商品货号" prop="sn">
            <el-input v-model="goods.spu.sn"></el-input>
            <span class="infoTip">如果您不输入商品货号，系统将自动生成一个唯一的货号。</span>
        </el-form-item>
        <el-form-item label="服务保证">
            <el-checkbox-group v-model="goods.spu.saleService">
              <el-checkbox v-for="item in baseData.serverData" :label="item.name" :value="item.id" :key="item.id"></el-checkbox>
              
            </el-checkbox-group>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {brand,template} from '@/api/base/commodity'
import constantApi from '@/api/base/base'
export default {
    props: {
        goods: {
          type: Object,
        },
        rules: { // 父组件传递的区域数据
          type: Object,
        },
        conInfo:{
          type:Object
        }
    },
    data () {
        return {
          baseData:{},
          districtListMock: [], // 展示的数据 （搜索会自动修改这个数组）
          checkedCities: [], // 已选择，数据格式：[区域id,id,id...]
          father: {}, // 父级数据
          buttonAble: true,
          active:-1,
          preInfo:false,
          brandData:[],
          templateData:[],
        };
    },
    created () {
          this.getAlls();
          this.baseData=constantApi
        },
      watch: {
        districtList () {
          this.getAlls();
          if (this.districtList.length === 0) {
            this.checkedCities = [];
          }
        },
    },
    methods: {
      // 商品品牌
      getBrandData(id) {
        brand({'id':id})
        .then(res => {
            this.brandData=res.data.data
        })
        .catch(err => {
          this.$message.error('获取信息失败');
        })
      },
      // 运费模板
      getTemplateData(formName) {
        template({'id':this.conInfo.threeInfo.id})
        .then(res => {
            this.templateData=res.data.data
            this.$emit('message', this.templateData)
        })
        .catch(err => {
          this.$message.error('获取信息失败');
        })
      },
        // 获取区域数据
        getAlls () {
          this.districtListMock = this.districtList;
          // 已选择的清空
          this.checkedCities = [];
        },
        // 选择
        handleCheckedChange (value,index) {
          this.active=index;
          // 子传父
          this.$emit('check-district', value);
        },
        handleEdit(){
            this.$emit('handleEdit');
        },
        handleChange(val,num){
          let obj = {};
          obj = this.templateData.find((item)=>{//templateData是上面遍历的数据
              return item.id === val;//筛选出匹配数据
          });
          
          // this.goods.spu.freight_name=obj.name
          this.$emit('handTemplate', obj.id,num)
          // this.getParameterData(obj.id)
        }
      }
}
</script>

<style>

</style>
