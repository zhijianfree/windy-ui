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
        <el-table-column prop="serviceId" label="服务Id"> </el-table-column>
        <el-table-column prop="serviceName" label="服务名称"> </el-table-column>
        <el-table-column prop="description" label="服务描述"> </el-table-column>
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
      <el-form :model="serviceForm" size="small" label-width="120px">
        <el-form-item label="服务名称">
          <el-input
            v-model="serviceForm.serviceName"
            placeholder="请输入服务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务描述">
          <el-input
            v-model="serviceForm.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入服务描述"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">确认</el-button>

          <el-button type="info" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建服务结束 -->
  </div>
</template>
<script>
import serviceApi from '../../http/Service'
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
      this.$confirm('确认删除服务?', '提示', {
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
    submit() {
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
    },
  },
  created() {
    this.getServices(1)
  },
}
</script>
<style scoped>
.all {
  margin: 10px;
}
</style>
