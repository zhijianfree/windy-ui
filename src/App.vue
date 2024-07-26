<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-header class="header">
      <!-- 侧边导航 -->
      <el-menu
        mode="horizontal"
        class="title-menu"
        :default-active="$route.path"
        background-color="#545c64"
        text-color="#fff"
        :router="true"
        active-text-color="#ffd04b"
      >
        <el-submenu index="/">
          <template slot="title">
            <i class="el-icon-s-help"></i>
            <span slot="title">服务管理</span>
          </template>
          <el-menu-item index="/">
            <i class="el-icon-s-opportunity"></i>
            服务列表</el-menu-item
          >
          <el-menu-item index="/service/resource">
            <i class="el-icon-location"></i>
            api管理</el-menu-item
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
            <i class="el-icon-share"></i>
            流水线</el-menu-item
          >
          <el-menu-item index="/pipe/action">
            <i class="el-icon-coin"></i>
            流水线节点</el-menu-item
          >
        </el-submenu>
        <el-submenu index="/case">
          <template slot="title">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">用例管理</span>
          </template>
          <el-menu-item index="/case">
            <i class="el-icon-cpu"></i>
            功能测试</el-menu-item
          >
          <el-menu-item index="/e2e">
            <i class="el-icon-cpu"></i>
            e2e测试</el-menu-item
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
            <i class="el-icon-place"></i>
            环境管理</el-menu-item
          >
          <el-menu-item index="/monitor">
            <i class="el-icon-s-platform"></i>
            监控</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main class="main-bg">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // isStartCollapse: false,
      selectIndex: '/',
    }
  },
  methods: {
    togleCollapse() {
      this.isStartCollapse = !this.isStartCollapse
    },
  },
}
</script>
<style>
body {
  padding: 0px;
  margin: 0px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
html,
body,
#app,
.el-container {
  height: 100%;
}
.header {
  padding: 0 !important;
  background-color: #545c64;
  height: 50px !important;
}

.el-main {
  padding: 0px !important;
}
.title-menu {
  width: 800px;
  left: 50%;
  transform: translate(-50%);
}
.el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
}
.el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
}
</style>
