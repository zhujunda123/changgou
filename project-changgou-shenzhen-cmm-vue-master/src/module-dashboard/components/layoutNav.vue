<template>
<div>
  <el-header  class="main-header" style="height:60px;">
      <!-- 导航 -->
      <nav class="navbar navbar-static-top">
        <a href="all-admin-index.html" class="logo" style="text-align:center">
        <span class="logo-lg"><img src="../../assets/logo.png"></span>
        </a>
        <div class="right-menu">
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
                <div class="avatar-wrapper">
                    <img src="../../assets/head.png" class="user-avatar">
                    Jay.Liu
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item divided>
                        <span style="display:block;">修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                            <span @click="logout" style="display:block;">退出</span>
                        </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="topbar-title">
          <el-menu class="el-menu-demo headNav" mode="horizontal" :default-active="defaultActiveIndex" @select="handleSelect" :router="true">
              
              <el-menu-item v-for="item in permission_routers" :key='item.id' :index="item.path" v-if="item.children" :router="true" ><i class="iconNav" :class="item.icon"></i>{{item.title}}</el-menu-item>
          </el-menu>
        </div>
      </nav>
    </el-header>
    
</div>
  
</template>

<script>
import {mapGetters} from 'vuex'
import {removeToken ,getToken} from '@/utils/auth'
export default {
  name: 'layoutNav',
  data() {
    return {
      defaultActiveIndex: '',
      loading: false,
      nickname: ''
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar'])
    
  },
  methods: {
    handleSelect(index){
      this.defaultActiveIndex = index;
      
    },
    fetchNavData () { 
      var cur_path = this.$route.path; // 获取当前路由
      var routers = this.$router.options.routes; // 获取路由对象
      
      var nav_type = "", nav_name = "";
      for (var i = 0; i < routers.length; i++) {
        
        var children = routers[i].children;
        
        if(children){
          for (var j = 0; j < children.length; j++) {
            
            var grand_children = children[j].children;
            if(grand_children){
              
              for (var k = 0; k < grand_children.length; k++) {
                // console.log(123,cur_path)
                // console.log(grand_children[k])

                if (grand_children[k].path === cur_path) {
                  nav_type = routers[i].type;
                  nav_name = routers[i].name;
                  break;
                }
                // 如果该菜单下还有子菜单
                if(children[j].children) {
                  let grandChildren = children[j].children;
                  for(let z=0; z<grandChildren.length; z++) {
                    if(grandChildren[z].path === cur_path) {
                      nav_type = routers[i].type;
                      nav_name = routers[i].name;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      this.$store.state.topNavState = nav_type;  // 改变topNavState状态的值
      this.$store.state.leftNavState = nav_name;  // 改变leftNavState状态的值
      // this.defaultActiveIndex = "/" + nav_name + "Manager";
      // console.log(this.defaultActiveIndex)
      if(nav_type == "home"){
        this.defaultActiveIndex = "/enterpriseManager";
      } else {
        this.defaultActiveIndex = "/" + nav_name + "Manager";
      }
      
    },
    // 退出
    logout() {
      removeToken()
      if(getToken()===undefined){
        this.$router.replace('/login');
      }
    },
  },
  created(){
    this.fetchNavData();
    
  },
  watch: {
    '$route': 'fetchNavData'  //监听router值改变时，改变导航菜单激活项
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
