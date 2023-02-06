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
          :data="recordData"
          default-expand-all
          :filter-node-method="filterNode"
          :props="{
            children: 'children',
            label: 'featureName',
          }"
          ref="tree"
        >
        </el-tree>
      </el-col>
      <el-col :span="18">
        <div class="drawer-content">
          <div class="record-title">执行历史记录</div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="预置" name="preset">
              <PanelList :list="presetList" />
            </el-tab-pane>
            <el-tab-pane label="执行" name="execute">
              <PanelList :list="executeList" />
            </el-tab-pane>
            <el-tab-pane label="清理" name="clean">
              <PanelList :list="cleanList" />
            </el-tab-pane>
          </el-tabs>
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
        }
        if (2 == e.testStage) {
          this.executeList.push(e)
        }
        if (3 == e.testStage) {
          this.cleanList.push(e)
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTaskHistories() {
      taskApi.getTaskHistories(this.recordId).then((res) => {
        this.recordData = res.data
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
</style>
