<template>
  <div class="content">
    <div>
      <el-form :inline="true" v-model="queryForm" size="mini">
        <el-form-item label="缺陷名称">
          <el-input
            v-model="queryForm.name"
            placeholder="输入缺陷名称查询"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            clearable
            placeholder="请选择缺陷状态"
          >
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.statusName"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryBugs">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="bug-div">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="createBug"
          size="mini"
          >新建缺陷</el-button
        >
      </div>
    </div>
    <div class="table-list">
      <el-table :data="tableData" height="600" style="width: 100%">
        <el-table-column prop="bugName" label="缺陷名称" width="600">
        </el-table-column>
        <el-table-column prop="acceptor" label="负责人" width="180">
        </el-table-column>
        <el-table-column prop="status" label="缺陷状态">
          <template slot-scope="scope">
            {{ exchangeStatusName(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提出时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="缺陷标签"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="viewBug(scope.row)" size="small"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="10"
          layout="sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="bugTitle"
      :visible.sync="showBugDialog"
      :center="true"
      :close-on-click-modal="false"
      width="80%"
    >
      <div>
        <bugDetail :edit="isEdit" :bug="bugId" @cancel="closeBug"></bugDetail>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeBug">取 消</el-button>
        <el-button type="primary" @click="submitBug('bugForm')" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bugApi from '../../http/BugApi'
import bugDetail from './bug-detail.vue'
export default {
  components: {
    bugDetail,
  },
  data() {
    return {
      tableData: [],
      queryForm: {
        name: '',
        status: '',
      },
      statusList: [],
      bugForm: {},
      bugId: '',
      showBugDialog: false,
      bugTitle: '创建缺陷',
      abilityList: ['用户体验', '功能增强', '性能', '可靠性', '安全', '运维'],
      currentPage: 1,
      currentSize: 10,
      total: 0,
      isEdit: false,
      bugId: '',
      bugRule: {
        bugName: [
          { required: true, message: '请输入缺陷名称', trigger: 'blur' },
          { min: 10, message: '缺陷名称最少10个字符', trigger: 'blur' },
        ],
        level: [
          { required: true, message: '请选择缺陷优先级', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    exchangeStatusName(status) {
      let statusName = '-'
      this.statusList.forEach((e) => {
        if (e.value == status) {
          statusName = e.statusName
        }
      })
      return statusName
    },
    queryBugs() {
      this.getBugList()
    },
    viewBug(row) {
      this.showBugDialog = true
      this.bugId = row.bugId
      // this.bugForm = row
      this.isEdit = true
    },
    createBug() {
      this.showBugDialog = true
      this.isEdit = false
      this.bugId = ''
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getBugList()
    },
    handleSizeChange(size) {
      this.currentSize = size
      this.getBugList()
    },
    closeBug() {
      this.showBugDialog = false
      this.bugForm = {}
      this.getBugList()
      this.$refs.bugForm.resetFields()
    },
    submitBug(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        console.log('edit', this.isEdit)
        if (this.isEdit) {
          bugApi.updateBug(this.bugForm).then((res) => {
            if (res.data) {
              this.$message.success('修改缺陷成功')
              this.getBugList()
              this.closeBug()
            } else {
              this.$message.error('修改缺陷失败')
            }
          })
          return
        }
        bugApi.createBug(this.bugForm).then((res) => {
          if (res.data) {
            this.$message.success('创建缺陷成功')
            this.getBugList()
            this.closeBug()
          } else {
            this.$message.error('创建缺陷失败')
          }
        })
      })
    },
    getBugList() {
      bugApi
        .getBugList(
          this.currentPage,
          this.currentSize,
          this.queryForm.name,
          this.queryForm.status
        )
        .then((res) => {
          console.log(res)
          this.tableData = res.data.data
          this.total = res.data.total
        })
    },
    getstatusList() {
      bugApi.getBugStatuses().then((res) => {
        this.statusList = res.data
      })
    },
  },
  created() {
    this.getBugList()
    this.getstatusList()
  },
}
</script>
<style scoped>
.content {
  margin: 20px;
  position: relative;
}
.bug-div {
  position: absolute;
  right: 30px;
  top: 0px;
}
</style>
