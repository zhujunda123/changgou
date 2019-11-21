<template>
    <div class="el-transfer-panel district-panel">
        <div class="el-transfer-panel__header">
        {{baseData.title[titleId]}}
        </div>
        <div class="el-transfer-panel__body">
        <ul v-if="districtListMock.length > 0">
            <li v-for="(item,index) in districtListMock" :class="index==active?'active':''" class="el-transfer-panel__item" @click="handleCheckedChange(item,index)" :label="item" :key="item.id">
            {{item.name}}
            <i v-if="item.parentId===0" class="fa fa-angle-right" aria-hidden="true"></i>
            </li>
        </ul>
        <p class="no-data" v-else>无数据</p>
        </div>
    </div>
</template>

<script>
import constantApi from '@/api/base/base'
export default {
    props: {
        titleId: {
          type: Number,
        },
        districtList: { // 父组件传递的区域数据
          type: Array,
        },
        activeStyle:{
          type:Boolean
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
          preInfo:false
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
      }
}
</script>

<style>

</style>
