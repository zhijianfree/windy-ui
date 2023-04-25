<template>
  <div>
    <el-tabs v-model="activeTab" class="content">
      <el-tab-pane label="节点管理" name="node">
        <!-- 表单查询开始 -->
        <div class="query-div">
          <el-form :inline="true" size="mini">
            <el-form-item label="节点名称">
              <el-input
                clearable
                v-model="queryNodeName"
                placeholder="请输入节点名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="startQueryNode"
                >查询</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="createNode"
                >新增节点</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!-- 表单查询结束 -->
        <!-- 节点表格显示开始 -->
        <div>
          <el-table :data="nodeList" stripe style="width: 100%">
            <el-table-column prop="nodeName" label="节点名称">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="userId" label="创建人"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="editNode(scope.row)"
                  slot="reference"
                  type="primary"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  @click="removeNode(scope.row)"
                  slot="reference"
                  type="danger"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :current-page="currentNodePage"
            @current-change="changeNodePage"
            :total="nodeTotalSize"
          >
          </el-pagination>
        </div>
        <!-- 节点表格显示结束 -->
      </el-tab-pane>
      <el-tab-pane label="执行点管理" name="execute">
        <!-- 表单查询开始 -->
        <div class="query-div">
          <el-form :inline="true" size="mini">
            <el-form-item label="执行点名称">
              <el-input
                clearable
                v-model="queryName"
                placeholder="请输入执行点名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="startQuery"
                >查询</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="createTemplet"
                >新增执行点</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!-- 表单查询结束 -->
        <!-- 执行点表格显示开始 -->
        <div>
          <el-table :data="actionList" stripe style="width: 100%">
            <el-table-column prop="actionName" label="执行点名称">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="userId" label="创建人"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="editAction(scope.row)"
                  slot="reference"
                  type="primary"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  @click="removeAction(scope.row)"
                  slot="reference"
                  type="danger"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :current-page="currentPage"
            @current-change="changePage"
            :total="totalSize"
          >
          </el-pagination>
        </div>
        <!-- 执行点表格显示结束 -->
      </el-tab-pane>
    </el-tabs>

    <!-- 节点弹框开始 -->
    <el-dialog
      :title="nodeTitle"
      :visible.sync="showCreateNode"
      width="80%"
      :before-close="closeNodeDialog"
    >
      <el-form v-model="nodeForm" size="small" label-width="120px">
        <el-form-item label="节点名称">
          <el-input placeholder="请输入节点名称" v-model="nodeForm.nodeName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入执行点描述"
            v-model="nodeForm.description"
          />
        </el-form-item>
        <el-form-item label="选择关联执行点">
          <el-select
            v-model="selectActions"
            multiple
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in executeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeNodeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="addNode" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 节点弹框结束 -->

    <!-- 执行点弹框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="showCreateExecuter"
      :before-close="closeDialog"
      width="80%"
    >
      <el-form v-model="actionForm" size="small" label-width="120px">
        <el-form-item label="执行点名称">
          <el-input
            placeholder="请输入执行点名称"
            v-model="actionForm.actionName"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入执行点描述"
            v-model="actionForm.description"
          />
        </el-form-item>
        <el-divider content-position="left">动作触发配置</el-divider>
        <el-form-item label="动作触发地址">
          <el-input
            placeholder="请输入执行点名称"
            v-model="actionForm.actionUrl"
          />
        </el-form-item>
        <el-form-item label="参数列表">
          <el-row
            v-for="(item, index) in configList"
            :key="index"
            class="config-line"
          >
            <el-col :span="5">
              <el-input placeholder="输入参数名" v-model="item.name" />
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="6">
              <el-input placeholder="输入参数描述" v-model="item.description" />
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="5">
              <el-input placeholder="输入参数类型" v-model="item.type" />
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="5">
              <el-input placeholder="输入默认值" v-model="item.value" />
            </el-col>
          </el-row>
          <div class="add-btn" @click="addNewItem">新增参数</div>
        </el-form-item>

        <el-divider content-position="left">状态查询配置</el-divider>
        <el-form-item label="状态查询地址">
          <el-input
            placeholder="请输入状态查询地址"
            v-model="actionForm.queryUrl"
          />
        </el-form-item>
        <el-form-item label="结果条件列表">
          <el-row
            v-for="(item, index) in compareList"
            :key="index"
            class="config-line"
          >
            <el-col :span="4">
              <el-input placeholder="比较Key" v-model="item.compareKey" />
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="4">
              <el-input placeholder="描述" v-model="item.description" />
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="4">
              <el-select v-model="item.valueType" placeholder="选择数据类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="4">
              <el-select v-model="item.operator" placeholder="选择运算服符">
                <el-option
                  v-for="item in operators"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" class="separate-line">-</el-col>
            <el-col :span="4">
              <el-input placeholder="设置期望值" v-model="item.value" />
            </el-col>
          </el-row>
          <div class="add-btn" @click="addNewCondition">新增条件</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="addAction" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 执行点弹框结束 -->
  </div>
</template>
<script>
import ActionApi from '../../http/PipelineAction'
import NodeApi from '../../http/NodeBind'
export default {
  data() {
    return {
      queryName: '',
      actionList: [],
      showCreateExecuter: false,
      actionForm: {},
      configList: [{}],
      compareList: [{}],
      currentPage: 1,
      totalSize: 0,
      title: '创建执行点',
      isEditAction: false,

      //----节点参数配置-----
      activeTab: 'node',
      nodeList: [],
      showCreateNode: false,
      nodeTitle: '创建节点',
      executeList: [],
      nodeForm: {},
      selectActions: [],
      currentNodePage: 1,
      nodeTotalSize: 0,
      queryNodeName: '',
      isEditNode: false,
      operators: [
        { label: 'equals', value: 'equals' },
        { label: '大于', value: '>' },
        { label: '大于等于', value: '>=' },
        { label: '小于', value: '<' },
        { label: '小于等于', value: '<=' },
      ],
      typeList: [
        { label: '数字类型', value: 'Integer' },
        { label: '字符串类型', value: 'String' },
      ],
    }
  },
  methods: {
    addNewCondition() {
      this.compareList.push({})
    },
    startQueryNode() {
      this.getNodes()
    },
    editNode(row) {
      this.isEditNode = true
      this.nodeTitle = '编辑节点'
      this.showCreateNode = true
      this.nodeForm = row
      this.selectActions = []
      this.getAllActions()
      NodeApi.getNodeActions(row.nodeId).then((res) => {
        res.data.forEach((e) => {
          this.selectActions.push(e.actionId)
        })
      })
    },
    closeNodeDialog() {
      this.isEditNode = false
      this.showCreateNode = false
      this.nodeForm = { executors: [] }
      this.selectActions = []
    },
    removeNode(row) {
      this.$confirm(`确认删除节点【${row.nodeName}】？`).then(() => {
        NodeApi.deleteNode(row.nodeId).then((res) => {
          if (res.data) {
            this.$message.success('删除节点成功')
            this.getNodes()
          } else {
            this.$message.error('删除节点失败')
          }
        })
      })
    },
    changeNodePage() {
      this.getNodes()
    },
    createNode() {
      this.nodeTitle = '创建节点'
      this.showCreateNode = true
      this.getAllActions()
    },
    addNode() {
      this.nodeForm.executors = this.selectActions
      console.log('node 节点', this.nodeForm)
      if (this.isEditNode) {
        NodeApi.updateNode(this.nodeForm).then((res) => {
          if (res.data) {
            this.$message.success('修改节点成功')
            this.getNodes()
            this.closeNodeDialog()
          } else {
            this.$message.error('修改节点失败')
          }
        })
        return
      }
      NodeApi.createNode(this.nodeForm).then((res) => {
        if (res.data) {
          this.$message.success('添加节点成功')
          this.getNodes()
          this.closeNodeDialog()
        } else {
          this.$message.error('添加节点失败')
        }
      })
    },
    getNodes() {
      NodeApi.getNodePage(this.currentNodePage, 10, this.queryNodeName).then(
        (res) => {
          console.log('get node list', res)
          this.nodeTotalSize = res.total
          this.nodeList = res.data
        }
      )
    },
    //-----节点方法结束------
    startQuery() {
      this.currentPage = 1
      this.getActions()
    },
    changePage() {
      this.getActions()
    },
    createTemplet() {
      this.showCreateExecuter = true
      this.title = '创建执行点'
    },
    editAction(row) {
      console.log('row', row)
      this.isEditAction = true
      this.title = '编辑执行点'
      this.showCreateExecuter = true
      this.actionForm = row
      this.configList = row.paramList
      this.compareList = row.compareResults
    },
    removeAction(row) {
      this.$confirm(`确认删除执行点【${row.actionName}】？`).then(() => {
        ActionApi.deleteAction(row.actionId).then((res) => {
          if (res.data) {
            this.$message.success('删除执行点成功')
            this.getActions()
          } else {
            this.$message.error('删除执行点失败')
          }
        })
      })
    },
    closeDialog() {
      this.showCreateExecuter = false
      this.configList = []
      this.compareList = []
      this.actionForm = {}
      this.isEditAction = false
    },
    addAction() {
      let data = this.actionForm
      data.paramList = this.configList
      data.compareResults = this.compareList
      console.log(data)
      if (this.isEditAction) {
        ActionApi.updateAction(data).then((res) => {
          if (res.data) {
            this.$message.success('修改执行点成功')
            this.closeDialog()
            this.getActions()
          } else {
            this.$message.error('修改执行点失败')
          }
        })
        return
      }

      ActionApi.createAction(data).then((res) => {
        if (res.data) {
          this.$message.success('创建执行点成功')
          this.closeDialog()
          this.getActions()
        } else {
          this.$message.error('创建执行点失败')
        }
      })
    },
    addNewItem() {
      this.configList.push({})
    },
    getActions() {
      ActionApi.getActionPage(this.currentPage, 10, this.queryName).then(
        (res) => {
          this.totalSize = res.total
          this.actionList = res.data
          console.log(res)
        }
      )
    },
    getAllActions() {
      ActionApi.getActionPage(1, 100, '').then((res) => {
        console.log(res)
        this.executeList = []
        res.data.forEach((e) => {
          this.executeList.push({ label: e.actionName, value: e.actionId })
        })
      })
    },
  },
  created() {
    this.getActions()
    this.getNodes()
  },
}
</script>
<style scoped>
.query-div {
  margin: 10px;
}
.add-btn {
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  border: 1px dashed #ccc;
  margin: 10px 20%;
  cursor: pointer;
}
.config-line {
  margin: 10px 0px;
}
.separate-line {
  text-align: center;
}
.content {
  margin: 10px;
}
</style>
