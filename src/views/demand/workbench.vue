<template>
  <div>
    <div class="header-container">
      <img class="image-logo" :src="imageUrl" alt="windy" />
      <el-input
        v-model="searchText"
        size="mini"
        placeholder="输入缺陷、需求、工作像名称搜索"
        class="custom-input"
      />
      <!-- 任务总览开始 -->
      <div class="ui-container">
        <div class="ui-item">
          <div class="ui-value">1</div>
          <div class="ui-label">缺陷数</div>
        </div>
        <div class="ui-item">
          <div class="ui-value ui-success">1</div>
          <div class="ui-label">需求数</div>
        </div>
        <div class="ui-item">
          <div class="ui-value ui-error">1</div>
          <div class="ui-label">工作项</div>
        </div>
      </div>
      <!-- 任务总览结束 -->
    </div>
    <div class="content">
      <el-tabs type="border-card" v-model="activeName">
        <!-- 缺陷列表开始 -->
        <el-tab-pane label="缺陷" name="bug">
          <span slot="label"><i class="el-icon-question"></i> 缺陷</span>
          <div class="content-detail">
            <div class="bug-div" v-for="(item, index) in bugData" :key="index">
              <el-row class="bug-row">
                <el-col :span="1">
                  <el-tag type="success" size="small">{{
                    bugStatusName(item.status)
                  }}</el-tag>
                </el-col>
                <el-col :span="23" class="bug-description title">
                  <div @click="showBugDetail(item)">
                    <textview :text="item.bugName" :len="100"> </textview>
                  </div>
                </el-col>
              </el-row>
              <div class="bug-bottom">
                <span class="bug-level p1" v-if="item.level == 1"
                  >P{{ item.level }}</span
                >
                <span class="bug-level p2" v-else-if="(item.level = 2)"
                  >P{{ item.level }}</span
                >
                <span class="bug-level p3" v-else>P{{ item.level }}</span>
                <span
                  >缺陷ID: {{ item.bugId }}
                  <i
                    :data-clipboard-text="item.bugId"
                    class="el-icon-document-copy copy-icon"
                /></span>
              </div>
              <div class="time-div">
                创建时间: {{ item.createTime | dayFormat }}
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange($event, 'bug')"
              @current-change="handleCurrentChange($event, 'bug')"
              :current-page.sync="bugPage"
              :page-sizes="[10, 20, 50]"
              :page-size="bugSize"
              layout="sizes, prev, pager, next"
              :total="bugTotal"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <!-- 缺陷列表结束 -->

        <!-- 需求列表开始 -->
        <el-tab-pane label="需求" name="demand">
          <span slot="label"><i class="el-icon-s-opportunity"></i> 需求</span>
          <div class="content-detail">
            <div
              class="bug-div"
              v-for="(item, index) in demandData"
              :key="index"
            >
              <div>
                <div class="title" @click="showDemand(item)">
                  <textview :text="item.demandName" :len="100"> </textview>
                </div>
                <div class="demand-desc">
                  <textview
                    :len="200"
                    :showpop="false"
                    :text="item.demandContent"
                  >
                  </textview>
                </div>
              </div>
              <div class="bug-bottom">
                <span class="bug-level p1" v-if="item.level == 1"
                  >P{{ item.level }}</span
                >
                <span class="bug-level p2" v-else-if="(item.level = 2)"
                  >P{{ item.level }}</span
                >
                <span class="bug-level p3" v-else>P{{ item.level }}</span>
                <span><i class="el-icon-user-solid" /> 古月澜</span>
                <span
                  ><span>需求ID:</span> {{ item.demandId }}
                  <i
                    :data-clipboard-text="item.demandId"
                    class="el-icon-document-copy copy-icon"
                /></span>
              </div>
              <div class="time-div">
                截止时间: {{ item.expectTime | dayFormat }}
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange($event, 'demand')"
              @current-change="handleCurrentChange($event, 'demand')"
              :current-page.sync="demandPage"
              :page-sizes="[10, 20, 50]"
              :page-size="demandSize"
              layout="sizes, prev, pager, next"
              :total="demandTotal"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <!-- 需求列表结束 -->
        <!-- 工作项列表开始 -->
        <el-tab-pane label="任务列表" name="work">
          <span slot="label"><i class="el-icon-s-claim"></i> 工作项</span>
          <div class="work-add">
            <el-button
              type="primary"
              size="mini"
              style="z-index: 1000"
              icon="el-icon-plus"
              @click="showTaskView"
              >新增工作项</el-button
            >
          </div>
          <div class="content-detail">
            <div class="bug-div" v-for="(item, index) in taskData" :key="index">
              <div>
                <div class="title">
                  <div @click="showEdit(item)">
                    <textview :text="item.taskName" :len="100"> </textview>
                  </div>
                </div>
                <div class="demand-desc">
                  <textview
                    :showpop="false"
                    :len="200"
                    :text="item.description"
                  >
                  </textview>
                </div>
              </div>
              <div class="bug-bottom">
                <span
                  ><i class="el-icon-camera-solid bug-icon" /> [{{
                    item.taskId
                  }}] <i class="el-icon-document-copy"
                /></span>
                <span
                  ><i class="el-icon-user-solid" /> 工时:
                  {{ item.workload }} 天</span
                >
                <span
                  ><i class="el-icon-time" /> 结束点:
                  {{ item.completeTime | dayFormat }}</span
                >
              </div>
              <div class="time-div">
                开始时间: {{ item.createTime | dateFormat }}
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange($event, 'work')"
              @current-change="handleCurrentChange($event, 'work')"
              :current-page.sync="taskPage"
              :page-sizes="[10, 20, 50]"
              :page-size="taskSize"
              layout="sizes, prev, pager, next"
              :total="taskTotal"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <!-- 工作项列表结束 -->
      </el-tabs>
    </div>
    <el-dialog title="需求详情" :visible.sync="showDemandDetail" width="90%">
      <detail :demand="demandId"></detail>
    </el-dialog>
    <el-dialog title="缺陷详情" :visible.sync="showBugDialog" width="90%">
      <bugDetail :bug="bugId" :edit="true" @cancel="closeBug"></bugDetail>
    </el-dialog>
    <el-dialog title="创建任务" :visible.sync="showTaskDialog">
      <div>
        <el-form
          :model="taskForm"
          ref="taskForm"
          label-width="120px"
          :rules="taskRule"
          size="mini"
        >
          <el-form-item label="任务名称">
            <el-input
              v-model="taskForm.taskName"
              placeholder="请输入任务名称"
            />
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 20 }"
              v-model="taskForm.description"
              placeholder="请输入任务名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="关联类型">
            <el-radio-group v-model="relatedType">
              <el-radio :label="1">需求</el-radio>
              <el-radio :label="2">缺陷</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="`关联${relatedType == 1 ? '需求' : '缺陷'}ID`">
            <el-input
              v-model="taskForm.relatedId"
              placeholder="请输入关联的ID"
            />
          </el-form-item>
          <el-form-item label="完成时间" prop="expectTime">
            <el-date-picker
              v-model="taskForm.completeTime"
              align="right"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="mini" type="info">取消</el-button>
        <el-button size="mini" type="primary" @click="submitTask('taskForm')"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import img from '../../../public/logo.svg'
import textview from '../../components/text-view.vue'
import demandApi from '../../http/DemandApi'
import bugApi from '../../http/BugApi'
import workTask from '../../http/WorkTask'
import detail from './detail.vue'
import bugDetail from './bug-detail.vue'
export default {
  components: {
    textview,
    detail,
    bugDetail,
  },
  data() {
    return {
      imageUrl: img,
      searchText: '',
      activeName: 'work',
      total: 30,
      currentPage: 1,
      demandTotal: 0,
      demandPage: 1,
      demandSize: 10,
      demandData: [],
      bugTotal: 0,
      bugPage: 1,
      bugSize: 10,
      bugData: [],
      showDemandDetail: false,
      showBugDialog: false,
      demandId: '',
      bugId: '',
      bugStatus: [],
      demandStatus: [],
      showTaskDialog: false,
      taskRules: [],
      taskForm: {},
      relatedType: 1,
      taskTotal: 0,
      taskPage: 1,
      taskSize: 10,
      taskData: [],
      isEditTask: false,
      taskRule: {},
      taskStatus:[]
    }
  },
  methods: {
    showEdit(row) {
      console.log('kkkkkkk')
      this.showTaskDialog = true
      this.isEditTask = true
      this.taskForm = JSON.parse(JSON.stringify(row))
    },
    submitTask(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.isEditTask) {
          workTask.updateTask(this.taskForm).then((res) => {
            if (res.data) {
              this.$message.success('修改任务成功')
              this.getTasks()
              this.closeTask()
            } else {
              this.$message.error('修改任务失败')
            }
          })
          return
        }
        workTask.createTask(this.taskForm).then((res) => {
          console.log('ddd', res)
          if (res.data) {
            this.$message.success('添加任务成功')
            this.getTasks()
            this.closeTask()
          } else {
            this.$message.error('添加任务失败')
          }
        })
      })
    },
    closeTask() {
      this.taskForm = {}
      this.showTaskDialog = false
    },
    showTaskView() {
      this.showTaskDialog = true
      this.isEditTask = false
    },
    closeBug() {
      this.showBugDialog = false
    },
    showBugDetail(row) {
      this.showBugDialog = true
      this.bugId = row.bugId
    },
    bugStatusName(status) {
      let statusName = '-'
      this.bugStatus.forEach((e) => {
        if (e.value == status) {
          statusName = e.statusName
        }
      })
      return statusName
    },
    demandStatusName(status) {
      let statusName = '-'
      this.demandStatus.forEach((e) => {
        if (e.value == status) {
          statusName = e.statusName
        }
      })
      return statusName
    },
    showDemand(row) {
      this.demandId = row.demandId
      this.showDemandDetail = true
    },
    handleClick(tab) {
      console.log(tab)
    },
    handleSizeChange(size, type) {
      if (type == 'demand') {
        this.demandSize = size
        this.getDemands()
      }
      if (type == 'bug') {
        this.bugSize = size
        this.getBugs()
      }
    },
    handleCurrentChange(page, type) {
      if (type == 'demand') {
        this.demandPage = page
        this.getDemands()
      }
      if (type == 'bug') {
        this.bugPage = page
        this.getBugs()
      }
    },
    getDemands() {
      demandApi.getUserDemands(this.demandPage, this.demandSize).then((res) => {
        this.demandTotal = res.data.total
        this.demandData = res.data.data
      })
    },
    getBugs() {
      bugApi.getUserbugs(this.bugPage, this.bugSize).then((res) => {
        this.bugTotal = res.data.total
        this.bugData = res.data.data
      })
    },
    getTasks() {
      workTask.getTaskPaage(this.taskPage, this.taskSize).then((res) => {
        this.taskTotal = res.data.total
        this.taskData = res.data.data
      })
    },
    getStatusList() {
      demandApi.getDemandStatuses().then((res) => {
        this.demandStatus = res.data
        this.getDemands()
      })
      bugApi.getBugStatuses().then((res) => {
        this.bugStatus = res.data
        this.getBugs()
      })

      workTask.getTaskStatuses().then((res) => {
        this.taskStatus = res.data
        this.getTasks()
      })
    },
    initCopy() {
      let _this = this
      let clipboard = new Clipboard('.copy-icon')

      clipboard.on('success', function () {
        _this.$message.success('复制成功')
      })
      clipboard.on('error', function () {
        _this.$message.error('复制失败')
      })
    },
  },
  created() {
    this.getStatusList()
  },
  mounted() {
    this.initCopy()
  },
}
</script>
<style scoped>
.image-logo {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 10px; /* 根据需要调整间距 */
}

.header-container {
  display: flex;
  align-items: center;
  margin: 20px;
  position: relative;
}
.input-div {
  display: flex;
  align-items: center;
}
.content {
  margin: 20px;
  margin-top: 40px;
}

.ui-container {
  width: 300px;
  position: absolute;
  top: 10px;
  right: 60px;
  display: flex;
  justify-content: space-between;
}

.ui-item {
  text-align: center;
}
.p1 {
  background-color: #f56c6c;
}
.p2 {
  background-color: #409eff;
}
.p3 {
  background-color: #67c23a;
}

.ui-value {
  font-size: 35px;
  font-weight: bold;
}
.ui-success {
  color: #67c23a;
}

.ui-error {
  color: #f56c6c;
}
.ui-result {
  color: #409eff;
}

.ui-label {
  font-size: 14px;
  color: #909399;
}

.content-detail {
  height: 500px;
  overflow-y: scroll;
}
.time-div {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 13px;
  color: #909399;
}
.bug-div {
  position: relative;
  color: #303133;
  font-size: 13px !important;
  border-bottom: 1px solid #e4e7ed;
  padding: 15px;
}
.bug-div:hover {
  background-color: #f2f6fc;
}

.bug-description {
  flex: 1;
  display: flex;
  align-items: center;
  word-break: break-all;
}
.bug-level {
  width: 25px;
  height: 15px;
  font-size: 12px;
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
}
.bug-bottom {
  margin-top: 10px;
  display: flex;
  color: #909399;
}
.bug-bottom span {
  margin-right: 10px;
}
.bug-icon {
  color: #f56c6c;
}
.pagination {
  margin-top: 10px;
}
.title {
  font-size: 15px;
  font-weight: 800;
  color: #606266;
  cursor: pointer;
  z-index: 1000;
}
.title:hover {
  color: #409eff;
}
.demand-desc {
  font-size: 12px;
  margin-top: 5px;
  color: #909399;
}
.copy-icon {
  cursor: pointer;
}
.work-add {
  margin: 10px;
  margin-bottom: 20px;
}
</style>
<style>
.custom-input {
  width: 300px;
  box-sizing: border-box; /* 确保 padding 不会影响元素的总尺寸 */
}
</style>
