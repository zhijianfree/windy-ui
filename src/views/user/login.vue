<template>
  <div class="content">
    <div class="video-background">
      <video autoplay="autoplay" loop="loop" muted="muted">
        <source src="../../assets/background.mp4" type="video/mp4" />
      </video>
      <div class="login-div">
        <div class="title">Windy</div>

        <el-form
          size="small"
          class="form-div"
          :model="loginForm"
          label-width="40px"
        >
          <el-form-item
            label="用户"
            prop="userName"
            class="form-line"
            size="mini"
          >
            <el-input
              v-model="loginForm.userName"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="form-line">
            <el-input
              v-model="loginForm.password"
              show-password
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="login-btn" @click="login">登录</div>
        <div class="bottom-line">-便捷一站式Devops平台-</div>
      </div>
    </div>
  </div>
</template>
<script>
import userApi from '../../http/User'
import cookies from 'js-cookie'
export default {
  data() {
    return {
      loginForm: {},
    }
  },
  methods: {
    login() {
      userApi.login(this.loginForm).then((res) => {
        if (res.data.token) {
          let expires = new Date(new Date() * 1 + res.data.expireTime * 1000)
          cookies.set('token', res.data.token, {
            expires: expires,
            path: '/',
          })
          this.$router.push({ path: '/' })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  position: relative;

  .login-div {
    position: absolute;
    top: 10%;
    right: 10%;
    height: 60%;
    min-height: 400px;
    width: 400px;
    border-radius: 20px;
    background-color: #fff;

    .bottom-line {
      position: absolute;
      bottom: 10px;
      width: 100%;
      text-align: center;
      color: #c0c4cc;
      font-size: 12px;
    }

    .title {
      margin-top: 50px;
      margin-bottom: 30px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      vertical-align: middle;
    }
    .form-div {
      margin: 10% 20px;
    }

    .form-line {
      margin: 20px 0;
    }

    .login-btn {
      margin: 10px 50px;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      text-align: center;
      vertical-align: middle;
      border-radius: 4px;
      color: #fff;
      background-color: #409eff;
      cursor: pointer;

      &:hover {
        box-shadow: 1px 1px 2px #f2f6fc;
      }
    }
  }

  .video-background {
    position: relative;
    width: 100%;
    height: 100vh; /* 或任意你希望的高度 */
    overflow: hidden;
  }

  .video-background video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translateX(-50%) translateY(-50%);
    z-index: -1;
    background-size: cover;
    transition: 1s opacity;
  }
}
</style>
