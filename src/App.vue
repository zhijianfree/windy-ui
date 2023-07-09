<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside class="aside" :width="isStartCollapse ? '64px' : '200px'">
      <div @click="togleCollapse" class="tigger-class">
        <i class="el-icon-s-fold" />
      </div>
      <!-- 侧边导航 -->
      <el-menu
        :default-active="$route.path"
        :collapse="isStartCollapse"
        background-color="#545c64"
        text-color="#fff"
        :router="true"
        active-text-color="#ffd04b"
      >
        <el-submenu index="/service">
          <template slot="title">
            <i class="el-icon-s-help"></i>
            <span slot="title">服务管理</span>
          </template>
          <el-menu-item index="/service">
            <i class="el-icon-s-unfold"></i>
            服务列表</el-menu-item
          >
        </el-submenu>
        <el-submenu index="/code/change">
          <template slot="title">
            <i class="el-icon-share"></i>
            <span slot="title">流水线管理</span>
          </template>
          <el-menu-item index="/code/change">
            <i class="el-icon-s-unfold"></i>
            变更列表</el-menu-item
          >
          <el-menu-item index="/pipeline">
            <i class="el-icon-s-unfold"></i>
            Pipeline</el-menu-item
          >
          <el-menu-item index="/pipe/action">
            <i class="el-icon-s-promotion"></i>
            节点管理</el-menu-item
          >
        </el-submenu>
        <el-submenu index="/">
          <template slot="title">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">用例管理</span>
          </template>
          <el-menu-item index="/">
            <i class="el-icon-s-unfold"></i>
            测试集列表</el-menu-item
          >
          <el-menu-item index="/template">
            <i class="el-icon-s-platform"></i>
            模版管理</el-menu-item
          >
          <el-menu-item index="/task">
            <i class="el-icon-s-order"></i>
            任务管理</el-menu-item
          >
        </el-submenu>
        <el-submenu index="/system">
          <template slot="title">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">系统管理</span>
          </template>
          <el-menu-item index="/system">
            <i class="el-icon-s-tools"></i>
            系统配置</el-menu-item
          >
          <el-menu-item index="/env">
            <i class="el-icon-s-platform"></i>
            环境管理</el-menu-item
          >
          <el-menu-item index="/monitor">
            <i class="el-icon-s-platform"></i>
            监控</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      isStartCollapse: false,
      selectIndex: "/",
    };
  },
  methods: {
    togleCollapse() {
      this.isStartCollapse = !this.isStartCollapse;
    },
  },
  computed: {
    toggleButton() {
      if (this.isStartCollapse) {
        return "minMargin";
      } else {
        return "maxMargin";
      }
    },
  },
};
</script>
<style>
body {
  padding: 0px;
  margin: 0px;
}
html,
body,
#app,
.el-container {
  height: 100%;
}

.aside {
  width: 178px;
  background-color: rgb(84, 92, 100);
  overflow: hidden;
}
.el-aside {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
.minMargin {
  width: 10px;
  height: 100%;
  position: absolute;
  cursor: pointer;
  margin-left: 64px;
}
.maxMargin {
  width: 10px;
  height: 100%;
  position: absolute;
  cursor: pointer;
  margin-left: 170px;
}
.el-main {
  padding: 0px !important;
}
.tigger-class {
  height: 40px;
  line-height: 40px;
  text-align: center;
  vertical-align: middle;
  font-size: 18px;
  cursor: pointer;
}
</style>
