<template>
  <div>
    <div class="title">
      <el-page-header @back="goBack" content="用户详情"> </el-page-header>
    </div>
    <el-tabs tab-position="left" style="height: 300px">
      <el-tab-pane label="用户信息">
        <div class="logo-text">
          {{ logoName }}
        </div>
        <el-form
          size="mini"
          v-model="userForm"
          label-position="80px"
          class="form-div"
        >
          <el-form-item label="用户名称">{{ userForm.userName }}</el-form-item>
          <el-form-item label="用户昵称">
            <el-input
              class="edit-name"
              v-if="isEdit"
              @blur="updateNickName"
              v-model="userForm.nickName"
              placeholder="请输入用户昵称"
            />
            <span v-else
              >{{ userForm.nickName }}
              <i @click="startEdit" class="el-icon-edit edit-icon"
            /></span>
          </el-form-item>
          <el-form-item label="所属组织">暂无</el-form-item>
          <el-form-item
            ><el-button type="primary" icon="el-icon-refresh"
              >重置密码</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import userApi from '../../http/User'
export default {
  data() {
    return {
      userForm: {},
      isEdit: false,
      oldName: '',
    }
  },
  computed: {
    logoName() {
      if (!this.userForm || !this.userForm.userName) {
        return ''
      }
      return this.userForm.userName.substring(0, 1)
    },
  },
  methods: {
    startEdit() {
      this.isEdit = true
      this.oldName = this.userForm.nickName
    },
    updateNickName() {
      if (this.oldName == this.userForm.nickName) {
        this.isEdit = false
        return
      }
      userApi.updateUser(this.userForm).then((res) => {
        if (res.data) {
          this.$message.success('修改成功成功')
          this.isEdit = false
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    getUserInfo() {
      userApi.getUserDetail().then((res) => {
        console.log(res)
        this.userForm = res.data
      })
    },
  },
  created() {
    this.getUserInfo()
  },
}
</script>
<style lang="less" scoped>
.title {
  margin: 20px;
}
.form-div {
  margin-left: 40px;
}

.logo-text {
  border-radius: 100px;
  height: 100px;
  line-height: 100px;
  width: 100px;
  text-align: center;
  vertical-align: middle;
  font-size: 30px;
  cursor: pointer;
  margin: 10px;
  margin-left: 40px;
  margin-bottom: 20px;
  color: #909399;
  font-weight: 800;
  background-color: #f2f6fc;
}
.edit-name {
  width: 200px;
}

.edit-icon {
  font-size: 15px;
  cursor: pointer;
}
</style>
