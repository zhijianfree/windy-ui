<template>
  <div>
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
    <div class="right-content">
      <el-row>
        <el-col :span="4">
          <div class="left-content">
            <div class="op-line">
              <el-dropdown
                v-if="!isManaged"
                placement="bottom-end"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-edit" />编辑<i
                    class="el-icon-arrow-down el-icon--right"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="new"
                    ><i class="el-icon-circle-plus" />新增</el-dropdown-item
                  >
                  <el-dropdown-item command="manage"
                    ><i class="el-icon-s-tools" />管理</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <div v-else>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deletePipeline"
                  icon="el-icon-delete"
                  >确认</el-button
                >
                <el-button
                  type="info"
                  size="mini"
                  @click="cancelManage"
                  icon="el-icon-circle-close"
                >
                  取消</el-button
                >
              </div>
            </div>
            <div class="pipeline-list">
              <el-checkbox-group v-model="checkList">
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
                      <el-checkbox v-if="isManaged" :label="item.pipelineId">{{
                        item.pipelineName
                      }}</el-checkbox>
                      <span @click="selectPipeline(item)" v-else>{{
                        item.pipelineName
                      }}</span>
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
                      <el-checkbox v-if="isManaged" :label="item.pipelineId">{{
                        item.pipelineName
                      }}</el-checkbox>
                      <span @click="selectPipeline(item)" v-else>{{
                        item.pipelineName
                      }}</span>
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
                      <el-checkbox v-if="isManaged" :label="item.pipelineId">{{
                        item.pipelineName
                      }}</el-checkbox>
                      <span @click="selectPipeline(item)" v-else>{{
                        item.pipelineName
                      }}</span>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="pipe-op-div">
            <el-button
              type="primary"
              v-if="isRunning"
              icon="el-icon-video-pause"
              size="mini"
              @click="pausePipeline"
              >暂停</el-button
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
          <div class="pipeline-detail">
            <el-descriptions title="流水线历史" :column="3" size="medium">
              <el-descriptions-item label="上次执行">{{
                history.executor
              }}</el-descriptions-item>
              <el-descriptions-item label="git分支">
                {{ history.branch }}</el-descriptions-item
              >
              <el-descriptions-item label="git记录">{{
                history.git
              }}</el-descriptions-item>
              <el-descriptions-item label="运行时间">
                {{ history.createTime }}
              </el-descriptions-item>
              <el-descriptions-item label="执行结果">
                <div class="pipeline-detail-item">
                  <el-tag type="success">{{ history.result }}</el-tag>
                </div></el-descriptions-item
              >
            </el-descriptions>
          </div>
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
            />
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="Git配置" :visible.sync="showGitConfig" width="70%">
      <bind :pipeline="currentPipeline.pipelineId" />
    </el-dialog>

    <el-dialog title="配置节点" :visible.sync="dialogVisible" width="70%">
      <el-form size="mini" :disabled="isView">
        <el-form-item label="节点名称" :label-width="formLabelWidth">
          <el-input v-model="nodeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="节点提示" :label-width="formLabelWidth">
          <el-input v-model="nodeForm.hint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="节点类型" :label-width="formLabelWidth">
          <el-select
            v-model="selectNodeType"
            placeholder="请选择"
            @change="selectStep"
          >
            <el-option
              v-for="item in stepOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
              <draggable>
                <li
                  v-for="(item, index) in itemList"
                  :key="index"
                  @click="chooseStep(item)"
                >
                  <div class="item">
                    {{ item.name }}
                  </div>
                </li>
              </draggable>
            </ul>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <div class="step-title">配置步骤</div>
            <el-form v-model="configForm" size="mini">
              <el-form-item
                v-for="(item, index) in StepConfigs"
                :key="index"
                :label-width="formLabelWidth"
              >
                <span slot="label">{{ item.tip }}</span>
                <el-select
                  v-if="item.type == 'select'"
                  v-model="configForm[item.name]"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in item.list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  @input="datachange(item.name)"
                  v-else
                  v-model="configForm[item.name]"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button
          v-if="!isView"
          type="primary"
          @click="submitConfig"
          size="mini"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :title="titleName" :visible.sync="pipelineDialog" width="80%">
      <el-form
        v-model="pipelineForm"
        label-width="120px"
        size="mini"
        :disabled="this.isView"
      >
        <el-form-item label="流水线名称">
          <el-input v-model="pipelineForm.pipelineName" />
        </el-form-item>
        <el-form-item label="流水线类型">
          <el-radio-group v-model="pipelineForm.pipelineType">
            <el-radio :label="1">发布流水线</el-radio>
            <el-radio :label="2">变更流水线</el-radio>
            <el-radio :label="3">自运行流水线</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="mini"
        v-if="!this.isView"
        icon="el-icon-edit"
        @click="
          dialogVisible = !dialogVisible;
          operateType = 1;
        "
        >添加节点</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="!this.isView && !startMove"
        icon="el-icon-edit"
        @click="startMove = !startMove"
        >移动节点</el-button
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreatePipeline" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitPipeline" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import json from "../../assets/data.json";
import draggable from "vuedraggable";
import bind from "./bindgit.vue";
import pipelineApi from "../../http/Pipeline";
import serviceApi from "../../http/Service";
import historyApi from "../../http/PipelineHistory";
import utils from "../../lib/pipeline";
export default {
  components: { draggable, bind },
  data() {
    return {
      nodes: [],
      startIndex: 1,
      nodeForm: { name: "1111", hint: "ssadsa" },
      formLabelWidth: "80px",
      dialogVisible: false,
      stepOptions: [],
      selectNodeType: "build",
      itemList: [],
      StepConfigs: [],
      configForm: {},
      loading: false,
      activePipelines: ["1", "2", "3"],
      pipelines: [],
      operateType: 1,
      rootList: [],
      currentPipeline: {
        pipelineConfig: [],
      },
      history: {},
      publishList: [],
      buildList: [],
      customList: [],
      isRunning: false,
      isManaged: false,
      checkList: [],
      pipelineDialog: false,
      pipelineForm: {
        pipelineConfig: [],
      },
      isView: false,
      piplienOperate: 0,
      prenodeId: [],
      chosedConfigItem: [],
      serviceId: "",
      titleName: "新增流水线",
      showGitConfig: false,
      startMove: false,
      editPipelines: [],
      uuid: 1,
    };
  },
  methods: {
    leftMove() {
      utils.moveLeft(this.editPipelines, this.nodeForm);
      this.uuid++;
    },
    rightMove() {
      utils.moveRight(this.editPipelines, this.nodeForm);
      this.uuid++;
    },
    removeNode() {
      let array = utils.removeNode(this.editPipelines, this.nodeForm);
      console.log("移除结果", array);
      this.editPipelines = array;
      this.uuid++;
    },
    selectService() {
      this.getPipelineList();
    },
    choosePipeItem(node) {
      this.nodeForm = node;
      if (node.disable || this.startMove) {
        return;
      }
      this.dialogVisible = true;
      this.operateType = 2;
      this.selectNodeType = node.nodeType;
      this.itemList = node.list;
    },
    selectStep(step) {
      this.itemList = json.pipeline_config[step];
    },
    chooseStep(item) {
      let temp = item.config;
      temp.forEach((e) => {
        this.configForm[e.name] = e.value;
      });
      this.StepConfigs = item.config;
      this.chosedConfigItem = item;
      this.$forceUpdate();
    },
    submitConfig() {
      let pipeArray = this.editPipelines;
      if (this.operateType == 1) {
        let subNodes = [];
        console.log("新增的节点", this.nodeForm, "列表", this.itemList);
        this.itemList.forEach((e) => {
          subNodes.push({
            name: e.name,
            hint: e.name,
            status: "success",
            originData: JSON.parse(JSON.stringify(e)),
            next: [],
          });
        });

        let temp = JSON.parse(JSON.stringify(pipeArray));
        let rootId = temp.length;
        let newNode = {
          name: this.nodeForm.name,
          hint: this.nodeForm.hint,
          status: "success",
          nodeType: this.selectNodeType,
          list: [],
          id: rootId,
          root: true,
        };

        utils.addNode(pipeArray, newNode, subNodes);
        console.log("last result1111", this.editPipelines);
      } else {
        console.log("pipeArray", pipeArray);
        console.log("nodeForm", this.nodeForm);
        console.log("itemList", this.itemList);
        this.itemList.splice(this.itemList.length - 1, 1);
        utils.updateNode(pipeArray, this.nodeForm, this.itemList);
        // 修改完成
      }
      this.resetNode();
    },
    getPrenode(arr, index) {
      let tmp = {};
      arr.forEach((e) => {
        if (e.next && e.next.length > 0) {
          e.next.forEach((ele) => {
            if (ele.index == index) {
              tmp = e;
            }
          });
        }
      });
      return tmp;
    },
    resetNode() {
      this.dialogVisible = false;
      this.selectNodeType = "";
      this.configForm = {};
      this.itemList = [];
      this.nodeForm = {};
    },
    preNodeAddline(array, prenodeId, itemIndexs, groupId) {
      array.forEach((e) => {
        if (e.id == prenodeId) {
          itemIndexs.forEach((ele) => {
            e.next.push({
              index: ele,
              weight: 0,
              groupId: groupId,
            });
          });
        }
      });
    },
    remoteMethod() {
      serviceApi.getServices().then((res) => {
        this.pipelines = [];
        res.data.forEach((e) => {
          this.pipelines.push({
            label: e.serviceName,
            value: e.serviceId,
          });
        });
      });
    },
    pausePipeline() {},
    startPipeline() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning("请先选择流水线");
        return;
      }
    },
    startEdit() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning("请先选择流水线");
        return;
      }
      this.piplienOperate = 1;
      this.titleName = "编辑流水线";
      this.isView = false;
      this.pipelineDialog = true;
      this.pipelineForm = this.currentPipeline;
      this.rootList = [];
      this.currentPipeline.pipelineConfig.forEach((e) => {
        if (e.id && e.rootId == e.id) {
          this.rootList.push(e);
        }

        if (e.name == "开始" || e.name == "构建" || e.name == "结束") {
          e.disable = true;
        }
      });
      this.editPipelines = this.currentPipeline.pipelineConfig;
    },
    startView() {
      if (!this.currentPipeline.pipelineConfig.length) {
        this.$message.warning("请先选择流水线");
        return;
      }
      this.piplienOperate = 2;
      this.titleName = "查看流水线";
      this.pipelineDialog = true;
      this.isView = true;
      this.pipelineForm = this.currentPipeline;
      this.editPipelines = this.currentPipeline.pipelineConfig;
    },
    selectPipeline(item) {
      this.publishList.forEach((e) => {
        e.selected = false;
      });
      this.buildList.forEach((e) => {
        e.selected = false;
      });
      this.customList.forEach((e) => {
        e.selected = false;
      });
      item.selected = true;
      historyApi
        .latestPipelineHistory(this.serviceId, item.pipelineId)
        .then((res) => {
          if (!res.data) {
            this.history = {};
            return;
          }
          this.history = res.data;
        });
      pipelineApi.queryPipeline(this.serviceId, item.pipelineId).then((res) => {
        let config = utils.displayData(res.data.stageList);
        this.currentPipeline.pipelineConfig = config;
        this.currentPipeline.pipelineName = res.data.pipelineName;
        this.currentPipeline.pipelineType = res.data.pipelineType;
        this.currentPipeline.pipelineId = item.pipelineId;
      });
    },
    handleCommand(command) {
      if (command == "manage") {
        this.isManaged = true;
      }
      if (command == "new") {
        this.piplienOperate = 3;
        this.titleName = "创建流水线";
        this.pipelineDialog = true;
        this.isView = false;
        this.rootList = [];
        pipelineApi.detaultConfig().then((res) => {
          let defaultConfigs = JSON.parse(res.data.configDetail);
          defaultConfigs.forEach((e) => {
            if (e.id && e.rootId == e.id) {
              this.rootList.push(e);
            }
          });
          this.editPipelines = JSON.parse(JSON.stringify(defaultConfigs));
        });
      }
    },
    deletePipeline() {
      this.$confirm("确认删除？")
        .then(() => {
          if (this.checkList.length < 1) {
            this.$message({
              message: "请选择要删除的流水线",
              type: "warning",
            });
            return;
          }

          let serviceId = this.serviceId;
          this.checkList.forEach((e) => {
            pipelineApi.deletePipeline(serviceId, e).then(() => {
              this.isManaged = false;
              this.checkList = [];
              this.getPipelineList();
            });
          });
        })
        .catch(() => {
          this.isManaged = false;
          this.checkList = [];
        });
    },
    cancelManage() {
      this.isManaged = false;
      this.checkList = [];
    },
    submitPipeline() {
      console.log("3333333", this.pipelineForm);
      let param = utils.exchangeData(this.pipelineForm, this.editPipelines);
      param.pipelineConfig = JSON.stringify(this.editPipelines);

      //修改流水线
      if (this.piplienOperate == 1) {
        console.log("pipelien id ", this.currentPipeline);
        pipelineApi
          .updatePipeline(
            this.serviceId,
            this.currentPipeline.pipelineId,
            param
          )
          .then(() => {
            this.$message({
              message: "修改流水线成功",
              type: "success",
            });
            this.cancelCreatePipeline();
            pipelineApi
              .queryPipeline(this.serviceId, this.currentPipeline.pipelineId)
              .then((res) => {
                let config = utils.displayData(res.data.stageList);
                this.currentPipeline.pipelineConfig = config;
                this.currentPipeline.pipelineName = res.data.pipelineName;
                this.currentPipeline.pipelineType = res.data.pipelineType;
                this.currentPipeline.pipelineId = item.pipelineId;
                this.uuid++;
              });
          });
      }

      //创建流水线
      if (this.piplienOperate == 3) {
        param.serviceId = this.serviceId;
        param.creator = "古月澜";
        console.log("请求的参数", param);
        pipelineApi.savePipeline(param).then(() => {
          this.$message({
            message: "创建流水线成功",
            type: "success",
          });
          this.cancelCreatePipeline();
          this.getPipelineList();
        });
      }
    },
    cancelCreatePipeline() {
      this.rootList = [];
      this.pipelineDialog = false;
      this.isView = false;
    },
    datachange(name) {
      this.chosedConfigItem.config.forEach((e) => {
        if (e.name == name) {
          e.value = this.configForm[name];
        }
      });
      this.$forceUpdate();
    },
    getPipelineList() {
      pipelineApi.pipelineList(this.serviceId).then((res) => {
        this.publishList = [];
        this.buildList = [];
        this.customList = [];
        res.data.forEach((e) => {
          e.selected = false;
          e.pipelineConfig = JSON.parse(e.pipelineConfig);
          if (e.pipelineType == 1) {
            this.publishList.push(e);
          }
          if (e.pipelineType == 2) {
            this.buildList.push(e);
          }
          if (e.pipelineType == 3) {
            this.customList.push(e);
          }
        });
      });
    },
    configPipeline(list) {
      let index = 0;
      list.forEach((e) => {
        e.index = index;
        index++;
        if (e.root) {
          this.rootList.push(e);
        }
      });
      this.currentPipeline.pipelineConfig = list;
    },
    getDefaultService() {
      serviceApi.getServices().then((res) => {
        this.pipelines = [];
        res.data.forEach((e) => {
          this.pipelines.push({
            label: e.serviceName,
            value: e.serviceId,
          });
        });

        this.serviceId = this.pipelines[0].value;
        this.getPipelineList();
      });
    },
  },
  created() {
    this.stepOptions = json.pipeline_stepOptions;
    this.getDefaultService();
  },
};
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
</style>
