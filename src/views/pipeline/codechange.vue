<template>
  <div>
    <div class="title-line">
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item :label="$t('pipeline.codeChange.service_list')">
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
      </el-form>
    </div>
    <div class="change-content">
      <div class="change-title">
        <div class="change-desc">
          {{ $t('pipeline.codeChange.code_change_list') }}
        </div>
        <div class="add-btn">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="addChangeCode"
            >{{ $t('pipeline.codeChange.create_code_change') }}</el-button
          >
        </div>
      </div>
      <div class="change-list">
        <div>
          <el-table :data="changeList" stripe style="width: 100%">
            <el-table-column
              prop="changeName"
              :label="$t('pipeline.codeChange.name')"
            >
            </el-table-column>
            <el-table-column
              prop="changeBranch"
              :label="$t('pipeline.codeChange.branch')"
            >
            </el-table-column>
            <el-table-column
              prop="changeDesc"
              :label="$t('pipeline.codeChange.description')"
            >
            </el-table-column>
            <el-table-column
              prop="creator"
              :label="$t('pipeline.codeChange.user')"
            >
            </el-table-column>
            <el-table-column
              prop="relationId"
              :label="$t('pipeline.codeChange.union_id')"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              :label="$t('pipeline.codeChange.create_time')"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="$t('pipeline.codeChange.operate')"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  @click="removeChange(scope.row)"
                  slot="reference"
                  type="text"
                  size="small"
                  >{{ $t('pipeline.codeChange.delete') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="创建变更" :visible.sync="dialogFormVisible">
      <el-form :model="changeForm" size="mini" label-width="120px">
        <el-form-item label="变更描述">
          <el-input
            v-model="changeForm.changeName"
            placeholder="请输入变更详细说明"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input
            type="textarea"
            placeholder="请输入详细说明"
            v-model="changeForm.changeDesc"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择分支">
          <el-radio-group
            @change="selectBranchType"
            v-model="changeForm.branchType"
          >
            <el-radio label="default">默认</el-radio>
            <el-radio label="custom">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更分支">
          <el-input
            v-model="changeForm.changeBranch"
            :disabled="editBranch"
            placeholder="请输入分支名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联需求/bug">
          <el-select
            v-model="changeForm.relationId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关联的需求或缺陷的ID"
            :remote-method="requestRelation"
            :loading="loading"
          >
            <el-option
              v-for="item in relations"
              :key="item.value"
              :label="item.name"
              :value="item.relationId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmChange" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import requestApi from '../../http/CodeChange'
import serviceApi from '../../http/Service'
export default {
  data() {
    return {
      service: '',
      serviceList: [],
      changeList: [],
      changeForm: {
        branchType: 'custom',
      },
      dialogFormVisible: false,
      relations: [{ name: '123', relationId: '12' }],
      loading: false,
      editBranch: false,
    }
  },
  methods: {
    getServices() {
      this.serviceList = []
      serviceApi.getServices().then((res) => {
        this.serviceList = res.data
        this.service = this.serviceList[0].serviceId
        this.getCodeChangeList()
      })
    },
    addChangeCode() {
      console.log('开始的')
      this.dialogFormVisible = true
    },
    selectService() {
      this.getCodeChangeList()
    },
    selectBranchType(value) {
      if (value == 'default') {
        let branchName = 'develop_'
        var today = new Date()
        var DD = String(today.getDate()).padStart(2, '0')
        var MM = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        branchName += yyyy + MM + DD + '_' + this.$utils.randomString(6)
        this.editBranch = true
        this.changeForm.changeBranch = branchName
      } else {
        this.changeForm.changeBranch = ''
        this.editBranch = false
      }
    },
    requestRelation(query) {
      console.log('query', query)
      requestApi.relationList(query).then((res) => {
        this.relations = res.data
      })
    },
    removeChange(item) {
      this.$confirm('确认删除？').then(() => {
        requestApi.deleteCodeChange(this.service, item.changeId).then(() => {
          this.$message({
            message: '删除变更成功',
            type: 'success',
          })
          this.getCodeChangeList()
        })
      })
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.changeForm = {}
    },
    confirmChange() {
      this.changeForm.serviceId = this.service
      requestApi.saveCodeChange(this.changeForm).then(() => {
        this.$message({
          message: '创建变更成功',
          type: 'success',
        })
        this.changeForm = {
          branchType: 'custom',
        }
        this.dialogFormVisible = false
        this.getCodeChangeList()
      })
    },
    getCodeChangeList() {
      requestApi.codeChangeList(this.service).then((res) => {
        this.changeList = res.data
      })
    },
  },
  created() {
    this.getServices()
    this.requestRelation('')
  },
}
</script>
<style scoped>
.add-btn {
  position: absolute;
  right: 20px;
  top: 10px;
}
.change-title {
  position: relative;
}
.change-desc {
  margin: 10px;
  font-weight: 800;
  width: 200px;
}
.change-list {
  margin-top: 30px;
}
.title-line {
  margin: 10px;
}
</style>
