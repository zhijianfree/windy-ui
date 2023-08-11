<template>
  <div>
    <div>
      <el-row :gutter="10">
        <el-col :span="5">
          <div class="api-list">
            <!-- 服务列表开始 -->
            <el-form inline size="mini">
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
            </el-form>
            <!-- 服务列表结束 -->

            <!-- api操作开始 -->
            <div class="filter-text">
              <el-row :gutter="10">
                <el-col :span="16">
                  <el-input
                    v-model="filterText"
                    size="mini"
                    clearable
                    placeholder="输入api名称过滤"
                  ></el-input>
                </el-col>
                <el-col :span="5">
                  <el-dropdown @command="selectCommand">
                    <el-button type="primary" size="mini">
                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="api"
                        >新增接口</el-dropdown-item
                      >
                      <el-dropdown-item command="dir"
                        >新增目录</el-dropdown-item
                      >
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </div>
            <!-- api操作结束 -->

            <!-- api列表开始 -->
            <el-tree
              :data="treeData"
              show-checkbox
              default-expand-all
              :filter-node-method="filterNode"
              :props="apiProps"
              @check-change="selectTreeNode"
              @node-click="treeNodeSelect"
              ref="tree"
            >
              <div class="tree-node" slot-scope="{ node, data }">
                <i
                  v-if="!data.isApi"
                  class="el-icon-folder-opened folder-icon"
                />
                {{ node.label }}
                <div class="tree-op-list">
                  <el-dropdown @command="selectItemCommand($event, data)">
                    <span> ... </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="api" v-if="!data.isApi"
                        >新增接口</el-dropdown-item
                      >
                      <el-dropdown-item command="dir" v-if="!data.isApi"
                        >新增目录</el-dropdown-item
                      >
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </el-tree>
            <!-- api列表结束 -->
          </div>
        </el-col>
        <el-col :span="19">
          <el-empty
            v-if="!apiForm.apiId"
            description="请在左侧选择接口"
          ></el-empty>
          <div v-else class="api-detail">
            <el-tabs
              v-model="activeName"
              @tab-click="selectTab"
              :before-leave="beforeLeave"
            >
              <!-- 接口预览开始 -->
              <el-tab-pane label="接口预览" name="preview">
                <el-descriptions title="接口属性" :column="2">
                  <el-descriptions-item label="接口名称">{{
                    apiForm.apiName
                  }}</el-descriptions-item>
                  <el-descriptions-item label="接口类型">{{
                    apiForm.type
                  }}</el-descriptions-item>
                  <el-descriptions-item label="接口定义"
                    ><el-tag type="success" size="small">{{
                      apiForm.method
                    }}</el-tag>
                    {{ apiForm.api }}</el-descriptions-item
                  >
                  <el-descriptions-item label="修改时间">{{
                    apiForm.updateTime | dateFormat
                  }}</el-descriptions-item>
                  <el-descriptions-item label="接口说明">
                    {{ apiForm.description }}
                  </el-descriptions-item>
                </el-descriptions>
                <h4>请求参数</h4>
                <div class="display-param" v-if="pathData.length > 0">
                  <h5>Path路径参数</h5>
                  <el-table :data="pathData" border size="mini">
                    <el-table-column
                      prop="paramKey"
                      label="参数名称"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型" width="150px">
                    </el-table-column>
                    <el-table-column
                      prop="position"
                      label="参数位置"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="required"
                      label="是否必选"
                      width="150px"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          disabled
                          v-model="scope.row.required"
                          active-color="#13ce66"
                          inactive-color="#909399"
                        >
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="参数描述">
                    </el-table-column>
                  </el-table>
                </div>

                <div class="display-param" v-if="headerData.length > 0">
                  <h5>Header</h5>
                  <el-table :data="headerData" border size="mini"
                    ><el-table-column
                      prop="paramKey"
                      label="参数名称"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型" width="150px">
                    </el-table-column>
                    <el-table-column
                      prop="required"
                      label="是否必选"
                      width="150px"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          disabled
                          v-model="scope.row.required"
                          active-color="#13ce66"
                          inactive-color="#909399"
                        >
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="参数描述">
                    </el-table-column
                  ></el-table>
                </div>

                <div class="display-param" v-if="bodyData.length > 0">
                  <h5>请求body</h5>
                  <el-table
                    :data="bodyData"
                    size="mini"
                    border
                    row-key="id"
                    :tree-props="{
                      children: 'children',
                      hasChildren: 'hasChildren',
                    }"
                    ><el-table-column
                      prop="paramKey"
                      label="参数名称"
                      width="150px"
                    >
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型" width="150px">
                    </el-table-column>
                    <el-table-column
                      prop="required"
                      label="是否必选"
                      width="150px"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          disabled
                          v-model="scope.row.required"
                          active-color="#13ce66"
                          inactive-color="#909399"
                        >
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="参数描述">
                    </el-table-column
                  ></el-table>
                </div>

                <h4>响应参数</h4>
                <div class="display-param">
                  <el-table
                    :data="previewRes"
                    border
                    row-key="id"
                    size="mini"
                    :tree-props="{
                      children: 'children',
                      hasChildren: 'hasChildren',
                    }"
                    ><el-table-column prop="paramKey" label="参数名称">
                    </el-table-column>
                    <el-table-column prop="type" label="参数类型">
                    </el-table-column>
                    <el-table-column
                      prop="required"
                      label="是否必选"
                      width="150px"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          disabled
                          v-model="scope.row.required"
                          active-color="#13ce66"
                          inactive-color="#909399"
                        >
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="参数描述">
                    </el-table-column
                  ></el-table>
                </div>
              </el-tab-pane>
              <!-- 接口预览结束 -->

              <!-- 接口配置开始 -->
              <el-tab-pane label="接口配置" name="edit">
                <el-form v-model="apiForm" size="small" label-width="80px">
                  <h4>接口属性</h4>
                  <el-form-item label="接口名称">
                    <el-input
                      v-model="apiForm.apiName"
                      placeholder="请输入接口名称"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="接口类型">
                    <el-select
                      v-model="apiForm.type"
                      placeholder="请选择"
                      @change="apiForm.method = ''"
                    >
                      <el-option label="Rest Http" value="http"> </el-option>
                      <el-option label="Dubbo" value="dubbo"> </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="接口定义">
                    <el-row :gutter="10">
                      <el-col v-if="apiForm.type == 'http'" :span="4"
                        ><el-select
                          v-model="apiForm.method"
                          placeholder="请选择HTTP请求方法"
                        >
                          <el-option label="GET" value="GET"></el-option>
                          <el-option label="POST" value="POST"></el-option>
                          <el-option label="PUT" value="PUT"></el-option>
                          <el-option
                            label="DELETE"
                            value="DELETE"
                          ></el-option> </el-select
                      ></el-col>
                      <el-col :span="18">
                        <el-input
                          :placeholder="
                            apiForm.type == 'http'
                              ? '请输入uri'
                              : '请输入dubbo的类名'
                          "
                          v-model="apiForm.api"
                          class="input-with-select"
                        >
                        </el-input>
                      </el-col>
                      <el-col :span="5" v-if="apiForm.type == 'dubbo'">
                        <el-input
                          v-model="apiForm.method"
                          placeholder="请输入方法名"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="接口说明">
                    <el-input
                      v-model="apiForm.description"
                      type="textarea"
                      placeholder="请输入接口描述"
                    ></el-input>
                  </el-form-item>
                  <h4>参数设置</h4>
                  <el-button type="primary" size="mini" @click="addParam"
                    >新增请求参数</el-button
                  >
                  <el-tree
                    class="tree-item"
                    :data="paramData"
                    :props="defaultProps"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                  >
                    <div class="custom-node" slot-scope="{ node, data }">
                      <el-row :gutter="10">
                        <el-col :span="4">
                          <el-input
                            size="mini"
                            v-model="data.paramKey"
                            placeholder="请输入参数名称"
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-select
                            v-model="data.position"
                            style="with: 100%"
                            size="mini"
                            :disabled="data.freezed"
                            placeholder="请选择参数位置"
                          >
                            <el-option label="Path" value="Path"> </el-option>
                            <el-option label="Query" value="Query"> </el-option>
                            <el-option label="Header" value="Header">
                            </el-option>
                            <el-option label="Body" value="Body"> </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="4">
                          <el-select
                            class="select-type"
                            v-model="data.type"
                            placeholder="请选择参数类型"
                            size="mini"
                          >
                            <el-option
                              label="String"
                              value="String"
                            ></el-option>
                            <el-option label="Long" value="Long"> </el-option>
                            <el-option
                              label="Array"
                              value="Array"
                              v-if="data.position == 'Body'"
                            >
                            </el-option>
                            <el-option
                              label="Object"
                              value="Object"
                              v-if="data.position == 'Body'"
                            >
                            </el-option>
                            <el-option label="Boolean" value="Boolean">
                            </el-option>
                            <el-option label="Integer" value="Integer">
                            </el-option>
                          </el-select>
                        </el-col>

                        <el-col :span="4">
                          <el-select
                            size="mini"
                            v-model="data.required"
                            placeholder="选择参数是否必选"
                          >
                            <el-option label="必需" :value="true"></el-option>
                            <el-option
                              label="非必需"
                              :value="false"
                            ></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.description"
                            placeholder="请输入参数描述"
                          ></el-input>
                        </el-col>
                        <el-col :span="3">
                          <div class="op-icon">
                            <i
                              class="el-icon-remove-outline"
                              @click="removeParam(node, data)"
                            />
                            <i
                              class="el-icon-circle-plus-outline"
                              @click="addSubParam(data)"
                              v-if="
                                data.type == 'Object' || data.type == 'Array'
                              "
                            />
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-tree>
                  <h4>响应设置</h4>
                  <el-button type="primary" size="mini" @click="addResParam"
                    >新增响应参数</el-button
                  >
                  <el-tree
                    class="tree-item"
                    :data="responseData"
                    :props="defaultProps"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                  >
                    <div class="custom-node" slot-scope="{ node, data }">
                      <el-row :gutter="10">
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.paramKey"
                            placeholder="请输入参数名称"
                          ></el-input>
                        </el-col>
                        <el-col :span="5">
                          <el-select
                            class="select-type"
                            v-model="data.type"
                            placeholder="请选择参数类型"
                            size="mini"
                          >
                            <el-option
                              label="String"
                              value="String"
                            ></el-option>
                            <el-option label="Long" value="Long"> </el-option>
                            <el-option label="Array" value="Array"> </el-option>
                            <el-option label="Object" value="Object">
                            </el-option>
                            <el-option label="Boolean" value="Boolean">
                            </el-option>
                            <el-option label="Integer" value="Integer">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="4">
                          <el-select
                            size="mini"
                            v-model="data.required"
                            placeholder="选择参数是否必选"
                          >
                            <el-option label="必需" :value="true"></el-option>
                            <el-option
                              label="非必需"
                              :value="false"
                            ></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="5">
                          <el-input
                            size="mini"
                            v-model="data.description"
                            placeholder="请输入参数描述"
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <div class="op-icon">
                            <i
                              class="el-icon-remove-outline"
                              @click="removeParam(node, data)"
                            />
                            <i
                              class="el-icon-circle-plus-outline"
                              @click="addSubParam(data)"
                              v-if="
                                data.type == 'Object' || data.type == 'Array'
                              "
                            />
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-tree>
                </el-form>
              </el-tab-pane>
              <!-- 接口配置结束 -->
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="save-btn" v-if="activeName == 'edit'">
      <el-button
        type="primary"
        icon="el-icon-upload"
        size="small"
        @click="saveApi"
        >保存配置</el-button
      >
    </div>
    <el-dialog
      title="创建目录"
      :visible.sync="showCreateApi"
      width="50%"
      :before-close="cancelCreate"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        size="mini"
        :rules="apiRule"
        ref="dataForm"
      >
        <el-form-item label="名称" prop="apiName">
          <el-input v-model="dataForm.apiName"></el-input>
        </el-form-item>
        <el-form-item label="接口类型" prop="type" v-if="!createDir">
          <el-select v-model="dataForm.type" placeholder="请选择">
            <el-option label="Rest Http" value="http"> </el-option>
            <el-option label="Dubbo" value="dubbo"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口定义" prop="api" v-if="!createDir">
          <el-row :gutter="10">
            <el-col v-if="dataForm.type == 'http'" :span="4"
              ><el-select v-model="dataForm.method" placeholder="选择请求方法">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option
                  label="DELETE"
                  value="DELETE"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="18">
              <el-input
                :placeholder="
                  dataForm.type == 'http' ? '请输入uri' : '请输入dubbo的类名'
                "
                v-model="dataForm.api"
                class="input-with-select"
              >
              </el-input>
            </el-col>
            <el-col :span="5" v-if="dataForm.type == 'dubbo'">
              <el-input
                v-model="dataForm.method"
                placeholder="请输入方法名"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCreate" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitApi('dataForm')" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import serviceApi from '../../http/Service'
export default {
  data() {
    return {
      activeName: 'preview',
      filterText: '',
      apiForm: {},
      paramData: [],
      responseData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'paramKey',
      },
      apiProps: {
        children: 'children',
        label: 'apiName',
      },
      pathData: [],
      headerData: [],
      bodyData: [],
      previewRes: [],
      uuid: 1,
      serviceList: [],
      serviceId: '',
      currentApi: '',
      showCreateApi: false,
      dataForm: { type: 'http' },
      apiRule: {
        apiName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择接口类型', trigger: 'blur' }],
        api: [
          { required: true, message: '请输入api', trigger: 'blur' },
          {
            validator: this.validApi,
            message: '请填写方法',
            trigger: 'blur',
          },
        ],
      },
      createDir: false,
      selectNodes: [],
      isLeaving: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    beforeLeave(activeName, oldActiveName) {
      console.log('xxxx leave', this.isLeaving)
      if (oldActiveName == 'edit' && !this.isLeaving) {
        this.$confirm('你存在数据变更，离开后数据可能丢失，确认离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.isLeaving = true
            this.activeName = activeName
            console.log('ddd', this.activeName)
          })
          .catch(() => {})
        return false
      }
      return true
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
    validApi(rule, value, callback) {
      if (this.dataForm.method == '' || this.dataForm.method == null) {
        callback(new Error())
      } else {
        callback()
      }
    },
    selectItemCommand(command, data) {
      console.log('sssss', command, data)
      if (command == 'dir') {
        this.addFolder(data)
        return
      }
      if (command == 'api') {
        this.addApi(data)
        return
      }
      if (command == 'delete') {
        serviceApi.deleteApi(data.apiId).then((res) => {
          if (res.data) {
            this.$message.success('删除成功')
            this.selectService()
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    },
    treeNodeSelect(data) {
      if (!data.isApi) {
        return
      }
      this.apiForm = data
      this.paramData = JSON.parse(data.requestParams)
      if (!this.paramData) {
        this.paramData = []
      }

      this.responseData = JSON.parse(data.responseParams)
      if (!this.responseData) {
        this.responseData = []
      }
      this.currentApi = data.apiId
      this.selectTab()
    },
    addFolder(node) {
      this.createDir = true
      this.showCreateApi = true
      this.dataForm.parentId = node.apiId
      this.dataForm.isApi = false
    },
    addApi(node) {
      this.createDir = false
      this.showCreateApi = true
      this.dataForm.parentId = node.apiId
      this.dataForm.isApi = true
    },
    submitApi(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }

        this.dataForm.serviceId = this.serviceId
        console.log('点对点', this.dataForm)
        serviceApi.createApi(this.dataForm).then((res) => {
          if (res.data) {
            this.$message.success('添加成功')
            this.selectService()
            this.cancelCreate()
          } else {
            this.$message.error('添加失败')
          }
        })
      })
    },
    selectCommand(command) {
      if (command == 'delete') {
        serviceApi.batchDeleteApi(this.selectNodes).then((res) => {
          if (res.data) {
            this.$message.success('删除成功')
            this.selectService()
          } else {
            this.$message.error('删除失败')
          }
        })
        return
      }
      this.createDir = command == 'dir'
      this.showCreateApi = true
      this.dataForm.isApi = !this.createDir
    },
    cancelCreate() {
      this.showCreateApi = false
      this.dataForm = { type: 'http' }
    },
    saveApi() {
      let data = this.apiForm
      data.serviceId = this.serviceId
      data.requestParams = this.paramData
      data.responseParams = this.responseData
      if (this.currentApi != '') {
        serviceApi.updateApi(data).then((res) => {
          if (res.data) {
            this.$message.success('修改接口成功')
          } else {
            this.$message.error('修改接口失败')
          }
        })
        return
      }
      serviceApi.createApi(data).then((res) => {
        if (res.data) {
          this.$message.success('添加接口成功')
        } else {
          this.$message.error('添加接口失败')
        }
      })
    },
    selectTab() {
      this.isLeaving = false
      if (this.activeName == 'preview') {
        this.pathData = []
        this.headerData = []
        this.bodyData = []
        this.traverseTree(this.paramData, 1)
        console.log('bbbbbbbbb', this.paramData)
        this.paramData.forEach((e) => {
          if (e.position == 'Path' || e.position == 'Query') {
            this.pathData.push(e)
          }
          if (e.position == 'Header') {
            this.headerData.push(e)
          }
          if (e.position == 'Body') {
            this.bodyData.push(e)
          }
        })
        this.previewRes = JSON.parse(JSON.stringify(this.responseData))
        this.traverseTree(this.previewRes, 1)
        console.log('ccccccccccc', this.previewRes)
      }
    },
    traverseTree(nodes, id) {
      for (const node of nodes) {
        node.id = id
        id++
        if (node.children && node.children.length > 0) {
          this.traverseTree(node.children, id)
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.apiName.indexOf(value) !== -1
    },
    removeParam(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },
    addParam() {
      this.paramData.push({ id: this.uuid, paramKey: '', children: [] })
      this.uuid++
    },
    addSubParam(data) {
      if (data.children) {
        data.children.push({
          id: this.uuid,
          paramKey: '',
          children: [],
          position: data.position,
          freezed: true,
        })
        this.uuid++
        return
      }
      data.children = [
        {
          id: this.uuid,
          paramKey: '',
          children: [],
          position: data.position,
          freezed: true,
        },
      ]
      this.uuid++
    },
    addResParam() {
      this.responseData.push({ id: this.uuid, paramKey: '', children: [] })
      this.uuid++
    },
    selectService() {
      serviceApi.getApiList(this.serviceId).then((res) => {
        this.treeData = this.buildTree(res.data)
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

    getServices() {
      this.serviceList = []
      serviceApi.getServices().then((res) => {
        this.serviceList = res.data
        this.serviceId = this.serviceList[0].serviceId
        this.selectService()
      })
    },
  },
  created() {
    this.getServices()
  },
}
</script>
<style scoped>
.folder-icon {
  color: #e6a23c;
}
.tree-node {
  position: relative;
  width: 100%;
}
.tree-op-list i {
  margin-right: 10px;
  cursor: pointer;
  font-size: 18px;
}
.tree-op-list {
  position: absolute;
  right: 10px;
  top: 0px;
}
.save-btn {
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 1000;
}
.display-param {
  margin-left: 50px;
}
.filter-text {
  margin-top: 20px;
}
.api-list {
  min-height: 90vh;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 4px;
  padding: 10px;
}
.api-detail {
  min-height: 90vh;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 100px;
}
.custom-node {
  width: 100%;
}
.op-icon i {
  font-size: 20px;
  margin-left: 10px;
}
.op-icon .el-icon-remove-outline {
  color: #f56c6c;
}
</style>
<style>
.el-input .el-input {
  width: 200px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.tree-item .el-tree-node__content {
  padding: 5px 10px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #fff !important;
}
.el-tree-node__content:hover {
  background-color: #fff;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #fff;
}
</style>
