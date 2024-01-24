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
    <div class="content">
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
                    <i class="el-icon-cpu title-icon" /> 定时流水线
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
              :disabled="currentPipeline.executeType != 1"
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
              v-if="currentPipeline.pipelineType != 1"
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
            <el-button
              type="primary"
              icon="el-icon-upload"
              size="mini"
              v-if="currentPipeline.pipelineType != 1"
              @click="publish"
              >推送发布</el-button
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
                <el-tag :type="history.pipelineStatus | statusFormat">{{
                  history.pipelineStatus | statusName
                }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="执行方式">
                <el-tag type="primary">{{
                  executeWay(currentPipeline.executeType)
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

          <!-- 发布流水线关联分支开始 -->
          <div v-if="currentPipeline.pipelineType == 1">
            <h4 class="republis-info">待发布分支</h4>
            <el-table :data="publishData" style="width: 100%">
              <el-table-column prop="branch" label="分支"> </el-table-column>
              <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                  {{ scope.row.status | publisFormat }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime | dateFormat }}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="removePublish(scope.row)"
                    type="text"
                    size="small"
                    >移除发布</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 发布流水线关联分支结束 -->
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
      :before-close="closeGitDialog"
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
        <el-tag :type="logForm.status | statusFormat">{{
          logForm.status | statusName
        }}</el-tag></span
      >
      <el-divider><i class="el-icon-receiving"></i></el-divider>
      <ul>
        <li v-for="(item, index) in logForm.messageList" :key="index">
          <span>{{ item }}</span>
        </li>
      </ul>
      <div v-if="recordList && recordList.length > 0">
        <el-table :data="recordList" size="mini" height="400px">
          <el-table-column prop="featureName" label="用例名称">
          </el-table-column>
          <el-table-column prop="executeStatus" label="用例状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.executeStatus | statusFormat">{{
                scope.row.executeStatus | statusName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="执行时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        :operate="piplienOperate"
        :pipeline="pipelineId"
        :service="serviceId"
        @complete="completeNotify"
      />
    </el-dialog>
    <!-- 创建/编辑流水线结束 -->
    <!-- 审批开始 -->
    <el-dialog
      title="卡点审批"
      :visible.sync="showApproval"
      width="30%"
      :before-close="approvalClose"
    >
      <span>审批是否通过?</span>
      <span slot="footer">
        <el-button size="mini" type="danger" @click="cancelApproval"
          >不通过</el-button
        >
        <el-button size="mini" type="primary" @click="confirmApproval"
          >通过</el-button
        >
      </span>
    </el-dialog>
    <!-- 审批结束 -->
  </div>
</template>
<script>
import bind from './bindgit.vue'
import PipelineConfig from './comp/pipeline-config.vue'
import pipelineApi from '../../http/Pipeline'
import publishApi from '../../http/Publish'
import serviceApi from '../../http/Service'
import taskApi from '../../http/Task'
import historyApi from '../../http/PipelineHistory'
import actionApi from '../../http/PipelineAction'
import utils from '../../lib/pipeline'
import nodeApi from '../../http/NodeBind'
import gitBindApi from '../../http/GitBind'
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
      pipelineId: '',
      history: {},
      publishList: [],
      buildList: [],
      customList: [],
      isRunning: false,
      pipelineDialog: false,
      piplienOperate: 0,
      prenodeId: [],
      serviceId: '',
      titleName: '新增流水线',
      showGitConfig: false,
      uuid: 1,
      isShowNodeLog: false,
      logForm: {},
      publishData: [],
      approvalNode: {},
      showApproval: false,
      bindGit: false,
      recordList: [],
    }
  },
  methods: {
    executeWay(executeType) {
      let label = '-'
      switch (executeType) {
        case 1:
          label = '手动执行'
          break
        case 2:
          label = '代码提交'
          break
        case 3:
          label = '定时执行'
          break
      }
      return label
    },
    approvalClose() {
      this.approvalNode = {}
      this.showApproval = false
    },
    cancelApproval() {
      this.approvalPipeline(2)
    },
    confirmApproval() {
      this.approvalPipeline(1)
    },
    approvalPipeline(status) {
      historyApi
        .approval(this.history.historyId, this.approvalNode.nodeId, status)
        .then((res) => {
          if (res.data) {
            this.$message.success('审批通过')
          } else {
            this.$message.error('审批失败，请重试')
          }
          this.approvalClose()
        })
    },
    getServicePublishes() {
      this.publishData = []
      publishApi.getPublishes(this.serviceId).then((res) => {
        this.publishData = res.data
      })
    },
    publish() {
      let data = {
        pipelineId: this.currentPipeline.pipelineId,
        serviceId: this.serviceId,
      }
      publishApi.createPublish(data).then((res) => {
        if (res.data) {
          this.$message.success('推送发布成功，请去发布流水线查看')
        } else {
          this.$message.error('推送发布失败')
        }
      })
    },
    removePublish(row) {
      publishApi.deletePublish(row.publishId).then((res) => {
        if (res.data) {
          this.$message.success('删除成功')
          this.getServicePublishes()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    completeNotify() {
      this.pipelineDialog = false
      this.getPipelineList()
      if (this.piplienOperate == 1) {
        pipelineApi
          .queryPipeline(this.currentPipeline.pipelineId)
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
      this.currentPipeline = { pipelineConfig: [] }
    },

    showNodeLog(node) {
      if (!node.originData || !node.originData.actionId) {
        return
      }
      actionApi.getAction(node.originData.actionId).then((res) => {
        if (res.data.executeType == 'APPROVAL' && this.isRunning) {
          if (!this.history.historyId) {
            return
          }
          this.approvalNode = node
          this.showApproval = true
          return
        }

        if (!this.history || !this.history.historyId) {
          this.logForm.status = 1
          this.logForm.messageList = ['未执行']
          this.isShowNodeLog = true
          return
        }

        console.log('ddd', res)
        let nodeType = res.data.executeType
        historyApi.getPipelienStatus(this.history.historyId).then((res) => {
          res.data.nodeStatusList.forEach((e) => {
            if (e.nodeId == node.nodeId) {
              this.logForm.nodeId = node.nodeId
              this.logForm.status = e.status
              this.logForm.messageList = e.message
              this.isShowNodeLog = true

              if (nodeType == 'TEST') {
                this.getTaskHistories(e.recordId)
              }
            }
          })
        })
      })
    },
    getTaskHistories(triggerId) {
      taskApi.getTaskRecordByTriggerId(triggerId).then((res) => {
        let recordId = res.data.recordId
        taskApi.getTaskHistories(recordId).then((res) => {
          console.log('records', res)
          this.recordList = res.data
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

      let isPublish =
        this.currentPipeline.pipelineType == 1 && this.publishData.length < 1
      if (isPublish) {
        this.$message.warning('待发布列表为空，请先推送分支到发布流水线')
        return
      }

      if (!isPublish && !this.bindGit) {
        let notify = this.$message.warning({
          dangerouslyUseHTMLString: true,
          message:
            '当前流水线未绑定分支，请先绑定 <span style="cursor: pointer;color:#409EFF" @click="showGitConfig = !showGitConfig">去绑定>></span>',
        })

        let that = this
        notify.$el.querySelector('span').onclick = () => {
          that.showGitConfig = !that.showGitConfig
        }

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
        this.currentPipeline.pipelineConfig.forEach((e) => {
          e.status = 'success'
        })
        this.uuid++
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
      this.pipelineDialog = true
    },
    startView() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning('请先选择流水线')
        return
      }
      this.piplienOperate = 2
      this.titleName = '查看流水线'
      this.pipelineDialog = true
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
      pipelineApi.queryPipeline(item.pipelineId).then((res) => {
        let config = utils.displayData(res.data.stageList)
        this.currentPipeline.pipelineConfig = config
        this.currentPipeline.pipelineName = res.data.pipelineName
        this.currentPipeline.pipelineType = res.data.pipelineType
        this.currentPipeline.executeType = res.data.executeType
        this.currentPipeline.pipelineId = item.pipelineId
        this.pipelineId = item.pipelineId
        this.uuid++

        this.checkBindBranch()

        if (this.currentPipeline.pipelineType == 1) {
          this.getServicePublishes()
        }
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
            })

            this.currentPipeline.pipelineConfig.forEach((e) => {
              let status = item[e.nodeId]
              if (status) {
                e.status = status
              } else {
                e.status = 'success'
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
            if (e.nodeId == this.logForm.nodeId) {
              this.logForm = {
                nodeId: this.logForm.nodeId,
                status: e.status,
                messageList: e.message,
              }
            }
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
      this.pipelineDialog = false
    },
    closeGitDialog() {
      this.checkBindBranch()
      this.showGitConfig = false
    },
    checkBindBranch() {
      this.bindGit = false
      gitBindApi.gitbindList(this.currentPipeline.pipelineId).then((res) => {
        res.data.forEach((e) => {
          if (e.isChoose) {
            this.bindGit = true
          }
        })
      })
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
.content {
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
.republis-info {
  margin: 10px;
}
</style>
