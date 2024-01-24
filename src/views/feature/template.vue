<template>
  <div class="content">
    <el-form
      :inline="true"
      :model="queryForm"
      size="small"
      class="demo-form-inline"
      @submit.native.prevent
    >
      <el-form-item label="模版名称">
        <el-input
          clearable
          @input="inputChange"
          v-model="queryForm.name"
          placeholder="请输入模版名称"
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
          >新增模版</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="showUploadDialog = !showUploadDialog"
          >上传模版文件</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="templateData" size="mini" style="width: 100%">
      <el-table-column prop="templateId" label="模版ID"> </el-table-column>
      <el-table-column prop="name" label="模版名称"> </el-table-column>
      <el-table-column prop="description" label="模版描述"> </el-table-column>
      <el-table-column prop="updateTime" label="最近修改时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作">
        <template
          slot-scope="scope"
          v-if="scope.row.templateType == 1 || scope.row.templateType == 3"
        >
          <el-button
            type="primary"
            size="mini"
            plain
            @click="refreshTemplate(scope.row)"
            >刷新</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)" plain
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.templateType == 3"
            plain
            @click="handleDelete(scope.row)"
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

    <!-- 创建模版开始 -->
    <el-dialog :visible.sync="showDialog" @close="closeDialog" width="85%">
      <template slot="title">
        {{ dialogTitle }}
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            用例执行点是由模版拖拽而来，模版定义了执行点运行的基本参数。<br />执行点配置好参数值之后执行测试任务
          </div>
          <span
            ><i
              style="margin-left: 5px; cursor: pointer; font-size: 15px"
              class="el-icon-question"
          /></span>
        </el-tooltip>
      </template>
      <TemplateConfig
        :isEdit="isEdit"
        :config="infoForm"
        @dataChange="templateChange"
        @complete="closeDialog"
      />
    </el-dialog>
    <!-- 创建模版结束 -->
    <!-- 文件上传开始 -->
    <el-dialog
      :visible.sync="showUploadDialog"
      title="模版扫描"
      :destroy-on-close="true"
      width="60%"
    >
      <div v-if="parseData.length <= 0">
        <el-upload
          drag
          action="#"
          :auto-upload="true"
          :http-request="httpRequest"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jar文件</div>
        </el-upload>
      </div>
      <div v-else>
        <h3>扫描结果</h3>
        <el-collapse>
          <el-collapse-item
            name="1"
            v-for="(item, index) in parseData"
            :key="index"
          >
            <template slot="title">
              {{ item.name }} - {{ item.description }}
            </template>
            <TemplateConfig
              :config="item"
              @dataChange="uploadChange($event, index)"
            />
          </el-collapse-item>
        </el-collapse>
      </div>

      <span slot="footer" class="dialog-footer" v-if="parseData.length > 0">
        <el-button size="mini" @click="deletePlugin">取消</el-button>
        <el-button type="primary" size="mini" @click="submitTemplates"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!-- 文件上传结束 -->
  </div>
</template>
<script>
import templateApi from '../../http/Template'
import TemplateConfig from './comp/template-config.vue'
export default {
  components: {
    TemplateConfig,
  },
  data() {
    return {
      templateData: [],
      queryForm: {},
      showDialog: false,
      infoForm: { params: [{}] },
      dialogTitle: '添加执行点模版',
      isEdit: false,
      currentPage: 1,
      totalSize: 0,
      showUploadDialog: false,
      parseData: [],
      pluginId: '',
    }
  },
  methods: {
    deletePlugin() {
      templateApi.deletePlugin(this.pluginId).then((res) => {
        if (res.data) {
          this.$message.success('未使用插件，已清理相关数据')
        } else {
          this.$message.warning('未使用插件，清理数据错误')
        }
      })
    },
    templateChange(data) {
      this.infoForm = data
    },
    submitTemplates() {
      let data = {
        templates: this.parseData,
        pluginId: this.pluginId,
      }
      templateApi.batchCreateTemplate(data).then((res) => {
        if (res.data) {
          this.$message.success('添加模版成功')
          this.showUploadDialog = false
          this.parseData = []
          this.pluginId = ''
          this.getTemplatePage(1)
        } else {
          this.$message.error('添加模版失败')
        }
      })
    },
    uploadChange(data, index) {
      this.parseData[index] = data
    },
    httpRequest(param) {
      const formData = new FormData()
      formData.append(`file`, param.file)
      templateApi.upload(formData).then((res) => {
        if (res.data) {
          this.$message.success('上传文件成功')
          this.parseData = res.data.templateDefines
          this.pluginId = res.data.pluginId
        } else {
          this.$message.error('上传文件失败')
        }
      })
    },
    removeHeader(index) {
      this.infoForm.headers.splice(index, 1)
    },
    addHeader() {
      this.infoForm.headers.push({})
    },
    inputChange() {
      this.getTemplatePage(1)
    },
    pageChange(page) {
      this.getTemplatePage(page)
    },
    getTemplatePage(page) {
      let name = this.queryForm.name
      if (!name) {
        name = ''
      }

      templateApi.getTemplatePage(page, 10, name).then((res) => {
        this.templateData = res.data.data
        this.totalSize = res.data.total
      })
    },
    startQuery() {
      this.getTemplatePage(1)
    },
    startCreate() {
      this.isEdit = false
      this.showDialog = !this.showDialog
      this.dialogTitle = '创建模版'
      this.infoForm = { params: [{}], invokeType: 1, method: '' }
    },
    refreshTemplate(row) {
      templateApi.refresh(row.templateId).then((res) => {
        if (res.data) {
          this.$message.success('刷新成功')
        } else {
          this.$message.error('刷新失败')
        }
      })
    },
    handleEdit(row) {
      this.isEdit = true
      this.showDialog = true
      this.dialogTitle = '编辑模版'
      this.infoForm = row
    },
    handleDelete(row) {
      this.$confirm(`确认删除模版【${row.name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        templateApi.deleteTemplate(row.templateId).then((res) => {
          if (res.data) {
            this.$message.success('删除模版成功')
            this.getTemplatePage(1)
          } else {
            this.$message.error('删除模版失败')
          }
        })
      })
    },
    closeDialog() {
      this.showDialog = false
      this.infoForm = { params: [{}] }
      this.getTemplatePage(1)
    },
  },
  created() {
    this.getTemplatePage(1)
  },
}
</script>
<style scoped>
.content {
  margin: 5px;
}
</style>
