<template>
  <div>
    <!-- 从图库选择 -->
    <el-dialog title="从图库选择" :visible.sync="selectVisible" width="30%" center>
      <el-form ref="reference">
        <div class="breadInfo clear">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>商品图库</el-breadcrumb-item>
            <el-breadcrumb-item>全部图片</el-breadcrumb-item>
          </el-breadcrumb>
          <el-select
            v-model="value8"
            filterable
            placeholder="请选择"
            @change="handleSelect"
            class="photo"
          >
            <el-option
              v-for="item in imageSelect"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="imagesList">
          <ul>
            <li v-for="item in imageItems" :key="item.id">
              <!-- <span v-for="test in item.imageItems" :key="test.uid" class="imgInfo">
                <img :src="test.url" alt>
                <span class="checkBox">
                  <el-checkbox @change="handleCheck($event,item,test)"></el-checkbox>
                </span>
              </span>-->
              <el-checkbox-group v-model="item.values">
                <el-checkbox
                  v-for="(city,index) in item.imageItems"
                  :label="city"
                  :key="index"
                  @change="handleCheck($event,item,city)"
                >
                  <span class="imgInfo">
                    <img :src="city.url" alt />
                  </span>
                </el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
          <div class="pages">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="Number(pagination.page)"
              :total="Number(total)"
              :page-size="Number(pagination.size)"
              :page-sizes="[10,20,30, 50]"
              layout="prev, pager, next"
            ></el-pagination>
          </div>
        </div>
      </el-form>
      <p class="infoTip">
        已选中
        <span class="fontSize">{{imagesLength.length}}</span>张图片
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectVisible = false">取 消</el-button>
        <el-button type="primary" @click="imgOK()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listPhoto, photoalbum } from "@/api/base/commodity";
export default {
  props: {
    selectNum: {
      type: String
    },
    goods: {
      type: Object
    },
    // spuImageList: {
    //   type: Array
    // },
    baseData: {
      type: Object
    },
    conInfo: {
      type: Object
    }
  },
  data() {
    return {
      spuImageListData: [],
      selectVisible: false,
      checkedCities: [],
      imageItems: [],
      imagesList: [],
      photoItems: [],
      imageSelect: [],
      imagesD: [],
      imageObj: {},
      itemList: [],
      // testItem: {},
      skuitemList: [],
      skuitemData: [],
      skutest: [],
      changeTrue: null,
      imagesLength: [],
      photoimagesList: [],
      pagination: {
        page: 1,
        size: 10
      },
      total: "",
      value8: "",
      datalist: [],
      photoTest: []
    };
  },
  mounted() {
    // this.getListPage();
  },
  methods: {
    // 弹层显示
    dialogFormV() {
      this.selectVisible = true;
    },
    // 弹层隐藏
    dialogFormH() {
      this.selectVisible = false;
    },
    // 筛选图片
    handleSelect(val) {
      photoalbum({ id: val }).then(response => {
        response.data.data.imageItems = JSON.parse(
          response.data.data.imageItems
        );
        this.imagesLength = [];
        this.imageItems = [];
        this.imageItems.push(response.data.data);
      });
    },
    // 选中图片
    handleCheck(e, item, test) {
      if (this.selectNum === "0") {
        if (e == true) {
          // console.log(88,this.skuitemData)
          this.skuitemData.push(test);
          this.imagesLength.push(test);
          this.changeTrue = true;
          console.log(88, this.skuitemData);
        }
        if (e == false) {
          this.changeTrue = false;

          if (this.skuitemData.length > 0) {
            this.skuitemData.forEach((item, index) => {
              if (test.url === item.url) {
                this.skuitemData.splice(index, 1);
              }
            });
          }
          console.log(99, this.skuitemData);
          this.skutest.push(test);
          this.imagesLength.splice(0, 1);
        }
      }
      if (this.selectNum === "1") {
        var _this = this;
        if (e == true) {
          this.imagesLength.push(test);
          this.changeTrue = true;
          this.datalist.push(test);
          console.log(88, this.datalist);
        }
        if (e == false) {
          this.changeTrue = false;
          if (this.datalist.length > 0) {
            this.datalist.forEach((item, index) => {
              if (test.url === item.url) {
                this.datalist.splice(index, 1);
              }
            });
          }
          console.log(99, this.datalist);
          this.photoTest.push(test);
          this.imagesLength.splice(0, 1);
        }
      }
    },
    // 筛选图片分页
    getListPage(data, num) {
      var vlength = [];
      var vsum = 0;
      listPhoto(this.pagination).then(res => {
        this.total = res.data.data.length;
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].imageItems = JSON.parse(res.data.data[i].imageItems);
        }
        this.imageItems = res.data.data;
        this.imageSelect = res.data.data;

        for (var j = 0; j < this.imageItems.length; j++) {
          this.$set(this.imageItems[j], "values", []);
          this.imageItems[j].imageItems.forEach(obj => {
            if (data !== undefined) {
              data.forEach(item => {
                var itemdata;
                if (num === "1") {
                  itemdata = item.url;
                } else {
                  itemdata = item.url;
                }
                if (itemdata === obj.url) {
                  this.imageItems[j].values.push(obj);
                  this.imagesLength.push(obj);
                }
              });
            }
          });

          // vlength.push(this.imageItems[j].values.length)
        }
        // for (let i = 0; i < vlength.length; i++) {
        //   vsum += vlength[i];
        // }
        // this.imagesLength=vsum
      });
    },
    // 从图库选择图片
    imgOK(formName) {
      this.itemList = this.datalist;
      var _this = this;
      this.spuImageListData = [];
      if (this.imagesLength.length === 0) {
        this.$message.error("请选择图片");
        return false;
      } else {
        if (this.selectNum === "1") {
          if (this.changeTrue === null) {
            this.photoimagesList = this.conInfo.photoList;
          }else {
            this.photoimagesList = this.itemList;
          }
          this.conInfo.photoList = this.photoimagesList;
          for (var m = 0; m < this.photoimagesList.length; m++) {
            this.spuImageListData.push(this.photoimagesList[m].url);
          }

          if (this.goods.spu.image === "") {
            this.goods.spu.image = this.spuImageListData[0];
          }
          this.goods.spu.images = this.spuImageListData.join(",");
        } else {
          var obj = "";
          var dataImage = [];
          var data = [];
          this.skuitemList = this.skuitemData;
          this.skuitemData = [];
          
          for (var i = 0; i < this.goods.skuList.length; i++) {
            if (this.baseData.tableId == i) {
              if (this.changeTrue === null) {
                obj = this.goods.skuList[i].images;
              } {
                if (this.skuitemList.length > 0) {
                  this.skuitemList.map(function(n) {
                    data.push(n.url);
                  });
                  obj = data.join(",");
                }
              } 
              this.goods.skuList[i].image=''
              this.goods.skuList[i].images = obj;
            }
          }
        }
        this.selectVisible = false;
      }
      console.log(this.goods.skuList);
    },
    // 每页显示信息条数
    handleSizeChange(val) {
      this.pagination.size = val;
      if (this.pagination.page === 1) {
        this.getListPage(this.pagination);
      }
    },
    // 进入某一页
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getListPage(this.pagination);
    }
  }
};
</script>

