<template>
  <div>
    <el-form :model="goods.spu" label-width="100px" class="demo-ruleForm">
      <!-- 商品属性 -->
      <h3 class="goodTit">
        <i></i>商品属性
      </h3>
      <el-form-item label="规格参数组">
        <el-select v-model="goods.spu.freightId" disabled>
          <el-option
            v-for="item in templateData"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          >{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <!-- end  -->
      <!-- 商品规格 -->
      <el-form-item>
        <span>商品规格</span>
        <div class="specList">
          <ul>
            <li
              v-for="(item,index) in conInfo.properties"
              v-on:mouseenter="dataDetails(index)"
              :key="item.id"
            >
              <span>{{item.name}}：</span>
              <!-- <label v-for="(value,num) in item.options" :key="value.id">
                <el-checkbox-group v-model="item.selectedValues">
                  <el-checkbox
                    :label="value"
                    :value="value"
                    class="checkbox check_item"
                  >{{value.name}}</el-checkbox>
                  <span @click="handleDel(item.id,num,value)" class="delInfo ">删除</span>
                </el-checkbox-group>
              </label>-->
              <span v-for="(value,num) in item.options" :key="value.id" class="spcebox">
                <label>
                  <input
                    type="checkbox"
                    :value="value"
                    v-model="item.selectedValues"
                    class="el-checkbox__input"
                  >
                  <span @click="handleDel(item.id,num)" class="delInfo">删除</span>
                  </input>
                  <span class="el-checkbox__label">{{value.name}}</span>
                </label>
              </span>

              <span v-if="index == ishow">
                <el-input v-model="item.value" :key="index" :value="index">{{index}}</el-input>
                <el-button type="primary" @click="handleAdd(item.value,item.id)">添加</el-button>
              </span>
            </li>
          </ul>
        </div>
        <div class="tableList">
          <el-table :data="skus" border style="width: 100%" v-if="skus.length>0">
            <el-table-column

              :label="item.name"
              fixed
              v-for="item in conInfo.properties"
              :key="item.name"
              v-if="item.selectedValues.length>0"
            >
              <template slot-scope="scope">
                <span>{{getValueName(scope.row,item)}}</span>
              </template>
            </el-table-column>
            <el-table-column width="150" label="价格">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" class="w50" v-if="scope.row.status==1" disabled></el-input>
                <el-input v-else v-model="scope.row.price" class="w50" @input.native="handleNumber"></el-input>
              </template>
            </el-table-column>

            <el-table-column width="150" label="库存数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.num" class="w50" v-if="scope.row.status==1" disabled></el-input>
                <el-input v-else v-model="scope.row.num" class="w50" @input.native="handleNumber"></el-input>
              </template>
            </el-table-column>

            <el-table-column width="150" label="库存预警值">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.alertNum"
                  class="w50"
                  v-if="scope.row.status==1"
                  disabled
                ></el-input>
                <el-input
                  v-else
                  v-model="scope.row.alertNum"
                  class="w50"
                  @input.native="handleNumber"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column width="150" label="SKU编号">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.spuId"
                  class="w50"
                  name="test"
                  v-if="scope.row.status==1"
                  disabled
                ></el-input>
                <el-input v-else v-model="scope.row.spuId" class="w50" name="test"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="150" label="重量">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.weight"
                  class="w50"
                  name="test"
                  v-if="scope.row.status==1"
                  disabled
                ></el-input>
                <el-input
                  v-else
                  v-model="scope.row.weight"
                  class="w50"
                  name="test"
                  @input.native="handleNumber"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column width="150" label="是否启用">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <!-- 图片上传 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleUpdate(scope.$index,scope.row)"
                >上传图片</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- end -->
        </div>
      </el-form-item>
      <!-- end -->
    </el-form>
    <!-- 上传图片弹层 -->
    <update-Img ref="updatePhoto" :baseData="baseData" :nameInfo="conInfo.nameInfo" @photoSelect='photoSelect'></update-Img>
    <!-- end -->
    <!-- 商品参数 -->
    <h3 class="goodTit">
      <i></i>商品参数
    </h3>
    <div style="margin-left:100px;">
      <el-table :data="conInfo.paraItems" border style="width: 100%">
        <el-table-column prop="name" label="参数类型" width="180" align="right"></el-table-column>
        <el-table-column label="录入参数" prop="parameterInfo">
          <template slot-scope="scope">
            <!-- v-model="conInfo.paraItems[scope.$index].city" -->
            <el-select
              filterable
              allow-create
              v-model="scope.row.parameterInfo"
              @change="handlePara($event,scope.row)"
              placeholder="请选择"
            >
              <el-option v-for="value in scope.row.options" :key="value" :value="value">{{value}}</el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- end -->
    <!-- 商品相册 -->
    <h3 class="goodTit">
      <i></i>商品相册
    </h3>
    <div style="margin-left:100px;">
      <div class="photoList">
        <ul>
          <li v-for="(item,i) in conInfo.photoList" :key="item.id">
            <span class="imgInfo">
              <span>
                <img :src="item.url" alt />
              </span>
              <p
                class="photoInfo"
                :class="conInfo.aciveIndex==i ? 'actives ':''">
                <em @click="handleSetPhoto(item,conInfo.aciveIndex=i)">{{conInfo.aciveIndex==i?'商品主图':"设为主图"}}</em>
                <em @click="handleDelPhoto(item.uid,i)">删除图片</em>
              </p>
            </span>
          </li>
        </ul>
        <div>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/upload"
            accept="image/jpeg, image/gif, image/png"
            :before-upload="onBeforeUpload"
            :on-success="handleFileSuccess"
            :file-list="fileList2"
            list-type="picture"
            :show-file-list="false"
          >
            <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
          </el-upload>
          <!-- <el-button size="small" type="primary" @click="photoSelect('1')">从图片库选择</el-button> -->
          <span class="el-upload__tip">最多可以上传5张图片，建议尺寸800*800px</span>
        </div>
      </div>
      <phtot-List ref="photo" 
      :selectNum="selectNum" 
      :goods='goods' 
      :spuImageList='spuImageList' 
      :baseData='baseData'
      :conInfo='conInfo'
      ></phtot-List>
    </div>
    <!-- end -->
    <!-- 详情描述 -->
    <h3 class="goodTit">
      <i></i>详情描述
    </h3>
    <div>
      <quill-editor
        v-model="conInfo.content"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      ></quill-editor>
    </div>
    <!-- end -->
  </div>
</template>
<script>
import { listPhoto, delectSpec, addSpec } from "@/api/base/commodity";
import phtotList from "./photo";
import updateImg from "./updateImg";
import { quillEditor } from "vue-quill-editor";
import { constants } from "fs";
import { connect } from "net";
import { log } from "util";
export default {
  props: {
    goods: {
      type: Object
    },
    templateData: {
      type: Array
    },
    rules: {
      // 父组件传递的区域数据
      type: Object
    },
    conInfo: {
      type: Object
    },
    spuImageList:{
      type: Array
    }
  },
  components: {
    updateImg,
    phtotList
  },
  data() {
    return {
      ishow: null,
      fileList2: [],
      baseData: {
        upPhotoData: [],
        tableId: "",
        nameInfo: "",
        tableDate: []
      },
      skus: [],
      paraItems: [],
      parname: [],
      selectNum: "",
      editorOption: {},
      specItemsData: [],
      parameterInfo: []
    };
  },
  beforeMount() {},
  // 侦听器
  computed: {
    allCheckedLength: function() {
      var length = 0;
      this.conInfo.properties.forEach(function(item) {
        length += item.selectedValues.length;
      });
      return length;
    }
  },
  watch: {
    allCheckedLength: {
      handler: "reBuild"
    }
  },
  methods: {
    // 规格添加
    handleAdd(name, num) {
      var obj = [];
      var data = {};
      var dataInfo = {};
      for (var i = 0; i < this.conInfo.properties.length; i++) {
        if (this.conInfo.properties[i].id === num) {
          var dataInfo = {
            Id: this.conInfo.properties[i].options.length,
            PropertyId: this.conInfo.properties[i].id,
            PropertyName: this.conInfo.properties[i].name,
            name: name
          };
          this.conInfo.properties[i].options.push(dataInfo);
        }
      }

      this.specItemsData = this.conInfo.properties;
      for (var i = 0; i < this.specItemsData.length; i++) {
        var itemsData = [];
        for (var n in this.specItemsData[i].options) {
          itemsData.push(this.specItemsData[i].options[n].name);
        }

        obj.push({
          name: this.specItemsData[i].name,
          options: itemsData
        });
      }
      for (var i = 0; i < obj.length; i++) {
        data[obj[i].name] = obj[i].options;
      }
      this.goods.spu.specItems = JSON.stringify(data);
    },
    // 删除商品规格
    handleDel(nameId, id) {
      var obj = [];
      var data = {};
      this.$confirm("此操作将永久删除用户 " + ", 是否继续?", "提示", {
        type: "warning"
      })
        .then(() => {
          for (var i = 0; i < this.conInfo.properties.length; i++) {
            if (this.conInfo.properties[i].id === nameId) {
              this.conInfo.properties[i].options.splice(id, 1);
            }
          }
          // this.specItemsData = this.conInfo.properties;
          for (var i = 0; i < this.conInfo.properties.length; i++) {
            var itemsData = [];
            for (var n in this.conInfo.properties[i].options) {
              itemsData.push(this.conInfo.properties[i].options[n].name);
            }

            obj.push({
              name: this.conInfo.properties[i].name,
              options: itemsData
            });
          }
          for (var i = 0; i < obj.length; i++) {
            data[obj[i].name] = obj[i].options;
          }
          this.goods.spu.specItems = JSON.stringify(data);
          this.$message.success("删除成功" + "!");
        })
        .catch(() => {
          this.$message.info("已取消操作!");
        });
    },
    dataDetails(index) {
      this.ishow = index;
    },
    reBuild: function(val, oldVal) {
      var vm = this;
      var vmSkus = (this.skus = []);
      var ori = [];
      var data;
      vm.conInfo.properties.forEach(function(item, index) {
        var selectValues = item.selectedValues;
        if (selectValues.length > 0) {
          data = item;
          ori.push(selectValues);
        }
      });
      //   console.log(JSON.stringify(ori));
      var ret = this.descartes(ori);
      //   console.log(JSON.stringify(ret));

      for (var i = 0; i < ret.length; i++) {
        var obj = {};
        var sku = {
              alertNum: "",
              price: "",
              num: "",
              sn: "",
              data: data,
              image: '',
              images: ''
            };
        if (this.conInfo.commodityId !== undefined) {
          var skuData = this.goods.skuList;

          if (skuData.length > 0) {
            for (var k = 0; k < skuData.length; k++) {
              if (i === k) {
                var sku = {
                  alertNum: skuData[k].alertNum,
                  price: skuData[k].price,
                  num: skuData[k].num,
                  sn: skuData[k].sn,
                  weight: skuData[k].weight,
                  status: skuData[k].status,
                  // spec:obj,
                  image: skuData[k].image,
                  images: skuData[k].images
                };
              }
            }
          } else {
            sku = {
              alertNum: "",
              price: "",
              num: "",
              sn: "",
              data: data,
              image: '',
              images: ''
            };
          }
        } else {
          sku = {
            alertNum: "",
            price: "",
            num: "",
            sn: "",
            data: data,
            image: '',
            images: ''
          };
        }
        this.$set(sku, "values", []);
        ret[i].forEach(function(item) {
          sku.values.push({
            propertyId: item.PropertyId,
            valueId: item.Id,
            PropertyName: item.PropertyName,
            name: item.name
          });
          sku.spec = sku.values;

          sku.spec.map(function(e) {
            obj[e.PropertyName] = e.name;
          });
          // console.log(typeof JSON.stringify(obj))
          sku.spec = JSON.stringify(obj); //数据类型
        });

        vmSkus.push(sku);
        // console.log(vmSkus)
      }
      this.baseData.tableDate = vmSkus;
      this.goods.skuList = this.baseData.tableDate;
    },

    getValueName: function(sku, property) {
      var valueName = "";
      sku.values.forEach(function(item) {
        var _this = this;
        if (item.propertyId == property.id) {
          property.selectedValues.forEach(function(obj) {
            if (item.valueId == obj.Id) {
              valueName = obj.name;
              return false;
            }
          });
        }
      });
      return valueName;
    },
    descartes(list) {
      //parent上一级索引;count指针计数
      var point = {};
      var result = [];
      var pIndex = null;
      var tempCount = 0;
      var temp = [];
      //根据参数列生成指针对象
      for (var index in list) {
        if (typeof list[index] == "object") {
          point[index] = { parent: pIndex, count: 0 };
          pIndex = index;
        }
      }
      //单维度数据结构直接返回
      if (pIndex == null) {
        return list;
      }
      //动态生成笛卡尔积
      while (true) {
        for (var index in list) {
          tempCount = point[index]["count"];
          temp.push(list[index][tempCount]);
        }
        //压入结果数组
        result.push(temp);
        temp = [];
        //检查指针最大值问题
        while (true) {
          if (point[index]["count"] + 1 >= list[index].length) {
            point[index]["count"] = 0;
            pIndex = point[index]["parent"];
            if (pIndex == null) {
              return result;
            }
            //赋值parent进行再次检查
            index = pIndex;
          } else {
            point[index]["count"]++;
            break;
          }
        }
      }
    },
    // 获取上传图片商品信息
    handleUpdate(index, val) {
      this.baseData.tableId = index;
      this.$refs.updatePhoto.dialogFormV();
      this.baseData.upPhotoData = val;
    },
    // 图库选择
    photoSelect(num) {
      this.$refs.photo.datalist=this.conInfo.photoList
      var data
        if (this.conInfo.commodityId !== undefined) {
          if(num==='0'){
          var imgobj = {};
          var imgdata = [];
          if(JSON.stringify(this.baseData.upPhotoData.images)!=='{}'){
            var goodsImages = this.baseData.upPhotoData.images.split(",");
            goodsImages.forEach(item => {
              imgobj = {
                url: item
              };
              imgdata.push(imgobj);
            });
            data=imgdata
            this.$refs.photo.skuitemData=imgdata
            this.$refs.photo.imagesLength=imgdata
          }
          
        }else{
          data=this.conInfo.photoList
          this.$refs.photo.imagesLength=this.conInfo.photoList
         }
      }
      else{
        if(num==='0'){
          if(JSON.stringify(this.baseData.upPhotoData.images)!=='{}'){
              var goodsImages=this.baseData.upPhotoData.images.split(",")
              var itemData=[]
              var obj={}
              goodsImages.forEach(item=>{
                obj={
                  'url':item
                }
                itemData.push(obj)

              })
              data=itemData
              this.$refs.photo.skuitemData=itemData
            }else if(this.$refs.photo.imagesList.length>0){

            this.$refs.photo.imagesList.forEach(item=>{
              data=item.imageItems
            })
          }
          
        }else{
          if(this.conInfo.photoList.length>0){
            data=this.conInfo.photoList
          }
        }
      }
      
        this.$refs.photo.imagesLength=[]
        this.$refs.photo.dialogFormV();
        this.selectNum = num;
        this.$refs.photo.getListPage(data, num);


      // var data = this.conInfo.photoList;
      // this.$refs.photo.imagesLength=data
      // 

    },
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    // 商品参数
    handlePara(e, handlePara) {
      console.log(e, handlePara);
      this.$emit("paraList", this.conInfo.paraItems);
      var data = [];
      for (var i = 0; i < this.conInfo.paraItems.length; i++) {
        if (handlePara.id === this.conInfo.paraItems[i].id) {
          this.parname.push(handlePara);
        }
      }
      var obj = {};

      this.parname.map(function(e, item) {
        obj[e.name] = e.parameterInfo;
      });
      // console.log(typeof JSON.stringify(obj))
      this.goods.spu.paraItems = JSON.stringify(obj); //数据类型
    },
    handleSetPhoto(item) {
      this.goods.spu.image = item.url;
    },
    // 商品相册删除某一张
    handleDelPhoto(Id, index) {
      this.$confirm("此操作将永久删除用户 " + ", 是否继续?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.conInfo.photoList.splice(index, 1);
        })
        .catch(() => {
          this.$message.info("已取消操作!");
        });
    },
    // 上传图片成功
    handleFileSuccess(response, file, fileList) {
      console.log(1,response)
      console.log(2,file)
      console.log(3,fileList)
      var obj={
        'id':file.uid,
        'url':file.name
      }
      this.conInfo.photoList.push(obj)
      // console.log(file)
      this.$message.success("上传成功!");
      // this.attachments.push(file.response);
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE;
    },
    // 输入数字 不可小数
    handleNumber(e) {
      e.target.value = e.target.value.replace(/[^\d]/g, "");
    }
  }
};
</script>
<style>
</style>
