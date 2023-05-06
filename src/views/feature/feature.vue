<template>
  <div>
    <div class="title">
      <el-page-header @back="goBack" :content="caseName"> </el-page-header>
    </div>
    <el-row>
      <el-col :span="5">
        <!-- 用例列表开始 -->
        <div class="api-list">
          <div class="service-panel">
            <div class="op">
              <div>辅助工具</div>
              <i class="item el-icon-video-play" @click="startDebug">调试</i>
              <el-tooltip
                effect="dark"
                content="设置全局变量"
                placement="top-start"
              >
                <i class="item el-icon-setting" @click="showGlobalEnv"
                  >全局变量</i
                >
              </el-tooltip>
            </div>
            <div class="search">
              <el-input
                size="mini"
                clearable
                placeholder="输入用例名进行过滤"
                v-model="filterText"
              >
              </el-input>
            </div>
          </div>

          <div class="feature-title">
            <el-row>
              <el-col :span="18">
                <span class="feature-introduce">用例列表</span>
              </el-col>
              <el-col :span="6">
                <span>
                  <el-dropdown @command="clickCommand">
                    <el-button type="text" size="mini" class="feature-add"
                      >操作</el-button
                    >
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="newItem"
                        >新增用例</el-dropdown-item
                      >
                      <el-dropdown-item command="newFolder"
                        >新增目录</el-dropdown-item
                      >
                      <el-dropdown-item command="deleteItems"
                        >批量删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </el-col>
            </el-row>
          </div>

          <el-tree
            draggable
            show-checkbox
            node-key="featureId"
            @node-click="treeNodeClick"
            :data="userCase"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
          >
            <div class="custom-tree-node" slot-scope="{ data }" :key="uuid">
              <span :class="{ 'folder-Text': data.featureType == 2 }"
                ><i
                  :class="{
                    'el-icon-tickets': data.featureType == 1,
                    'el-icon-folder-opened': data.featureType == 2,
                  }"
                />
                {{ data.featureName }}</span
              >
              <span style="float: right" v-if="data.featureType == 2">
                <el-dropdown @command="(val) => clickCommand(val, data)">
                  <el-button type="text">...</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="newItem"
                      >新增用例</el-dropdown-item
                    >
                    <el-dropdown-item command="newFolder"
                      >新增目录</el-dropdown-item
                    >
                    <el-dropdown-item command="delete"
                      ><i class="el-icon-delete" />删除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </el-tree>
        </div>
        <!-- 用例列表结束 -->
      </el-col>
      <!-- 用例内容开始 -->
      <el-col :span="19">
        <!-- 用例内容开始 -->
        <el-empty
          v-if="!this.infoForm"
          description="请在左侧选择或创建用例"
        ></el-empty>
        <div v-else class="content">
          <el-tabs v-model="activeName" @tab-click="tabChange">
            <el-tab-pane label="用例信息" name="desc">
              <el-descriptions title="用例描述" :column="3" size="small">
                <template slot="extra">
                  <el-button
                    type="primary"
                    @click="startEditFeature"
                    size="mini"
                    >编辑</el-button
                  >
                  <el-button type="danger" @click="deleteFeature" size="mini"
                    >删除</el-button
                  >
                </template>
                <el-descriptions-item label="用例名称：">{{
                  infoForm.featureName
                }}</el-descriptions-item>
                <el-descriptions-item label="用例">{{
                  infoForm.featureId
                }}</el-descriptions-item>
                <el-descriptions-item label="创建人">{{
                  infoForm.author
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">
                  <el-tag size="small">{{
                    infoForm.createTime | dateFormat
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="修改时间">
                  <el-tag size="small">{{
                    infoForm.updateTime | dateFormat
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="标签" :span="3">
                  <el-tag :key="tag" v-for="tag in dynamicTags" size="mini">
                    {{ tag }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
              <div v-if="infoForm.featureType == 1">
                <div class="step-title">测试步骤：</div>
                <div class="step-line">
                  <el-steps direction="vertical" size="mini" space="40px">
                    <el-step
                      v-for="(item, index) in formStepList"
                      :title="'步骤' + (index + 1)"
                      :key="index"
                      status="process"
                      :description="item"
                    >
                    </el-step>
                  </el-steps>
                </div>
              </div>
            </el-tab-pane>
            <!-- 用例编写开始 -->
            <el-tab-pane
              label="用例配置"
              name="config"
              v-if="infoForm.featureType == 1"
            >
              <div class="feature-content gridBackground">
                <div>
                  <el-row :gutter="20">
                    <el-col :span="18">
                      <div class="edit-content">
                        <div class="menu-type">
                          <el-radio-group
                            v-model="menuType"
                            size="small"
                            @change="selectTestStep"
                          >
                            <el-radio-button label="1">预置</el-radio-button>
                            <el-radio-button label="2">执行</el-radio-button>
                            <el-radio-button label="3">清理</el-radio-button>
                          </el-radio-group>
                        </div>
                        <!--- 开始-->
                        <div>
                          <el-empty
                            v-if="isShowEmpty"
                            description="请在右侧拖拽组件到此处"
                          ></el-empty>
                          <el-collapse
                            v-model="activeCollapse"
                            accordion
                            :key="uuid"
                            v-else
                          >
                            <draggable
                              v-model="featureList"
                              @add="addItem"
                              group="api"
                              animation="100"
                            >
                              <el-collapse-item
                                v-for="(executePoint, index) in featureList"
                                :key="index"
                                :name="executePoint.randomId"
                              >
                                <template slot="title">
                                  <div style="width: 800px">
                                    <el-row :gutter="10">
                                      <el-col :span="4">
                                        {{ executePoint.name }}
                                      </el-col>
                                      <el-col :span="3">
                                        <i
                                          v-if="isEdit"
                                          @click.stop="
                                            deleteExecutePoint(
                                              index,
                                              executePoint.pointId
                                            )
                                          "
                                          class="el-icon-delete delete-point"
                                        />
                                        <i
                                          v-if="
                                            isEdit && !executePoint.editDesc
                                          "
                                          @click.stop
                                          @click="
                                            exchangeEditStatus(executePoint)
                                          "
                                          class="el-icon-edit-outline delete-point"
                                        />
                                      </el-col>
                                      <el-col
                                        :span="8"
                                        v-if="
                                          executePoint.description &&
                                          !executePoint.editDesc
                                        "
                                      >
                                        <el-tag type="success">
                                          {{ executePoint.description }}
                                        </el-tag>
                                      </el-col>

                                      <el-col
                                        :span="8"
                                        v-if="executePoint.editDesc"
                                      >
                                        <div @keyup.space.enter.stop>
                                          <el-input
                                            @click.native.stop
                                            placeholder="输入功能描述"
                                            v-model="executePoint.description"
                                            size="mini"
                                          />
                                        </div>
                                      </el-col>
                                      <el-col
                                        v-if="executePoint.editDesc"
                                        :span="5"
                                      >
                                        <el-button
                                          size="mini"
                                          @click="
                                            exchangeEditStatus(executePoint)
                                          "
                                          >保存</el-button
                                        >
                                        <el-button size="mini">取消</el-button>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </template>
                                <FeatureTemplate
                                  v-if="executePoint.executeType == 1"
                                  :data="executePoint"
                                  :isEdit="isEdit"
                                  :type="executePoint.writeType"
                                  @refreshData="refreshValue"
                                />
                                <FeatureTool
                                  v-else
                                  :data="executePoint"
                                  :isEdit="isEdit"
                                  @refreshData="refreshValue"
                                />
                              </el-collapse-item>
                            </draggable>
                          </el-collapse>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="feature-config-list">
                        <el-collapse v-model="toolType" accordion>
                          <el-collapse-item title="基础工具" name="1">
                            <draggable
                              @start="startDrag"
                              v-model="featureItemList"
                              v-bind="{
                                group: { name: 'api', pull: 'clone' },
                                sort: true,
                              }"
                              animation="100"
                            >
                              <div
                                v-for="(element, index) in featureItemList"
                                :key="index"
                              >
                                <div
                                  class="feature-item"
                                  v-if="element.templateType != 1"
                                >
                                  <div class="template-name">
                                    {{ element.name }}
                                  </div>
                                  <div class="template-desc">
                                    {{ element.description }}
                                  </div>
                                </div>
                              </div>
                            </draggable>
                          </el-collapse-item>
                          <el-collapse-item title="业务模版" name="2">
                            <draggable
                              @start="startDrag"
                              style="height: 500px"
                              v-model="featureItemList"
                              v-bind="{
                                group: { name: 'api', pull: 'clone' },
                                sort: true,
                              }"
                              animation="100"
                            >
                              <div
                                v-for="(element, index) in featureItemList"
                                :key="index"
                              >
                                <div
                                  class="feature-item"
                                  v-if="element.templateType == 1"
                                >
                                  <div class="template-name">
                                    {{ element.name }}
                                  </div>
                                  <div class="template-desc">
                                    {{ element.description }}
                                  </div>
                                </div>
                              </div>
                            </draggable>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
            <!-- 用例编写结束 -->
            <el-tab-pane
              label="执行历史"
              name="history"
              v-if="infoForm.featureType == 1"
            >
              <history ref="historyComp" :feature="infoForm.featureId" />
            </el-tab-pane>
          </el-tabs>
          <div
            class="operate"
            v-if="this.infoForm != null && activeName == 'config'"
          >
            <el-button
              v-if="!isEdit"
              icon="el-icon-edit"
              type="text"
              @click="clickEdit"
              size="mini"
              >编辑</el-button
            >
            <el-button
              v-if="isEdit"
              icon="el-icon-upload"
              type="success"
              @click="saveConfig"
              size="mini"
              >保存</el-button
            >
            <el-button
              v-if="isEdit"
              icon="el-icon-circle-close"
              type="info"
              @click="cancelEdit"
              size="mini"
              >取消</el-button
            >
            <el-button
              icon="item el-icon-video-play"
              v-if="!isEdit"
              type="text"
              @click="startDebug"
              size="mini"
              >启动调试</el-button
            >
          </div>
        </div>
        <!-- 用例内容结束 -->
      </el-col>
      <!-- 用例内容结束 -->
    </el-row>
    <!-- 用例添加开始 -->
    <el-dialog
      :title="featureTitle"
      :visible.sync="showFeatureDialog"
      @close="closeFeatureDialog"
      width="60%"
      :destroy-on-close="true"
    >
      <el-form
        v-model="featureForm"
        size="small"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="名称">
          <el-input
            v-model="featureForm.featureName"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="用例标签" v-if="createData.type == 1">
          <el-tag
            :key="index"
            v-for="(tag, index) in dynamicTags"
            closable
            size="mini"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="mini"
            @click="showInput"
            >+ 新增标签</el-button
          >
        </el-form-item>
        <el-form-item label="用例步骤描述" v-if="createData.type == 1">
          <el-steps direction="vertical" size="mini" space="40px">
            <el-step
              v-for="(item, index) in stepList"
              :key="index"
              status="process"
              :description="item.content"
            >
              <template slot="title">
                <span
                  @mouseover="item.hover = true"
                  @mouseleave="item.hover = false"
                >
                  <span>{{ '步骤' + (index + 1) }}</span>
                  <i
                    v-if="item.hover"
                    class="el-icon-delete step-delete"
                    @click="removeStep(index)"
                  />
                </span>
              </template>
            </el-step>

            <div class="step-edit">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                    v-model="stepContent"
                  />
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="addStep"
                    >新增步骤</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </el-steps>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFeatureForm">确认</el-button>
          <el-button type="info" @click="closeFeatureDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 用例添加结束 -->
    <!-- 全局环境变量开始 -->
    <el-dialog
      title="全局环境变量配置"
      :visible.sync="showDebugDialog"
      width="90%"
      :destroy-on-close="true"
    >
      <div class="tips">
        全局环境变量：测试集是由多个用例组合在一起的集合，在当前集合内针对于不同的用例可能需要相同的配置信息(比如http请求的域名等信息)，
        针对相同的配置信息不用在每个用例里面声明，只需要在全局设置然后在每个用例里声明引用即可。
      </div>
      <div class="config-body">
        <el-table
          :data="configData"
          border
          :key="uuid"
          size="small"
          default-expand-all
          row-key="configId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="paramKey" label="参数" width="250">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.paramKey }}</span>
              <el-input v-model="scope.row.paramKey" v-else />
            </template>
          </el-table-column>
          <el-table-column prop="paramType" label="参数类型" width="180">
            <template slot-scope="scope">
              <span
                v-if="
                  !scope.row.isEdit && scope.$index != configData.length - 1
                "
                >{{ scope.row.paramType }}</span
              >
              <el-select
                v-if="scope.row.isEdit"
                v-model="scope.row.paramType"
                placeholder="请选择参数类型"
              >
                <el-option
                  v-for="item in paramTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="参数值">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.value }}</span>
              <el-input v-model="scope.row.value" v-if="scope.row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-if="scope.row.isEdit">
                <el-button size="mini" @click="handleSave(scope.row)"
                  >保存</el-button
                >
                <el-button
                  size="mini"
                  type="info"
                  @click="cancelEditParam(scope.row)"
                  >取消</el-button
                >
              </div>
              <div v-else>
                <el-button size="mini" @click="startEditParam(scope.row)">{{
                  scope.$index == configData.length - 1 ? '新增' : '编辑'
                }}</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  v-if="scope.$index != configData.length - 1"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 全局环境变量结束 -->
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import FeatureTemplate from '@/components/feature-template'
import FeatureTool from '@/components/feature-tool'
import history from './history.vue'
import featureApi from '../../http/Feature'
import testCaseApi from '../../http/TestCase'
export default {
  components: {
    draggable,
    history,
    FeatureTemplate,
    FeatureTool,
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  data() {
    return {
      isEdit: false,
      infoForm: null,
      activeName: 'desc',
      filterText: '',
      menuType: '1',
      preset: [],
      test: [],
      release: [],
      featureList: [],
      userCase: [],
      featureItemList: [],
      featureTemp: [],
      showDebugDialog: false,
      isConnect: false,
      historyId: '',
      isDrag: false,
      service: '',
      showFeatureDialog: false,
      featureForm: {},
      isEditFeature: false,
      featureTitle: '',
      caseId: '',
      stepContent: '',
      stepList: [],
      formStepList: [],
      configData: [],
      paramTypeList: [
        { label: 'String', value: 'String' },
        { label: 'Map', value: 'Map' },
        { label: 'List', value: 'List' },
        { label: 'Integer', value: 'Integer' },
        { label: 'Float', value: 'Float' },
        { label: 'Double', value: 'Double' },
      ],
      uuid: 0,
      activeCollapse: '',
      toolType: '2',
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      createData: {},
      caseName: '',
    }
  },
  methods: {
    clickCommand(command, data) {
      if (command == 'newItem') {
        this.startAddFeature()
        this.createData.type = 1
        if (data) {
          this.createData.parentId = data.featureId
        }
      }

      if (command == 'newFolder') {
        this.startAddFeature()
        this.createData.type = 2
        this.featureTitle = '添加目录'
        if (data) {
          this.createData.parentId = data.featureId
        }
      }

      if (command == 'deleteItems') {
        let featureIds = this.$refs.tree.getCheckedKeys()
        featureApi.batchDeleteFeature({ features: featureIds }).then(() => {
          this.requestCaseFeatures(this.caseId)
          this.uuid = this.$utils.randomString(20)
        })
      }
      if (command == 'delete') {
        featureApi
          .deleteFeature(data.featureId)
          .then(() => {
            this.requestCaseFeatures(this.caseId)
            this.uuid = this.$utils.randomString(20)
          })
          .catch((e) => {
            this.$message.error(e.response.data.message)
          })
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    exchangeEditStatus(item) {
      item.editDesc = !item.editDesc
      this.uuid = this.$utils.randomString(20)
    },
    getTestCaseConfigs() {
      this.configData = []
      testCaseApi.getTestCaseConfigs(this.caseId).then((res) => {
        let array = res.data
        array.push({ paramType: 'String' })
        this.configData = array
      })
    },
    startEditParam(row) {
      row.isEdit = true
      this.uuid = this.$utils.randomString(20)
    },
    cancelEditParam(row) {
      this.uuid = this.$utils.randomString(20)
      row.isEdit = false
    },
    handleSave(row) {
      if (row.configId) {
        testCaseApi.updateConfig(row).then(() => {
          this.$message.success('修改配置成功')
          this.getTestCaseConfigs()
        })
        return
      }

      row.unionId = this.caseId
      testCaseApi.addConfigs([row]).then(() => {
        this.$message.success('添加配置成功')
        this.getTestCaseConfigs()
      })
    },
    handleDelete(row) {
      testCaseApi.deleteConfig(row.configId).then(() => {
        this.$message.success('删除配置成功')
        this.getTestCaseConfigs()
      })
    },
    addStep() {
      this.stepList.push({
        content: this.stepContent,
        hover: false,
      })
      this.stepContent = ''
    },
    removeStep(index) {
      this.stepList.splice(index, 1)
    },
    closeFeatureDialog() {
      this.showFeatureDialog = false
      this.featureForm = {}
      this.dynamicTags = []
      this.createData = {}
      if (!this.infoForm) {
        return
      }
      featureApi.getFeatureDetail(this.infoForm.featureId).then((res) => {
        this.infoForm = res.data
        this.formStepList = []
        this.infoForm.testStep.split('|').forEach((e) => {
          this.formStepList.push(e)
        })
      })
    },
    startAddFeature() {
      this.showFeatureDialog = !this.showFeatureDialog
      this.isEditFeature = false
      this.featureForm = {}
      this.featureTitle = '添加用例'
      this.stepList = []
    },
    startEditFeature() {
      this.showFeatureDialog = !this.showFeatureDialog
      this.isEditFeature = true
      this.featureTitle = '修改用例'
      this.featureForm = this.infoForm
      this.stepList = []
      this.infoForm.testStep.split('|').forEach((e) => {
        this.stepList.push({ hover: false, content: e })
      })
    },
    deleteExecutePoint(index, pointId) {
      this.$confirm('确认删除用例执行点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (!pointId) {
          this.uuid = this.$utils.randomString(20)
          this.featureList.splice(index, 1)
          this.updateFeatureList()
          return
        }
        featureApi.deleteExecutePoint(pointId).then((res) => {
          if (res.data == 1) {
            this.uuid = this.$utils.randomString(20)
            this.featureList.splice(index, 1)
            this.updateFeatureList()
            this.$message.success('删除执行点成功')
            return
          }
          this.$message.warning('删除执行点失败')
        })
      })
    },
    deleteFeature() {
      this.$confirm('用例删除后所有执行点数据都会删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        featureApi.deleteFeature(this.infoForm.featureId).then(() => {
          this.$message('删除用例成功')
          this.requestCaseFeatures(this.caseId)
        })
      })
    },
    submitFeatureForm() {
      let request = JSON.parse(JSON.stringify(this.featureForm))
      request.author = '古月澜'
      request.modify = '古月澜'
      request.featureType = 1
      request.testCaseId = this.caseId
      request.testFeatures = []
      let str = ''
      this.stepList.forEach((e) => {
        str += e.content + '|'
      })
      request.testStep = str.substring(0, str.length - 1)
      request.tags = JSON.parse(JSON.stringify(this.dynamicTags))
      request.featureType = this.createData.type
      request.parentId = this.createData.parentId
      if (this.isEditFeature) {
        featureApi.updateFeature(request).then(() => {
          this.$message.success(`修改成功`)
          this.showFeatureDialog = !this.showFeatureDialog
          this.requestCaseFeatures(this.caseId)
        })
        return
      }

      featureApi.createFeature(request).then(() => {
        this.$message.success(`添加成功`)
        this.showFeatureDialog = !this.showFeatureDialog
        this.requestCaseFeatures(this.caseId)
      })
    },
    startDrag() {
      this.isDrag = true
    },
    addItem(e) {
      this.featureList = JSON.parse(JSON.stringify(this.featureList))
      let item = this.featureList[e.newIndex]
      console.log(item)
      item.randomId = this.$utils.randomString(20)
      item.writeType = '1'
      item.sortOrder = e.newIndex

      item.pointId = null
      this.featureList.forEach((e) => {
        e.testStage = parseInt(this.menuType)
      })
      this.isEdit = true
      this.updateFeatureList()
      this.uuid = this.$utils.randomString(20)
    },
    updateFeatureList() {
      if (this.menuType == '1') {
        this.preset = JSON.parse(JSON.stringify(this.featureList))
      }

      if (this.menuType == '2') {
        this.test = JSON.parse(JSON.stringify(this.featureList))
      }

      if (this.menuType == '3') {
        this.release = JSON.parse(JSON.stringify(this.featureList))
      }
    },
    refreshValue(update) {
      let features = JSON.parse(JSON.stringify(this.featureList))
      this.featureList = []
      features.forEach((e) => {
        if (e.randomId == update.data.randomId) {
          this.featureList.push(update.data)
        } else {
          this.featureList.push(e)
        }
      })
      this.updateFeatureList()
    },
    cancelEdit() {
      this.tabChange()
      this.isEdit = false
    },
    getAllFeatures() {
      if (this.menuType == '1') {
        return this.featureList.concat(this.test).concat(this.release)
      }

      if (this.menuType == '2') {
        return this.preset.concat(this.featureList).concat(this.release)
      }

      if (this.menuType == '3') {
        return this.preset.concat(this.test).concat(this.featureList)
      }
    },
    saveConfig() {
      var data = JSON.parse(JSON.stringify(this.infoForm))
      data.testFeatures = []

      let allFeature = this.getAllFeatures()
      let index = 0
      allFeature.forEach((e) => {
        let item = {
          method: e.method,
          name: e.name,
          description: e.description,
          service: e.service,
        }

        if (e.executeType != 1) {
          item.executePoints = e.executePoints
        } else {
          item.params = e.params
        }

        data.testFeatures.push({
          pointId: e.pointId,
          featureId: data.featureId,
          testStage: e.testStage,
          sortOrder: index,
          executorUnit: item,
          compareDefine: e.compareDefine,
          variableDefine: e.variableDefine,
          executeType: e.executeType,
          description: e.description,
        })
        index++
      })

      featureApi.updateFeature(data).then(() => {
        this.$message.success('保存成功')
        this.isEdit = false
      })
    },
    startDebug() {
      let res = this.$refs.tree.getCheckedNodes()
      if (res.length == 0) {
        this.$message.warning('请选择服务与用例～')
        return
      }

      this.tableData = []
      featureApi.startFeature(this.infoForm.featureId).then((res) => {
        this.$message.success('开始执行，请查看运行日志')
        this.historyId = res.data
      })
    },
    tabChange() {
      if (this.activeName == 'history') {
        this.$refs.historyComp.getFeatureHistory(this.infoForm.featureId)
      }
      if (this.activeName == 'config') {
        featureApi.getExecutePoints(this.infoForm.featureId).then((res) => {
          this.preset = []
          this.test = []
          this.release = []
          this.featureList = []
          res.data.data.forEach((e) => {
            let executePoint = e.executorUnit
            let data = executePoint.params
            let item = {
              id: e.id,
              pointId: e.pointId,
              name: executePoint.name,
              method: executePoint.method,
              service: executePoint.service,
              description: e.description,
              params: data,
              executePoints: executePoint.executePoints,
              compareDefine: e.compareDefine,
              variableDefine: e.variableDefine,
              writeType: '1',
              executeType: e.executeType,
              randomId: this.$utils.randomString(20),
            }
            if (e.testStage == 1) {
              this.preset.push(item)
            }

            if (e.testStage == 2) {
              this.test.push(item)
            }
            if (e.testStage == 3) {
              this.release.push(item)
            }
          })
          this.featureList = this.preset
        })
        featureApi.getFeatureTemplates().then((res) => {
          let array = res.data
          array.forEach((e) => {
            e.executeType = e.templateType
          })
          this.featureItemList = array
        })
        this.menuType = '1'
      }
    },
    treeNodeClick(data) {
      this.activeName = 'desc'
      this.infoForm = data
      this.isEdit = false
      this.dynamicTags = []
      this.formStepList = data.testStep.split('|')
      featureApi.getFeatureDetail(data.featureId).then((res) => {
        this.dynamicTags = res.data.tags
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.featureName.indexOf(value) !== -1
    },
    selectTestStep(type) {
      this.featureList = []
      if (type == '1') {
        let data = JSON.parse(JSON.stringify(this.preset))
        this.refreshArray(data)
      } else if (type == '2') {
        let testData = JSON.parse(JSON.stringify(this.test))
        this.refreshArray(testData)
      } else {
        let releaseData = JSON.parse(JSON.stringify(this.release))
        this.refreshArray(releaseData)
      }
      this.$forceUpdate()
    },
    refreshArray(data) {
      console.log('DARAAAAddDDDdd', data)
      console.log('featureList', this.featureList)
      this.featureList = []
      let index = 0
      data.forEach((e) => {
        this.$set(this.featureList, index, e)
        index++
      })
    },
    clickEdit() {
      this.isEdit = !this.isEdit
      this.editIcon = ''
      if (!this.isEdit) {
        this.editIcon = 'el-icon-edit'
      }
    },
    showGlobalEnv() {
      this.showDebugDialog = !this.showDebugDialog
      this.getTestCaseConfigs()
    },
    goBack() {
      this.$router.go(-1)
    },
    requestCaseFeatures(caseId) {
      this.userCase = []
      featureApi.getFeatureTree(caseId).then((res) => {
        this.userCase = res.data
      })
    },
    getCaseDetail() {
      testCaseApi.getTestCaseDetail(this.caseId).then((res) => {
        this.caseName = res.data.testCaseName
      })
    },
  },
  computed: {
    isShowEmpty() {
      let flag = false
      if (
        this.featureList.length == 0 ||
        this.featureList.length == undefined
      ) {
        flag = true
      }
      if (this.isDrag) {
        flag = false
      }
      return flag
    },
  },
  created() {
    this.caseId = this.$route.query.caseId
    this.requestCaseFeatures(this.caseId)
    this.getCaseDetail()
  },
}
</script>

<style scoped>
.step-line {
  font-size: 14px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<style scoped>
.name {
  margin-left: 20px;
}
.api-list {
  height: 80vh;
  font-size: 14px;
}
.search {
  margin: 10px;
}
.content {
  margin: 5px;
  position: relative;
}
.info-line {
  margin: 20px 10px;
}
.step-line {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding: 10px;
  max-height: 300px;
  min-height: 200px;
  font-size: 14px;
  overflow: scroll;
}
.step-title {
  margin-top: 40px;
}
.menu-type {
  width: 200px;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}
.feature-content {
  height: 75vh;
  min-height: 300px;
  padding: 0 10px;
  background-color: #fff;
}
.feature {
  height: 40px;
  line-height: 40px;
  width: 200px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
}

.feature span {
  margin-left: 10px;
}

.param_desc {
  height: 30px;
  line-height: 30px;
  color: #c0c4cc;
  margin-left: 10px;
}
.op {
  margin-top: 10px;
  font-size: 14px;
}

.op i {
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.item {
  margin-left: 5px;
  cursor: pointer;
}

.delete-icon {
  margin-left: 10px;
  font-size: 16px;
  color: #f56c6c;
}
.delete-icon i {
  cursor: pointer;
}
.feature-config-list {
  background-color: #ffffff;
  height: 80vh;
  padding: 10px 5px;
}
.feature-item {
  height: 40px;
  padding: 2px 4px;
  border-radius: 5px;
  text-align: left;
  border: 2px solid #f2f6fc;
  cursor: pointer;
  background-color: #f2f6fc;
  box-shadow: 1px 1px 2px #f2f6fc;
  margin: 10px;
  font-size: 14px;
  color: #606266;
  border: 1px dashed #d4d6d8;
}
.template-desc {
  font-size: 12px;
  color: #909399;
}
.template-name {
  height: 20px;
}
.edit-content {
  position: relative;
}
.operate {
  position: absolute;
  right: 20px;
  top: 8px;
}
.service-panel {
  margin: 5px 10px;
}
.title {
  margin: 20px 10px;
}
.feature-title {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.feature-add {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
}
.step-edit {
  margin-top: 20px;
}
.step-delete {
  cursor: pointer;
  margin-left: 10px;
}

.step-delete:hover {
  color: #f56c6c;
}
.tips {
  color: #909399;
  margin-bottom: 20px;
}
.config-body {
  position: relative;
}

.delete-point {
  font-size: 16px;
  margin-left: 20px;
}
.feature-introduce {
  margin-left: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  width: 100%;
  height: 40px;
}
.folder-Text i {
  color: #70c745;
  font-size: 16px;
}
.gridBackground {
  background: #dcdfe6;
  background-image: linear-gradient(white 0px, transparent 0),
    linear-gradient(90deg, white 0px, transparent 0),
    linear-gradient(hsla(0, 0%, 100%, 0.3) 1px, transparent 0),
    linear-gradient(90deg, hsla(0, 0%, 100%, 0.3) 1px, transparent 0);
  background-size: 75px 75px, 75px 75px, 15px 15px, 15px 15px;
}
</style>
