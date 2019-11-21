<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="用户详情" name="first">
            <div class=" userBox">
                <user-Details
            ref="userdetails"
            ></user-Details>
            </div>
            
        </el-tab-pane>
        <el-tab-pane label="编辑资料" name="second">
          <div class=" userBox">
            <user-Edit></user-Edit>
          </div>
        </el-tab-pane>
        <el-tab-pane label="登录日志" name="third">
          <div class=" userBox">
            <user-Logs></user-Logs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import userDetails from './../components/userDetails'
import userEdit from './../components/useredit'
import userLogs from './../components/userLogs'
export default {
    components: {
    userDetails,
    userEdit,
    userLogs
  },
  data() {
    return {
      activeName2: "first"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style>
</style>

