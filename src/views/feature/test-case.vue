<template>
  <div>
    <div class="service">
      <el-row>
        <el-col :span="22">
          <el-form
            :inline="true"
            :model="queryForm"
            size="mini"
            class="demo-form-inline"
            @submit.native.prevent
          >
            <el-form-item label="服务列表">
              <el-select
                v-model="service"
                size="small"
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
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="startCreate"
                >新增测试集</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 测试集表格开始 -->
    <div class="content">
      <el-table :data="featureData" size="mini">
        <el-table-column prop="testCaseName" label="测试集"> </el-table-column>
        <!-- <el-table-column prop="author" label="创建人"> </el-table-column> -->
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="updateTime" label="最近编辑时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="startEdit(scope.row)"
              plain
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="startDelete(scope.row)"
              plain
              size="mini"
              >删除</el-button
            >
            <el-button
              type="info"
              @click="startCopy(scope.row)"
              plain
              icon="el-icon-document-copy"
              size="mini"
              >复制</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :page-size="10"
          :current-page="currentPage"
          @current-change="pageChange"
          layout="prev, pager, next"
          :total="totalSize"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 测试集表格结束 -->
    <!-- 创建测试集开始 -->
    <el-dialog
      title="创建测试集"
      :visible.sync="showDialog"
      @close="closeDialog"
      width="70%"
    >
      <el-form
        :model="caseForm"
        ref="caseForm"
        :rules="rule"
        size="small"
        label-width="120px"
      >
        <el-form-item label="测试集名称" prop="testCaseName">
          <el-input
            v-model="caseForm.testCaseName"
            placeholder="请输入测试集名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="测试集描述" prop="description">
          <el-input
            v-model="caseForm.description"
            placeholder="请输入测试集描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择服务" prop="serviceId">
          <el-select v-model="caseForm.serviceId" placeholder="请选择">
            <el-option
              v-for="item in serviceList"
              :key="item.serviceId"
              :label="item.serviceName"
              :value="item.serviceId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('caseForm')">确认</el-button>

          <el-button type="info" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建测试集结束 -->
    <!-- 复制测试集开始 -->
    <el-dialog
      title="复制测试集"
      :visible.sync="showCopyDialog"
      @close="cancellCopy"
      width="70%"
    >
      <h3>
        原测试集名称:
        <span style="color: #f56c6c">{{ copyCase.testCaseName }}</span>
      </h3>
      <div style="margin: 20px 40px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input
              v-model="filterTag"
              size="small"
              placeholder="请输入标签过滤用例"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="confimFilter" size="small"
              >确认过滤</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div style="margin: 20px 40px">
        <el-tag
          :key="index"
          @close="handleClose(tag)"
          type="success"
          :disable-transitions="false"
          v-for="(tag, index) in filterTagList"
          closable
          size="small"
        >
          {{ tag }}
        </el-tag>
      </div>
      <el-row>
        <el-col :span="10">
          <div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >

            <div class="tree-list">
              <el-tree
                ref="tree"
                :data="treeData"
                show-checkbox
                default-expand-all
                @node-click="treeNodeClick"
                highlight-current
                node-key="featureId"
                :props="{
                  children: 'children',
                  label: 'featureName',
                }"
              >
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <el-descriptions title="用例描述" :column="2" size="small">
            <el-descriptions-item label="用例名称：">{{
              featureForm.featureName
            }}</el-descriptions-item>
            <el-descriptions-item label="最近修改时间">{{
              featureForm.updateTime | dateFormat
            }}</el-descriptions-item>
            <el-descriptions-item label="标签">
              <el-tag
                :key="tag"
                v-for="tag in featureForm.tags"
                class="tag-item"
                size="mini"
              >
                {{ tag }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancellCopy">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmCopy"
          >确定复制</el-button
        >
      </span>
    </el-dialog>
    <!-- 复制测试集结束 -->
  </div>
</template>
<script>
import serviceApi from '../../http/Service'
import testCaseApi from '../../http/TestCase'
import featureApi from '../../http/Feature'
export default {
  data() {
    return {
      service: '',
      serviceList: [],
      activeName: '1',
      tableData: [],
      showHistory: false,
      direction: 'rtl',
      featureData: [],
      currentPage: 1,
      totalSize: 0,
      showDialog: false,
      caseForm: {},
      queryForm: {},
      showCopyDialog: false,
      checkAll: false,
      isIndeterminate: true,
      copyCase: {},
      filterTag: '',
      filterTagList: [],
      treeData: [],
      allKeys: [],
      featureForm: {},
      rule: {
        testCaseName: [
          { required: true, message: '请输入测试集名称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入详细描述', trigger: 'blur' },
        ],
        serviceId: [
          { required: true, message: '请选择关联的服务', trigger: 'select' },
        ],
      },
    }
  },
  methods: {
    treeNodeClick(data) {
      featureApi.getFeatureDetail(data.featureId).then((res) => {
        this.featureForm = res.data
      })
    },
    cancellCopy() {
      this.showCopyDialog = false
      this.filterTagList = []
      this.filterTag = ''
      this.copyCase = {}
      this.checkAll = false
      this.featureForm = {}
    },
    confirmCopy() {
      let array = this.$refs.tree.getCheckedKeys()
      if (!array || array.length == 0) {
        this.$message.warning('请选择需要复制的用例')
        return
      }

      let data = {
        testCaseId: this.copyCase.testCaseId,
        featureIds: array,
      }

      featureApi.copyCaseFeature(data).then((res) => {
        if (res.data) {
          this.$message.success('复制成功！')
          this.selectService()
          this.cancellCopy()
          return
        }

        this.$message.error('复制失败！')
      })
    },
    handleClose(tag) {
      this.filterTagList.splice(this.filterTagList.indexOf(tag), 1)
      this.refreshTag()
    },
    confimFilter() {
      if (!this.filterTag) {
        return
      }

      if (this.filterTagList.length >= 5) {
        this.$message.danger('过滤数超过上限')
        return
      }

      this.filterTagList.push(this.filterTag)
      this.filterTag = ''
      this.refreshTag()
    },
    refreshTag() {
      if (this.filterTagList == 0) {
        featureApi.getFeatureTree(this.copyCase.testCaseId).then((res) => {
          this.treeData = res.data
        })
        return
      }

      let item = {
        tags: this.filterTagList,
        testCaseId: this.copyCase.testCaseId,
      }
      featureApi.filterFeatureByTag(item).then((res) => {
        this.treeData = res.data
      })
    },
    handleCheckAllChange(val) {
      if (val) {
        this.$refs.tree.setCheckedNodes(this.treeData)
        this.isIndeterminate = false
      } else {
        this.$refs.tree.setCheckedNodes([])
        this.isIndeterminate = true
      }
    },
    startCopy(row) {
      this.showCopyDialog = true
      this.copyCase = row
      featureApi.getFeatureTree(row.testCaseId).then((res) => {
        this.treeData = res.data
      })
    },
    closeDialog() {
      this.showDialog = false
      this.caseForm = {}
    },
    submit(caseForm) {
      this.$refs[caseForm].validate((valid) => {
        if (!valid) {
          return false
        }

        testCaseApi.createTestCase(this.caseForm).then((res) => {
          this.closeDialog()
          if (res.data) {
            this.$message.success('添加测试集成功')
            this.getTestCaseList(1)
            return
          }
          this.$message.error('添加测试集失败')
        })
      })
    },
    startCreate() {
      this.showDialog = true
    },
    getServices() {
      this.serviceList = []
      serviceApi.getServices().then((res) => {
        this.serviceList = res.data
        this.service = this.serviceList[0].serviceId
        this.selectService()
      })
    },
    selectService() {
      this.getTestCaseList(1)
    },
    pageChange(page) {
      this.getTestCaseList(page)
    },
    getTestCaseList(page) {
      testCaseApi.getTestCaseList(this.service, page, 10).then((res) => {
        this.currentPage = page
        this.totalSize = res.data.total
        this.featureData = res.data.data
      })
    },
    startEdit(row) {
      this.$router.push({
        path: '/feature',
        query: {
          caseId: row.testCaseId,
        },
      })
    },
    startDelete(row) {
      this.$confirm('测试集删除后用例都会删除，确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        testCaseApi.deleteTestCase(row.testCaseId).then(() => {
          this.$message.success('删除测试集成功')
          this.getTestCaseList(this.currentPage)
        })
      })
    },
  },
  created() {
    this.getServices()
  },
}
</script>
<style scoped>
.service {
  margin: 10px 20px;
}
.content {
  margin: 10px 20px;
  height: 300px;
}
.history {
  margin: 20px 20px;
}
.history-title {
  font-weight: 900;
}
.check-box-item {
  margin: 10px;
}
.tag-item {
  margin: 0px 10px;
}
.tree-list {
  max-height: 600px;
  overflow-y: scroll;
}
</style>
