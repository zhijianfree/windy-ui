<template>
  <div class="content">
    <div>
      <el-form :inline="true" v-model="queryForm" size="mini">
        <el-form-item label="需求名称">
          <el-input
            v-model="queryForm.name"
            placeholder="输入需求名称查询"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            clearable
            placeholder="请选择需求状态"
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
          <el-button type="primary" @click="queryDemands">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="demand-div">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="createDemand"
          size="mini"
          >新建需求</el-button
        >
      </div>
    </div>
    <div class="table-list">
      <el-table :data="tableData" height="600" style="width: 100%">
        <el-table-column prop="demandName" label="需求名称" width="600">
        </el-table-column>
        <el-table-column prop="proposer" label="提出人" width="180">
        </el-table-column>
        <el-table-column prop="status" label="需求状态">
          <template slot-scope="scope">
            {{ exchangeStatusName(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="expectTime" label="期待结束时间">
          <template slot-scope="scope">
            <i class="el-icon-date" /> {{ scope.row.expectTime | dayFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="需求标签"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDemand(scope.row)" size="small"
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
      :title="demandTitle"
      :visible.sync="showDemandDialog"
      width="80%"
    >
      <div style="height: 100%">
        <el-form
          :model="demandForm"
          ref="demandForm"
          size="mini"
          label-width="120px"
          :rules="demandRule"
        >
          <el-form-item label="需求标题" prop="demandName">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10 }"
              placeholder="请输入需求标题"
              v-model="demandForm.demandName"
            ></el-input>
          </el-form-item>
          <el-form-item label="需求描述" prop="demandContent">
            <el-input
              type="textarea"
              :autosize="{ minRows: 12, maxRows: 30 }"
              placeholder="请输入需求的详细描述"
              v-model="demandForm.demandContent"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :limit="3"
              :file-list="demandForm.fileList"
            >
              <el-button size="mini" type="primary">上传附件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="需求价值" prop="customerValue">
            <el-select
              v-model="demandForm.customerValue"
              placeholder="请选择需求价值"
            >
              <el-option
                v-for="(item, index) in abilityList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需求优先级" prop="level">
            <el-select
              v-model="demandForm.level"
              placeholder="请选择需求优先级"
            >
              <el-option label="P1" :value="1"></el-option>
              <el-option label="P2" :value="2"></el-option>
              <el-option label="P3" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提出人">
            <el-input
              v-model="demandForm.proposer"
              placeholder="提出人"
            ></el-input>
          </el-form-item>
          <el-form-item label="接受人">
            <el-input
              v-model="demandForm.acceptor"
              placeholder="接受人"
            ></el-input>
          </el-form-item>
          <el-form-item label="期待完成时间" prop="expectTime">
            <el-date-picker
              v-model="demandForm.expectTime"
              align="right"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工作量(人/日)" prop="workload">
            <el-input
              v-model="demandForm.workload"
              placeholder="请输入工作量"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              v-model="demandForm.tag"
              filterable
              allow-create
              default-first-option
              placeholder="请选择标签"
            >
              <el-option
                v-for="(item, index) in tagList"
                :key="index"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDemand">取 消</el-button>
          <el-button
            type="primary"
            @click="submitDemand('demandForm')"
            size="mini"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="demandTitle"
      :visible.sync="showDemandDetail"
      width="90%"
    >
      <detail :demand="demandDetail.demandId"></detail>
    </el-dialog>
  </div>
</template>
<script>
import demandApi from '../../http/DemandApi'
import detail from './detail.vue'
export default {
  components: {
    detail,
  },
  data() {
    return {
      tableData: [],
      queryForm: {
        name: '',
        status: '',
      },
      statusList: [],
      demandForm: {},
      demandId: '',
      showDemandDialog: false,
      showDemandDetail: false,
      demandTitle: '创建需求',
      tagList: [
        { text: '个人需求', value: '个人需求' },
        { text: '数据分析', value: '数据分析' },
        { text: '客户定制', value: '客户定制' },
      ],
      abilityList: ['用户体验', '功能增强', '性能', '可靠性', '安全', '运维'],
      currentPage: 1,
      currentSize: 10,
      total: 0,
      demandDetail: {},
      demandRule: {
        demandName: [
          { required: true, message: '请输入需求名称', trigger: 'blur' },
          { min: 10, message: '需求名称最少10个字符', trigger: 'blur' },
        ],
        demandContent: [
          { required: true, message: '请输入需求描述', trigger: 'blur' },
          { min: 20, message: '需求名称最少20个字符', trigger: 'blur' },
        ],
        customerValue: [
          { required: true, message: '请选择客户价值', trigger: 'change' },
        ],
        level: [
          { required: true, message: '请选择需求优先级', trigger: 'change' },
        ],
        workload: [
          { required: true, message: '请输入工作量', trigger: 'blur' },
        ],
        expectTime: [
          { required: true, message: '请选择期待完成日期', trigger: 'change' },
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
    queryDemands() {
      this.getDemandList()
    },
    viewDemand(row) {
      this.showDemandDetail = true
      this.demandDetail = row
    },
    createDemand() {
      this.showDemandDialog = true
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getDemandList()
    },
    handleSizeChange(size) {
      this.currentSize = size
      this.getDemandList()
    },
    closeDemand() {
      this.showDemandDialog = false
      this.demandForm = {}
      this.$refs.demandForm.resetFields()
    },
    submitDemand(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        demandApi.createDemand(this.demandForm).then((res) => {
          if (res.data) {
            this.$message.success('创建需求成功')
            this.getDemandList()
            this.closeDemand()
          } else {
            this.$message.error('创建需求失败')
          }
        })
      })
    },
    getDemandList() {
      demandApi
        .getDemandList(
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
      demandApi.getDemandStatuses().then((res) => {
        this.statusList = res.data
      })
    },
  },
  created() {
    this.getDemandList()
    this.getstatusList()
  },
}
</script>
<style scoped>
.content {
  margin: 20px;
  position: relative;
}
.demand-div {
  position: absolute;
  right: 30px;
  top: 0px;
}
</style>
