<template>
  <div>
    <!-- <table class="table">
      <tr v-for="item in properties" :key="item.id">
        <td>
          <strong>{{item.name}}：</strong>
        </td>
        <td>
          <label v-for="value in item.values" :key="value.id">
            <input type="checkbox" :value="value" v-model="item.selectedValues">
            {{item.selectedValues}}
            {{value.name}}
          </label>
        </td>
      </tr>
    </table> -->
    <div class="specList">
          <ul>
            <li v-for="item in properties" :key="item.id">
              <span>{{item.name}}：</span>
              <label v-for="value in item.values" :key="value.id">
                <el-checkbox-group v-model="item.selectedValues">
                  <el-checkbox
                    :label="value"
                    :value="value"
                    class="checkbox check_item"
                  >{{value.name}}</el-checkbox>
                  <span @click="handleDel(item.id,num)" class="delInfo">删除</span>
                </el-checkbox-group>
              </label>
            </li>
          </ul>
        </div>
    <!-- <table id="skuPrice_table" class="product_list_table break-word mt_0">
      <tbody>
        <tr>
          <th
            v-for="item in properties"
            :key="item.id"
            v-if="item.selectedValues.length>0"
          >{{item.Name}}</th>
          <th>
            <span class="c_red">*</span>零售价
          </th>
          <th>
            <span class="c_red">*</span>库存
          </th>
          <th>商品编码</th>
        </tr>
        <tr v-for="sku in skus" :key="sku.id">
          <td
            v-for="item in properties"
            :key="item.id"
            v-if="item.selectedValues.length>0"
          >{{getValueName(sku,item)}}</td>
          <td>
            US $
            <input type="text" v-model="sku.SkuPrice" class="w50" maxlength="9">
            <span name="productUnitTips"></span>
          </td>
          <td>
            <input type="text" v-model="sku.StockQuantity" class="w50" maxlength="9">
          </td>
          <td>
            <input type="text" v-model="sku.SkuCode" class="w180" maxlength="20">
          </td>
        </tr>
      </tbody>
    </table>-->
    <el-table :data="skus" border style="width: 100%">
      <el-table-column
        width="150"
        :label="item.name"
        fixed
        v-for="item in properties"
        :key="item.name"
        v-if="item.selectedValues.length>0"
      >
        <template slot-scope="scope">
          <span>{{getValueName(scope.row,item)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.SkuPrice" class="w50" v-if="scope.row.status==1" disabled></el-input>
          <el-input v-else v-model="scope.row.SkuPrice" class="w50"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="150" label="库存数量">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.StockQuantity"
            class="w50"
            v-if="scope.row.status==1"
            disabled
          ></el-input>
          <el-input v-else v-model="scope.row.StockQuantity" class="w50"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { commoditySpec } from "@/api/base/commodity";
var properties = [
  {
    Id: 1,
    name: "颜色222",
    values: [
      { PropertyId: 1, Id: 1, name: "红" },
      { PropertyId: 1, Id: 2, name: "黄" },
      { PropertyId: 1, Id: 3, name: "绿" }
    ],
    selectedValues: []
  },
  {
    Id: 3,
    name: "颜色",
    values: [
      { PropertyId: 3, Id: 25, name: "1" },
      { PropertyId: 3, Id: 26, name: "2" },
      { PropertyId: 3, Id: 27, name: "3" }
    ],
    selectedValues: []
  },
  {
    Id: 4,
    name: "大小",
    values: [
      { PropertyId: 4, Id: 34, name: "x" },
      { PropertyId: 4, Id: 35, name: "L" }
    ],
    selectedValues: [
      //   { PropertyId: 4, Id: 35, name: "L"},
      //   { PropertyId: 4, Id: 34, name: "x"}
    ]
  },
  {
    Id: 5,
    name: "颜色3",
    values: [
      { PropertyId: 5, Id: 12, name: "红色" },
      {
        PropertyId: 5,
        Id: 13,
        name: "绿色"
      },
      { PropertyId: 5, Id: 14, name: "白色" }
    ],
    selectedValues: [
      //   {
      //     PropertyId: 5,
      //     Id: 13,
      //     name: "绿色",
      //   }
    ]
  },
  {
    Id: 6,
    name: "s4",
    values: [
      { PropertyId: 6, Id: 15, name: "s1" },
      { PropertyId: 6, Id: 16, name: "s2" },
      { PropertyId: 6, Id: 17, name: "s3" }
    ],
    selectedValues: []
  },
  {
    Id: 7,
    name: "s4",
    values: [
      { PropertyId: 7, Id: 18, name: "s1" },
      { PropertyId: 7, Id: 19, name: "s2" },
      { PropertyId: 7, Id: 20, name: "s3" }
    ],
    selectedValues: []
  }
];
var skus = [
  //   {
  //     SkuCode: "",
  //     SkuPrice: "0.00",
  //     StockQuantity: 0,
  //     values: [{ propertyId: 4, valueId: 35 }, { propertyId: 5, valueId: 13 }]
  //   },
  //   {
  //     SkuCode: "",
  //     SkuPrice: "0.00",
  //     StockQuantity: 0,
  //     values: [{ propertyId: 4, valueId: 34 }, { propertyId: 5, valueId: 13 }]
  //   }
];
export default {
  data() {
    return {
      // properties:properties,
      properties: [],
      skus: []
    };
  },
  created() {
    commoditySpec()
      .then(res => {
        var obj = [];
        var data = {};
        for (var i = 0; i < res.data.data.length; i++) {
          obj.push({
            name: res.data.data[i].name,
            options: res.data.data[i].options
          });
          this.$set(res.data.data[i], "selectedValues", []);
          this.$set(res.data.data[i], "spec", {});

          this.$set(res.data.data[i], "values", []);
          res.data.data[i].options = res.data.data[i].options.split(",");
          for (var k = 0; k < res.data.data[i].options.length; k++) {
            var hh = {
              PropertyId: res.data.data[i].id,
              name: res.data.data[i].options[k],
              Id: k
            };
            res.data.data[i].values.push(hh);
          }
        }
        this.properties = res.data.data;
      })
      .catch(err => {
        this.$message.error("获取信息失败");
      });
  },
  computed: {
    allCheckedLength: function() {
      var length = 0;
      this.properties.forEach(function(item) {
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
    reBuild: function(val, oldVal) {
      var vm = this;
      var vmSkus = (this.skus = []);
      var propertyChecked = [];
      var skuCount = 1;
      var ori = [];
      vm.properties.forEach(function(item, index) {
        // console.log(item);
        var selectValues = item.selectedValues;
        if (selectValues.length > 0) {
          propertyChecked.push(index);
          skuCount *= selectValues.length;
          ori.push(selectValues);
        }
      });
      //   console.log(JSON.stringify(ori));
      var ret = this.descartes(ori);
      //   console.log(JSON.stringify(ret));

      for (var i = 0; i < ret.length; i++) {
        var sku = { SkuCode: "", SkuPrice: "", StockQuantity: "" };
        sku.values = [];
        ret[i].forEach(function(item) {
          sku.values.push({ propertyId: item.PropertyId, valueId: item.Id });
        });

        vmSkus.push(sku);
      }
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
    }
  }
};
</script>
<style >
table {
  border-collapse: collapse;
}

table th {
  background-color: antiquewhite;
}

table td,
th {
  border: solid 1px #b4aba1;
}

.table label {
  margin-left: 30px;
  float: left;
  width: 150px;
}

.table label input {
  margin-top: 4px;
}

.table td {
  min-width: 100px;
}

.list_table {
  clear: both;
  margin-left: 30px;
  margin-top: 10px;
}
</style>

