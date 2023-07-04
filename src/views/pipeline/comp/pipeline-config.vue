<template>
  <div>
    <el-form
      :model="pipelineForm"
      label-width="120px"
      ref="pipelineForm"
      :rules="pipelineRule"
      size="mini"
      :disabled="this.isView"
    >
      <el-form-item label="流水线名称" prop="pipelineName">
        <el-input v-model="pipelineForm.pipelineName" />
      </el-form-item>
      <el-form-item label="流水线类型" prop="pipelineType">
        <el-radio-group v-model="pipelineForm.pipelineType">
          <el-radio :label="1">发布流水线</el-radio>
          <el-radio :label="2">定时流水线</el-radio>
          <el-radio :label="3">个人流水线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="执行方式" prop="executeType">
        <el-radio-group v-model="pipelineForm.executeType">
          <el-radio :label="1">手动执行</el-radio>
          <el-radio :label="2">Push</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-button
        type="primary"
        size="mini"
        :disabled="startMove"
        v-if="!this.isView"
        icon="el-icon-circle-plus-outline"
        @click="
          dialogVisible = !dialogVisible
          operateType = 1
        "
        >添加节点</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="!this.isView && !startMove"
        icon="el-icon-edit"
        @click="startMove = !startMove"
        >操作节点</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="!this.isView && startMove"
        icon="el-icon-circle-close"
        @click="startMove = !startMove"
        >取消操作</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="!this.isView && startMove"
        icon="el-icon-d-arrow-left"
        @click="leftMove"
        >前移</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="!this.isView && startMove"
        icon="el-icon-d-arrow-right"
        @click="rightMove"
        >后移</el-button
      >
      <el-button
        type="danger"
        size="mini"
        v-if="!this.isView && startMove"
        icon="el-icon-delete"
        @click="removeNode"
        >删除</el-button
      >
      <div>
        <vue-pipeline
          :key="uuid"
          ref="pipeline"
          :x="50"
          :y="55"
          v-if="editPipelines && editPipelines.length > 0"
          :data="editPipelines"
          :showArrow="true"
          :ystep="70"
          :xstep="120"
          lineStyle="default"
          @select="choosePipeItem"
        />
      </div>
      <el-form-item>
        <div class="dialog-footer" v-if="!isView">
          <el-button @click="cancelCreatePipeline" size="mini">取 消</el-button>
          <el-button
            type="primary"
            @click="submitPipeline('pipelineForm')"
            size="mini"
            >确 定</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 新增/编辑节点开始 -->
    <el-dialog
      title="配置节点"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="70%"
      @close="closeConfigNode"
    >
      <el-form
        :model="nodeForm"
        ref="nodeForm"
        :rules="nodeRule"
        size="mini"
        :disabled="isView"
      >
        <el-form-item
          label="节点名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="nodeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="节点提示"
          :label-width="formLabelWidth"
          prop="hint"
        >
          <el-input v-model="nodeForm.hint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="节点类型"
          :label-width="formLabelWidth"
          prop="configId"
        >
          <el-select
            v-model="nodeForm.configId"
            placeholder="请选择"
            @change="selectStep"
          >
            <el-option
              v-for="item in stepOptions"
              :key="item.nodeId"
              :label="item.nodeName"
              :value="item.nodeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8">
          <div class="step-title">执行步骤</div>
          <div class="item-list">
            <ul>
              <draggable :list="itemList">
                <li
                  v-for="(item, index) in itemList"
                  :key="index"
                  @click="chooseStep(item)"
                >
                  <div class="item">
                    {{ item.actionName }}
                  </div>
                </li>
              </draggable>
            </ul>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <div class="step-title">配置步骤</div>
            <el-form
              v-model="configForm"
              size="mini"
              :disabled="isView"
              :label-width="formLabelWidth"
            >
              <el-divider content-position="left" v-if="paramConfigs.length > 0"
                >触发参数配置</el-divider
              >
              <el-form-item
                v-for="(item, index) in paramConfigs"
                :key="100 + index"
                :label-width="formLabelWidth"
              >
                <span slot="label">{{ item.description }}</span>
                <el-select
                  v-if="item.type == 'select'"
                  v-model="configForm[item.compareKey]"
                  @change="selectChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in item.list"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  @input="datachange(item.compareKey)"
                  v-else
                  v-model="configForm[item.compareKey]"
                />
              </el-form-item>
              <el-divider content-position="left" v-if="calculateShow"
                >节点配置</el-divider
              >
              <div v-for="(item, index) in stepConfigs" :key="index">
                <el-form-item
                  v-if="item.showCompare"
                  :label-width="formLabelWidth"
                >
                  <span slot="label">{{ item.description }}</span>
                  <el-input
                    @input="datachange(item.compareKey)"
                    v-model="configForm[item.compareKey]"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button
          v-if="!isView"
          type="primary"
          @click="submitConfig('nodeForm')"
          size="mini"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 创建编辑节点结束 -->
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import utils from '../../../lib/pipeline'
import nodeApi from '../../../http/NodeBind'
import pipelineApi from '../../../http/Pipeline'
import taskApi from '../../../http/Task'
export default {
  components: {
    draggable,
  },
  props: {
    operate: {
      type: Number,
      default: 1,
    },
    pipeline: {
      type: String,
      default: '',
    },
    service: {
      type: String,
    },
    enableView: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    pipeline: {
      handler(val) {
        this.pipelineId = val
      },
      deep: true,
      immediate: true,
    },
    service: {
      handler(val) {
        this.serviceId = val
      },
      deep: true,
      immediate: true,
    },
    operate: {
      handler(type) {
        if (type == 1) {
          this.isView = false
          this.isEditPipeline = true
          this.getPipeline()
        }
        if (type == 2) {
          this.isView = true
          this.isEditPipeline = false
          this.getPipeline()
        }
        if (type == 3) {
          this.isView = false
          this.pipelineForm = {}
          this.pipelineId = ''
          this.serviceId = ''
          this.getDefaultPipe()
          this.isEditPipeline = false
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    calculateShow() {
      if (!this.stepConfigs || this.stepConfigs.length == 0) {
        return false
      }
      let flag = false
      this.stepConfigs.forEach((e) => {
        if (e.showCompare) {
          flag = true
        }
      })
      return flag
    },
  },
  data() {
    return {
      isEditPipeline: false,
      pipelineForm: {},
      isView: false,
      dialogVisible: false,
      operateType: 1,
      startMove: false,
      editPipelines: [],
      formLabelWidth: '120px',
      nodeForm: {},
      stepOptions: [],
      itemList: [],
      configForm: {},
      paramConfigs: [],
      stepConfigs: [],
      labelWidth: '150px',
      rootList: [],
      uuid: '',
      serviceId: '',
      pipelineId: '',
      chosedConfigItem: [],
      pipelineRule: {
        pipelineName: [
          { required: true, message: '请输入流水线名称', trigger: 'blur' },
        ],
        pipelineType: [
          { required: true, message: '请选择流水线类型', trigger: 'change' },
        ],
        executeType: [
          { required: true, message: '请选择执行方式', trigger: 'change' },
        ],
      },
      nodeRule: {
        name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
        configId: [
          { required: true, message: '请选择节点类型', trigger: 'select' },
        ],
      },
    }
  },
  methods: {
    leftMove() {
      if (!this.nodeForm.name) {
        this.$message.warning('请先点击选择一个移动的节点')
        return
      }
      utils.moveLeft(this.editPipelines, this.nodeForm)
      this.uuid++
      this.nodeForm = {}
      console.log(this.editPipelines)
    },
    rightMove() {
      if (!this.nodeForm.name) {
        this.$message.warning('请先点击选择一个移动的节点')
        return
      }
      utils.moveRight(this.editPipelines, this.nodeForm)
      this.nodeForm = {}
      this.uuid++
    },
    removeNode() {
      let array = utils.removeNode(this.editPipelines, this.nodeForm)
      this.editPipelines = array
      this.uuid++
    },
    selectChange(value) {
      this.chosedConfigItem.paramList.forEach((e) => {
        if (e.name == 'taskId') {
          e.value = value
        }
      })

      this.$forceUpdate()
    },
    datachange(value) {
      console.log('数据变化', value, this.chosedConfigItem)
      this.chosedConfigItem.compareResults.forEach((e) => {
        if (e.compareKey == value) {
          e.value = this.configForm[value]
          console.log('数据变化111 datachange', this.configForm[value])
        }
      })

      this.chosedConfigItem.paramList.forEach((e) => {
        if (e.name == value) {
          e.value = this.configForm[value]
          console.log('数据变化111 datachange', this.configForm[value])
        }
      })
      this.$forceUpdate()
    },
    selectStep(configId) {
      this.itemList = []
      nodeApi.getNodeActions(configId).then((res) => {
        let config = {}
        if (this.nodeForm.list) {
          this.nodeForm.list.forEach((e) => {
            console.log('nodeform e =>', e)
            if (e.configDetail) {
              let detail = JSON.parse(e.configDetail)
              config[detail.actionId] = detail
            }
          })
        }
        console.log('config=====', config)
        console.log('return=====', res.data)
        res.data.forEach((e) => {
          let detail = config[e.actionId]
          if (detail != undefined && detail != null) {
            e.compareResults = detail.compareInfo

            e.paramList.forEach((e) => {
              console.log('e=====', e, detail)
              let data = detail.paramList[e.name]
              if (data) {
                e.value = data
              }
            })

            this.nodeForm.list.forEach((el) => {
              let configDetail = JSON.parse(el.configDetail)
              if (e.actionId == configDetail.actionId) {
                e.nodeId = el.nodeId
              }
            })
          }
          this.itemList.push(e)
        })
        console.log('执行完成====', this.itemList)
      })
      this.paramConfigs = []
      this.stepConfigs = []
    },
    cancelCreatePipeline() {
      this.rootList = []
      this.pipelineDialog = false
      this.isView = false
      this.pipelineForm = {}
      this.editPipelines = []
      this.configForm = {}
      this.$emit('complete')
    },
    closeConfigNode() {
      this.nodeForm = {}
      this.configForm = {}
      this.itemList = []
    },
    submitConfig(nodeForm) {
      this.$refs[nodeForm].validate((valid) => {
        if (!valid) {
          return false
        }

        let pipeArray = JSON.parse(JSON.stringify(this.editPipelines))
        let subNodes = []
        console.log('新增的节点', this.nodeForm, '列表', this.itemList)
        this.itemList.forEach((e) => {
          let data = {}
          e.paramList.forEach((ele) => {
            data[ele.name] = ele.value
          })

          let item = {
            actionId: e.actionId,
            compareResults: e.compareResults,
            paramList: data,
          }
          e.originData = item

          subNodes.push({
            name: e.actionName,
            hint: e.actionName,
            status: 'success',
            nodeId: e.nodeId,
            originData: JSON.parse(JSON.stringify(item)),
            next: [],
          })
        })

        if (this.operateType == 1) {
          let temp = JSON.parse(JSON.stringify(pipeArray))
          let rootId = temp.length
          let newNode = {
            name: this.nodeForm.name,
            hint: this.nodeForm.hint,
            status: 'success',
            configId: this.nodeForm.configId,
            list: [],
            id: rootId,
            group: rootId,
            root: true,
          }

          this.editPipelines = utils.addNode(pipeArray, newNode, subNodes)
          this.uuid++
          console.log('last result1111', this.editPipelines)
        } else {
          console.log('itemlist=', this.itemList)
          console.log('subnodes=', subNodes)
          this.editPipelines = utils.updateNode(
            pipeArray,
            this.nodeForm,
            subNodes
          )
          // 修改完成
          console.log('修改结果', this.editPipelines)
        }
        this.resetNode()
      })
    },
    submitPipeline(pipelineForm) {
      this.$refs[pipelineForm].validate((valid) => {
        if (!valid) {
          return false
        }

        let param = utils.exchangeData(this.pipelineForm, this.editPipelines)
        console.log('更新参数', param)
        param.pipelineConfig = JSON.stringify(this.editPipelines)

        //修改流水线
        if (this.isEditPipeline) {
          pipelineApi
            .updatePipeline(this.serviceId, this.pipelineId, param)
            .then(() => {
              this.$message({
                message: '修改流水线成功',
                type: 'success',
              })
              this.cancelCreatePipeline()
            })
        }

        //创建流水线
        if (!this.isEditPipeline) {
          param.serviceId = this.serviceId
          param.creator = '古月澜'
          console.log('请求的参数', param)
          pipelineApi.savePipeline(param).then(() => {
            this.$message({
              message: '创建流水线成功',
              type: 'success',
            })
            this.cancelCreatePipeline()
          })
        }
      })
    },
    choosePipeItem(node) {
      console.log('pipeline 点击node', node)
      let selectItem = node
      this.nodeForm = selectItem
      if (node.disable || this.startMove) {
        return
      }
      //选择根节点
      this.editPipelines.forEach((e) => {
        if (e.group == node.group && e.root) {
          this.nodeForm = e
          selectItem = e
        }
      })
      console.log('=====-----', selectItem)

      this.dialogVisible = true
      this.operateType = 2
      this.itemList = selectItem.list
      this.selectStep(selectItem.configId)
    },
    chooseStep(item) {
      console.log('选择的node', item)
      this.stepConfigs = JSON.parse(JSON.stringify(item.compareResults))
      this.stepConfigs.forEach((e) => {
        this.configForm[e.compareKey] = e.value
      })

      this.paramConfigs = []
      item.paramList.forEach((e) => {
        this.configForm[e.name] = e.value
        this.paramConfigs.push({
          compareKey: e.name,
          description: e.description,
          value: e.value,
          type: e.type,
        })
      })
      //用例测试为了选择节点所有特殊处理
      if (item.executeType == 'TEST') {
        taskApi.getAllTaskList(this.serviceId).then((res) => {
          let list = []
          res.data.forEach((e) => {
            list.push({
              label: e.taskName,
              value: e.taskId,
            })
          })
          this.paramConfigs.forEach((e) => {
            if (e.compareKey == 'taskId') {
              e.list = list
            }
          })
          this.$forceUpdate()
        })
      }
      this.chosedConfigItem = item
      this.$forceUpdate()
    },
    resetNode() {
      this.dialogVisible = false
      this.configForm = {}
      this.itemList = []
      this.nodeForm = {}
    },
    getConfigNodes() {
      nodeApi.getAllNodes().then((res) => {
        this.stepOptions = res.data
      })
    },
    getDefaultPipe() {
      pipelineApi.detaultConfig().then((res) => {
        let defaultConfigs = JSON.parse(res.data.configDetail)
        defaultConfigs.forEach((e) => {
          if (e.id && e.rootId == e.id) {
            this.rootList.push(e)
          }
        })
        this.editPipelines = JSON.parse(JSON.stringify(defaultConfigs))
      })
    },
    getPipeline() {
      this.pipelineForm = {}
      pipelineApi.queryPipeline(this.serviceId, this.pipelineId).then((res) => {
        this.editPipelines = utils.displayData(res.data.stageList)
        this.pipelineForm = res.data
        this.uuid++
      })
    },
  },
  created() {
    this.getConfigNodes()
    this.serviceId = this.service
    this.pipelineId = this.pipeline
  },
}
</script>
<style scoped>
.step-title {
  margin: 5px 5px;
  font-weight: 800;
}
.item-list ul {
  list-style: none;
  padding: 3px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  margin: 0px;
  min-height: 300px;
}
.item {
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  cursor: pointer;
  color: #606266;
}
.item:hover {
  background-color: #67c23a;
  color: #fff;
}
</style>
