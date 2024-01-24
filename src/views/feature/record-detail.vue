<template>
  <div>
    <div class="title">
      <el-page-header @back="goBack" :content="recordName"> </el-page-header>
    </div>
    <el-row>
      <el-col :span="6">
        <div class="show-config">
          <el-button type="primary" size="mini" @click="showRecordConfig"
            >查看配置</el-button
          >
        </div>
        <div class="search">
          <el-input
            size="mini"
            placeholder="输入用例名进行过滤"
            v-model="filterText"
          >
          </el-input>
        </div>
        <el-tree
          node-key="featureId"
          @node-click="treeNodeClick"
          :default-expanded-keys="errorList"
          :data="recordData"
          :filter-node-method="filterNode"
          :props="{
            children: 'children',
            label: 'featureName',
          }"
          ref="tree"
        >
          <span slot-scope="{ node, data }">
            <span class="custom-tree-node" :style="{ color: data.status }">{{
              node.label
            }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-empty
          v-if="isShowEmpty"
          description="请在左侧点击详细用例查看详情"
        ></el-empty>
        <div v-else class="drawer-content">
          <div class="record-title">
            【{{ chooseFeature.featureName }}】执行历史记录
          </div>
          <div class="execute-detail">
            <el-tabs v-model="activeName">
              <el-tab-pane name="preset">
                <el-badge
                  slot="label"
                  is-dot
                  class="tab-label"
                  :hidden="!presetError"
                  >预置</el-badge
                >
                <PanelList :list="presetList" />
              </el-tab-pane>
              <el-tab-pane name="execute">
                <el-badge
                  slot="label"
                  is-dot
                  class="tab-label"
                  :hidden="!executeError"
                  >执行</el-badge
                >
                <PanelList :list="executeList" />
              </el-tab-pane>
              <el-tab-pane name="clean">
                <el-badge
                  slot="label"
                  is-dot
                  class="tab-label"
                  :hidden="!cleanError"
                  >清理</el-badge
                >
                <PanelList :list="cleanList" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" title="任务执行配置" width="70%">
      <json-viewer
        :value="jsonData"
        :expand-depth="5"
        copyable
        boxed
        sort
      ></json-viewer>
    </el-dialog>
  </div>
</template>
<script>
import taskApi from '../../http/Task'
import featureApi from '../../http/Feature'
import PanelList from '../../components/panel-list.vue'
import JsonViewer from 'vue-json-viewer'
export default {
  components: {
    PanelList,
    JsonViewer,
  },
  data() {
    return {
      recordData: [],
      recordId: '',
      recordName: '',
      filterText: '',
      activeName: 'preset',
      resultList: [],
      presetList: [],
      executeList: [],
      cleanList: [],
      jsonData: [],
      dialogVisible: false,
      chooseFeature: {},
      isShowEmpty: true,
      errorList: [],
      presetError: false,
      executeError: false,
      cleanError: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    treeNodeClick(data) {
      this.resultList = []
      this.activeName = 'preset'
      this.chooseFeature = data
      this.isShowEmpty = false
      featureApi.getExecuteRecords(data.historyId).then((res) => {
        this.resultList = res.data
        this.filterRecord()
      })
    },
    filterRecord() {
      this.presetList.splice(0, this.presetList.length)
      this.executeList.splice(0, this.executeList.length)
      this.cleanList.splice(0, this.cleanList.length)
      this.resultList.forEach((e) => {
        if (1 == e.testStage) {
          this.presetList.push(e)
          if (e.status != 1) {
            this.presetError = true
          }
        }
        if (2 == e.testStage) {
          this.executeList.push(e)
          if (e.status != 1) {
            this.executeError = true
          }
        }
        if (3 == e.testStage) {
          this.cleanList.push(e)
          if (e.status != 1) {
            this.cleanError = true
          }
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTaskHistories() {
      this.recordData = []
      taskApi.getTaskHistoryTree(this.recordId).then((res) => {
        let list = res.data
        this.displayTreeNode(list)
        console.log(this.errorList)
        this.recordData = list
      })
    },
    displayTreeNode(list) {
      list.forEach((e) => {
        if (e.executeStatus) {
          e.status = '#67C23A'
          if (e.executeStatus != 1) {
            e.status = '#F56C6C'
            this.errorList = [e.featureId]
            this.treeNodeClick(e)
          }
        }

        if (e.children && e.children.length > 0) {
          this.displayTreeNode(e.children)
        }
      })
    },
    showRecordConfig() {
      this.dialogVisible = true
      taskApi.getTaskRecordDetail(this.recordId).then((res) => {
        // this.jsonData = {
        //   执行机器列表: JSON.parse(res.data.machines),
        //   执行配置: JSON.parse(res.data.taskConfig),
        // };
        this.jsonData = JSON.parse(res.data.taskConfig)
      })
    },
    getRecordDetail() {
      taskApi.getTaskRecordDetail(this.recordId).then((res) => {
        this.recordName = res.data.taskName
      })
    },
  },
  created() {
    this.recordId = this.$route.query.recordId
    this.getRecordDetail()
    this.getTaskHistories()
  },
}
</script>
<style scoped>
.title {
  margin: 20px;
}
.search {
  margin: 10px 20px;
}
.show-config {
  margin: 10px 20px;
}
.record-title {
  font-weight: 800;
}
.execute-detail {
  margin-top: 20px;
}
.custom-tree-node {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 14px;
}
.tab-label {
  margin-top: 10px;
}
</style>
