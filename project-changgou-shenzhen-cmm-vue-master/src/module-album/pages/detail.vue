<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <!-- 导航区域 -->
        <el-row slot="header">
          <el-col :span="12">
            <span>相册列表</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button icon="el-icon-back" @click="goToAlbumListView">返回</el-button>
            <el-button icon="el-icon-refresh" @click="searchAlbumDetail">刷新</el-button>
            <el-button icon="el-icon-plus" @click="openUploadAlbumDialog">上传图片</el-button>
          </el-col>
        </el-row>
        <!-- 导航区域 / -->

        <div class="clearfix">
          <template v-if="album.imageItems.length > 0">
            <div class="imageItems fl" v-for="(item, index) in album.imageItems" :key="index">
              <div class="item">
                <img :src="item.url">
              </div>
              <div class="foot">
                <el-checkbox></el-checkbox>
                <el-button @click="openTransferAlbumDialog" type="text" size="small">转移相册</el-button>
                <el-button @click="confirmDeleteAlbumImages(index)" type="text" size="small">删除图片</el-button>
              </div>
            </div>
          </template>
          <template v-else>当前相册没有图片，试着上传一下吧！</template>

          <!-- 转移相册 -->
          <transfer-album-dialog :id="id" ref="transfer-album-dialog" :albums="albums"></transfer-album-dialog>
          <!-- 转移相册 / -->

          <!-- 上传图片 -->
          <upload-images-dialog
            ref="upload-images-dialog"
            :albums="albums"
            @submitImagesSuccess="searchAlbumDetail"
          ></upload-images-dialog>
          <!-- 上传图片 / -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { all, detail, update } from "@/api/business/album";
import TransferAlbumDialog from "@/module-album/components/transfer-album-dialog";
import UploadImagesDialog from "@/module-album/components/upload-images-dialog";

export default {
  name: "AlbumDetail",
  data() {
    return {
      loading: false,
      imageItems: [],
      id: 0,
      albums: [],
      album: {
        id: 0,
        title: "",
        image: "",
        imageItems: []
      }
    };
  },
  components: {
    TransferAlbumDialog,
    UploadImagesDialog
  },
  created() {
    this.id = parseInt(this.$route.query.id, 10);
  },
  mounted() {
    // 查询相册列表
    this.searchAlbumAll();
    // 查询相册详情
    this.searchAlbumDetail();
  },
  methods: {
    // 查询相册列表
    searchAlbumAll() {
      this.loading = true;

      // 调用接口
      all()
        .then(res => {
          this.albums = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 查询相册列表
    searchAlbumDetail() {
      this.loading = true;

      // 组装参数
      let params = {
        id: this.id
      };

      // 调用接口
      detail(params)
        .then(res => {
          let album = res.data.data;

          let imageItems = album.imageItems;
          if (!imageItems) {
            album.imageItems = [];
            this.loading = false;
            return;
          }
          album.imageItems = JSON.parse(imageItems);
          this.album = album;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 打开转移相册对话框
    openTransferAlbumDialog() {
      this.$refs["transfer-album-dialog"].openDialog();
    },
    // 打开上传图片对话框
    openUploadAlbumDialog() {
      this.$refs["upload-images-dialog"].openDialog();
    },
    // 提醒删除相册图片
    confirmDeleteAlbumImages(item) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 处理删除相册图片
          this.handleDeleteAlbumImages(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 处理删除相册图片
    handleDeleteAlbumImages(index) {
      this.album.imageItems.splice(index, 1);
      let params = {
        id: this.album.id,
        title: this.album.title,
        image: this.album.image,
        imageItems: JSON.stringify(this.album.imageItems)
      };

      // 调用接口
      update(params)
        .then(res => {
          let data = res.data;

          if (data.code != 20000) {
            this.$message({
              type: "error",
              message: data.message
            });
            return;
          }
          this.$message({
            type: "success",
            message: data.message
          });
          // 查询相册详情
          this.searchAlbumDetail();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转相册列表
    goToAlbumListView() {
      this.$router.push("/commodity/album-list");
    }
  }
};
</script>

<style scoped>
.imageItems {
  margin-top: 15px;
  margin-right: 15px;
}

.imageItems .item {
  width: 160px;
  height: 160px;
  padding: 10px;
  border: 1px solid #ccc;
}

.imageItems .item img {
  width: 140px;
  height: 140px;
}

.imageItems .foot {
  padding-left: 10px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.imageItems .foot .el-checkbox {
  margin-right: 0;
}
</style>
