<template>
  <div class="content">
    <el-form
      :inline="true"
      :model="queryForm"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="模版名称">
        <el-input
          clearable
          @input="inputChange"
          v-model="queryForm.name"
          placeholder="请输入模版名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="startQuery"
          >查询</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="startCreate"
          >新增模版</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="templateData" size="mini" style="width: 100%">
      <el-table-column prop="templateId" label="模版ID"> </el-table-column>
      <el-table-column prop="name" label="模版名称"> </el-table-column>
      <el-table-column prop="description" label="模版描述"> </el-table-column>
      <el-table-column prop="author" label="提交人"> </el-table-column>
      <el-table-column prop="updateTime" label="最近修改时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope" v-if="scope.row.templateType == 1">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
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

    <!-- 创建模版开始 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      @close="closeDialog"
      width="85%"
    >
      <el-form :model="infoForm" size="small" label-width="80px">
        <el-form-item label="模版名称">
          <el-input
            v-model="infoForm.name"
            placeholder="请输入模版名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="Service">
          <el-input
            v-model="infoForm.service"
            placeholder="请输入Service"
          ></el-input>
        </el-form-item>
        <el-form-item label="Method">
          <el-input
            v-model="infoForm.method"
            placeholder="请输入Method"
          ></el-input>
        </el-form-item>
        <el-form-item label="参数列表">
          <el-row v-for="(item, num) in infoForm.params" :key="num">
            <el-col :span="3">
              <el-input
                size="mini"
                v-model="item.paramKey"
                placeholder="请输入参数名"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="3">
              <el-select v-model="item.type" placeholder="请选择参数类型">
                <el-option
                  v-for="item in paramTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="3">
              <el-input
                size="mini"
                v-model="item.description"
                placeholder="请输入参数描述"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="3">
              <el-input
                size="mini"
                v-model="item.defaultValue"
                placeholder="请输入默认值"
              ></el-input>
            </el-col>
            <el-col :span="1" v-if="item.type == 2">
              <div class="header-line">-</div>
            </el-col>
            <el-col :span="4" v-if="item.type == 2">
              <el-select
                v-model="item.range"
                multiple
                filterable
                allow-create
                placeholder="请添加枚举类型"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <div class="delete-icon">
                <i
                  class="el-icon-remove-outline op-icon"
                  @click="deleteItem(item, num)"
                />
                <i
                  class="el-icon-circle-plus-outline op-icon"
                  v-if="num == infoForm.params.length - 1"
                  @click="addItem"
                />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="infoForm.description"
            placeholder="请输入模版功能描述"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确认</el-button>

          <el-button type="info" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建模版结束 -->
  </div>
</template>
<script>
import templateApi from '../../http/Template'
export default {
  data() {
    return {
      templateData: [],
      queryForm: {},
      showDialog: false,
      infoForm: { params: [{}] },
      dialogTitle: '添加执行点模版',
      options: [],
      paramTypeList: [
        { label: 'String', value: 0 },
        { label: 'Map', value: 1 },
        { label: 'List', value: 2 },
        { label: 'Integer', value: 3 },
        { label: 'Float', value: 4 },
        { label: 'Double', value: 5 },
      ],
      isEdit: false,
      currentPage: 1,
      totalSize: 0,
    }
  },
  methods: {
    inputChange() {
      this.getTemplatePage(1)
    },
    pageChange(page) {
      this.getTemplatePage(page)
    },
    getTemplatePage(page) {
      let name = this.queryForm.name
      if (!name) {
        name = ''
      }

      templateApi.getTemplatePage(page, 10, name).then((res) => {
        this.templateData = res.data.data
        this.totalSize = res.data.total
      })
    },
    startQuery() {
      this.getTemplatePage(1)
    },
    startCreate() {
      this.isEdit = false
      this.showDialog = !this.showDialog
      this.dialogTitle = '创建模版'
      this.infoForm = { params: [{}] }
    },
    handleEdit(row) {
      this.isEdit = true
      this.showDialog = true
      this.dialogTitle = '编辑模版'

      let rowData = JSON.parse(JSON.stringify(row))
      if (!rowData.params) {
        this.infoForm = rowData
        return
      }

      rowData.params.forEach((e) => {
        if (e.defaultValue === null) {
          return
        }
        if (e.type == 2) {
          e.range = e.defaultValue.range
        }

        e.defaultValue = e.defaultValue.defaultValue
      })
      this.infoForm = rowData
    },
    handleDelete(row) {
      templateApi.deleteTemplate(row.templateId).then(() => {
        this.$message.success('删除模版成功')
        this.getTemplatePage(1)
      })
    },
    deleteItem(item, index) {
      this.infoForm.params.splice(index, 1)
    },
    addItem() {
      this.infoForm.params.push({})
    },
    closeDialog() {
      this.showDialog = false
      this.infoForm = { params: [{}] }
    },
    submit() {
      let requestParam = JSON.parse(JSON.stringify(this.infoForm))
      requestParam.params.forEach((e) => {
        e.defaultValue = {
          defaultValue: e.defaultValue ? e.defaultValue : '',
        }
        if (e.type == 2) {
          e.defaultValue.range = e.range
        }
      })

      if (this.isEdit) {
        templateApi.updateTemplate(requestParam).then(() => {
          this.$message.success(`${this.dialogTitle}成功`)
          this.showDialog = false
          this.getTemplatePage(1)
        })
        return
      }

      templateApi.createTemplate(requestParam).then(() => {
        this.$message.success(`${this.dialogTitle}成功`)
        this.showDialog = false
        this.getTemplatePage(1)
      })
    },
  },
  created() {
    this.getTemplatePage(1)
  },
}
</script>
<style scoped>
.content {
  margin: 5px;
}
.header-line {
  text-align: center;
}
.delete-icon {
  font-size: 20px;
  cursor: pointer;
}
.op-icon {
  margin-left: 10px;
}
</style>
