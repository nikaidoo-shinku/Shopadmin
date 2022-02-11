<template>
  <el-container class="home-container">
      <!-- 头部区域 -->
    <el-header>
        <div class="header-left">
            <img src="../assets/home.jpg" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
        <!-- 侧边栏 -->
      <el-aside :width="asideWidth">
          <div class="toggle-button" @click="toggleCollapse">《 》</div>
          <navmenu :menuListData="menuListData" :itemId="itemId" :isCollapse="isCollapse"></navmenu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navmenu from './common/Navmenu.vue'

import {menuList} from '../network/home'

export default {
  name: "Home",
  components: {
    Navmenu  
  },
  data () {
      return {
          menuListData: [],
          itemId: [],
          isCollapse: false    
      }
  },
  created () {
      menuList().then(res => {
          if (res.meta.status !== 200) {
              this.$message.err(res.meta.msg)
          }else {
              this.menuListData = res.data
              let i
              for (i of res.data) {
                  this.itemId.push(i.id)
              }
          }
          console.log(res);
      })
  },
  computed: {
      asideWidth() {
          if(this.isCollapse) {
              return '64px'
          }else {
              return '200px'
          }
      }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    // 侧边栏折叠
    toggleCollapse() {
        this.isCollapse = !this.isCollapse
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
    height: 100vh;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    img {
        width: 15%;
    }
    span {
        margin-left: 15px;
    }
}

.el-aside {
    background-color: #333744;
    transition: 0.5s;
    overflow: hidden;
}

.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.el-main {
    background-color: #EAEDF1;
}
</style>