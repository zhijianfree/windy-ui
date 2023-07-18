<template>
  <div>
    <el-alert
      class="tips-info"
      title="消息提示"
      type="info"
      :closable="false"
      description="系统配置作用于全局，请谨慎操作"
      show-icon
    >
    </el-alert>
    <div class="content">
      <el-divider content-position="left">Git配置</el-divider>
      <el-form :model="systemForm" size="mini" label-width="120px">
        <el-form-item label="类型" prop="gitType">
          <el-radio-group v-model="systemForm.gitType">
            <el-radio label="Gitea">Gitea</el-radio>
            <el-radio label="Gitlab">Gitlab</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" prop="gitDomain">
          <el-input
            type="text"
            v-model="systemForm.gitDomain"
            placeholder="请输入git地址"
          />
        </el-form-item>
        <el-form-item label="拥有者" prop="owner">
          <el-input
            type="text"
            v-model="systemForm.owner"
            placeholder="请输入git拥有者"
          />
        </el-form-item>
        <el-form-item label="访问token" prop="accessToken">
          <el-input
            type="text"
            v-model="systemForm.accessToken"
            placeholder="请输入git访问token"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import systemApi from '../../http/System'
export default {
  data() {
    return {
      systemForm: {},
      configId: '',
    }
  },
  methods: {
    getGitConfig() {
      systemApi.requestGitConfig().then((res) => {
        this.configId = res.data.configId
        this.systemForm = JSON.parse(res.data.configDetail)
      })
    },
    submit() {
      let data = {
        configId: this.configId,
        configDetail: JSON.stringify(this.systemForm),
      }
      systemApi.updateGitConfig(data).then((res) => {
        if (res.data) {
          this.$message.success('修改配置成功')
        } else {
          this.$message.error('修改配置失败')
        }
      })
    },
  },
  created() {
    this.getGitConfig()
  },
}
</script>
<style scoped>
.content {
  width: 50%;
}
.tips-info {
  margin: 10px;
}
</style>
