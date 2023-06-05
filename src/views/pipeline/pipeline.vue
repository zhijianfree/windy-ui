<template>
  <div>
    <!-- 服务title开始 -->
    <div class="title-line">
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="服务列表">
          <el-select
            v-model="serviceId"
            size="small"
            reserve-keyword
            @change="selectService"
            placeholder="请输入搜索的服务名"
          >
            <el-option
              v-for="item in pipelines"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 服务title结束 -->

    <!-- 流水线内容开始 -->
    <div class="right-content">
      <el-row>
        <!-- 流水线列表开始 -->
        <el-col :span="4">
          <div class="left-content">
            <div class="op-line">
              <el-dropdown placement="bottom-end" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-edit" />管理<i
                    class="el-icon-arrow-down el-icon--right"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="new"
                    ><i class="el-icon-circle-plus" />新增</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="pipeline-list">
              <el-collapse v-model="activePipelines">
                <el-collapse-item name="1">
                  <template slot="title">
                    <i class="el-icon-s-promotion title-icon" />
                    发布流水线
                  </template>
                  <div
                    v-for="(item, index) in publishList"
                    :key="index"
                    class="pipeline-item"
                    :class="{ 'selected-line': item.selected }"
                  >
                    <span @click="selectPipeline(item)">{{
                      item.pipelineName
                    }}</span>
                    <div style="float: right">
                      <el-dropdown @command="operateLine($event, item)">
                        <span class="el-dropdown-link">
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="delete"
                            >删除</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="2">
                  <template slot="title">
                    <i class="el-icon-cpu title-icon" /> 日常流水线
                  </template>
                  <div
                    v-for="(item, index) in buildList"
                    :key="index"
                    class="pipeline-item"
                    :class="{ 'selected-line': item.selected }"
                  >
                    <span @click="selectPipeline(item)">{{
                      item.pipelineName
                    }}</span>
                    <div style="float: right">
                      <el-dropdown @command="operateLine($event, item)">
                        <span class="el-dropdown-link">
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="delete"
                            >删除</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="3">
                  <template slot="title">
                    <i class="el-icon-s-custom title-icon" />
                    个人流水线
                  </template>
                  <div
                    v-for="(item, index) in customList"
                    :key="index"
                    class="pipeline-item"
                    :class="{ 'selected-line': item.selected }"
                  >
                    <span @click="selectPipeline(item)">{{
                      item.pipelineName
                    }}</span>
                    <div style="float: right">
                      <el-dropdown @command="operateLine($event, item)">
                        <span class="el-dropdown-link">
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="delete"
                            >删除</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-col>
        <!-- 流水线列表结束 -->

        <!-- 流水线内容开始 -->
        <el-empty
          v-if="
            currentPipeline.pipelineConfig &&
            currentPipeline.pipelineConfig.length <= 0
          "
          description="请在左侧点击流水线查看详情"
        >
          <el-link
            type="primary"
            :underline="false"
            @click="handleCommand('new')"
            >创建流水线?</el-link
          >
        </el-empty>
        <el-col v-else :span="20">
          <!-- 流水线操作按钮开始 -->
          <div class="pipe-op-div">
            <el-button
              type="primary"
              v-if="isRunning"
              icon="el-icon-video-pause"
              size="mini"
              @click="pausePipeline"
              >停止</el-button
            >
            <el-button
              v-else
              type="primary"
              icon="el-icon-video-play"
              size="mini"
              @click="startPipeline"
              >运行</el-button
            >

            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="startEdit"
              >编辑</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-setting"
              size="mini"
              @click="showGitConfig = !showGitConfig"
              >Git配置</el-button
            >
            <el-button
              type="info"
              icon="el-icon-view"
              size="mini"
              @click="startView"
              >查看</el-button
            >
          </div>
          <!-- 流水线操作按钮结束 -->

          <!-- 流水线运行描述信息开始 -->
          <div class="pipeline-detail">
            <el-descriptions title="流水线历史" :column="3" size="medium">
              <el-descriptions-item label="git分支">
                {{ history.branch }}</el-descriptions-item
              >
              <el-descriptions-item label="运行时间">
                {{ history.createTime | dateFormat }}
              </el-descriptions-item>
              <el-descriptions-item label="执行结果">
                <el-tag :type="exchangeExecuteStatus(history.pipelineStatus)">{{
                  exchangeStatusMessage(history.pipelineStatus)
                }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!-- 流水线运行描述信息结束 -->

          <!-- 流水线ui开始 -->
          <div class="pipeline-content">
            <vue-pipeline
              :key="uuid"
              v-if="
                currentPipeline.pipelineConfig &&
                currentPipeline.pipelineConfig.length > 0
              "
              ref="pipeline"
              :x="50"
              :y="55"
              :data="currentPipeline.pipelineConfig"
              :showArrow="true"
              :ystep="70"
              :xstep="120"
              lineStyle="default"
              @select="showNodeLog"
            />
          </div>
          <!-- 流水线ui结束 -->
        </el-col>
        <!-- 流水线内容结束 -->
      </el-row>
    </div>
    <!-- 流水线内容结束 -->

    <!-- git配置开始 -->
    <el-dialog
      title="Git配置"
      :visible.sync="showGitConfig"
      :destroy-on-close="true"
      width="70%"
    >
      <bind :pipeline="currentPipeline.pipelineId" :service="serviceId" />
    </el-dialog>
    <!-- git配置结束 -->

    <!-- 节点日志开始 -->
    <el-dialog
      title="节点日志"
      :visible.sync="isShowNodeLog"
      :destroy-on-close="true"
      width="70%"
    >
      <span
        >节点运行状态:
        <el-tag :type="logForm.status == 1 ? 'success' : 'danger'">{{
          logForm.status == 1 ? '成功' : '失败'
        }}</el-tag></span
      >
      <el-divider><i class="el-icon-receiving"></i></el-divider>
      <ul>
        <li v-for="(item, index) in logForm.messageList" :key="index">
          <span>{{ item }}</span>
        </li>
      </ul>
    </el-dialog>
    <!-- 节点日志结束 -->

    <!-- 创建/编辑流水线开始 -->
    <el-dialog
      :title="titleName"
      :visible.sync="pipelineDialog"
      width="80%"
      :destroy-on-close="true"
      :before-close="cancelCreatePipeline"
    >
      <PipelineConfig
        :isEditPipeline="piplienOperate == 1"
        :pipeline="currentPipeline.pipelineId"
        :service="serviceId"
        @complete="completeNotify"
      />
    </el-dialog>
    <!-- 创建/编辑流水线结束 -->
  </div>
</template>
<script>
import bind from './bindgit.vue'
import PipelineConfig from './comp/pipeline-config.vue'
import pipelineApi from '../../http/Pipeline'
import serviceApi from '../../http/Service'
import historyApi from '../../http/PipelineHistory'
import actionApi from '../../http/PipelineAction'
import utils from '../../lib/pipeline'
import nodeApi from '../../http/NodeBind'
export default {
  components: { bind, PipelineConfig },
  data() {
    return {
      nodes: [],
      startIndex: 1,
      formLabelWidth: '80px',
      loading: false,
      activePipelines: ['1', '2', '3'],
      pipelines: [],
      currentPipeline: {
        pipelineConfig: [],
      },
      history: {},
      publishList: [],
      buildList: [],
      customList: [],
      isRunning: false,
      pipelineDialog: false,
      pipelineForm: {
        pipelineConfig: [],
      },
      isView: false,
      piplienOperate: 0,
      prenodeId: [],
      chosedConfigItem: [],
      serviceId: '',
      titleName: '新增流水线',
      showGitConfig: false,
      uuid: 1,
      isShowNodeLog: false,
      logForm: {},
    }
  },
  methods: {
    completeNotify() {
      this.pipelineDialog = false
      this.getPipelineList()
      if (this.piplienOperate == 1) {
        pipelineApi
          .queryPipeline(this.serviceId, this.currentPipeline.pipelineId)
          .then((res) => {
            let config = utils.displayData(res.data.stageList)
            this.currentPipeline.pipelineConfig = config
            this.currentPipeline.pipelineName = res.data.pipelineName
            this.currentPipeline.pipelineType = res.data.pipelineType
            this.currentPipeline.pipelineId = res.data.pipelineId
            this.uuid++
          })
      }
    },
    exchangeStatusMessage(status) {
      let msg = '无'
      if (status == undefined || status == null) {
        return msg
      }

      switch (status) {
        case 4:
          msg = '运行中'
          break
        case 1:
          msg = '运行成功'
          break
        case 2:
          msg = '运行失败'
          break
        case 3:
          msg = '运行超时'
          break
        default:
          msg = '运行失败'
          break
      }
      return msg
    },
    exchangeExecuteStatus(status) {
      let type = 'info'
      if (status == undefined || status == null) {
        return type
      }

      switch (status) {
        case 4:
          type = 'primary'
          break
        case 1:
          type = 'success'
          break
        case 2:
          type = 'danger'
          break
        case 3:
          type = 'warning'
          break
        default:
          type = 'danger'
          break
      }
      return type
    },
    operateLine(command, item) {
      if (command == 'delete') {
        this.deletePipeline(item)
      }
    },
    selectService() {
      this.getPipelineList()
    },
    showNodeLog(node) {
      if (this.isRunning && node.originData && node.originData.actionId) {
        actionApi.getAction(node.originData.actionId).then((res) => {
          if (res.data.executeType == 'APPROVAL') {
            if (!this.history.historyId) {
              return
            }

            this.$confirm('是否审批通过?').then(() => {
              historyApi
                .approval(this.history.historyId, node.nodeId)
                .then(() => {
                  this.$message.success('审批通过')
                })
            })
          }
        })
        return
      }

      if (!this.history || !this.history.historyId) {
        this.logForm.status = 1
        this.logForm.messageList = ['未执行']
        this.isShowNodeLog = true
        return
      }

      historyApi.getPipelienStatus(this.history.historyId).then((res) => {
        res.data.nodeStatusList.forEach((e) => {
          if (e.nodeId == node.nodeId) {
            this.logForm.status = e.status
            this.logForm.messageList = e.message
            this.isShowNodeLog = true
          }
        })
      })
    },
    getPrenode(arr, index) {
      let tmp = {}
      arr.forEach((e) => {
        if (e.next && e.next.length > 0) {
          e.next.forEach((ele) => {
            if (ele.index == index) {
              tmp = e
            }
          })
        }
      })
      return tmp
    },
    preNodeAddline(array, prenodeId, itemIndexs, groupId) {
      array.forEach((e) => {
        if (e.id == prenodeId) {
          itemIndexs.forEach((ele) => {
            e.next.push({
              index: ele,
              weight: 0,
              groupId: groupId,
            })
          })
        }
      })
    },
    remoteMethod() {
      serviceApi.getServices().then((res) => {
        this.pipelines = []
        res.data.forEach((e) => {
          this.pipelines.push({
            label: e.serviceName,
            value: e.serviceId,
          })
        })
      })
    },
    pausePipeline() {
      if (!this.isRunning) {
        return
      }

      pipelineApi.pausePipeline(this.history.historyId).then((res) => {
        this.isRunning = false
        if (res.data) {
          this.$message.success('停止流水线成功')
        } else {
          this.$message.error('停止流水线失败')
        }
      })
    },
    startPipeline() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning('请先选择流水线')
        return
      }

      pipelineApi.startPipeline(this.currentPipeline.pipelineId).then((res) => {
        if (res.data == '' || res.data == null) {
          this.$message.error('运行流水线失败')
          return
        }
        this.$message.success('开始运行流水线')
        this.getLatestHistory(this.currentPipeline.pipelineId)
        this.isRunning = true
      })
    },
    exchangeStatus(status) {
      switch (status) {
        case 1:
          return 'success'
        case 2:
          return 'failure'
        case 3:
          return 'unstable'
        case 4:
          return 'running'
        case 5:
          return 'unstable'
        case 6:
          return 'paused'
      }
    },
    startEdit() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning('请先选择流水线')
        return
      }
      this.piplienOperate = 1
      this.isView = false
      this.pipelineDialog = true
      this.pipelineForm = JSON.parse(JSON.stringify(this.currentPipeline))
    },
    startView() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning('请先选择流水线')
        return
      }
      this.piplienOperate = 2
      this.titleName = '查看流水线'
      this.pipelineDialog = true
      this.isView = true
      this.pipelineForm = this.currentPipeline
    },
    selectPipeline(item) {
      this.publishList.forEach((e) => {
        e.selected = false
      })
      this.buildList.forEach((e) => {
        e.selected = false
      })
      this.customList.forEach((e) => {
        e.selected = false
      })
      item.selected = true
      pipelineApi.queryPipeline(this.serviceId, item.pipelineId).then((res) => {
        let config = utils.displayData(res.data.stageList)
        this.currentPipeline.pipelineConfig = config
        this.currentPipeline.pipelineName = res.data.pipelineName
        this.currentPipeline.pipelineType = res.data.pipelineType
        this.currentPipeline.executeType = res.data.executeType
        this.currentPipeline.pipelineId = item.pipelineId
        this.uuid++
      })

      historyApi
        .latestPipelineHistory(this.serviceId, item.pipelineId)
        .then((res) => {
          if (!res.data) {
            this.history = {}
            return
          }
          this.history = res.data
          historyApi.getPipelienStatus(this.history.historyId).then((res) => {
            let item = {}
            res.data.nodeStatusList.forEach((e) => {
              item[e.nodeId] = this.exchangeStatus(e.status)
              console.log(item[e.nodeId])
            })

            this.currentPipeline.pipelineConfig.forEach((e) => {
              let status = item[e.nodeId]
              if (status) {
                e.status = status
              }
            })
            this.uuid++
          })
        })
    },
    getLatestHistory(pipelineId) {
      historyApi
        .latestPipelineHistory(this.serviceId, pipelineId)
        .then((res) => {
          if (!res.data) {
            this.history = {}
            return
          }
          this.history = res.data
        })
    },
    handleCommand(command) {
      if (command == 'new') {
        this.piplienOperate = 3
        this.titleName = '创建流水线'
        this.pipelineDialog = true
        this.isView = false
      }
    },
    deletePipeline(pipeline) {
      this.$confirm(`确认删除流水线【${pipeline.pipelineName}】？`).then(() => {
        pipelineApi
          .deletePipeline(this.serviceId, pipeline.pipelineId)
          .then(() => {
            this.getPipelineList()
          })
      })
    },
    getPipelineList() {
      pipelineApi.pipelineList(this.serviceId).then((res) => {
        this.publishList = []
        this.buildList = []
        this.customList = []
        res.data.forEach((e) => {
          e.selected = false
          e.pipelineConfig = JSON.parse(e.pipelineConfig)
          if (e.pipelineType == 1) {
            this.publishList.push(e)
          }
          if (e.pipelineType == 2) {
            this.buildList.push(e)
          }
          if (e.pipelineType == 3) {
            this.customList.push(e)
          }
        })
      })
    },
    getConfigNodes() {
      nodeApi.getAllNodes().then((res) => {
        this.stepOptions = res.data
      })
    },
    getDefaultService() {
      serviceApi.getServices().then((res) => {
        this.pipelines = []
        res.data.forEach((e) => {
          this.pipelines.push({
            label: e.serviceName,
            value: e.serviceId,
          })
        })

        this.serviceId = this.pipelines[0].value
        this.getPipelineList()
      })
    },
    loopQueryStatus() {
      setInterval(() => {
        if (!this.history.historyId) {
          return
        }
        historyApi.getPipelienStatus(this.history.historyId).then((res) => {
          let item = {}
          res.data.nodeStatusList.forEach((e) => {
            item[e.nodeId] = this.exchangeStatus(e.status)
          })

          this.currentPipeline.pipelineConfig.forEach((e) => {
            let status = item[e.nodeId]
            if (status) {
              e.status = status
            }
          })
          if (res.data.pipelineStatus != 4) {
            this.isRunning = false
            this.getLatestHistory(this.currentPipeline.pipelineId)
            return
          }
          this.isRunning = true
        })
      }, 3000)
    },
    cancelCreatePipeline() {
      this.rootList = []
      this.pipelineDialog = false
      this.isView = false
      this.pipelineForm = {}
      this.editPipelines = []
      this.configForm = {}
    },
  },
  created() {
    this.getConfigNodes()
    this.getDefaultService()
    this.loopQueryStatus()
  },
}
</script>

<style scoped>
.service-tip {
  cursor: pointer;
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
.step-title {
  margin: 5px 5px;
  font-weight: 800;
}

.select-pipeline {
  margin: 10px;
}
.pipeline-list {
  margin-top: 20px;
}
.left-content {
  border-right: 1px solid #dcdfe6;
  height: 100vh;
}
.pipeline-item {
  cursor: pointer;
  border: 1px dashed #dcdfe6;
  margin: 5px 10px;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  border-radius: 3px;
  padding: 5px 10px;
  background: #f2f6fc;
}

.pipeline-item:hover {
  background: rgb(102, 177, 255);
  color: #fff;
}

.selected-line {
  background: rgb(102, 177, 255);
  color: #fff;
}

.title-icon {
  margin-right: 10px;
}
.right-content {
  margin: 10px;
}
.service-name {
  font-size: 20px;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  margin: 10px;
}
.pipeline-detail {
  border: 1px dashed #dcdfe6;
  border-radius: 3px;
  padding: 5px 10px;
  min-height: 100px;
}
.pipeline-content {
  margin: 20px 10px 10px 10px;
}
.pipeline-detail-item {
  min-width: 200px;
}
.pipe-op-div {
  margin: 10px;
}
.pipe-op-btn {
  margin: 10px;
}
.op-line {
  font-size: 12px;
  margin: 0px 10px;
  cursor: pointer;
}
.title-line {
  margin: 10px;
}
ul {
  list-style: none;
  padding: 0px;
}
</style>
