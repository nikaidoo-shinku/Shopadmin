<template>
  <el-menu
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409BFF"
    :unique-opened="true"
    :collapse="isCollapse"
    :collapse-transition="false"
    :router="true"
    :default-active="activePath"
  >
    <el-submenu
      :index="item.id.toString()"
      v-for="item in menuListData"
      :key="item.id"
    >
      <template slot="title">
        <i :class="iconObj[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item
        :index="subItem.path"
        v-for="subItem in item.children"
        :key="subItem.id"
        @click="saveNavState"
      >
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ subItem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Navmenu",
  props: {
    menuListData: {
      type: Array,
      default() {
        return [];
      },
    },
    itemId: {
      type: Array,
      default() {
        return [];
      },
    },
    isCollapse: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      iconObj: {},
      activePath: this.$route.path.split('/')[1]
    };
  },
  mounted() {
    setTimeout(() => {
      this.getItemId();
    }, 500);
  },
  methods: {
    getItemId() {
      this.$set(this.iconObj, this.itemId[0], "iconfont icon-user-group-fill")
      this.$set(this.iconObj, this.itemId[1], "iconfont icon-quanxian")
      this.$set(this.iconObj, this.itemId[2], "iconfont icon-shangpin")
      this.$set(this.iconObj, this.itemId[3], "iconfont icon-dingdandingdanmingxishouzhimingxi")
      this.$set(this.iconObj, this.itemId[4], "iconfont icon-baobiao-xianxing")
    },
    // 侧边菜单栏根据路由保持激活状态
    saveNavState() {
      this.activePath = this.$route.path.split('/')[1]
    }
  },
};
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.iconfont {
  margin-right: 8px;
}
</style>