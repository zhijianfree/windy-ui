<template>
  <div class="content">
    <el-form
      :inline="true"
      :model="queryForm"
      size="mini"
      class="demo-form-inline"
      @submit.native.prevent
    >
      <el-form-item label="服务列表">
        <el-select
          v-model="serviceId"
          size="mini"
          @change="selectService"
          placeholder="选择服务"
        >
          <el-option
            v-for="(item, index) in serviceList"
            :key="index"
            :label="item.serviceName"
            :value="item.serviceId"
          ></el-option>
        </el-select>
      </el-form-item>
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
          >手动创建模版</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="showUploadDialog = !showUploadDialog"
          >上传模版文件</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="triggerApiDialog"
          >Api生成模版</el-button
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
        <template slot-scope="scope">
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
              :isEdit="isEdit"
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
    <el-dialog :visible.sync="showAPIDialog" title="API生成模版" width="60%">
      <div v-if="!previewData || previewData.length < 1">
        <el-row :gutter="20">
          <el-col :span="8">
            <!-- api列表开始 -->
            <el-scrollbar style="height: 100%">
              <div class="api-list">
                <div class="api-title">「{{ chooseService }}」 接口列表</div>
                <div class="filter">
                  <el-input
                    v-model="filterText"
                    size="mini"
                    clearable
                    placeholder="输入api名称过滤"
                  ></el-input>
                </div>
                <el-tree
                  :data="apiTreeData"
                  show-checkbox
                  :filter-node-method="filterNode"
                  :props="apiProps"
                  @check-change="selectTreeNode"
                  ref="apiTree"
                >
                  <div class="tree-node" slot-scope="{ node, data }">
                    <i
                      v-if="data.apiType == 0"
                      class="el-icon-folder-opened folder-icon"
                    />
                    <span class="api-name">{{ node.label }}</span>
                  </div>
                </el-tree>
              </div>
            </el-scrollbar>
            <!-- api列表结束 -->
          </el-col>
          <el-col :span="16">
            <div class="api-title">生成配置</div>
            <el-form v-model="generateForm" label-width="80px" size="mini">
              <el-form-item label="是否覆盖"
                ><el-switch v-model="generateForm.cover" active-color="#13ce66">
                </el-switch>
              </el-form-item>
              <el-form-item label="调用方式">
                <el-radio-group v-model="generateForm.invoke">
                  <el-radio :label="2">HTTP调用</el-radio>
                  <el-radio :label="1">本地方法调用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="类名" v-if="generateForm.invoke == 1">
                <el-input
                  v-model="generateForm.className"
                  placeholder="请输入调用的类名"
                />
              </el-form-item>
              <el-form-item label="方法名" v-if="generateForm.invoke == 1">
                <el-input
                  v-model="generateForm.methodName"
                  placeholder="请输入调用的类的方法名"
                />
              </el-form-item>
              <el-alert
                v-if="generateForm.invoke == 1"
                title="请注意方法参数顺序"
                type="error"
                :closable="false"
                description="API生成模版参数是根据URL、Method、Header、Body顺序作为方法入参，模版执行也是按照这个顺序传入参数.请在编写模版代码时按照这个顺序接收参数！"
                show-icon
              >
              </el-alert>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <h3>模版预览</h3>
        <el-table :data="previewData" size="mini" style="width: 100%">
          <el-table-column prop="name" label="模版名称"> </el-table-column>
          <el-table-column prop="description" label="模版描述">
          </el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="showTemplate(scope.row)" plain
                >查看</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deletePreviewTemp(scope.$index)"
                plain
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="nextStep"
          v-if="previewData.length < 1"
          size="mini"
          >下一步</el-button
        >
        <el-button type="primary" @click="upStep" v-else size="mini"
          >上一步</el-button
        >
        <el-button @click="closeApiGenerate" size="mini">取 消</el-button>
        <el-button
          type="primary"
          v-if="previewData.length > 0"
          size="mini"
          @click="saveTemplates"
          >生成模版</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import templateApi from '../../http/Template'
import serviceApi from '../../http/Service'
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
      serviceId: '',
      showAPIDialog: false,
      apiTreeData: [],
      apiProps: {
        children: 'children',
        label: 'apiName',
      },
      selectNodes: [],
      generateForm: {},
      filterText: '',
      chooseService: '',
      previewData: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.apiTree.filter(val)
    },
  },
  methods: {
    saveTemplates() {
      let data = {
        templates: this.previewData,
      }
      templateApi.batchCreateTemplate(data).then((res) => {
        if (res.data) {
          this.$message.success('添加模版成功')
          this.closeApiGenerate()
        } else {
          this.$message.error('添加模版失败')
        }
      })
    },
    nextStep() {
      if (this.selectNodes.length < 1) {
        this.$message.warning('请先选择生成的api')
        return
      }
      this.genarateApi()
    },
    upStep() {
      this.previewData = []
    },
    deletePreviewTemp(index) {
      this.previewData.splice(index, 1)
    },
    showTemplate(row) {
      this.isEdit = false
      this.infoForm = row
      this.showDialog = true
    },
    genarateApi() {
      serviceApi
        .generateTemplate({
          serviceId: this.serviceId,
          apiIds: this.selectNodes,
        })
        .then((res) => {
          if (res.data.length > 0) {
            this.previewData = res.data
          }
        })
    },
    closeApiGenerate() {
      this.getTemplatePage(1)
      this.showAPIDialog = false
      this.generateForm = {}
    },
    expendAllNode() {
      let allNodes = this.$refs['apiTree'].store._getAllNodes()
      console.log('aaaaaa', allNodes)
      for (let i = 0; i < allNodes.length; i++) {
        this.$refs['apiTree'].store._getAllNodes()[i].expanded = true
      }
    },
    triggerApiDialog() {
      this.showAPIDialog = !this.showAPIDialog
      this.serviceList.forEach((e) => {
        if (e.serviceId == this.serviceId) {
          this.chooseService = e.serviceName
        }
      })
      this.getServiceApi()
    },
    selectTreeNode(data, checked) {
      if (checked) {
        this.selectNodes.push(data.apiId)
      } else {
        let index = this.selectNodes.indexOf(data.apiId)
        if (index != -1) {
          this.selectNodes.splice(index, 1)
        }
      }
    },
    getServiceApi() {
      serviceApi.getApiList(this.serviceId).then((res) => {
        this.apiTreeData = this.buildTree(res.data)
        this.expendAllNode()
      })
    },
    buildTree(data, parentId = null) {
      let tree = []
      for (let item of data) {
        if (item.parentId === parentId) {
          let children = this.buildTree(data, item.apiId)
          if (children.length > 0) {
            item.children = children
          }
          if (!item.children) {
            item.children = []
          }
          tree.push(item)
        }
      }
      return tree
    },
    filterNode(value, data) {
      if (!value) return true
      return data.apiName.indexOf(value) !== -1
    },
    selectService() {
      this.getTemplatePage(1)
    },
    getServices() {
      this.serviceList = []
      serviceApi.getServices().then((res) => {
        this.serviceList = res.data
        this.serviceId = this.serviceList[0].serviceId
        this.selectService()
      })
    },
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
      formData.append('serviceId', this.serviceId)
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

      templateApi
        .getTemplatePage(this.serviceId, page, 10, name)
        .then((res) => {
          this.templateData = res.data.data
          this.totalSize = res.data.total
        })
    },
    startQuery() {
      this.getTemplatePage(1)
    },
    startCreate() {
      this.isEdit = true
      this.showDialog = !this.showDialog
      this.dialogTitle = '手动创建模版'
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
    this.getServices()
  },
}
</script>
<style scoped>
.content {
  margin: 5px;
}
.api-list {
  height: 60vh;
}
.api-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}
.filter {
  margin: 10px 20px 10px 0px;
}
</style>
