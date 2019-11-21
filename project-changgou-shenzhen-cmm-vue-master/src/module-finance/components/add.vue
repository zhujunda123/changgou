<template>
  <el-dialog title="添加" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div class="searchBox">
      <el-input placeholder="请输入内容" v-model="pagination.name" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>当前已选择
      <span class="fontSize">{{checkData.length}}</span>件商品
    </div>
    <el-table
      :data="itemData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="商品名称" width="150px">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sn}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-checkbox @change="handleCheck($event,scope.row)"></el-checkbox>
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
  </el-dialog>
</template>
<style>
</style>
<script>
import { addlist,addRow,deleRow} from "@/api/base/operate";
export default {
  name: "splitOrder",
  props: {
    
  },
  data() {
    return {
      dialogVisible: false,
      total: 0,
      itemData: [],
      checkData: [],
      pagination: {
        page: 1,
        size: 10
      }
    };
  },
  methods: {
      // 数据列表
    async doQuery(paremt) {
      this.loading = true;

      await addlist(this.pagination)
        .then(res => {
          this.items = res.data.data.rows;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 业务方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagination.page = val;
    },
    // 选中列表某一行
    async handleCheck(e, val) {
      if (e === true) {
        this.checkData.push(val);
        await addRow(val)
      } else {
        this.checkData.splice(val.id, 1);
        await deleRow(val.id)
      }
    },
    // 秒杀专区添加列表-搜索
    handleSearch() {
      this.doQuery(this.pagination)
    },
    // 弹层隐藏
    dialogFormH() {
      this.dialogVisible = false;
    },
    handleClose() {
      this.dialogFormH();
    }
  },
  created() {},
  mounted() {}
};
</script>


