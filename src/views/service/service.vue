<template>
  <div class="all">
    <!-- 查询条件开始 -->
    <div>
      <el-form :inline="true" size="mini">
        <el-form-item label="服务名称">
          <el-input
            @input="startQuery"
            v-model="queryName"
            placeholder="请输入服务名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="startQuery"
            >查询</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="startCreate"
            >新增服务</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询条件结束 -->
    <div class="content">
      <el-table :data="serviceData" size="mini">
        <el-table-column prop="serviceName" label="服务名称"> </el-table-column>
        <el-table-column prop="description" label="服务描述"> </el-table-column>
        <el-table-column prop="gitUrl" label="git地址"> </el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.priority" disabled></el-rate>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="startEdit(scope.row)"
              plain
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="startDelete(scope.row)"
              plain
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :page-size="10"
          :current-page="currentPage"
          @current-change="pageChange"
          layout="prev, pager, next"
          :total="totalSize"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 创建服务开始 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showServiceDialog"
      @close="closeDialog"
      width="70%"
    >
      <el-alert
        type="warning"
        center
        show-icon
        :closable="false"
        v-if="notConfigGit"
      >
        <template slot="title">
          创建服务需先配置环境信息
          <el-link type="primary" @click="goEnv">前往配置>></el-link></template
        >
      </el-alert>
      <el-form
        :model="serviceForm"
        :disabled="!isEdit && notConfigGit"
        :rules="rules"
        ref="serviceForm"
        size="small"
        label-width="120px"
      >
        <el-form-item label="服务名称" prop="serviceName">
          <el-input
            v-model="serviceForm.serviceName"
            placeholder="请输入服务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input
            v-model="serviceForm.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入服务描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务git地址" prop="gitUrl">
          <el-input
            v-model="serviceForm.gitUrl"
            placeholder="请输入服务git地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="gitUrl">
          <el-rate v-model="serviceForm.priority"></el-rate>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit('serviceForm')"
            >确认</el-button
          >

          <el-button type="info" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建服务结束 -->
  </div>
</template>
<script>
import serviceApi from '../../http/Service'
import systemApi from '../../http/System'
export default {
  data() {
    return {
      serviceData: [],
      currentPage: 1,
      totalSize: 0,
      queryName: '',
      dialogTitle: '创建服务',
      showServiceDialog: false,
      serviceForm: {},
      isEdit: false,
      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入服务描述', trigger: 'blur' },
        ],
        gitUrl: [
          { required: true, message: '请输入服务的git地址', trigger: 'blur' },
        ],
      },
      notConfigGit: false,
    }
  },
  methods: {
    startEdit(row) {
      this.dialogTitle = '修改服务'
      this.isEdit = true
      this.showServiceDialog = true
      this.serviceForm = JSON.parse(JSON.stringify(row))
    },
    startDelete(row) {
      this.$confirm(`确认删除服务【${row.serviceName}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        serviceApi.deleteService(row.serviceId).then((res) => {
          if (res.data == 1) {
            this.$message.success('删除服务成功')
            this.closeDialog()
            this.getServices(1)
            return
          }
          this.$message.warning('删除服务失败')
        })
      })
    },
    startQuery() {
      this.getServices(1)
    },
    startCreate() {
      this.dialogTitle = '添加服务'
      this.isEdit = false
      this.showServiceDialog = true
      this.serviceForm = {}
    },
    closeDialog() {
      this.isEdit = false
      this.showServiceDialog = false
      this.serviceForm = {}
    },
    pageChange(page) {
      this.getServices(page)
    },
    getServices(page) {
      let name = this.queryName
      if (name == null || name == undefined) {
        name = ''
      }
      serviceApi.getServicesPage(page, 10, name).then((res) => {
        this.totalSize = res.data.total
        this.currentPage = page
        this.serviceData = res.data.data
      })
    },
    submit(serviceForm) {
      this.$refs[serviceForm].validate((valid) => {
        if (!valid) {
          return false
        }

        if (this.isEdit) {
          serviceApi.updateService(this.serviceForm).then(() => {
            this.$message.success('修改成功！')
            this.closeDialog()
            this.getServices(1)
          })
          return
        }

        serviceApi.createService(this.serviceForm).then(() => {
          this.$message.success('添加成功！')
          this.closeDialog()
          this.getServices(1)
        })
      })
    },
    getGitEnv() {
      systemApi.requestGitConfig().then((res) => {
        this.notConfigGit = this.$utils.isEmpty(res.data.accessToken)
      })
    },
    goEnv() {
      this.$router.push({ path: '/system' })
    },
  },
  created() {
    this.getGitEnv()
    this.getServices(1)
  },
}
</script>
<style scoped>
.all {
  margin: 10px;
}
.page-title {
  margin: 10px 0;
  font-size: 15px;
}
</style>
